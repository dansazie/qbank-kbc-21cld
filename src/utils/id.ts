import { randomUUID } from "node:crypto";

export function generateId(prefix = "Q"): string {
    return `${prefix}-${randomUUID()}`;
}
