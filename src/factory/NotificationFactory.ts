export type NotificationKind = "success" | "error" | "info";

export interface AppNotification {
  kind: NotificationKind;
  message: string;
}

export class NotificationFactory {
  static create(event: string, payload?: string): AppNotification {
    switch (event) {
      case "team:full":
        return {
          kind: "error",
          message: payload ?? "Équipe complète.",
        };
      case "team:saved":
        return {
          kind: "success",
          message: payload ?? "Équipe sauvegardée.",
        };
      case "team:loaded":
        return {
          kind: "info",
          message: payload ?? "Équipe chargée.",
        };
      case "team:compared":
        return {
          kind: "info",
          message: payload ?? "Comparaison terminée.",
        };
      case "team:compare-error":
        return {
          kind: "error",
          message: payload ?? "Comparaison impossible.",
        };
      default:
        return {
          kind: "info",
          message: payload ?? "",
        };
    }
  }
}
