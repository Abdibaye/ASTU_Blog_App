import type { Request, Response } from "express";

import { postService } from "./service.js";
import {
    parseCreatePostPayload,
    parseUpdatePostPayload,
} from "./types.js";

const handleUnexpectedError = (res: Response, error: unknown) => {
    const message = error instanceof Error ? error.message : "Unexpected error";
    res.status(500).json({ error: message });
};

export const listPosts = async (_req: Request, res: Response) => {
    try {
        const posts = await postService.list();
        res.json({ data: posts });
    } catch (error) {
        handleUnexpectedError(res, error);
    }
};

export const getPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: "Parameter 'id' is required." });
            return;
        }

        const post = await postService.getById(id);

        if (!post) {
            res.status(404).json({ error: "Post not found." });
            return;
        }

        res.json({ data: post });
    } catch (error) {
        handleUnexpectedError(res, error);
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const payload = parseCreatePostPayload(req.body);
        const post = await postService.create(payload);
        res.status(201).json({ data: post });
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("Field")) {
            res.status(400).json({ error: error.message });
            return;
        }

        if (error instanceof Error && error.message.includes("already exists")) {
            res.status(409).json({ error: error.message });
            return;
        }

        handleUnexpectedError(res, error);
    }
};

export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: "Parameter 'id' is required." });
            return;
        }

        const payload = parseUpdatePostPayload(req.body);
        const post = await postService.update(id, payload);

        if (!post) {
            res.status(404).json({ error: "Post not found." });
            return;
        }

        res.json({ data: post });
    } catch (error) {
        if (error instanceof Error && error.message.startsWith("Field")) {
            res.status(400).json({ error: error.message });
            return;
        }

        if (error instanceof Error && error.message.includes("already exists")) {
            res.status(409).json({ error: error.message });
            return;
        }

        handleUnexpectedError(res, error);
    }
};

export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: "Parameter 'id' is required." });
            return;
        }

        const deleted = await postService.delete(id);

        if (!deleted) {
            res.status(404).json({ error: "Post not found." });
            return;
        }

        res.status(204).send();
    } catch (error) {
        handleUnexpectedError(res, error);
    }
};
