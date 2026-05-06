import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Utensils, HeartPulse, Timer, Loader2, AlertCircle } from "lucide-react";

const companySizes = [
  "1-10 funcionários",
  "11-50 funcionários",
  "51-200 funcionários",
  "201-500 funcionários",
  "501-1000 funcionários",
  "1000+ funcionários",
];

const ufs = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const productInfo = {
  vale_refeicao: {
    label: "Vale Refeição / Alimentação",
    icon: Utensils,
    contextLabel: "Número aproximado de funcionários beneficiados",
    contextPlaceholder: "Ex: 45",
  },
  seguro_saude: {
    label: "Seguro Saúde",
    icon: HeartPulse,
    contextLabel: "Porte da empresa (faixa de funcionários)",
    contextPlaceholder: "Ex: 51-200",
  },
  ponto_eletronico: {
    label: "Sistema de Ponto Eletrônico",
    icon: Timer,
    contextLabel: "Quantidade de funcionários no sistema",
    contextPlaceholder: "Ex: 30",
  },
};

export default function NewLead() {
  const { user } = useAuth({ redirectOnUnauthenticated: true });
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    segment: "",
    city: "",
    uf: "",
    companySize: "",
    notes: "",
    contactName: "",
    contactRole: "",
    contactEmail: "",
    contactPhone: "",
    bestTime: "",
    contactAware: false,
    lgpdConsent: false,
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productContexts, setProductContexts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const createLead = trpc.leads.create.useMutation({
    onSuccess: (data) => {
      navigate(`/confirmacao/${data.id}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const toggleProduct = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.companyName || !form.contactName) {
      setError("Preencha os campos obrigatórios: Nome da empresa e Nome do contato.");
      return;
    }

    if (selectedProducts.length === 0) {
      setError("Selecione pelo menos um produto de interesse.");
      return;
    }

    if (!form.lgpdConsent) {
      setError("É necessário confirmar o consentimento LGPD para enviar a indicação.");
      return;
    }

    createLead.mutate({
      companyName: form.companyName,
      segment: form.segment,
      city: form.city,
      uf: form.uf,
      companySize: form.companySize,
      notes: form.notes,
      contactName: form.contactName,
      contactRole: form.contactRole,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      bestTime: form.bestTime,
      contactAware: form.contactAware,
      products: selectedProducts.map((p) => ({
        product: p as "vale_refeicao" | "seguro_saude" | "ponto_eletronico",
        contextData: productContexts[p] || undefined,
      })),
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Voltar ao painel</span>
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Nova Indicação</h1>
      <p className="text-slate-500 mb-8">Preencha os dados da empresa e do contato de RH</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados da empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nome da empresa *</Label>
              <Input
                id="companyName"
                placeholder="Ex: Empresa ABC Ltda"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="segment">Segmento</Label>
                <Input
                  id="segment"
                  placeholder="Ex: Tecnologia, Indústria"
                  value={form.segment}
                  onChange={(e) => setForm({ ...form, segment: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="companySize">Porte</Label>
                <Select value={form.companySize} onValueChange={(v) => setForm({ ...form, companySize: v })}>
                  <SelectTrigger id="companySize">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Ex: São Paulo"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="uf">UF</Label>
                <Select value={form.uf} onValueChange={(v) => setForm({ ...form, uf: v })}>
                  <SelectTrigger id="uf">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {ufs.map((uf) => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Informações adicionais sobre a empresa ou a oportunidade"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados do contato (RH / Decisor)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Nome *</Label>
                <Input
                  id="contactName"
                  placeholder="Nome completo"
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contactRole">Cargo</Label>
                <Input
                  id="contactRole"
                  placeholder="Ex: Gerente de RH"
                  value={form.contactRole}
                  onChange={(e) => setForm({ ...form, contactRole: e.target.value })}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">E-mail</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="email@empresa.com"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Telefone / WhatsApp</Label>
                <Input
                  id="contactPhone"
                  placeholder="(11) 99999-9999"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bestTime">Melhor horário para contato</Label>
              <Input
                id="bestTime"
                placeholder="Ex: Segunda a sexta, 14h-17h"
                value={form.bestTime}
                onChange={(e) => setForm({ ...form, bestTime: e.target.value })}
              />
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="contactAware"
                checked={form.contactAware}
                onCheckedChange={(checked) => setForm({ ...form, contactAware: checked as boolean })}
              />
              <Label htmlFor="contactAware" className="text-sm font-normal leading-relaxed cursor-pointer">
                O contato está ciente de que será procurado pela Conecta RH
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produtos de interesse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              {Object.entries(productInfo).map(([key, info]) => {
                const Icon = info.icon;
                const isSelected = selectedProducts.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleProduct(key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-3 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                    <div className={`font-medium text-sm ${isSelected ? "text-blue-900" : "text-slate-700"}`}>
                      {info.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedProducts.map((product) => {
              const info = productInfo[product as keyof typeof productInfo];
              return (
                <div key={product} className="bg-slate-50 rounded-lg p-4">
                  <Label className="text-sm">{info.contextLabel}</Label>
                  <Input
                    placeholder={info.contextPlaceholder}
                    value={productContexts[product] || ""}
                    onChange={(e) =>
                      setProductContexts({ ...productContexts, [product]: e.target.value })
                    }
                    className="mt-1 bg-white"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* LGPD Consent */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="lgpd"
                checked={form.lgpdConsent}
                onCheckedChange={(checked) => setForm({ ...form, lgpdConsent: checked as boolean })}
              />
              <Label htmlFor="lgpd" className="text-sm font-normal leading-relaxed cursor-pointer">
                Declaro que tenho autorização para compartilhar os dados deste contato e que a empresa indicada tem interesse legítimo em receber nossa comunicação. Concordo com o tratamento dos dados conforme a{" "}
                <a href="/privacidade" target="_blank" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </a>{" "}
                da Conecta RH.
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
            disabled={createLead.isPending}
          >
            {createLead.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar indicação
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 px-8"
            onClick={() => navigate("/dashboard")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
