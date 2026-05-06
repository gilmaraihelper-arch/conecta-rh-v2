import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Handshake, ArrowLeft, Loader2, User, Building2, Mail, Phone, Hash, Shield } from "lucide-react";

export default function Login() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    cpfCnpj: "",
    acceptedTerms: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const register = trpc.demo.register.useMutation({
    onSuccess: (data) => {
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAdminMode) {
      if (!form.name || !form.email || !form.phone || !form.companyName) {
        setError("Preencha todos os campos obrigatórios.");
        return;
      }
      if (!form.acceptedTerms) {
        setError("Voce precisa aceitar os termos para continuar.");
        return;
      }
    }

    register.mutate({
      name: isAdminMode ? "Administrador" : form.name,
      email: isAdminMode ? "admin@conectarh.com" : form.email,
      phone: isAdminMode ? "(11) 99999-9999" : form.phone,
      companyName: isAdminMode ? "Conecta RH" : form.companyName,
      cpfCnpj: isAdminMode ? "00.000.000/0001-00" : form.cpfCnpj,
      role: isAdminMode ? "admin" : "user",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="border-b bg-white">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <Handshake className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Conecta RH</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">
                {isAdminMode ? "Acesso Administrativo" : "Cadastro de Parceiro"}
              </CardTitle>
              <CardDescription>
                {isAdminMode
                  ? "Entre no painel administrativo de demonstracao"
                  : "Preencha seus dados para acessar o painel de parceiro"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isAdminMode && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  <strong>Modo demonstracao:</strong> Acesso ao painel administrativo com dados de exemplo pre-cadastrados.
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isAdminMode && (
                  <>
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-1.5 text-sm">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Nome completo *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-1.5 text-sm">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        E-mail *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        Telefone / WhatsApp *
                      </Label>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="flex items-center gap-1.5 text-sm">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        Empresa / Escritorio *
                      </Label>
                      <Input
                        id="company"
                        placeholder="Sua empresa"
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf" className="flex items-center gap-1.5 text-sm">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        CPF ou CNPJ
                      </Label>
                      <Input
                        id="cpf"
                        placeholder="Opcional"
                        value={form.cpfCnpj}
                        onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })}
                      />
                    </div>
                    <div className="flex items-start gap-3 pt-1">
                      <Checkbox
                        id="terms"
                        checked={form.acceptedTerms}
                        onCheckedChange={(checked) =>
                          setForm({ ...form, acceptedTerms: checked as boolean })
                        }
                      />
                      <Label htmlFor="terms" className="text-xs font-normal leading-relaxed cursor-pointer">
                        Li e aceito os{" "}
                        <Link to="/termos" target="_blank" className="text-blue-600 hover:underline">Termos de Uso</Link>{" "}
                        e{" "}
                        <Link to="/privacidade" target="_blank" className="text-blue-600 hover:underline">Politica de Privacidade</Link>.
                      </Label>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-medium"
                  disabled={register.isPending}
                >
                  {register.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isAdminMode ? "Entrando..." : "Criando conta..."}
                    </>
                  ) : (
                    <>{isAdminMode ? "Entrar como Administrador" : "Criar conta e acessar painel"}</>
                  )}
                </Button>
              </form>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(!isAdminMode);
                    setError("");
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-blue-600 transition-colors py-2"
                >
                  {isAdminMode ? (
                    <>
                      <User className="w-3.5 h-3.5" />
                      Voltar ao cadastro de parceiro
                    </>
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5" />
                      Entrar como administrador (demonstracao)
                    </>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
