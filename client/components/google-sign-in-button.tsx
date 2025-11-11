'use client';

import { useTransition } from "react";
import { ChromeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";

type GoogleSignInButtonProps = {
  className?: string;
};

export function GoogleSignInButton({ className }: GoogleSignInButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
        });
      } catch (error) {
        console.error("Google sign-in failed", error);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "w-full border-white/15 bg-white/5 text-sm text-zinc-200 hover:bg-white/5",
        isPending && "cursor-wait opacity-70",
        className,
      )}
      onClick={handleClick}
      disabled={isPending}
    >
      <ChromeIcon className="size-4 text-blue-200" />
      {isPending ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
}
