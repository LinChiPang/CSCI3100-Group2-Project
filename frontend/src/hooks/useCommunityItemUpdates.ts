import { useEffect, useRef } from "react";
import { createConsumer } from "@rails/actioncable";
import type { ItemStatus } from "../types/marketplace";
import { buildCableUrl } from "../utils/cable";

interface ItemStatusChange {
  item_id: number;
  status: ItemStatus;
  reserved_by_id: number | null;
}

const validStatuses: ItemStatus[] = ["available", "reserved", "sold"];

function isItemStatus(status: string): status is ItemStatus {
  return validStatuses.includes(status as ItemStatus);
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

    const cable = createConsumer(buildCableUrl(token));

    cable.subscriptions.create(
      { channel: "CommunityItemsChannel" },
      {
        received(data: { type?: string; item_id?: number; status?: string; reserved_by_id?: number | null }) {
          if (
            data.type === "item_status_changed" &&
            data.item_id != null &&
            data.status != null &&
            isItemStatus(data.status)
          ) {
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
