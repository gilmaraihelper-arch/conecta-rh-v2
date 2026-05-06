import { z } from "zod";
import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, publicQuery } from "./middleware";
import { signSessionToken } from "./kimi/session";
import { getSessionCookieOptions } from "./lib/cookies";
import { Session } from "@contracts/constants";
import * as cookie from "cookie";
import { env } from "./lib/env";

export const demoRouter = createRouter({
  register: publicQuery
    .input(
      z.object({
        name: z.string().min(2).max(255),
        email: z.string().email().max(320),
        phone: z.string().max(20),
        companyName: z.string().max(255),
        cpfCnpj: z.string().max(20),
        role: z.enum(["user", "admin"]).default("user"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();

      // Check if user already exists
      const existing = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.unionId, input.email))
        .limit(1);

      let user;
      if (existing.length > 0) {
        user = existing[0];
        // Update last sign in
        await db
          .update(schema.users)
          .set({ lastSignInAt: new Date() })
          .where(eq(schema.users.id, user.id));
      } else {
        // Create new user
        const result = await db.insert(schema.users).values({
          unionId: input.email,
          name: input.name,
          email: input.email,
          phone: input.phone || null,
          companyName: input.companyName || null,
          cpfCnpj: input.cpfCnpj || null,
          role: input.role,
          acceptedTerms: true,
          onboardingComplete: true,
          lastSignInAt: new Date(),
        }).returning();

        const [newUser] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, result[0].id))
          .limit(1);

        user = newUser;
      }

      // Create session token
      const token = await signSessionToken({
        unionId: user.unionId,
        clientId: env.appId,
      });

      // Set cookie via resHeaders (same as auth-router logout)
      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );

      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          onboardingComplete: user.onboardingComplete,
        },
      };
    }),
});
