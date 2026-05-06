import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, DollarSign, TrendingUp, CheckCircle2, Wallet } from "lucide-react";

export default function Commissions() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const [activeTab, setActiveTab] = useState("estimada");

  const { data: summary, isLoading: summaryLoading } = trpc.commissions.getSummary.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: commissions, isLoading: commissionsLoading } = trpc.commissions.getMyCommissions.useQuery(
    { status: activeTab as "estimada" | "confirmada" | "paga" },
    { enabled: !!user }
  );

  const isLoading = summaryLoading || commissionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Minhas Comissões</h1>
        <p className="text-slate-500 mt-1">Acompanhe suas comissões estimadas, confirmadas e pagas</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  R$ {Number(summary?.byStatus.estimada ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500">Estimada</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  R$ {Number(summary?.byStatus.confirmada ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500">Confirmada</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  R$ {Number(summary?.byStatus.paga ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500">Paga</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalhamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="estimada">Estimada</TabsTrigger>
              <TabsTrigger value="confirmada">Confirmada</TabsTrigger>
              <TabsTrigger value="paga">Paga</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {commissions && commissions.length > 0 ? (
                <div className="space-y-3">
                  {commissions.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-slate-900">{c.leadName}</div>
                        <div className="text-sm text-slate-500 capitalize">
                          {c.product === "vale_refeicao" && "Vale Refeição"}
                          {c.product === "seguro_saude" && "Seguro Saúde"}
                          {c.product === "ponto_eletronico" && "Ponto Eletrônico"}
                          {" · "}
                          {c.type === "recorrente" ? "Recorrente" : "Parcela única"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">
                          R$ {Number(c.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500">{c.monthYear}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Nenhuma comissão neste status ainda.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Monthly View */}
      {summary?.monthly && Object.keys(summary.monthly).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Visão mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(summary.monthly)
                .sort((a, b) => {
                  const [mA, yA] = a[0].split("/");
                  const [mB, yB] = b[0].split("/");
                  return Number(yB) - Number(yA) || Number(mB) - Number(mA);
                })
                .map(([monthYear, values]) => (
                  <div key={monthYear} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="font-medium text-slate-900">{monthYear}</div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-right">
                        <div className="text-amber-700 font-medium">
                          R$ {values.estimada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500">Estimada</div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-700 font-medium">
                          R$ {values.confirmada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500">Confirmada</div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-700 font-medium">
                          R$ {values.paga.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500">Paga</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
