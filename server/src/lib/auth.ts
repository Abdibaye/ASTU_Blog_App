import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db.js";
// If your Prisma file is located elsewhere, you can change the path

// Provide a lightweight declaration for `process.env` so TypeScript doesn't require @types/node.
// Narrow to expected env vars while allowing other keys.
declare const process: {
    env: {
        GITHUB_CLIENT_ID?: string;
        GITHUB_CLIENT_SECRET?: string;
        BETTER_AUTH_SECRET?: string;
        BETTER_AUTH_URL?: string;
        CLIENT_ORIGIN?: string;
        [key: string]: string | undefined;
    };
};

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const betterAuthURL = process.env.BETTER_AUTH_URL ?? "http://localhost:5000";
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";

if (!githubClientId || !githubClientSecret) {
    throw new Error("Missing GitHub OAuth credentials.");
}

if (!betterAuthSecret) {
    throw new Error("Missing BETTER_AUTH_SECRET.");
}

export const auth = betterAuth({
    secret: betterAuthSecret,
    baseURL: betterAuthURL,
    trustedOrigins: Array.from(new Set([betterAuthURL, clientOrigin])),
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),

    socialProviders: {
        github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
        },
    },
});