import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FeaturedPost = {
  title: string;
  description: string;
  author: string;
  readTime: string;
  highlight: string;
  tag: string;
  vibe: string;
};

type FeaturedSpotlightProps = {
  post: FeaturedPost;
};

export function FeaturedSpotlight({ post }: FeaturedSpotlightProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/10">
      <div className={cn("absolute inset-0 -z-20 opacity-40", post.vibe)} />
      <div className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-white/80">
          {post.highlight}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {post.title}
        </h1>
        <p className="max-w-xl text-base text-zinc-200">{post.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-300">
          <span className="rounded-full border border-white/15 px-3 py-1">{post.tag}</span>
          <span>By {post.author}</span>
          <span>&#8226;</span>
          <span>{post.readTime}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg" className="bg-white text-zinc-900 transition hover:bg-white">
            Read story
          </Button>
          <Button size="lg" variant="ghost" className="text-zinc-200 hover:bg-transparent">
            Save for later
          </Button>
        </div>
      </div>
    </article>
  );
}
