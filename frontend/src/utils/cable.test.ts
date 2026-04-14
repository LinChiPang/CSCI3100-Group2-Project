import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCableUrl } from "./cable";

describe("buildCableUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers VITE_CABLE_URL", () => {
    vi.stubEnv("VITE_CABLE_URL", "wss://cable.example.test/live?tenant=one");
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.test");

    expect(buildCableUrl("test-token")).toBe("wss://cable.example.test/live?tenant=one&token=test-token");
  });

  it("derives the cable URL from VITE_API_BASE_URL", () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.test");

    expect(buildCableUrl("test-token")).toBe("wss://api.example.test/cable?token=test-token");
  });

  it("falls back to the current origin", () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    expect(buildCableUrl("test-token")).toBe(`${protocol}//${window.location.host}/cable?token=test-token`);
  });
});
