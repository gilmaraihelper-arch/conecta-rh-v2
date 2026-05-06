import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  ArrowRight,
  BarChart3,
} from "lucide-react";

const statusLabels: Record<string, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  negociacao: "Negociação",
  fechado: "Fechado",
  perdido: "Perdido",
};

const statusColors: Record<string, string> = {
  novo: "bg-blue-100 text-blue-700",
  em_contato: "bg-amber-100 text-amber-700",
  negociacao: "bg-purple-100 text-purple-700",
  fechado: "bg-green-100 text-green-700",
  perdido: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const navigate = useNavigate();

  const { data: reports, isLoading: reportsLoading } = trpc.admin.getReports.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: leads, isLoading: leadsLoading } = trpc.admin.getAllLeads.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">Acesso restrito</h1>
          <p className="text-slate-500 mb-4">Esta área é exclusiva para administradores.</p>
          <Button onClick={() => navigate("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
            Voltar ao painel
          </Button>
        </div>
      </div>
    );
  }

  if (reportsLoading || leadsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel Administrativo</h1>
          <p className="text-slate-500 mt-1">Visão geral de todas as indicações e comissões</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{reports?.totalLeads ?? 0}</div>
                <div className="text-xs text-slate-500">Total de leads</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {(reports?.statusCounts.novo ?? 0) + (reports?.statusCounts.em_contato ?? 0) + (reports?.statusCounts.negociacao ?? 0)}
                </div>
                <div className="text-xs text-slate-500">Em andamento</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{reports?.statusCounts.fechado ?? 0}</div>
                <div className="text-xs text-slate-500">Fechados</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  R$ {Number(reports?.commissionTotals.estimada ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500">Comissões estimadas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            Distribuição por status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(reports?.statusCounts ?? {}).map(([status, count]) => (
              <div key={status} className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{count}</div>
                <Badge className={`mt-2 ${statusColors[status]}`} variant="secondary">
                  {statusLabels[status]}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Partners */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Parceiros</CardTitle>
        </CardHeader>
        <CardContent>
          {reports?.topPartners && reports.topPartners.length > 0 ? (
            <div className="space-y-3">
              {reports.topPartners.slice(0, 5).map((partner, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{partner.name}</div>
                      <div className="text-xs text-slate-500">{partner.leads} indicações</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">
                      R$ {partner.commission.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-slate-500">em comissões</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">Nenhum dado de parceiros ainda.</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Últimas indicações</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/leads")}>
            Ver todas <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {leads && leads.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{lead.companyName}</div>
                    <div className="text-sm text-slate-500">
                      Parceiro: {lead.partnerName} · {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <Badge className={statusColors[lead.status]} variant="secondary">
                    {statusLabels[lead.status]}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">Nenhuma indicação recebida ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
