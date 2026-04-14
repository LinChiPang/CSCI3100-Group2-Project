import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNotifications } from "./useNotifications";

const cableMock = vi.hoisted(() => {
  const state = {
    createConsumer: vi.fn(),
    disconnect: vi.fn(),
    unsubscribe: vi.fn(),
    lastReceived: undefined as
      | ((data: { type: string; message: string; sent_at: string }) => void)
      | undefined,
  };

  state.createConsumer.mockImplementation(() => ({
    subscriptions: {
      create: vi.fn((_params, callbacks) => {
        state.lastReceived = callbacks.received;
        return { unsubscribe: state.unsubscribe };
      }),
    },
    disconnect: state.disconnect,
  }));

  return state;
});

vi.mock("@rails/actioncable", () => ({
  createConsumer: cableMock.createConsumer,
}));

describe("useNotifications", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.setItem("auth_token", "test-token");
    vi.clearAllMocks();
    cableMock.lastReceived = undefined;
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("subscribes with the authenticated cable URL", () => {
    renderHook(() => useNotifications(1));

    expect(cableMock.createConsumer).toHaveBeenCalledWith(expect.stringContaining("/cable?token=test-token"));
  });

  it("stores notifications and clears the toast timer", () => {
    const { result } = renderHook(() => useNotifications(1));

    act(() => {
      cableMock.lastReceived?.({ type: "item_reserved", message: "Reserved", sent_at: "10:30" });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.latestToast?.message).toBe("Reserved");
    expect(result.current.unreadCount).toBe(1);

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.latestToast).toBeNull();
  });
});
