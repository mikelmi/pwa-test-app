import type { SOSMessage } from "@/types";

export function isSOSMessage(value: unknown): value is SOSMessage {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Partial<SOSMessage>;

  return (
    typeof obj.uuid === "string" &&
    typeof obj.location === "object" &&
    obj.location !== null &&
    typeof obj.location.latitude === "number" &&
    typeof obj.location.longitude === "number" &&
    typeof obj.timestamp === "number"
  );
}
