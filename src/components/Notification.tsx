import { useEffect, useState } from "react";
import { teamEvents } from "../observer/teamEvents";

export function Notification() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = teamEvents.on<string>("team:full", (msg) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 3000);
    });
    return unsub;
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-bounce">
      {message}
    </div>
  );
}
