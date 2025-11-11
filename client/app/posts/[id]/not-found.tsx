import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PostNotFound() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-40 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-[280px] w-[280px] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-44 left-14 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-6 px-5 py-16 text-center">
        <h1 className="text-3xl font-semibold text-white">Post not found</h1>
        <p className="text-sm text-zinc-300">
          The story you&apos;re looking for might have been removed or is still in draft. Head back to the feed to explore other campus vibes.
        </p>
        <Button asChild className="bg-blue-500 text-white hover:bg-blue-500">
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Back to feed
          </Link>
        </Button>
      </main>
    </div>
  );
}
