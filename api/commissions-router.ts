import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, authedQuery } from "./middleware";

export const commissionsRouter = createRouter({
  getMyCommissions: authedQuery
    .input(
      z
        .object({
          status: z.enum(["estimada", "confirmada", "paga"]).optional(),
          monthYear: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const partnerId = ctx.user.id;

      const conditions = [eq(schema.commissions.partnerId, partnerId)];
      if (input?.status) {
        conditions.push(eq(schema.commissions.status, input.status));
      }
      if (input?.monthYear) {
        conditions.push(eq(schema.commissions.monthYear, input.monthYear));
      }

      const commissions = await db
        .select()
        .from(schema.commissions)
        .where(and(...conditions))
        .orderBy(desc(schema.commissions.createdAt));

      const commissionsWithLeads = await Promise.all(
        commissions.map(async (commission) => {
          const [lead] = await db
            .select()
            .from(schema.leads)
            .where(eq(schema.leads.id, commission.leadId))
            .limit(1);
          return { ...commission, leadName: lead?.companyName || "-" };
        })
      );

      return commissionsWithLeads;
    }),

  getSummary: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const partnerId = ctx.user.id;

    const allCommissions = await db
      .select()
      .from(schema.commissions)
      .where(eq(schema.commissions.partnerId, partnerId));

    const byStatus = {
      estimada: allCommissions
        .filter((c) => c.status === "estimada")
        .reduce((sum, c) => sum + Number(c.amount), 0),
      confirmada: allCommissions
        .filter((c) => c.status === "confirmada")
        .reduce((sum, c) => sum + Number(c.amount), 0),
      paga: allCommissions
        .filter((c) => c.status === "paga")
        .reduce((sum, c) => sum + Number(c.amount), 0),
    };

    const monthly: Record<string, { estimada: number; confirmada: number; paga: number }> = {};
    for (const c of allCommissions) {
      if (!monthly[c.monthYear]) {
        monthly[c.monthYear] = { estimada: 0, confirmada: 0, paga: 0 };
      }
      monthly[c.monthYear][c.status] += Number(c.amount);
    }

    return {
      byStatus: {
        estimada: byStatus.estimada.toFixed(2),
        confirmada: byStatus.confirmada.toFixed(2),
        paga: byStatus.paga.toFixed(2),
      },
      monthly,
      total: allCommissions.length,
    };
  }),
});
