import { BASE_URL } from "@/constants";

export async function apiClient(
  url: string,
  options: RequestInit & { skipRefresh?: boolean } = {},
) {
  const { skipRefresh, ...fetchOptions } = options;
  const defaultOptions = {
    ...fetchOptions,
    credentials: "include" as const,
    headers: {
      ...fetchOptions.headers,
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(url, defaultOptions);

  if (
    response.status === 401 &&
    !skipRefresh &&
    !url.includes("/auth/refresh")
  ) {
    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include" as const,
    });
    if (refreshResponse.ok) {
      response = await fetch(url, defaultOptions);
    } else {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("Failed to refresh token");
    }
  }
  return response;
}
