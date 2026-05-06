import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  StickyNote,
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

const productLabels: Record<string, string> = {
  vale_refeicao: "Vale Refeição / Alimentação",
  seguro_saude: "Seguro Saúde",
  ponto_eletronico: "Sistema de Ponto Eletrônico",
};

export default function AdminLeads() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [comment, setComment] = useState("");

  const { data: leads, isLoading, refetch } = trpc.admin.getAllLeads.useQuery(
    statusFilter !== "all" ? { status: statusFilter as any } : undefined,
    { enabled: user?.role === "admin" }
  );

  const updateStatus = trpc.admin.updateLeadStatus.useMutation({
    onSuccess: () => {
      refetch();
      setNewStatus("");
      setComment("");
    },
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

  const filteredLeads = leads?.filter((lead) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      lead.companyName.toLowerCase().includes(term) ||
      lead.contactName.toLowerCase().includes(term) ||
      lead.partnerName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-slate-900">Todas as Indicações</h1>
            <p className="text-slate-500">Gerencie leads e atualize status</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por empresa, contato ou parceiro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="novo">Novo</SelectItem>
            <SelectItem value="em_contato">Em contato</SelectItem>
            <SelectItem value="negociacao">Negociação</SelectItem>
            <SelectItem value="fechado">Fechado</SelectItem>
            <SelectItem value="perdido">Perdido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Empresa</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Contato</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Parceiro</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Produtos</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Data</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads && filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{lead.companyName}</div>
                        <div className="text-xs text-slate-500">
                          {lead.city}, {lead.uf}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-900">{lead.contactName}</div>
                        <div className="text-xs text-slate-500">{lead.contactRole}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-900">{lead.partnerName}</div>
                        <div className="text-xs text-slate-500">{lead.partnerEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {lead.products.map((p: any) => (
                            <Badge key={p.id} variant="outline" className="text-xs">
                              {p.product === "vale_refeicao" && "VR"}
                              {p.product === "seguro_saude" && "Saúde"}
                              {p.product === "ponto_eletronico" && "Ponto"}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[lead.status]} variant="secondary">
                          {statusLabels[lead.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* View Details Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-600 hover:text-blue-600"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <div>{lead.companyName}</div>
                                    <Badge className={`mt-1 ${statusColors[lead.status]}`} variant="secondary">
                                      {statusLabels[lead.status]}
                                    </Badge>
                                  </div>
                                </DialogTitle>
                              </DialogHeader>

                              <div className="mt-2 space-y-5">
                                {/* Company Info */}
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                    <Building2 className="w-4 h-4 text-slate-400" />
                                    Dados da Empresa
                                  </h4>
                                  <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                                    {lead.segment && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Segmento</span>
                                        <span className="text-slate-900 font-medium">{lead.segment}</span>
                                      </div>
                                    )}
                                    {(lead.city || lead.uf) && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Local</span>
                                        <span className="text-slate-900 font-medium flex items-center gap-1">
                                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                          {lead.city}, {lead.uf}
                                        </span>
                                      </div>
                                    )}
                                    {lead.companySize && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Porte</span>
                                        <span className="text-slate-900 font-medium">{lead.companySize}</span>
                                      </div>
                                    )}
                                    {lead.notes && (
                                      <div className="pt-1">
                                        <span className="text-slate-500 flex items-center gap-1">
                                          <StickyNote className="w-3.5 h-3.5" />
                                          Observações
                                        </span>
                                        <p className="text-slate-800 mt-1 bg-white p-3 rounded border border-slate-100">
                                          {lead.notes}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <Separator />

                                {/* Contact Info */}
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                    <User className="w-4 h-4 text-slate-400" />
                                    Dados do Contato (RH / Decisor)
                                  </h4>
                                  <div className="bg-slate-50 rounded-lg p-4 space-y-2.5 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Nome</span>
                                      <span className="text-slate-900 font-medium">{lead.contactName}</span>
                                    </div>
                                    {lead.contactRole && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Cargo</span>
                                        <span className="text-slate-900">{lead.contactRole}</span>
                                      </div>
                                    )}
                                    {lead.contactEmail && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">E-mail</span>
                                        <a
                                          href={`mailto:${lead.contactEmail}`}
                                          className="text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                          <Mail className="w-3.5 h-3.5" />
                                          {lead.contactEmail}
                                        </a>
                                      </div>
                                    )}
                                    {lead.contactPhone && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-500">Telefone</span>
                                        <a
                                          href={`tel:${lead.contactPhone.replace(/\D/g, "")}`}
                                          className="text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                          <Phone className="w-3.5 h-3.5" />
                                          {lead.contactPhone}
                                        </a>
                                      </div>
                                    )}
                                    {lead.bestTime && (
                                      <div className="flex justify-between">
                                        <span className="text-slate-500 flex items-center gap-1">
                                          <Clock className="w-3.5 h-3.5" />
                                          Melhor horário
                                        </span>
                                        <span className="text-slate-900">{lead.bestTime}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2 pt-1">
                                      {lead.contactAware ? (
                                        <>
                                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                                          <span className="text-green-700 text-xs">
                                            Contato ciente da prospecção
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                                          <span className="text-amber-700 text-xs">
                                            Contato ainda não informado
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                {/* Products */}
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                    Produtos de Interesse
                                  </h4>
                                  <div className="space-y-2">
                                    {lead.products.map((p: any) => (
                                      <div
                                        key={p.id}
                                        className="bg-slate-50 rounded-lg p-3 text-sm"
                                      >
                                        <div className="font-medium text-slate-900">
                                          {productLabels[p.product]}
                                        </div>
                                        {p.contextData && (
                                          <div className="text-slate-500 mt-1">
                                            {p.contextData}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Parceiro */}
                                <Separator />
                                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                                  <span className="text-slate-500">Indicado por:</span>{" "}
                                  <span className="font-medium text-slate-900">{lead.partnerName}</span>
                                  {lead.partnerEmail && (
                                    <span className="text-slate-500"> ({lead.partnerEmail})</span>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Update Status Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setNewStatus(lead.status);
                                }}
                              >
                                Atualizar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Atualizar status</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div>
                                  <Label>Empresa</Label>
                                  <Input value={lead.companyName} disabled />
                                </div>
                                <div>
                                  <Label>Novo status</Label>
                                  <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(statusLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Comentário interno</Label>
                                  <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Motivo da mudança ou observações..."
                                    rows={3}
                                  />
                                </div>
                                <Button
                                  className="w-full bg-blue-600 hover:bg-blue-700"
                                  disabled={newStatus === lead.status || updateStatus.isPending}
                                  onClick={() =>
                                    updateStatus.mutate({
                                      leadId: lead.id,
                                      status: newStatus as any,
                                      comment: comment || undefined,
                                    })
                                  }
                                >
                                  {updateStatus.isPending ? "Salvando..." : "Salvar alteração"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                      Nenhuma indicação encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
