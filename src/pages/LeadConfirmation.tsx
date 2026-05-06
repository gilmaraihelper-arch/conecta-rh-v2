import { useNavigate, useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, Plus, AlertTriangle, Utensils, HeartPulse, Timer } from "lucide-react";

const productLabels: Record<string, string> = {
  vale_refeicao: "Vale Refeição / Alimentação",
  seguro_saude: "Seguro Saúde",
  ponto_eletronico: "Sistema de Ponto Eletrônico",
};

const productIcons: Record<string, React.ElementType> = {
  vale_refeicao: Utensils,
  seguro_saude: HeartPulse,
  ponto_eletronico: Timer,
};

export default function LeadConfirmation() {
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
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
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
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Indicação enviada com sucesso!</h1>
        <p className="text-slate-600">
          Nosso time comercial já foi notificado e entrará em contato em até 48h úteis.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Resumo da indicação</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Empresa</span>
              <span className="font-medium text-slate-900">{lead.companyName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Contato</span>
              <span className="font-medium text-slate-900">{lead.contactName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Local</span>
              <span className="font-medium text-slate-900">
                {lead.city}, {lead.uf}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500">Status</span>
              <span className="font-medium text-blue-600">Novo</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-slate-900 mb-3">Produtos de interesse</h3>
            <div className="flex flex-wrap gap-2">
              {lead.products?.map((p) => {
                const Icon = productIcons[p.product] || Utensils;
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    {productLabels[p.product]}
                  </div>
                );
              })}
            </div>
          </div>

          {lead.estimatedCommission && Number(lead.estimatedCommission) > 0 && (
            <div className="mt-6 bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-700 mb-1">Estimativa de comissão</div>
              <div className="text-2xl font-bold text-purple-900">
                R$ {Number(lead.estimatedCommission).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="flex items-start gap-2 mt-2">
                <AlertTriangle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-700">
                  Este valor é uma projeção baseada nas regras atuais de comissão. O valor real pode variar conforme o contrato fechado com a empresa indicada.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-amber-900 mb-2">Próximos passos</h3>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>1. Nosso time analisará a indicação em até 24h</li>
          <li>2. Entraremos em contato com o decisor de RH</li>
          <li>3. Você será notificado a cada mudança de status</li>
          <li>4. Quando fechar, sua comissão será confirmada</li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/dashboard">
          <Button variant="outline" className="h-12 px-6">
            Ver minhas indicações
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link to="/indicar">
          <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-6">
            <Plus className="w-4 h-4 mr-2" />
            Nova indicação
          </Button>
        </Link>
      </div>
    </div>
  );
}
