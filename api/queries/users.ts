import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";

export async function findUserByUnionId(unionId: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.unionId, unionId))
    .limit(1);
  return rows.at(0);
}

export async function upsertUser(data: InsertUser) {
  const values = { ...data };
  const updateSet: Partial<InsertUser> = {
    lastSignInAt: new Date(),
    ...data,
  };

  if (
    values.role === undefined &&
    values.unionId &&
    values.unionId === env.ownerUnionId
  ) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  // PostgreSQL: use ON CONFLICT (upsert)
  const db = getDb();
  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.unionId, values.unionId))
    .limit(1);

  if (existing.length > 0) {
    // Update existing
    await db
      .update(schema.users)
      .set(updateSet)
      .where(eq(schema.users.id, existing[0].id));
  } else {
    // Insert new
    await db.insert(schema.users).values(values);
  }
}
