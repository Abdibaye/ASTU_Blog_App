import { Router } from "express";
import type { Router as ExpressRouterType } from "express";

import {
    createPost,
    deletePost,
    getPost,
    listPosts,
    updatePost,
} from "./controller.js";

const router = Router();

router.get("/", listPosts);
router.get("/:id", getPost);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export const postRouter: ExpressRouterType = router;
