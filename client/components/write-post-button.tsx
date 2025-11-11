"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PenSquare, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

const initialState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  published: false,
};

type FormState = typeof initialState;

type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export function WritePostButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);
  const [slugEdited, setSlugEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const originalOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, isMounted]);

  const derivedSlug = slugEdited ? form.slug : slugify(form.title);

  const openModal = () => {
    setIsOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    setForm(initialState);
    setSlugEdited(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const plainContent = stripHtml(form.content).trim();

      const payload = {
        title: form.title.trim(),
        slug: derivedSlug,
        content: form.content.trim(),
        excerpt: form.excerpt.trim() ? form.excerpt.trim() : null,
        published: form.published,
      };

      if (!payload.title || !payload.slug || !plainContent) {
        setError("Title, slug, and content are required.");
        setIsSubmitting(false);
        return;
      }

      const response = (await api.post("/posts", payload)) as ApiResponse<{ id: string }>;

      if (response?.error) {
        setError(response.error);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Post created successfully.");
      setIsSubmitting(false);
      setForm(initialState);
      setSlugEdited(false);
      router.refresh();
    } catch (unknownError) {
      const message = unknownError instanceof Error ? unknownError.message : "Failed to create post.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  const modalContent = !isOpen
    ? null
    : (
      <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
        <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/15 bg-zinc-950 p-6 text-zinc-100 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Write a new post</h2>
            <p className="text-sm text-zinc-400">Share something fresh with the ASTU community.</p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:bg-white/10"
            aria-label="Close create post dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label className="text-sm text-zinc-300" htmlFor="post-title">
              Title
            </label>
            <input
              id="post-title"
              type="text"
              required
              value={form.title}
              onChange={(event) => {
                const value = event.target.value;
                setForm((prev) => {
                  const next = { ...prev, title: value };
                  if (!slugEdited) {
                    next.slug = slugify(value);
                  }
                  return next;
                });
              }}
              className="h-11 rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 focus:border-blue-400/70 focus:outline-none"
              placeholder="Give it a headline"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-zinc-300" htmlFor="post-slug">
              Slug
            </label>
            <input
              id="post-slug"
              type="text"
              required
              value={derivedSlug}
              onChange={(event) => {
                setSlugEdited(true);
                setForm((prev) => ({ ...prev, slug: slugify(event.target.value) }));
              }}
              className="h-11 rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 focus:border-blue-400/70 focus:outline-none"
              placeholder="auto-generated"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-zinc-300" htmlFor="post-excerpt">
              Excerpt (optional)
            </label>
            <textarea
              id="post-excerpt"
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
              rows={2}
              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-blue-400/70 focus:outline-none"
              placeholder="A quick summary to entice readers"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-zinc-300" htmlFor="post-content">
              Content
            </label>
            <RichTextEditor
              value={form.content}
              onChange={(content) => setForm((prev) => ({ ...prev, content }))}
              disabled={isSubmitting}
              placeholder="Tell the story..."
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))}
                className="size-4 rounded border border-white/20 bg-white/10 text-blue-400 focus:ring-transparent"
              />
              Publish immediately
            </label>
            <small className="text-xs text-zinc-500">You can always publish later.</small>
          </div>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-400">{successMessage}</p> : null}

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="text-zinc-300 hover:bg-white/0"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                "bg-blue-500 text-white hover:bg-blue-500",
                isSubmitting && "cursor-wait opacity-80",
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Publish"}
            </Button>
          </div>
        </form>
      </div>
      </div>
    );

  return (
    <>
      <Button className="bg-blue-500 text-white shadow-md shadow-black/20 transition hover:bg-blue-500" onClick={openModal}>
        <PenSquare className="size-4" />
        Write a post
      </Button>
      {isMounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}
