import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./queries/connection";
import { createRouter, authedQuery } from "./middleware";
import { TRPCError } from "@trpc/server";

export const leadsRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        companyName: z.string().min(1).max(255),
        segment: z.string().max(100).optional(),
        city: z.string().max(100).optional(),
        uf: z.string().max(2).optional(),
        companySize: z.string().max(50).optional(),
        notes: z.string().optional(),
        contactName: z.string().min(1).max(255),
        contactRole: z.string().max(100).optional(),
        contactEmail: z.string().email().max(320).optional(),
        contactPhone: z.string().max(20).optional(),
        bestTime: z.string().max(50).optional(),
        contactAware: z.boolean().default(false),
        products: z.array(
          z.object({
            product: z.enum(["vale_refeicao", "seguro_saude", "ponto_eletronico"]),
            contextData: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const partnerId = ctx.user.id;

      const lead = await db.insert(schema.leads).values({
        partnerId,
        companyName: input.companyName,
        segment: input.segment || null,
        city: input.city || null,
        uf: input.uf || null,
        companySize: input.companySize || null,
        notes: input.notes || null,
        contactName: input.contactName,
        contactRole: input.contactRole || null,
        contactEmail: input.contactEmail || null,
        contactPhone: input.contactPhone || null,
        bestTime: input.bestTime || null,
        contactAware: input.contactAware,
      }).returning();

      const leadId = lead[0].id;

      if (input.products.length > 0) {
        await db.insert(schema.leadProducts).values(
          input.products.map((p) => ({
            leadId,
            product: p.product,
            contextData: p.contextData || null,
          }))
        );
      }

      await db.insert(schema.leadStatusHistory).values({
        leadId,
        status: "novo",
        changedBy: partnerId,
        comment: "Lead criado pelo parceiro",
      });

      const commissionRules = await db
        .select()
        .from(schema.commissionRules)
        .where(eq(schema.commissionRules.active, true));

      let estimatedCommission = 0;
      const now = new Date();
      const monthYear = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

      for (const product of input.products) {
        const rule = commissionRules.find((r) => r.product === product.product);
        if (rule) {
          const baseAmount = rule.minAmount ? Number(rule.minAmount) : 5000;
          const commissionAmount = baseAmount * (Number(rule.percentage) / 100);
          estimatedCommission += commissionAmount;

          await db.insert(schema.commissions).values({
            leadId,
            partnerId,
            product: product.product,
            amount: String(commissionAmount.toFixed(2)),
            type: rule.type,
            status: "estimada",
            monthYear,
          });
        }
      }

      await db
        .update(schema.leads)
        .set({ estimatedCommission: String(estimatedCommission.toFixed(2)) })
        .where(eq(schema.leads.id, leadId));

      await db.insert(schema.notifications).values({
        userId: partnerId,
        title: "Nova indicação enviada",
        message: `Sua indicação para ${input.companyName} foi recebida e está em análise.`,
      });

      return { id: leadId, estimatedCommission };
    }),

  getMyLeads: authedQuery
    .input(
      z
        .object({
          status: z
            .enum(["novo", "em_contato", "negociacao", "fechado", "perdido"])
            .optional(),
          period: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const partnerId = ctx.user.id;

      const conditions = [eq(schema.leads.partnerId, partnerId)];
      if (input?.status) {
        conditions.push(eq(schema.leads.status, input.status));
      }

      const leads = await db
        .select()
        .from(schema.leads)
        .where(and(...conditions))
        .orderBy(desc(schema.leads.createdAt));

      const leadsWithProducts = await Promise.all(
        leads.map(async (lead) => {
          const products = await db
            .select()
            .from(schema.leadProducts)
            .where(eq(schema.leadProducts.leadId, lead.id));
          return { ...lead, products };
        })
      );

      return leadsWithProducts;
    }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const user = ctx.user;

      const [lead] = await db
        .select()
        .from(schema.leads)
        .where(eq(schema.leads.id, input.id))
        .limit(1);

      if (!lead) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lead não encontrado" });
      }

      if (user.role !== "admin" && lead.partnerId !== user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado" });
      }

      const products = await db
        .select()
        .from(schema.leadProducts)
        .where(eq(schema.leadProducts.leadId, lead.id));

      const history = await db
        .select()
        .from(schema.leadStatusHistory)
        .where(eq(schema.leadStatusHistory.leadId, lead.id))
        .orderBy(desc(schema.leadStatusHistory.createdAt));

      const commissions = await db
        .select()
        .from(schema.commissions)
        .where(eq(schema.commissions.leadId, lead.id));

      return { ...lead, products, history, commissions };
    }),

  getStats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const partnerId = ctx.user.id;

    const allLeads = await db
      .select()
      .from(schema.leads)
      .where(eq(schema.leads.partnerId, partnerId));

    const total = allLeads.length;
    const emAndamento = allLeads.filter(
      (l) => l.status === "novo" || l.status === "em_contato" || l.status === "negociacao"
    ).length;
    const fechadas = allLeads.filter((l) => l.status === "fechado").length;
    const perdidas = allLeads.filter((l) => l.status === "perdido").length;

    const commissions = await db
      .select()
      .from(schema.commissions)
      .where(eq(schema.commissions.partnerId, partnerId));

    const estimada = commissions
      .filter((c) => c.status === "estimada")
      .reduce((sum, c) => sum + Number(c.amount), 0);
    const confirmada = commissions
      .filter((c) => c.status === "confirmada")
      .reduce((sum, c) => sum + Number(c.amount), 0);
    const paga = commissions
      .filter((c) => c.status === "paga")
      .reduce((sum, c) => sum + Number(c.amount), 0);

    return {
      total,
      emAndamento,
      fechadas,
      perdidas,
      estimada: estimada.toFixed(2),
      confirmada: confirmada.toFixed(2),
      paga: paga.toFixed(2),
    };
  }),
});
