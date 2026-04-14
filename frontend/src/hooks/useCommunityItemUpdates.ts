import { useEffect, useRef } from "react";
import { createConsumer } from "@rails/actioncable";

interface ItemStatusChange {
  item_id: number;
  status: string;
  reserved_by_id: number | null;
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

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const cableUrl = (import.meta.env.VITE_CABLE_URL as string | undefined) ??
      `${protocol}//${window.location.host}/cable`;
    const cable = createConsumer(`${cableUrl}?token=${encodeURIComponent(token)}`);

    cable.subscriptions.create(
      { channel: "CommunityItemsChannel" },
      {
        received(data: { type?: string; item_id?: number; status?: string; reserved_by_id?: number | null }) {
          if (data.type === "item_status_changed" && data.item_id != null && data.status != null) {
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
