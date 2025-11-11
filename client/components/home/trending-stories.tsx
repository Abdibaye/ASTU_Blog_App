import { Sparkles } from "lucide-react";

export type TrendingStory = {
  id: string;
  title: string;
  category: string;
  readTime: string;
};

type TrendingStoriesProps = {
  stories: TrendingStory[];
};

export function TrendingStories({ stories }: TrendingStoriesProps) {
  return (
    <aside className="h-full rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">Trending</p>
          <h2 className="text-lg font-semibold text-white">What students read at 2am</h2>
        </div>
        <Sparkles className="size-5 text-blue-300" />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {stories.map((story, index) => (
          <article key={story.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start gap-4">
              <span className="text-lg font-semibold text-blue-200">{`0${index + 1}`}</span>
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">{story.category}</span>
                <h3 className="text-base font-semibold text-white">{story.title}</h3>
                <p className="text-xs text-zinc-400">{story.readTime}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
