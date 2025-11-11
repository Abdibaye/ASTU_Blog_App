import type { FeedPost } from "@/components/home/feed-section";
import { api } from "@/lib/api";

export type ApiPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
};

type PostsResponse = {
  data?: ApiPost[];
  error?: string;
};

type PostResponse = {
  data?: ApiPost;
  error?: string;
};

const truncate = (value: string, maxLength = 180) => {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const truncated = normalized.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : truncated.length).trim()}...`;
};

const computeReadTime = (content: string) => {
  const normalized = content.trim();
  const words = normalized.length > 0 ? normalized.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return minutes === 1 ? "1 min read" : `${minutes} min read`;
};

const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const diffMs = Date.now() - date.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) {
    return "Just now";
  }
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) {
    return "Just now";
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} min ago`;
  }

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) {
    return diffHr === 1 ? "1 hr ago" : `${diffHr} hrs ago`;
  }

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) {
    return diffDay === 1 ? "1 day ago" : `${diffDay} days ago`;
  }

  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 4) {
    return diffWeek === 1 ? "1 wk ago" : `${diffWeek} wks ago`;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  }).format(date);
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const toFeedPost = (post: ApiPost): FeedPost => ({
  id: post.id,
  title: post.title,
  excerpt: post.excerpt ?? truncate(stripHtml(post.content ?? "")),
  category: post.published ? "Published" : "Draft",
  readTime: computeReadTime(stripHtml(post.content ?? "")),
  author: post.authorId ?? "Unknown author",
  postedAt: formatRelativeTime(post.createdAt),
});

export async function fetchFeedPosts(): Promise<FeedPost[]> {
  try {
    const response = (await api.get("/posts")) as PostsResponse;
    const posts = Array.isArray(response?.data) ? response.data : [];
    return posts.map(toFeedPost);
  } catch (error) {
    console.error("Failed to fetch posts", error);
    return [];
  }
}

export async function fetchPostById(id: string): Promise<ApiPost | null> {
  if (!id) {
    return null;
  }

  try {
    const response = (await api.get(`/posts/${id}`)) as PostResponse;
    return response?.data ?? null;
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      return null;
    }

    console.error(`Failed to fetch post ${id}`, error);
    throw error;
  }
}
