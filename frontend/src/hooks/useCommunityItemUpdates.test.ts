import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCommunityItemUpdates } from "./useCommunityItemUpdates";

const cableMock = vi.hoisted(() => {
  const state = {
    createConsumer: vi.fn(),
    disconnect: vi.fn(),
    lastReceived: undefined as
      | ((data: { type?: string; item_id?: number; status?: string; reserved_by_id?: number | null }) => void)
      | undefined,
  };

  state.createConsumer.mockImplementation(() => ({
    subscriptions: {
      create: vi.fn((_params, callbacks) => {
        state.lastReceived = callbacks.received;
        return { unsubscribe: vi.fn() };
      }),
    },
    disconnect: state.disconnect,
  }));

  return state;
});

vi.mock("@rails/actioncable", () => ({
  createConsumer: cableMock.createConsumer,
}));

describe("useCommunityItemUpdates", () => {
  beforeEach(() => {
    localStorage.setItem("auth_token", "test-token");
    vi.clearAllMocks();
    cableMock.lastReceived = undefined;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("subscribes with the authenticated cable URL", () => {
    renderHook(() => useCommunityItemUpdates(1, vi.fn()));

    expect(cableMock.createConsumer).toHaveBeenCalledWith(expect.stringContaining("/cable?token=test-token"));
  });

  it("passes valid item status changes to the callback", () => {
    const callback = vi.fn();
    renderHook(() => useCommunityItemUpdates(1, callback));

    cableMock.lastReceived?.({
      type: "item_status_changed",
      item_id: 42,
      status: "reserved",
      reserved_by_id: 7,
    });

    expect(callback).toHaveBeenCalledWith({ item_id: 42, status: "reserved", reserved_by_id: 7 });
  });

  it("ignores malformed status changes", () => {
    const callback = vi.fn();
    renderHook(() => useCommunityItemUpdates(1, callback));

    cableMock.lastReceived?.({ type: "item_status_changed", item_id: 42, status: "archived" });
    cableMock.lastReceived?.({ type: "other_event", item_id: 42, status: "reserved" });

    expect(callback).not.toHaveBeenCalled();
  });
});
