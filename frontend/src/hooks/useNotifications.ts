import { useState, useEffect, useRef } from "react";
import type { Consumer, Subscription } from "@rails/actioncable";
import { createAuthenticatedCableConsumer } from "../utils/actionCable";

export interface Notification {
  id: string;
  type: string;
  message: string;
  sent_at: string;
  read: boolean;
}

export function useNotifications(userId: number | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestToast, setLatestToast] = useState<Notification | null>(null);
  const consumerRef = useRef<Consumer | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const cable = createAuthenticatedCableConsumer(token);
    consumerRef.current = cable;

    subscriptionRef.current = cable.subscriptions.create(
      { channel: "NotificationsChannel" },
      {
        received(data: { type: string; message: string; sent_at: string }) {
          const newNotification: Notification = {
            id: `${Date.now()}-${Math.random()}`,
            type: data.type,
            message: data.message,
            sent_at: data.sent_at,
            read: false,
          };
          setNotifications((prev) => [newNotification, ...prev]);
          // Show toast — auto-dismiss after 4 s
          setLatestToast(newNotification);
          if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
          toastTimerRef.current = setTimeout(() => setLatestToast(null), 4000);
        },
      }
    );

    return () => {
      subscriptionRef.current?.unsubscribe();
      cable.disconnect();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [userId]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setLatestToast(null);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAllRead, clearAll, latestToast, dismissToast };
}
