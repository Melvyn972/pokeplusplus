type Callback<T = void> = (payload: T) => void;

class EventBus {
  private listeners: Map<string, Callback<any>[]> = new Map();

  on<T = void>(event: string, callback: Callback<T>): () => void {
    const existing = this.listeners.get(event) ?? [];
    this.listeners.set(event, [...existing, callback]);
    return () => {
      this.listeners.set(
        event,
        (this.listeners.get(event) ?? []).filter((cb) => cb !== callback)
      );
    };
  }

  emit<T = void>(event: string, payload?: T) {
    (this.listeners.get(event) ?? []).forEach((cb) => cb(payload));
  }
}

export const teamEvents = new EventBus();
