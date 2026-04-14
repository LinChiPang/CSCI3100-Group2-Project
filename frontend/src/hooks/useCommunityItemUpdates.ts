import { useEffect, useRef } from "react";
import { createAuthenticatedCableConsumer } from "../utils/actionCable";
import type { ItemStatus } from "../types/marketplace";

export interface ItemStatusChange {
  item_id: number;
  status: ItemStatus;
  reserved_by_id: number | null;
}

const validItemStatuses = new Set<ItemStatus>(["available", "reserved", "sold"]);

function isItemStatus(status: unknown): status is ItemStatus {
  return typeof status === "string" && validItemStatuses.has(status as ItemStatus);
}

export function useCommunityItemUpdates(
  userId: number | null,
  onItemStatusChanged: (change: ItemStatusChange) => void
) {
  // Keep callback ref so we never need to re-subscribe when the callback changes
  const callbackRef = useRef(onItemStatusChanged);
  callbackRef.current = onItemStatusChanged;

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const cable = createAuthenticatedCableConsumer(token);

    cable.subscriptions.create(
      { channel: "CommunityItemsChannel" },
      {
        received(data: { type?: string; item_id?: number; status?: string; reserved_by_id?: number | null }) {
          if (data.type === "item_status_changed" && typeof data.item_id === "number" && isItemStatus(data.status)) {
            callbackRef.current({
              item_id: data.item_id,
              status: data.status,
              reserved_by_id: data.reserved_by_id ?? null,
            });
          }
        },
      }
    );

    return () => {
      cable.disconnect();
    };
  }, [userId]);
}
