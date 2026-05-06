import { z } from "zod";
import * as cookie from "cookie";
import { eq, desc } from "drizzle-orm";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
  updateProfile: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255).optional(),
        phone: z.string().max(20).optional(),
        companyName: z.string().max(255).optional(),
        cpfCnpj: z.string().max(20).optional(),
        acceptedTerms: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const updateData: Partial<schema.InsertUser> = {};
      if (input.name !== undefined) updateData.name = input.name;
      if (input.phone !== undefined) updateData.phone = input.phone || null;
      if (input.companyName !== undefined) updateData.companyName = input.companyName || null;
      if (input.cpfCnpj !== undefined) updateData.cpfCnpj = input.cpfCnpj || null;
      if (input.acceptedTerms !== undefined) updateData.acceptedTerms = input.acceptedTerms;

      await db.update(schema.users).set(updateData).where(eq(schema.users.id, userId));

      const [updated] = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1);

      return updated;
    }),
  completeOnboarding: authedQuery.mutation(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    await db
      .update(schema.users)
      .set({ onboardingComplete: true })
      .where(eq(schema.users.id, userId));

    return { success: true };
  }),
  getNotifications: authedQuery
    .input(z.object({ unreadOnly: z.boolean().default(false) }).optional())
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const conditions = [eq(schema.notifications.userId, userId)];
      if (input?.unreadOnly) {
        conditions.push(eq(schema.notifications.read, false));
      }

      return db
        .select()
        .from(schema.notifications)
        .where(eq(schema.notifications.userId, userId))
        .orderBy(desc(schema.notifications.createdAt))
        .limit(50);
    }),
  markNotificationRead: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(schema.notifications)
        .set({ read: true })
        .where(eq(schema.notifications.id, input.id));
      return { success: true };
    }),
  checkFirstTime: publicQuery.query(async ({ ctx }) => {
    if (!ctx.user) return { firstTime: false };
    return {
      firstTime: !ctx.user.onboardingComplete && !ctx.user.acceptedTerms,
    };
  }),
});
