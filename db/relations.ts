import { relations } from "drizzle-orm";
import {
  users,
  leads,
  leadProducts,
  leadStatusHistory,
  commissions,
  notifications,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  statusChanges: many(leadStatusHistory),
  commissions: many(commissions),
  notifications: many(notifications),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  partner: one(users, {
    fields: [leads.partnerId],
    references: [users.id],
  }),
  products: many(leadProducts),
  statusHistory: many(leadStatusHistory),
  commissions: many(commissions),
}));

export const leadProductsRelations = relations(leadProducts, ({ one }) => ({
  lead: one(leads, {
    fields: [leadProducts.leadId],
    references: [leads.id],
  }),
}));

export const leadStatusHistoryRelations = relations(leadStatusHistory, ({ one }) => ({
  lead: one(leads, {
    fields: [leadStatusHistory.leadId],
    references: [leads.id],
  }),
  changedByUser: one(users, {
    fields: [leadStatusHistory.changedBy],
    references: [users.id],
  }),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  lead: one(leads, {
    fields: [commissions.leadId],
    references: [leads.id],
  }),
  partner: one(users, {
    fields: [commissions.partnerId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
