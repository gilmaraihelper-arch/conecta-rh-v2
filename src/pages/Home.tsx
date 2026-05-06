import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Handshake,
  Search,
  Send,
  TrendingUp,
  Wallet,
  Shield,
  Clock,
  ChevronRight,
  CheckCircle2,
  Briefcase,
  Utensils,
  HeartPulse,
  Timer,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Handshake className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">Conecta RH</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollTo("como-funciona")} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Como Funciona
              </button>
              <button onClick={() => scrollTo("produtos")} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Produtos
              </button>
              <button onClick={() => scrollTo("beneficios")} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                Benefícios
              </button>
              <button onClick={() => scrollTo("faq")} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                FAQ
              </button>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Quero ser parceiro</Button>
              </Link>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-3">
            <button onClick={() => scrollTo("como-funciona")} className="block w-full text-left text-sm font-medium text-slate-600 py-2">Como Funciona</button>
            <button onClick={() => scrollTo("produtos")} className="block w-full text-left text-sm font-medium text-slate-600 py-2">Produtos</button>
            <button onClick={() => scrollTo("beneficios")} className="block w-full text-left text-sm font-medium text-slate-600 py-2">Benefícios</button>
            <button onClick={() => scrollTo("faq")} className="block w-full text-left text-sm font-medium text-slate-600 py-2">FAQ</button>
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="w-full"><Button variant="outline" className="w-full">Entrar</Button></Link>
              <Link to="/login" className="w-full"><Button className="w-full bg-blue-600 hover:bg-blue-700">Quero ser parceiro</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Plataforma exclusiva para parceiros B2B
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                Indique empresas de <span className="text-blue-600">RH</span> e ganhe comissão
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed">
                Transforme seus relacionamentos com departamentos de RH em renda recorrente. Indique empresas que precisam de Vale Refeição, Seguro Saúde ou Ponto Eletrônico.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 h-auto">
                    Quero ser parceiro
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <button onClick={() => scrollTo("como-funciona")} className="text-slate-600 hover:text-blue-600 font-medium text-lg transition-colors flex items-center gap-2 px-4 py-3">
                  Como funciona
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img src="/hero-main.jpg" alt="Ambiente corporativo" className="rounded-2xl shadow-xl w-full object-cover h-[420px]" />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">500+</div>
              <div className="text-sm text-slate-500 mt-1">Parceiros ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">R$ 2M+</div>
              <div className="text-sm text-slate-500 mt-1">Em comissões pagas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">3.200+</div>
              <div className="text-sm text-slate-500 mt-1">Indicações enviadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">85%</div>
              <div className="text-sm text-slate-500 mt-1">Taxa de conversão</div>
            </div>
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Para quem é</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Ideal para profissionais e empresas que já têm relacionamento com o departamento de Recursos Humanos
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Briefcase, title: "Consultorias de R&S", desc: "Que conhecem empresas em crescimento e expansão de equipe" },
              { icon: Shield, title: "Escritórios de Contabilidade", desc: "Com visão completa do tamanho e das necessidades das empresas" },
              { icon: Handshake, title: "Consultorias Empresariais", desc: "Que atuam na transformação organizacional e gestão de pessoas" },
              { icon: Clock, title: "Advogados Trabalhistas", desc: "Com acesso direto às decisões estratégicas de RH" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Como funciona</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Quatro passos simples para começar a monetizar seu relacionamento com RH
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", icon: Search, title: "Identifique", desc: "Perceba que uma empresa precisa de soluções de benefícios, saúde ou controle de ponto" },
              { step: "02", icon: Send, title: "Indique", desc: "Preencha o formulário de indicação com os dados da empresa e do contato de RH" },
              { step: "03", icon: TrendingUp, title: "Acompanhe", desc: "Monitore o status da negociação em tempo real pelo seu painel exclusivo" },
              { step: "04", icon: Wallet, title: "Ganhe", desc: "Receba comissão quando o contrato for fechado — recorrente ou à vista" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-bold text-blue-100 mb-4">{item.step}</div>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">O que você pode indicar</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Não é preciso entender de produto. Apenas conecte a empresa ao nosso time especializado.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Utensils,
                title: "Vale Refeição / Alimentação",
                desc: "Benefício obrigatório para empresas com mais de 5 funcionários. Alto potencial de recorrência mensal.",
                tag: "Recorrente",
              },
              {
                icon: HeartPulse,
                title: "Seguro Saúde",
                desc: "Plano de saúde empresarial para pequenas, médias e grandes companhias. Comissão atrativa por contrato.",
                tag: "Alto ticket",
              },
              {
                icon: Timer,
                title: "Sistema de Ponto Eletrônico",
                desc: "Solução digital para controle de jornada. Crescente demanda por compliance trabalhista.",
                tag: "Em alta",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-8 border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-4">
                  {item.tag}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Por que ser parceiro Conecta RH?</h2>
              <div className="space-y-6">
                {[
                  { title: "Zero esforço comercial", desc: "Você não vende. Apenas indica. Nosso time especialista cuida de toda a negociação." },
                  { title: "Transparência total", desc: "Acompanhe cada etapa da negociação pelo painel. Status em tempo real, sem surpresas." },
                  { title: "Comissões justas", desc: "Regras claras de remuneração. Você sabe exatamente quanto vai receber antes mesmo do fechamento." },
                  { title: "Pagamento pontual", desc: "Comissões pagas conforme o contrato. Recorrentes mensais ou parcela única — conforme o produto." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="shrink-0 w-6 h-6 mt-1">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Simule sua comissão</h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-blue-100 mb-1">Vale Refeição — empresa com 50 funcionários</div>
                  <div className="text-2xl font-bold">~R$ 250/mês recorrente</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-blue-100 mb-1">Seguro Saúde — ticket médio R$ 8.000</div>
                  <div className="text-2xl font-bold">~R$ 640 à vista</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-blue-100 mb-1">Ponto Eletrônico — 30 funcionários</div>
                  <div className="text-2xl font-bold">~R$ 240 à vista</div>
                </div>
              </div>
              <p className="text-xs text-blue-200 mt-4">* Valores estimados. As comissões reais dependem do contrato fechado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Perguntas frequentes</h2>
            <p className="text-slate-600">Tire suas dúvidas sobre o programa de parceiros</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "Preciso ter CNPJ para ser parceiro?", a: "Não necessariamente. Profissionais liberais (consultores, advogados, contadores) também podem participar. Empresas com CNPJ têm acesso a relatórios fiscais simplificados." },
              { q: "Quanto tempo leva para receber a comissão?", a: "Para produtos com comissão única (Seguro Saúde, Ponto Eletrônico), o pagamento ocorre após a confirmação do contrato. Para comissões recorrentes (Vale Refeição), você recebe mensalmente enquanto o cliente permanecer ativo." },
              { q: "Posso indicar a mesma empresa para mais de um produto?", a: "Sim! Na verdade, incentivamos isso. Você pode indicar uma empresa interessada em Vale Refeição e Seguro Saúde ao mesmo tempo, aumentando seu potencial de comissão." },
              { q: "O que acontece se o lead não fechar?", a: "Você não recebe comissão, mas também não tem nenhum custo. O risco comercial é todo nosso. Sua única função é indicar oportunidades qualificadas." },
              { q: "Como acompanho o status das minhas indicações?", a: "Você tem acesso a um painel exclusivo com todos os seus leads, status em tempo real, histórico de interações e projeção de comissões." },
              { q: "Há limite de indicações por mês?", a: "Não há limite. Quanto mais indicações qualificadas você enviar, maiores serão suas chances de comissão." },
            ].map((item, i) => (
              <details key={i} className="bg-white rounded-lg border border-slate-100 group">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-medium text-slate-900 pr-4">{item.q}</span>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para monetizar seus relacionamentos?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Cadastre-se gratuitamente e comece a indicar em minutos. Nosso time cuida de todo o reste.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 h-auto font-semibold">
              Quero ser parceiro agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-white">Conecta RH</span>
              </div>
              <p className="text-sm leading-relaxed">
                Hub de indicação de oportunidades de RH. Conectando parceiros a soluções empresariais.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Plataforma</h4>
              <div className="space-y-2 text-sm">
                <button onClick={() => scrollTo("como-funciona")} className="block hover:text-white transition-colors">Como funciona</button>
                <button onClick={() => scrollTo("produtos")} className="block hover:text-white transition-colors">Produtos</button>
                <button onClick={() => scrollTo("beneficios")} className="block hover:text-white transition-colors">Benefícios</button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link to="/termos" className="block hover:text-white transition-colors">Termos de Uso</Link>
                <Link to="/privacidade" className="block hover:text-white transition-colors">Politica de Privacidade</Link>
                <Link to="/lgpd" className="block hover:text-white transition-colors">LGPD</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contato</h4>
              <div className="space-y-2 text-sm">
                <p>parceiros@conectarh.com.br</p>
                <p>São Paulo, SP — Brasil</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            © 2025 Conecta RH. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
