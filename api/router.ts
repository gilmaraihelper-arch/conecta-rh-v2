import { authRouter } from "./auth-router";
import { leadsRouter } from "./leads-router";
import { commissionsRouter } from "./commissions-router";
import { adminRouter } from "./admin-router";
import { demoRouter } from "./demo-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  leads: leadsRouter,
  commissions: commissionsRouter,
  admin: adminRouter,
  demo: demoRouter,
});

export type AppRouter = typeof appRouter;
