import { ArrowLeft, LockKeyhole, Mail, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { GithubSignInButton } from "./github-sign-in";

export const metadata = {
  title: "Sign in | ASTU Blog",
  description: "Continue the story — access your ASTU Blog account",
};

const communityPerks = [
  {
    id: "perks-1",
    title: "Stay in the loop",
    description:
      "Drop into midnight brainstorms, new club drops, and campus-only opportunities.",
  },
  {
    id: "perks-2",
    title: "Personalized feed",
    description:
      "Bookmark vibes, follow creators, and get weekly recaps tuned to your interests.",
  },
  {
    id: "perks-3",
    title: "Publish with confidence",
    description:
      "Share your work with built-in editing tools and analytics that matter to student creators.",
  },
];

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 -z-10">
  <div className="absolute left-1/2 -top-40 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute left-[-120px] top-40 h-[280px] w-[280px] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute right-[-100px] bottom-24 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-5 pb-20 pt-10 md:px-10">
        <header className="flex flex-col gap-6">
          <nav className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Image
                src="/writing.png"
                alt="ASTU Blog"
                width={45}
                height={45}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-base font-semibold tracking-tight">
                  ASTU Blog
                </span>
                <span className="text-xs text-zinc-400">
                  Log back in. The campus conversation keeps moving.
                </span>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="hidden border-white/15 bg-white/5 text-zinc-100 hover:bg-white/5 md:inline-flex"
            >
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to stories
              </Link>
            </Button>
          </nav>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <aside className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="absolute inset-0 -z-10 bg-white/5" />
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-white/80">
                Campus Circle
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your campus voice belongs here
              </h1>
              <p className="max-w-lg text-base text-zinc-200">
                Sign back in to pick up drafts, respond to collaborators, and dive into fresh stories curated for the ASTU community.
              </p>

              <div className="space-y-5">
                {communityPerks.map((perk) => (
                  <article
                    key={perk.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-full border border-white/15 bg-white/10 p-2">
                        <Sparkles className="size-4 text-blue-200" />
                      </div>
                      <div className="space-y-1.5">
                        <h2 className="text-base font-semibold text-white">
                          {perk.title}
                        </h2>
                        <p className="text-sm text-zinc-300">{perk.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                <span>Need an account?</span>
                <Link
                  href="/register"
                  className="text-blue-300 transition hover:text-blue-200"
                >
                  Start your creator profile
                </Link>
              </div>
            </div>
          </aside>

          <section className="flex flex-col justify-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/10">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
              <p className="text-sm text-zinc-300">
                Use your ASTU email or a linked account to continue.
              </p>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-zinc-200">
                  ASTU email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@astu.edu"
                    className="h-12 w-full rounded-full border border-white/10 bg-zinc-950/70 pl-12 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-400/70 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-zinc-200">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-full border border-white/10 bg-zinc-950/70 pl-12 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-400/70 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-zinc-400">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="size-4 rounded border border-white/15 bg-white/5 text-blue-400 focus:ring-transparent"
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="text-blue-300 transition hover:text-blue-200"
                >
                  Forgot password?
                </Link>
              </div>

              <Button size="lg" className="w-full bg-blue-500 text-white shadow-md shadow-black/20 transition hover:bg-blue-500">
                Sign in
              </Button>

              <GithubSignInButton />

              <Button
                type="button"
                variant="outline"
                className="w-full border-white/15 bg-white/5 text-sm text-zinc-200 hover:bg-white/5"
              >
                Continue with campus ID
              </Button>
            </form>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-zinc-300">
              <p>
                By signing in, you agree to keep ASTU Blog welcoming and constructive. Read the
                {" "}
                <Link href="/community-guidelines" className="text-blue-300 transition hover:text-blue-200">
                  Community Guidelines
                </Link>
                {" "}
                for more on how we protect creative spaces.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
