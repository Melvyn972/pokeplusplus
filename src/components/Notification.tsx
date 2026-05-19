import { useEffect, useState } from "react";
import { teamEvents } from "../observer/teamEvents";
import {
  NotificationFactory,
  type AppNotification,
} from "../factory/NotificationFactory";

const TEAM_EVENTS = [
  "team:full",
  "team:saved",
  "team:loaded",
  "team:compared",
  "team:compare-error",
] as const;

const KIND_STYLES: Record<AppNotification["kind"], string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-600 text-white",
};

export function Notification() {
  const [notification, setNotification] = useState<AppNotification | null>(null);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const unsubscribers = TEAM_EVENTS.map((event) =>
      teamEvents.on<string>(event, (payload) => {
        const created = NotificationFactory.create(event, payload);
        if (!created.message) return;
        setNotification(created);
        timeouts.push(setTimeout(() => setNotification(null), 3000));
      })
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
      timeouts.forEach(clearTimeout);
    };
  }, []);

  if (!notification) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-bounce ${KIND_STYLES[notification.kind]}`}
      role="status"
    >
      {notification.message}
    </div>
  );
}
