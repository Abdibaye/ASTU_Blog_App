import { Prisma } from "@prisma/client";

import { prisma } from "../../lib/db.js";
import type { CreatePostInput, PostEntity, UpdatePostInput } from "./types.js";

const toPostEntity = (record: any): PostEntity => ({
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt ?? null,
    content: record.content,
    published: Boolean(record.published),
    authorId: record.authorId ?? null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
});

const getPostDelegate = () => {
    const delegate = (prisma as unknown as { post?: any }).post;

    if (!delegate) {
        throw new Error("Post delegate is unavailable. Run `pnpm prisma:generate` after updating the schema.");
    }

    return delegate;
};

export class PostService {
    async list(): Promise<PostEntity[]> {
        const post = getPostDelegate();
        const records = await post.findMany({
            orderBy: { createdAt: "desc" },
        });

        return records.map(toPostEntity);
    }

    async getById(id: string): Promise<PostEntity | null> {
        const post = getPostDelegate();
        const record = await post.findUnique({ where: { id } });

        return record ? toPostEntity(record) : null;
    }

    async create(input: CreatePostInput): Promise<PostEntity> {
        const post = getPostDelegate();

        try {
            const record = await post.create({
                data: {
                    title: input.title,
                    slug: input.slug,
                    content: input.content,
                    excerpt: input.excerpt ?? null,
                    published: input.published ?? false,
                    authorId: input.authorId ?? null,
                },
            });

            return toPostEntity(record);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new Error("A post with this slug already exists.");
            }

            throw error;
        }
    }

    async update(id: string, input: UpdatePostInput): Promise<PostEntity | null> {
        const post = getPostDelegate();

        try {
            const data: Record<string, unknown> = {};

            if (Object.prototype.hasOwnProperty.call(input, "title")) {
                data.title = input.title;
            }

            if (Object.prototype.hasOwnProperty.call(input, "slug")) {
                data.slug = input.slug;
            }

            if (Object.prototype.hasOwnProperty.call(input, "content")) {
                data.content = input.content;
            }

            if (Object.prototype.hasOwnProperty.call(input, "excerpt")) {
                data.excerpt = input.excerpt ?? null;
            }

            if (Object.prototype.hasOwnProperty.call(input, "published")) {
                data.published = input.published;
            }

            if (Object.prototype.hasOwnProperty.call(input, "authorId")) {
                data.authorId = input.authorId ?? null;
            }

            const record = await post.update({
                where: { id },
                data,
            });

            return toPostEntity(record);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    return null;
                }

                if (error.code === "P2002") {
                    throw new Error("A post with this slug already exists.");
                }
            }

            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        const post = getPostDelegate();

        try {
            await post.delete({ where: { id } });
            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
                return false;
            }

            throw error;
        }
    }
}

export const postService = new PostService();
