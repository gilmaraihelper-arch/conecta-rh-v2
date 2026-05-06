import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const statusEnum = pgEnum("status", ["novo", "em_contato", "negociacao", "fechado", "perdido"]);
export const productEnum = pgEnum("product", ["vale_refeicao", "seguro_saude", "ponto_eletronico"]);
export const commissionStatusEnum = pgEnum("commission_status", ["estimada", "confirmada", "paga"]);
export const commissionTypeEnum = pgEnum("commission_type", ["recorrente", "unica"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  phone: varchar("phone", { length: 20 }),
  companyName: varchar("companyName", { length: 255 }),
  cpfCnpj: varchar("cpfCnpj", { length: 20 }),
  acceptedTerms: boolean("acceptedTerms").default(false),
  onboardingComplete: boolean("onboardingComplete").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  partnerId: integer("partnerId").notNull().references(() => users.id),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  segment: varchar("segment", { length: 100 }),
  city: varchar("city", { length: 100 }),
  uf: varchar("uf", { length: 2 }),
  companySize: varchar("companySize", { length: 50 }),
  notes: text("notes"),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  contactRole: varchar("contactRole", { length: 100 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  bestTime: varchar("bestTime", { length: 50 }),
  contactAware: boolean("contactAware").default(false),
  status: statusEnum("status").default("novo").notNull(),
  estimatedCommission: decimal("estimatedCommission", {
    precision: 12,
    scale: 2,
  }).default("0.00"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

export const leadProducts = pgTable("leadProducts", {
  id: serial("id").primaryKey(),
  leadId: integer("leadId").notNull().references(() => leads.id),
  product: productEnum("product").notNull(),
  contextData: text("contextData"),
});

export type LeadProduct = typeof leadProducts.$inferSelect;

export const leadStatusHistory = pgTable("leadStatusHistory", {
  id: serial("id").primaryKey(),
  leadId: integer("leadId").notNull().references(() => leads.id),
  status: statusEnum("status").notNull(),
  changedBy: integer("changedBy").notNull().references(() => users.id),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadStatusHistory = typeof leadStatusHistory.$inferSelect;

export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  leadId: integer("leadId").notNull().references(() => leads.id),
  partnerId: integer("partnerId").notNull().references(() => users.id),
  product: productEnum("product").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  type: commissionTypeEnum("type").notNull(),
  status: commissionStatusEnum("status").default("estimada").notNull(),
  monthYear: varchar("monthYear", { length: 7 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Commission = typeof commissions.$inferSelect;

export const commissionRules = pgTable("commissionRules", {
  id: serial("id").primaryKey(),
  product: productEnum("product").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  type: commissionTypeEnum("type").notNull(),
  minAmount: decimal("minAmount", { precision: 12, scale: 2 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CommissionRule = typeof commissionRules.$inferSelect;
export type InsertCommissionRule = typeof commissionRules.$inferInsert;

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;