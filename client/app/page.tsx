import { FeaturedSpotlight, type FeaturedPost } from "@/components/home/featured-spotlight";
import { FeedSection, type QuickFilter } from "@/components/home/feed-section";
import { TrendingStories, type TrendingStory } from "@/components/home/trending-stories";
import { SiteHeader } from "@/components/home/site-header";
import { fetchFeedPosts } from "@/lib/data/posts";

export const revalidate = 0;

const featuredPost: FeaturedPost = {
  title: "ASTU Innovators Showcase 2025",
  description:
    "Peek into the minds shaping the next wave of campus innovation — from robotics to renewable energy.",
  author: "STEM Collective",
  readTime: "6 min read",
  highlight: "Weekly Spotlight",
  tag: "Campus Spotlight",
  vibe: "bg-blue-500/10",
};

const trendingStories: TrendingStory[] = [
  {
    id: "trend-1",
    title: "Designing for Impact: Women in Engineering",
    category: "People",
    readTime: "4 min read",
  },
  {
    id: "trend-2",
    title: "Zero Waste Dorm Hacks You Can Start Today",
    category: "Lifestyle",
    readTime: "3 min read",
  },
  {
    id: "trend-3",
    title: "AI Lab Tours: Behind the Scenes",
    category: "Tech",
    readTime: "5 min read",
  },
];

const feedFilters: QuickFilter[] = [
  { label: "All", active: true },
  { label: "Campus Life" },
  { label: "Tech" },
  { label: "Creatives" },
  { label: "Opportunities" },
];

export default async function Home() {
  const feedPosts = await fetchFeedPosts();

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-40 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-[280px] w-[280px] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-44 left-14 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-5 pb-20 pt-10 md:px-12 lg:px-16">
        <SiteHeader
          trendingLabel="Trending today across campus"
          trendingHref="#"
          trendingCta="View all updates"
        />

        <section className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <FeaturedSpotlight post={featuredPost} />
          <TrendingStories stories={trendingStories} />
        </section>

        <FeedSection filters={feedFilters} posts={feedPosts} />
      </main>
    </div>
  );
}
