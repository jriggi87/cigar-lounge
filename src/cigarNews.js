// ═══ CIGAR NEWS FETCHER ═══
// Fetches cigar industry news from RSS feeds via rss2json API
// Free tier: 10,000 requests/day (more than enough)

const RSS_FEEDS = [
  { url: "https://halfwheel.com/feed/", source: "halfwheel", icon: "📰" },
  { url: "https://cigarcoop.com/feed", source: "Cigar Coop", icon: "📰" },
];

const API_BASE = "https://api.rss2json.com/v1/api.json?rss_url=";

// Cache news in memory for 30 minutes so we don't hit the API every time
let cachedNews = [];
let lastFetch = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function fetchCigarNews(maxItems = 8) {
  const now = Date.now();
  if (cachedNews.length > 0 && now - lastFetch < CACHE_DURATION) {
    return cachedNews;
  }

  const allItems = [];

  for (const feed of RSS_FEEDS) {
    try {
      const res = await fetch(`${API_BASE}${encodeURIComponent(feed.url)}`);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.status !== "ok" || !data.items) continue;

      data.items.slice(0, 5).forEach((item) => {
        // Strip HTML tags from description
        const desc = (item.description || "")
          .replace(/<[^>]*>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .trim()
          .slice(0, 200);

        allItems.push({
          id: "news_" + btoa(item.link || item.title).slice(0, 20),
          type: "news",
          title: item.title,
          description: desc ? desc + "..." : "",
          link: item.link,
          source: feed.source,
          icon: feed.icon,
          thumbnail: item.thumbnail || item.enclosure?.link || null,
          pubDate: item.pubDate,
          timestamp: { seconds: Math.floor(new Date(item.pubDate).getTime() / 1000) },
        });
      });
    } catch (err) {
      console.warn("Failed to fetch RSS from", feed.source, err);
    }
  }

  // Sort by date descending
  allItems.sort((a, b) => (b.timestamp.seconds || 0) - (a.timestamp.seconds || 0));
  cachedNews = allItems.slice(0, maxItems);
  lastFetch = now;
  return cachedNews;
}
