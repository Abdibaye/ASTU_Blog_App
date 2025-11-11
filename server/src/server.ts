import "dotenv/config";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { postRouter } from "./models/post/route.js";
import cors from "cors";


const app = express();
const port = Number(process.env.PORT ?? 5000);

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.set("trust proxy", 1);

app.use(
    cors({
        origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
        optionsSuccessStatus: 204,
    }),
);

app.use("/api/auth", toNodeHandler(auth));

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());

app.use("/api/posts", postRouter);

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});