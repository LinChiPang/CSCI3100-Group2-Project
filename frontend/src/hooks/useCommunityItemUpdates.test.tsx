import { act, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCommunityItemUpdates } from "./useCommunityItemUpdates";

const actionCableMock = vi.hoisted(() => ({
  createConsumer: vi.fn(),
  disconnect: vi.fn(),
  received: undefined as ((data: unknown) => void) | undefined,
  subscriptionCreate: vi.fn(),
}));

vi.mock("@rails/actioncable", () => ({
  createConsumer: actionCableMock.createConsumer,
}));

function Probe({ onChange }: { onChange: Parameters<typeof useCommunityItemUpdates>[1] }) {
  useCommunityItemUpdates(7, onChange);
  return null;
}

describe("useCommunityItemUpdates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    localStorage.clear();
    window.history.pushState({}, "", "/c/hall-1");
    localStorage.setItem("auth_token", "token with spaces");
    actionCableMock.received = undefined;
    actionCableMock.createConsumer.mockImplementation(() => ({
      subscriptions: {
        create: actionCableMock.subscriptionCreate.mockImplementation((_identifier, callbacks) => {
          actionCableMock.received = callbacks.received;
          return { unsubscribe: vi.fn() };
        }),
      },
      disconnect: actionCableMock.disconnect,
    }));
  });

  it("connects with an encoded token, dispatches valid status events, and disconnects on cleanup", () => {
    const onChange = vi.fn();
    const { unmount } = render(<Probe onChange={onChange} />);

    expect(actionCableMock.createConsumer).toHaveBeenCalledWith(
      "ws://localhost:3000/cable?token=token%20with%20spaces",
    );

    act(() => {
      actionCableMock.received?.({
        type: "item_status_changed",
        item_id: 42,
        status: "reserved",
        reserved_by_id: 9,
      });
    });

    expect(onChange).toHaveBeenCalledWith({
      item_id: 42,
      status: "reserved",
      reserved_by_id: 9,
    });

    act(() => {
      actionCableMock.received?.({
        type: "item_status_changed",
        item_id: 42,
        status: "archived",
        reserved_by_id: null,
      });
    });

    expect(onChange).toHaveBeenCalledTimes(1);

    unmount();
    expect(actionCableMock.disconnect).toHaveBeenCalled();
  });
});
