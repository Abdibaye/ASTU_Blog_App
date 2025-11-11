import Image from "next/image";
import Link from "next/link";
import { Flame, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { WritePostButton } from "@/components/write-post-button";

type SiteHeaderProps = {
  trendingLabel: string;
  trendingHref: string;
  trendingCta: string;
};

export function SiteHeader({ trendingLabel, trendingHref, trendingCta }: SiteHeaderProps) {
  return (
    <header className="flex flex-col gap-6">
      <nav className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Image src="/writing.png" alt="ASTU Blog" width={45} height={45} className="rounded-full" />
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight">ASTU Blog</span>
            <span className="text-xs text-zinc-400">Stories by students, for students.</span>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              className="h-10 w-64 rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-blue-400/70 focus:outline-none"
              placeholder="Search topics, people, vibe..."
            />
          </div>
          <Button variant="outline" className="hidden border-white/15 bg-white/5 text-zinc-100 hover:bg-white/5 md:inline-flex">
            <Sparkles className="size-4" />
            Discover
          </Button>
          <div className="flex items-center gap-2">
            <WritePostButton />
            <UserAvatar />
          </div>
        </div>
      </nav>

      <div className="flex items-center justify-between text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Flame className="size-4 text-amber-400" />
          <span>{trendingLabel}</span>
        </div>
        <Link href={trendingHref} className="font-medium text-blue-300 transition hover:text-blue-200">
          {trendingCta}
        </Link>
      </div>
    </header>
  );
}
