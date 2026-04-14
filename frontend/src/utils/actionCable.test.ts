import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildCableUrl } from "./actionCable";

describe("actionCable utilities", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    window.history.pushState({}, "", "/c/hall-1");
  });

  it("builds a same-origin secure cable URL with an encoded token by default", () => {
    expect(buildCableUrl("token with spaces")).toBe(
      "ws://localhost:3000/cable?token=token%20with%20spaces",
    );
  });

  it("uses configured cable URL and preserves existing query params", () => {
    vi.stubEnv("VITE_CABLE_URL", "wss://cable.example.test/cable?source=spa");

    expect(buildCableUrl("abc+123")).toBe(
      "wss://cable.example.test/cable?source=spa&token=abc%2B123",
    );
  });
});
