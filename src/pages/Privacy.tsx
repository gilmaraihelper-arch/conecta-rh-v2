import { Link } from "react-router";
import { ArrowLeft, Handshake } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-700 rounded-md flex items-center justify-center">
              <Handshake className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">Conecta RH</span>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Política de Privacidade</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Última atualização: 30 de abril de 2025
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Compromisso com a Privacidade</h2>
          <p className="text-slate-600 mb-4">
            A Conecta RH valoriza a privacidade dos seus parceiros e dos leads indicados. Esta política descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Dados Coletados</h2>
          <p className="text-slate-600 mb-4">
            Coletamos dados do parceiro (nome, e-mail, telefone, empresa, CPF/CNPJ) e dados dos leads indicados (nome da empresa, contato, telefone, e-mail). Todos os dados são coletados com base no consentimento explícito.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Finalidade do Uso</h2>
          <p className="text-slate-600 mb-4">
            Os dados são utilizados exclusivamente para: gerenciamento do programa de parceiros, contato com leads indicados, cálculo e pagamento de comissões, comunicação sobre status de indicações, e cumprimento de obrigações legais.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Compartilhamento</h2>
          <p className="text-slate-600 mb-4">
            Os dados dos leads são compartilhados apenas com nosso time comercial interno para prospecção. Não vendemos nem repassamos dados a terceiros não autorizados. Parceiros não têm acesso aos dados de outros parceiros ou leads de terceiros.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Segurança</h2>
          <p className="text-slate-600 mb-4">
            Utilizamos criptografia, controle de acesso baseado em funções, logs de auditoria e hospedagem segura para proteger seus dados contra acesso não autorizado, alteração ou divulgação.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Seus Direitos (LGPD)</h2>
          <p className="text-slate-600 mb-4">
            Você tem direito a acessar, corrigir, excluir, limitar o processamento e exportar seus dados pessoais. Para exercer esses direitos, entre em contato através do e-mail privacidade@conectarh.com.br.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Retenção</h2>
          <p className="text-slate-600 mb-4">
            Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política e para atender obrigações legais e fiscais.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">8. Cookies</h2>
          <p className="text-slate-600 mb-4">
            Utilizamos cookies essenciais para autenticação e funcionamento da plataforma. Não utilizamos cookies de rastreamento de terceiros.
          </p>
        </div>
      </div>
    </div>
  );
}