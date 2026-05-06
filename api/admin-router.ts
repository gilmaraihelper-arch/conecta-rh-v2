import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, adminQuery } from "./middleware";

export const adminRouter = createRouter({
  getAllLeads: adminQuery
    .input(
      z
        .object({
          status: z
            .enum(["novo", "em_contato", "negociacao", "fechado", "perdido"])
            .optional(),
          partnerId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();

      const conditions = [];
      if (input?.status) {
        conditions.push(eq(schema.leads.status, input.status));
      }
      if (input?.partnerId) {
        conditions.push(eq(schema.leads.partnerId, input.partnerId));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const leads = await db
        .select()
        .from(schema.leads)
        .where(whereClause)
        .orderBy(desc(schema.leads.createdAt));

      const leadsWithDetails = await Promise.all(
        leads.map(async (lead) => {
          const [partner] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, lead.partnerId))
            .limit(1);

          const products = await db
            .select()
            .from(schema.leadProducts)
            .where(eq(schema.leadProducts.leadId, lead.id));

          return {
            ...lead,
            partnerName: partner?.name || "-",
            partnerEmail: partner?.email || "-",
            products,
          };
        })
      );

      return leadsWithDetails;
    }),

  updateLeadStatus: adminQuery
    .input(
      z.object({
        leadId: z.number(),
        status: z.enum(["novo", "em_contato", "negociacao", "fechado", "perdido"]),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const adminId = ctx.user.id;

      await db
        .update(schema.leads)
        .set({ status: input.status })
        .where(eq(schema.leads.id, input.leadId));

      await db.insert(schema.leadStatusHistory).values({
        leadId: input.leadId,
        status: input.status,
        changedBy: adminId,
        comment: input.comment || `Status alterado para ${input.status}`,
      });

      const [lead] = await db
        .select()
        .from(schema.leads)
        .where(eq(schema.leads.id, input.leadId))
        .limit(1);

      if (lead) {
        await db.insert(schema.notifications).values({
          userId: lead.partnerId,
          title: "Atualização de status",
          message: `O status da indicação ${lead.companyName} foi alterado para ${input.status}.`,
        });
      }

      return { success: true };
    }),

  getCommissionRules: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(schema.commissionRules).orderBy(schema.commissionRules.product);
  }),

  createCommissionRule: adminQuery
    .input(
      z.object({
        product: z.enum(["vale_refeicao", "seguro_saude", "ponto_eletronico"]),
        percentage: z.string(),
        type: z.enum(["recorrente", "unica"]),
        minAmount: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(schema.commissionRules).values({
        product: input.product,
        percentage: input.percentage,
        type: input.type,
        minAmount: input.minAmount || null,
      }).returning();
      return { id: result[0].id };
    }),

  updateCommissionRule: adminQuery
    .input(
      z.object({
        id: z.number(),
        percentage: z.string().optional(),
        minAmount: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const updateData: Partial<schema.InsertCommissionRule> = {};
      if (input.percentage !== undefined) updateData.percentage = input.percentage;
      if (input.minAmount !== undefined) updateData.minAmount = input.minAmount || null;
      if (input.active !== undefined) updateData.active = input.active;

      await db
        .update(schema.commissionRules)
        .set(updateData)
        .where(eq(schema.commissionRules.id, input.id));

      return { success: true };
    }),

  getReports: adminQuery.query(async () => {
      const db = getDb();

      const allLeads = await db.select().from(schema.leads);
      const allCommissions = await db.select().from(schema.commissions);

      const statusCounts = {
        novo: allLeads.filter((l) => l.status === "novo").length,
        em_contato: allLeads.filter((l) => l.status === "em_contato").length,
        negociacao: allLeads.filter((l) => l.status === "negociacao").length,
        fechado: allLeads.filter((l) => l.status === "fechado").length,
        perdido: allLeads.filter((l) => l.status === "perdido").length,
      };

      const commissionTotals = {
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

      const topPartners: Record<number, { name: string; leads: number; commission: number }> = {};
      for (const lead of allLeads) {
        if (!topPartners[lead.partnerId]) {
          const [partner] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.id, lead.partnerId))
            .limit(1);
          topPartners[lead.partnerId] = {
            name: partner?.name || "-",
            leads: 0,
            commission: 0,
          };
        }
        topPartners[lead.partnerId].leads++;
      }

      for (const commission of allCommissions) {
        if (topPartners[commission.partnerId]) {
          topPartners[commission.partnerId].commission += Number(commission.amount);
        }
      }

      return {
        totalLeads: allLeads.length,
        statusCounts,
        commissionTotals: {
          estimada: commissionTotals.estimada.toFixed(2),
          confirmada: commissionTotals.confirmada.toFixed(2),
          paga: commissionTotals.paga.toFixed(2),
        },
        topPartners: Object.values(topPartners).sort((a, b) => b.leads - a.leads).slice(0, 10),
      };
    }),
});
