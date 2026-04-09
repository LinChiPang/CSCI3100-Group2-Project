import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AxiosResponse } from "axios";

const axiosMock = vi.hoisted(() => {
  const requestHandlers: Array<(config: { url?: string; headers: Record<string, string> }) => unknown> = [];
  const responseHandlers: Array<[(response: AxiosResponse) => unknown, (error: unknown) => unknown]> = [];

  const runRequestHandlers = async (url: string) => {
    const config = { url, headers: {} as Record<string, string> };
    for (const handler of requestHandlers) {
      await handler(config);
    }
    return config;
  };

  return {
    requestHandlers,
    responseHandlers,
    post: vi.fn(async (url: string) => {
      const config = await runRequestHandlers(url);
      return { data: { user: { id: 1, email: "test@cuhk.edu.hk", community_id: 1 }, token: "fresh-token" }, config };
    }),
    delete: vi.fn(async (url: string) => {
      const config = await runRequestHandlers(url);
      return { data: {}, config };
    }),
  };
});

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: (handler: (config: { url?: string; headers: Record<string, string> }) => unknown) => {
            axiosMock.requestHandlers.push(handler);
          },
        },
        response: {
          use: (success: (response: AxiosResponse) => unknown, failure: (error: unknown) => unknown) => {
            axiosMock.responseHandlers.push([success, failure]);
          },
        },
      },
      post: axiosMock.post,
      delete: axiosMock.delete,
    })),
  },
}));

async function loadApi() {
  vi.stubEnv("VITE_USE_MOCKS", "false");
  vi.resetModules();
  return import("./api");
}

describe("api auth headers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.requestHandlers.length = 0;
    axiosMock.responseHandlers.length = 0;
    localStorage.clear();
  });

  it("does not send stale authorization headers to login", async () => {
    const api = await loadApi();
    localStorage.setItem("auth_token", "stale-token");

    await api.login("test@cuhk.edu.hk", "password123");

    const response = await axiosMock.post.mock.results[0].value;
    expect(response.config.url).toBe("/users/login.json");
    expect(response.config.headers.Authorization).toBeUndefined();
  });

  it("does not send stale authorization headers to registration", async () => {
    const api = await loadApi();
    localStorage.setItem("auth_token", "stale-token");

    await api.register("test@cuhk.edu.hk", "password123", "password123", 1, "testuser");

    const response = await axiosMock.post.mock.results[0].value;
    expect(response.config.url).toBe("/users.json");
    expect(response.config.headers.Authorization).toBeUndefined();
  });

  it("sends the current token to logout before clearing it", async () => {
    const api = await loadApi();
    localStorage.setItem("auth_token", "active-token");

    await api.logout();

    const response = await axiosMock.delete.mock.results[0].value;
    expect(response.config.url).toBe("/users/logout.json");
    expect(response.config.headers.Authorization).toBe("Bearer active-token");
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});
