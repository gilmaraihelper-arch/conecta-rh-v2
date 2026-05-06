import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  Loader2,
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

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = trpc.leads.getStats.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: leads, isLoading: leadsLoading } = trpc.leads.getMyLeads.useQuery(undefined, {
    enabled: !!user,
  });

  const isLoading = authLoading || statsLoading || leadsLoading;

  useEffect(() => {
    if (user && !user.onboardingComplete) {
      navigate("/onboarding");
    }
  }, [user, navigate]);

  if (isLoading) {
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
          <h1 className="text-2xl font-bold text-slate-900">Olá, {user?.name?.split(" ")[0] || "Parceiro"}</h1>
          <p className="text-slate-500 mt-1">Acompanhe suas indicações e comissões</p>
        </div>
        <Link to="/indicar">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Indicação
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{stats?.total ?? 0}</div>
                <div className="text-xs text-slate-500">Total de indicações</div>
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
                <div className="text-2xl font-bold text-slate-900">{stats?.emAndamento ?? 0}</div>
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
                <div className="text-2xl font-bold text-slate-900">{stats?.fechadas ?? 0}</div>
                <div className="text-xs text-slate-500">Fechadas</div>
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
                  R$ {Number(stats?.estimada ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500">Comissão estimada</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Últimas indicações</CardTitle>
          <Link to="/indicacoes" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {leads && leads.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="py-4 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => navigate(`/indicacoes/${lead.id}`)}
                >
                  <div>
                    <div className="font-medium text-slate-900">{lead.companyName}</div>
                    <div className="text-sm text-slate-500">
                      {lead.contactName} · {lead.city}, {lead.uf}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[lead.status]} variant="secondary">
                      {statusLabels[lead.status]}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">Nenhuma indicação ainda</h3>
              <p className="text-sm text-slate-500 mb-4">Comece enviando sua primeira indicação</p>
              <Link to="/indicar">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Indicação
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
