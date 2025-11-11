import { ArrowLeft, Bookmark } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { fetchPostById } from "@/lib/data/posts";

export const revalidate = 0;

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const computeReadTime = (content: string) => {
  const normalized = stripHtml(content);
  const words = normalized.length > 0 ? normalized.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return minutes === 1 ? "1 min read" : `${minutes} min read`;
};

const formatPublishedDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
};

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const post = await fetchPostById(params.id);

  if (!post) {
    notFound();
  }

  const readTime = computeReadTime(post.content ?? "");
  const publishedDate = formatPublishedDate(post.createdAt);
  const content = post.content?.trim() ? post.content : "<p>No content provided yet.</p>";

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-40 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-[280px] w-[280px] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-44 left-14 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-5 pb-20 pt-10 md:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="gap-2 text-zinc-200 hover:bg-white/5">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to feed
            </Link>
          </Button>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-300">
            {post.published ? "Published" : "Draft"}
          </span>
        </div>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              <span>By {post.authorId ?? "Unknown author"}</span>
              <span>&#8226;</span>
              <span>{readTime}</span>
              <span>&#8226;</span>
              <span>{publishedDate}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="text-base text-zinc-200">{post.excerpt}</p>
            ) : null}
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Bookmark className="size-4" />
              <span>Saved posts coming soon</span>
            </div>
          </header>

          <section className="prose prose-invert max-w-none rounded-3xl border border-white/10 bg-white/5 px-6 py-8 shadow-lg shadow-black/20">
            <div
              className="space-y-4 text-base leading-relaxed text-zinc-100"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </section>
        </article>
      </main>
    </div>
  );
}
