import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertTriangle,
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

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leadId = Number(id);

  const { data: lead, isLoading } = trpc.leads.getById.useQuery(
    { id: leadId },
    { enabled: !!leadId && !isNaN(leadId) }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Indicação não encontrada</h1>
        <Button onClick={() => navigate("/dashboard")} className="bg-blue-600 hover:bg-blue-700 mt-4">
          Voltar ao painel
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Voltar ao painel</span>
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{lead.companyName}</h1>
          <p className="text-slate-500 mt-1">
            Indicado em {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <Badge className={statusColors[lead.status]} variant="secondary">
          {statusLabels[lead.status]}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400" />
                Dados da empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lead.segment && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 w-24 shrink-0">Segmento</span>
                  <span className="text-sm text-slate-900">{lead.segment}</span>
                </div>
              )}
              {(lead.city || lead.uf) && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500 w-20 shrink-0">Local</span>
                  <span className="text-sm text-slate-900">
                    {lead.city}, {lead.uf}
                  </span>
                </div>
              )}
              {lead.companySize && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 w-24 shrink-0">Porte</span>
                  <span className="text-sm text-slate-900">{lead.companySize}</span>
                </div>
              )}
              {lead.notes && (
                <div className="pt-2">
                  <span className="text-sm text-slate-500">Observações</span>
                  <p className="text-sm text-slate-900 mt-1 bg-slate-50 p-3 rounded-lg">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                Dados do contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 w-24 shrink-0">Nome</span>
                <span className="text-sm font-medium text-slate-900">{lead.contactName}</span>
              </div>
              {lead.contactRole && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 w-24 shrink-0">Cargo</span>
                  <span className="text-sm text-slate-900">{lead.contactRole}</span>
                </div>
              )}
              {lead.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500 w-20 shrink-0">E-mail</span>
                  <span className="text-sm text-slate-900">{lead.contactEmail}</span>
                </div>
              )}
              {lead.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500 w-20 shrink-0">Telefone</span>
                  <span className="text-sm text-slate-900">{lead.contactPhone}</span>
                </div>
              )}
              {lead.bestTime && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500 w-20 shrink-0">Horário</span>
                  <span className="text-sm text-slate-900">{lead.bestTime}</span>
                </div>
              )}
              <div className="flex items-center gap-3 pt-1">
                {lead.contactAware ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span className="text-sm text-slate-600">
                  {lead.contactAware
                    ? "Contato ciente da prospecção"
                    : "Contato ainda não informado"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" />
                Histórico de status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lead.history && lead.history.length > 0 ? (
                <div className="space-y-4">
                  {lead.history.map((h, i) => (
                    <div key={h.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-blue-600" : "bg-slate-300"}`} />
                        {i < lead.history!.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex items-center gap-2">
                          <Badge className={statusColors[h.status]} variant="secondary">
                            {statusLabels[h.status]}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {new Date(h.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        {h.comment && (
                          <p className="text-sm text-slate-600 mt-1">{h.comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Nenhuma movimentação registrada ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lead.products?.map((p) => (
                  <div key={p.id} className="bg-slate-50 rounded-lg p-3">
                    <div className="font-medium text-sm text-slate-900">
                      {p.product === "vale_refeicao" && "Vale Refeição / Alimentação"}
                      {p.product === "seguro_saude" && "Seguro Saúde"}
                      {p.product === "ponto_eletronico" && "Sistema de Ponto Eletrônico"}
                    </div>
                    {p.contextData && (
                      <p className="text-xs text-slate-500 mt-1">{p.contextData}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comissões</CardTitle>
            </CardHeader>
            <CardContent>
              {lead.commissions && lead.commissions.length > 0 ? (
                <div className="space-y-3">
                  {lead.commissions.map((c) => (
                    <div key={c.id} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          R$ {Number(c.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-slate-500 capitalize">
                          {c.type === "recorrente" ? "Recorrente" : "Única"} · {c.status}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          c.status === "paga"
                            ? "bg-green-100 text-green-700"
                            : c.status === "confirmada"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      >
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Comissões serão calculadas após análise.</p>
              )}
            </CardContent>
          </Card>

          {lead.estimatedCommission && Number(lead.estimatedCommission) > 0 && (
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-xs text-purple-700 mb-1">Estimativa total</div>
              <div className="text-xl font-bold text-purple-900">
                R$ {Number(lead.estimatedCommission).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-purple-600 mt-1">* Projeção sujeita a confirmação</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
