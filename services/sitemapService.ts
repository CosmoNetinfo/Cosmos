import { XMLParser } from "fast-xml-parser";

const PROXY_URL = "https://api.allorigins.win/raw?url=";
const SITEMAP_URL = "https://www.cosmonet.info/post-sitemap.xml";

export interface Article {
    title: string;
    link: string;
    pubDate?: string;
}

export const fetchLatestArticles = async (): Promise<Article[]> => {
    try {
        console.log("Fetching sitemap...");
        // Using a CORS proxy to avoid browser restrictions
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(SITEMAP_URL)}`);
        const xmlText = await response.text();

        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: ""
        });

        const jsonObj = parser.parse(xmlText);

        // Sitemap XML structure usually is <urlset><url><loc>...</loc></url></urlset>
        // Or for RSS/Feed: <rss><channel><item>...</item></channel></rss>
        // Yoast sitemaps usually use <urlset><url>...

        // We need to handle potential different structures.
        // Standard Sitemap doesn't have "Title", only URL (<loc>) and LastMod (<lastmod>).
        // This is a limitation of standard sitemaps. They don't have titles!

        // HOWEVER, many WP sitemaps might have images with titles or we can guess title from slug.
        // Let's look at the structure.

        const urls = jsonObj?.urlset?.url;

        if (!urls || !Array.isArray(urls)) {
            console.warn("Invalid sitemap format or no URLs found.");
            return [];
        }

        // Sort by lastmod descending if available
        const sortedUrls = urls.sort((a: any, b: any) => {
            const dateA = new Date(a.lastmod).getTime();
            const dateB = new Date(b.lastmod).getTime();
            return dateB - dateA;
        });

        // Take top 5
        const latest = sortedUrls.slice(0, 5).map((entry: any) => {
            const url = entry.loc;
            // Generate a readable title from the slug (last part of URL)
            // e.g., https://www.cosmonet.info/my-article-title/ -> My Article Title
            let slug = url.split('/').filter((s: string) => s.length > 0).pop();
            let title = slug
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Capitalize words

            return {
                title: title || "Articolo Recente",
                link: url,
                pubDate: entry.lastmod
            };
        });

        return latest;

    } catch (error) {
        console.error("Error fetching sitemap:", error);
        return [];
    }
};
