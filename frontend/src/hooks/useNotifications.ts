import { useState, useEffect, useRef } from "react";
import { createConsumer, Consumer, Subscription } from "@rails/actioncable";

export interface Notification {
  id: string;
  type: string;
  message: string;
  sent_at: string;
  read: boolean;
}

export function useNotifications(userId: number | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const consumerRef = useRef<Consumer | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const cable = createConsumer(
      `${import.meta.env.VITE_CABLE_URL ?? "ws://localhost:3000/cable"}?token=${encodeURIComponent(token)}`
    );
    consumerRef.current = cable;

    subscriptionRef.current = cable.subscriptions.create(
      { channel: "NotificationsChannel" },
      {
        received(data: { type: string; message: string; sent_at: string }) {
          setNotifications((prev) => [
            {
              id: `${Date.now()}-${Math.random()}`,
              type: data.type,
              message: data.message,
              sent_at: data.sent_at,
              read: false,
            },
            ...prev,
          ]);
        },
      }
    );

    return () => {
      subscriptionRef.current?.unsubscribe();
      cable.disconnect();
    };
  }, [userId]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAllRead, clearAll };
}
