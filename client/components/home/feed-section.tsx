import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type QuickFilter = {
  label: string;
  active?: boolean;
};

export type FeedPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  postedAt: string;
};

type FeedSectionProps = {
  filters: QuickFilter[];
  posts: FeedPost[];
};

export function FeedSection({ filters, posts }: FeedSectionProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">Fresh on ASTU Blog</p>
          <h2 className="text-2xl font-semibold text-white">Dive into what everyone's talking about</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter.label}
              className={cn(
                "rounded-full border border-white/15 px-4 py-2 text-sm transition",
                filter.active ? "bg-white text-zinc-900" : "bg-white/0 text-zinc-200 hover:bg-white/0",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-8 space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
            No posts yet. Be the first to publish something inspiring.
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-white/5" />
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl space-y-3">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    <span>{post.category}</span>
                    <span>&#8226;</span>
                    <span>{post.postedAt}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                  <p className="text-sm text-zinc-300">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <span>By {post.author}</span>
                    <span>&#8226;</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-center">
                  <Button variant="ghost" className="text-blue-200 hover:bg-transparent">
                    Save
                  </Button>
                  <Button asChild className="bg-white text-zinc-900 hover:bg-white">
                    <Link href={`/posts/${post.id}`}>Read</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="mt-8 flex items-center justify-center">
        <Button variant="outline" className="border-white/15 bg-white/5 px-6 py-2 text-sm text-zinc-200 hover:bg-white/5">
          Load more vibes soon
        </Button>
      </div>
    </section>
  );
}
