"use client";

import { useState } from "react";
import { Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signInWithGitHub } from "@/lib/auth";

export function GithubSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSignIn = async () => {
    setError(undefined);
    setIsLoading(true);

    try {
      const result = await signInWithGitHub();

      const data = (result as { data?: unknown })?.data;
      const fetchError = (result as { error?: unknown })?.error;

      if (fetchError) {
        if (
          typeof fetchError === "object" &&
          fetchError !== null &&
          "message" in fetchError &&
          typeof (fetchError as { message?: unknown }).message === "string"
        ) {
          setError((fetchError as { message: string }).message);
        } else {
          setError("Unable to sign in with GitHub.");
        }
        setIsLoading(false);
        return;
      }

      if (
        typeof data === "object" &&
        data !== null &&
        "url" in data &&
        typeof (data as { url?: unknown }).url === "string"
      ) {
        window.location.href = (data as { url: string }).url;
        return;
      }

      setIsLoading(false);
    } catch (unknownError) {
      const message =
        unknownError instanceof Error ? unknownError.message : "Unable to sign in with GitHub.";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full border-white/15 bg-white/5 text-sm text-zinc-200 hover:bg-white/5"
        onClick={handleSignIn}
        disabled={isLoading}
      >
        <Github className="size-4" />
  {isLoading ? "Connecting..." : "Continue with GitHub"}
      </Button>

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
