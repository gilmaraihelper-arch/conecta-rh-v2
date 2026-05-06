import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";

const productLabels: Record<string, string> = {
  vale_refeicao: "Vale Refeição / Alimentação",
  seguro_saude: "Seguro Saúde",
  ponto_eletronico: "Sistema de Ponto Eletrônico",
};

export default function AdminCommissions() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    product: "vale_refeicao" as "vale_refeicao" | "seguro_saude" | "ponto_eletronico",
    percentage: "",
    type: "recorrente" as "recorrente" | "unica",
    minAmount: "",
  });

  const { data: rules, isLoading, refetch } = trpc.admin.getCommissionRules.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const createRule = trpc.admin.createCommissionRule.useMutation({
    onSuccess: () => {
      refetch();
      setShowForm(false);
      setForm({ product: "vale_refeicao", percentage: "", type: "recorrente", minAmount: "" });
    },
  });

  const updateRule = trpc.admin.updateCommissionRule.useMutation({
    onSuccess: () => refetch(),
  });

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Acesso restrito</h1>
          <Button onClick={() => navigate("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
            Voltar ao painel
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Regras de Comissão</h1>
            <p className="text-slate-500">Configure as comissões por produto</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova regra
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Nova regra de comissão</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Produto</Label>
                <Select
                  value={form.product}
                  onValueChange={(v: any) => setForm({ ...form, product: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(productLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v: any) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recorrente">Recorrente (mensal)</SelectItem>
                    <SelectItem value="unica">Parcela única</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Percentual (%)</Label>
                <Input
                  placeholder="Ex: 5.00"
                  value={form.percentage}
                  onChange={(e) => setForm({ ...form, percentage: e.target.value })}
                />
              </div>
              <div>
                <Label>Valor mínimo base (R$)</Label>
                <Input
                  placeholder="Ex: 1000.00"
                  value={form.minAmount}
                  onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createRule.isPending || !form.percentage}
                onClick={() =>
                  createRule.mutate({
                    product: form.product,
                    percentage: form.percentage,
                    type: form.type,
                    minAmount: form.minAmount || undefined,
                  })
                }
              >
                {createRule.isPending ? "Salvando..." : "Salvar regra"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regras ativas</CardTitle>
        </CardHeader>
        <CardContent>
          {rules && rules.length > 0 ? (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-slate-900">
                      {productLabels[rule.product]}
                    </div>
                    <div className="text-sm text-slate-500">
                      {rule.type === "recorrente" ? "Recorrente" : "Única"}
                      {rule.minAmount && ` · Mínimo: R$ ${rule.minAmount}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-900">{rule.percentage}%</div>
                      <div className="text-xs text-slate-500">comissão</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.active}
                        onCheckedChange={(checked) =>
                          updateRule.mutate({ id: rule.id, active: checked })
                        }
                      />
                      <span className="text-xs text-slate-500">
                        {rule.active ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">
              Nenhuma regra de comissão cadastrada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
