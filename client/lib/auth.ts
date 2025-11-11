import { createAuthClient } from "better-auth/client";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const authClient = createAuthClient({
	basePath: "/api/auth",
	...(baseURL ? { baseURL } : {}),
});

export const signInWithGitHub = () =>
	authClient.signIn.social({
		provider: "github",
	});


