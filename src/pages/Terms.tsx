import { Link } from "react-router";
import { ArrowLeft, Handshake } from "lucide-react";

export default function Terms() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Termos de Uso</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Última atualização: 30 de abril de 2025
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p className="text-slate-600 mb-4">
            Ao acessar e utilizar a plataforma Conecta RH, você concorda em cumprir estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Definições</h2>
          <p className="text-slate-600 mb-4">
            <strong>Parceiro:</strong> Profissional ou empresa cadastrada na plataforma que indica leads qualificados.<br />
            <strong>Lead:</strong> Empresa ou contato indicado como potencial cliente.<br />
            <strong>Comissão:</strong> Remuneração paga ao parceiro quando um contrato é fechado com sucesso.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Cadastro e Elegibilidade</h2>
          <p className="text-slate-600 mb-4">
            Para ser parceiro, você deve ter pelo menos 18 anos, possuir vínculo profissional que permita relacionamento com departamentos de RH, e fornecer informações verdadeiras durante o cadastro.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Regras de Indicação</h2>
          <p className="text-slate-600 mb-4">
            O parceiro deve indicar leads com dados de contato válidos e com conhecimento prévio do contato sobre a prospecção. É proibido indicar leads sem autorização do contato ou utilizar dados obtidos de forma ilícita.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Comissões</h2>
          <p className="text-slate-600 mb-4">
            As comissões são calculadas conforme as regras vigentes na plataforma, podendo ser recorrentes (mensais) ou parcela única. O parceiro será notificado quando uma comissão for confirmada ou paga.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Propriedade Intelectual</h2>
          <p className="text-slate-600 mb-4">
            Todo o conteúdo da plataforma, incluindo logotipos, textos e software, é de propriedade da Conecta RH e está protegido por leis de direitos autorais.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Rescisão</h2>
          <p className="text-slate-600 mb-4">
            A Conecta RH reserva-se o direito de suspender ou encerrar a conta de qualquer parceiro que viole estes termos, sem prejuízo de eventuais comissões já confirmadas.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">8. Alterações</h2>
          <p className="text-slate-600 mb-4">
            Estes termos podem ser atualizados periodicamente. Notificaremos os parceiros sobre alterações significativas.
          </p>
        </div>
      </div>
    </div>
  );
}
