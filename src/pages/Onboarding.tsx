import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Handshake,
  Send,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function Onboarding() {
  const { user, isLoading } = useAuth({ redirectOnUnauthenticated: true });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const utils = trpc.useUtils();

  // Auto-redirect if already onboarded
  useEffect(() => {
    if (user?.onboardingComplete) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const completeOnboarding = trpc.auth.completeOnboarding.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => {
      setError(err.message || "Erro ao completar cadastro. Redirecionando...");
      // Fallback: force redirect even if mutation fails
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    },
  });

  // If auth is still loading, show spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <Card className="shadow-xl shadow-slate-200/50 border-slate-100">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Bem-vindo à Conecta RH, {user.name?.split(" ")[0] || "Parceiro"}!
              </h1>
              <p className="text-slate-600">
                Seu cadastro está completo. Veja como funciona a plataforma em 4 passos simples.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              {[
                {
                  icon: Handshake,
                  title: "Você é um parceiro indicador",
                  description:
                    "Sua função é identificar empresas que precisam de soluções de RH e nos conectar com o contato certo.",
                },
                {
                  icon: Send,
                  title: "Como enviar uma indicação",
                  description:
                    "Acesse 'Nova Indicação', preencha os dados da empresa e do contato de RH, marque os produtos de interesse e envie.",
                },
                {
                  icon: TrendingUp,
                  title: "Acompanhe o status",
                  description:
                    "No seu painel, você vê todas as suas indicações, o status de cada uma e o histórico de movimentações.",
                },
                {
                  icon: Wallet,
                  title: "Ganhe comissão",
                  description:
                    "Quando um contrato é fechado, você recebe comissão conforme as regras do produto.",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{s.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold"
              onClick={() => {
                setError("");
                completeOnboarding.mutate();
              }}
              disabled={completeOnboarding.isPending}
            >
              {completeOnboarding.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Entrar no painel
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
