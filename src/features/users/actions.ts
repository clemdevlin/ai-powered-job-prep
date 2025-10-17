"use server";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserIdTag } from "./dbCache";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { upsertUser } from "./db";

export async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}

/** Wrapper server action you can call safely from a Client Component */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createUserOnServer(data: any) {
  await upsertUser(data);
}
