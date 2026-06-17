import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import type { SessionPayload } from "@/lib/auth";

export async function logAudit(
  session: SessionPayload | null,
  action: string,
  entity: string,
  entityId?: number,
  details?: string,
) {
  await db.insert(auditLogs).values({
    userId: session?.userId ?? null,
    action,
    entity,
    entityId: entityId ?? null,
    details: details ?? null,
  });
}
