"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";

type SessionAtom = typeof authClient.useSession;
type SessionSnapshot = ReturnType<SessionAtom["get"]>;

type UserAvatarProps = {
  className?: string;
  fallbackInitials?: string;
};

const sessionAtom = authClient.useSession;

export function UserAvatar({ className, fallbackInitials = "AB" }: UserAvatarProps) {
  const [sessionState, setSessionState] = useState<SessionSnapshot>(() => sessionAtom.get());

  useEffect(() => {
    const store = sessionAtom as typeof sessionAtom & {
      subscribe?: (listener: (value: SessionSnapshot) => void) => () => void;
    };

    const unsubscribe = typeof sessionAtom.listen === "function"
      ? sessionAtom.listen((value) => {
          setSessionState(value);
        })
      : store.subscribe?.((value) => {
          setSessionState(value);
        });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const user = sessionState.data?.user ?? null;

  if (user?.image) {
    return (
      <Image
        src={user.image}
        alt={user.name ? `${user.name}'s avatar` : "User avatar"}
        width={40}
        height={40}
        className={cn("size-10 rounded-full border border-white/15 object-cover", className)}
      />
    );
  }

  if (!user) {
    return null;
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || fallbackInitials
    : fallbackInitials;

  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white/90",
        className,
      )}
    >
      {initials}
    </div>
  );
}
