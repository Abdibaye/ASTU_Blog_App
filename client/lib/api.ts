const resolveBaseUrl = () => {
  const publicUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const serverUrl = process.env.API_URL ?? process.env.INTERNAL_API_URL ?? "";
  const selected = (typeof window === "undefined" ? serverUrl || publicUrl : publicUrl).trim();

  return selected.replace(/\/$/, "");
};

const baseUrl = resolveBaseUrl();
const apiPrefix = (process.env.NEXT_PUBLIC_API_PREFIX ?? "/api").replace(/\/$/, "");

const buildUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!baseUrl) {
    throw new Error(
      "API base URL is not configured. Set NEXT_PUBLIC_API_URL (and optionally API_URL for server-side requests).",
    );
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const prefixedPath = normalizedPath.startsWith(apiPrefix)
    ? normalizedPath
    : `${apiPrefix}${normalizedPath}`;

  return `${baseUrl}${prefixedPath}`;
};

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let errorMessage = response.statusText;

    try {
      if (isJson) {
        const errorBody = await response.json();
        errorMessage = typeof errorBody === "string" ? errorBody : errorBody?.error ?? errorMessage;
      } else {
        const text = await response.text();
        if (text && !/^\s*</.test(text)) {
          errorMessage = text;
        }
      }
    } catch {
      // ignore parse errors and fall back to statusText
    }

    throw new Error(errorMessage || "Request failed");
  }

  if (!contentType) {
    return null;
  }

  return isJson ? response.json() : response.text();
};

const request = async (path: string, init?: RequestInit) => {
  const url = buildUrl(path);
  const response = await fetch(url, {
    credentials: "include",
    cache: init?.cache ?? "no-store",
    ...init,
  });

  return parseResponse(response);
};

export const api = {
  get: (path: string) => request(path),
  post: (path: string, data: unknown) => request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }),
};
