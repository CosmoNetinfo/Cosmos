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

const searchNewsApi = async (query: string): Promise<SearchResult[]> => {
    try {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (!apiKey) {
            console.warn("News API Key missing (VITE_NEWS_API_KEY). Skipping News API search.");
            return [];
        }

        // News API: /v2/everything for search
        // Sort by relevancy by default, language=it for context consistency (or remove to broader search)
        // We limit to 5 to match other sources
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&pageSize=5&language=it&apiKey=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`News API Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const json = await response.json();
        if (!json.articles || !Array.isArray(json.articles)) return [];

        return json.articles.map((article: any) => ({
            title: article.title,
            link: article.url,
            pubDate: article.publishedAt ? new Date(article.publishedAt).toDateString() : "Recent",
            source: article.source?.name || "News API"
        }));

    } catch (e) {
        console.warn("News API Fetch Error:", e);
        return [];
    }
};

export const searchWeb = async (query: string): Promise<SearchResult[]> => {
    console.log(`Deep searching web for: ${query}`);

    // Execute searches in parallel
    const [newsResults, redditResults, newsApiResults] = await Promise.all([
        searchGoogleNews(query),
        searchReddit(query),
        searchNewsApi(query)
    ]);

    // Interleave/Combine results
    const combined = [...newsResults, ...redditResults, ...newsApiResults];

    // Deduplicate by link just in case
    const unique = combined.filter((item, index, self) =>
        index === self.findIndex((t) => (
            t.link === item.link
        ))
    );

    return unique.slice(0, 15); // Return top 15 combined results (increased from 10)
};
