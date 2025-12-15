import { XMLParser } from "fast-xml-parser";

const PROXY_URL = "https://api.allorigins.win/raw?url=";

// 1. Google News RSS (Mainstream News)
const GOOGLE_NEWS_RSS_BASE = "https://news.google.com/rss/search?hl=it-IT&gl=IT&ceid=IT%3Ait&q=";

// 2. Reddit JSON (Community/Discussions)
const REDDIT_SEARCH_BASE = "https://www.reddit.com/search.json?sort=new&limit=5&q=";

export interface SearchResult {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

const searchGoogleNews = async (query: string): Promise<SearchResult[]> => {
    try {
        const searchUrl = `${GOOGLE_NEWS_RSS_BASE}${encodeURIComponent(query)}`;
        const finalUrl = `${PROXY_URL}${encodeURIComponent(searchUrl)}`;

        const response = await fetch(finalUrl);
        if (!response.ok) return [];

        const xmlText = await response.text();
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "" });
        const jsonObj = parser.parse(xmlText);
        const items = jsonObj?.rss?.channel?.item;

        if (!items) return [];
        const itemsArray = Array.isArray(items) ? items : [items];

        return itemsArray.slice(0, 5).map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate || "Recent",
            source: item.source || "Google News"
        }));
    } catch (e) {
        console.warn("Google News Search Error:", e);
        return [];
    }
};

const searchReddit = async (query: string): Promise<SearchResult[]> => {
    try {
        const searchUrl = `${REDDIT_SEARCH_BASE}${encodeURIComponent(query)}`;
        const finalUrl = `${PROXY_URL}${encodeURIComponent(searchUrl)}`;

        const response = await fetch(finalUrl);
        if (!response.ok) return [];

        const json = await response.json();
        const posts = json?.data?.children;

        if (!posts || !Array.isArray(posts)) return [];

        return posts.map((post: any) => {
            const data = post.data;
            return {
                title: data.title,
                link: `https://www.reddit.com${data.permalink}`,
                pubDate: new Date(data.created_utc * 1000).toDateString(),
                source: `Reddit (r/${data.subreddit})`
            };
        });
    } catch (e) {
        console.warn("Reddit Search Error:", e);
        return [];
    }
};

export const searchWeb = async (query: string): Promise<SearchResult[]> => {
    console.log(`Deep searching web for: ${query}`);

    // Execute searches in parallel
    const [newsResults, redditResults] = await Promise.all([
        searchGoogleNews(query),
        searchReddit(query)
    ]);

    // Interleave/Combine results
    const combined = [...newsResults, ...redditResults];

    // Deduplicate by link just in case
    const unique = combined.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.link === item.link
        ))
    );

    return unique.slice(0, 10); // Return top 10 combined results
};
