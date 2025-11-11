export type PostEntity = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    published: boolean;
    authorId: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreatePostInput = {
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    published?: boolean;
    authorId?: string | null;
};

export type UpdatePostInput = Partial<CreatePostInput>;

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

const isString = (value: unknown): value is string => typeof value === "string";

const sanitizeOptionalString = (value: unknown): string | null => {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
};

export const parseCreatePostPayload = (payload: unknown): CreatePostInput => {
    if (!payload || typeof payload !== "object") {
        throw new Error("Invalid payload: expected an object.");
    }

    const data = payload as Record<string, unknown>;

    if (!isNonEmptyString(data.title)) {
        throw new Error("Field 'title' is required.");
    }

    if (!isNonEmptyString(data.slug)) {
        throw new Error("Field 'slug' is required.");
    }

    if (!isNonEmptyString(data.content)) {
        throw new Error("Field 'content' is required.");
    }

    return {
        title: data.title.trim(),
        slug: data.slug.trim().toLowerCase(),
        content: data.content.trim(),
        excerpt: sanitizeOptionalString(data.excerpt ?? null),
        published: typeof data.published === "boolean" ? data.published : false,
        authorId: isString(data.authorId) ? data.authorId : null,
    };
};

export const parseUpdatePostPayload = (payload: unknown): UpdatePostInput => {
    if (!payload || typeof payload !== "object") {
        throw new Error("Invalid payload: expected an object.");
    }

    const data = payload as Record<string, unknown>;
    const result: UpdatePostInput = {};

    if ("title" in data) {
        if (!isNonEmptyString(data.title)) {
            throw new Error("Field 'title' must be a non-empty string.");
        }
        result.title = data.title.trim();
    }

    if ("slug" in data) {
        if (!isNonEmptyString(data.slug)) {
            throw new Error("Field 'slug' must be a non-empty string.");
        }
        result.slug = data.slug.trim().toLowerCase();
    }

    if ("content" in data) {
        if (!isNonEmptyString(data.content)) {
            throw new Error("Field 'content' must be a non-empty string.");
        }
        result.content = data.content.trim();
    }

    if ("excerpt" in data) {
        result.excerpt = sanitizeOptionalString(data.excerpt ?? null);
    }

    if ("published" in data) {
        if (typeof data.published !== "boolean") {
            throw new Error("Field 'published' must be a boolean.");
        }
        result.published = data.published;
    }

    if ("authorId" in data) {
        if (data.authorId !== null && !isString(data.authorId)) {
            throw new Error("Field 'authorId' must be a string or null.");
        }
        result.authorId = data.authorId as string | null;
    }

    if (Object.keys(result).length === 0) {
        throw new Error("No valid fields provided for update.");
    }

    return result;
};
