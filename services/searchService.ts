import { XMLParser } from "fast-xml-parser";

const PROXY_URL = "https://api.allorigins.win/raw?url=";

// Google News RSS Feed URL for Italy
const GOOGLE_NEWS_RSS_BASE = "https://news.google.com/rss/search?hl=it-IT&gl=IT&ceid=IT%3Ait&q=";

export interface SearchResult {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

export const searchWeb = async (query: string): Promise<SearchResult[]> => {
    try {
        console.log(`Searching web for: ${query}`);

        // Use the user's query directly against Google News RSS
        const searchUrl = `${GOOGLE_NEWS_RSS_BASE}${encodeURIComponent(query)}`;
        const finalUrl = `${PROXY_URL}${encodeURIComponent(searchUrl)}`;

        const response = await fetch(finalUrl);
        if (!response.ok) throw new Error("Network response was not ok");

        const xmlText = await response.text();

        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: ""
        });

        const jsonObj = parser.parse(xmlText);
        const items = jsonObj?.rss?.channel?.item;

        if (!items) return [];

        // Handle case where 'items' is a single object (not array) if only 1 result
        const itemsArray = Array.isArray(items) ? items : [items];

        // Map and limit to top 5-7 results to save tokens
        return itemsArray.slice(0, 7).map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            source: item.source || "Google News"
        }));

    } catch (error) {
        console.error("Web search failed:", error);
        return [];
    }
};
