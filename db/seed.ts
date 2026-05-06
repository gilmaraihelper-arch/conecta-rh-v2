import { getDb } from "../api/queries/connection";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Clear existing demo data first (Drizzle ORM delete)
  await db.delete(schema.notifications);
  await db.delete(schema.commissions);
  await db.delete(schema.leadStatusHistory);
  await db.delete(schema.leadProducts);
  await db.delete(schema.leads);
  await db.delete(schema.commissionRules);
  // Delete only demo users (not real ones)
  const demoEmails = [
    "demo@contabilidade.com",
    "demo@consultoria.com",
    "demo@advocacia.com",
    "demo@rse.com",
    "admin@conectarh.com",
  ];
  for (const email of demoEmails) {
    await db.delete(schema.users).where(eq(schema.users.unionId, email));
  }
  console.log("Cleared existing demo data.");

  // Seed commission rules
  await db.insert(schema.commissionRules).values([
    {
      product: "vale_refeicao",
      percentage: "5.00",
      type: "recorrente",
      minAmount: "1000.00",
      active: true,
    },
    {
      product: "seguro_saude",
      percentage: "8.00",
      type: "unica",
      minAmount: "5000.00",
      active: true,
    },
    {
      product: "ponto_eletronico",
      percentage: "10.00",
      type: "unica",
      minAmount: "800.00",
      active: true,
    },
  ]);
  console.log("Commission rules seeded.");

  // Create admin demo FIRST (so we can reference its ID)
  const adminResult = await db.insert(schema.users).values({
    unionId: "admin@conectarh.com",
    name: "Administrador",
    email: "admin@conectarh.com",
    phone: "(11) 99999-9999",
    companyName: "Conecta RH",
    cpfCnpj: "00.000.000/0001-00",
    role: "admin",
    acceptedTerms: true,
    onboardingComplete: true,
  } as any).returning();
  const adminId = adminResult[0].id;
  console.log("Admin demo seeded with ID:", adminId);

  // Create demo partners
  const partners = [
    {
      unionId: "demo@contabilidade.com",
      name: "Carlos Mendes",
      email: "demo@contabilidade.com",
      phone: "(11) 98765-4321",
      companyName: "Mendes Contabilidade",
      cpfCnpj: "12.345.678/0001-90",
      role: "user",
      acceptedTerms: true,
      onboardingComplete: true,
    },
    {
      unionId: "demo@consultoria.com",
      name: "Ana Paula Ferreira",
      email: "demo@consultoria.com",
      phone: "(21) 99876-5432",
      companyName: "Ferreira Consultoria RH",
      cpfCnpj: "98.765.432/0001-21",
      role: "user",
      acceptedTerms: true,
      onboardingComplete: true,
    },
    {
      unionId: "demo@advocacia.com",
      name: "Roberto Silva",
      email: "demo@advocacia.com",
      phone: "(31) 91234-5678",
      companyName: "Silva Advocacia Trabalhista",
      cpfCnpj: "11.222.333/0001-44",
      role: "user",
      acceptedTerms: true,
      onboardingComplete: true,
    },
    {
      unionId: "demo@rse.com",
      name: "Juliana Costa",
      email: "demo@rse.com",
      phone: "(11) 93333-4444",
      companyName: "Costa R&S Consultoria",
      cpfCnpj: "55.666.777/0001-88",
      role: "user",
      acceptedTerms: true,
      onboardingComplete: true,
    },
  ];

  const partnerIds: number[] = [];
  for (const p of partners) {
    const result = await db.insert(schema.users).values(p as any).returning();
    partnerIds.push(result[0].id);
  }
  console.log(`${partners.length} demo partners seeded.`);

  // Create demo leads
  const demoLeads = [
    {
      partnerId: partnerIds[0],
      companyName: "TechInova Soluções Ltda",
      segment: "Tecnologia",
      city: "São Paulo",
      uf: "SP",
      companySize: "51-200 funcionários",
      notes: "Empresa em expansão. Precisa de benefícios para novos funcionários. Prioridade alta.",
      contactName: "Mariana Oliveira",
      contactRole: "Gerente de RH",
      contactEmail: "mariana@techinova.com",
      contactPhone: "(11) 3456-7890",
      bestTime: "Segunda a quinta, 10h-12h",
      contactAware: true,
      status: "fechado" as const,
      estimatedCommission: "1250.00",
    },
    {
      partnerId: partnerIds[0],
      companyName: "Supermercados Rede Sul",
      segment: "Varejo",
      city: "Curitiba",
      uf: "PR",
      companySize: "201-500 funcionários",
      notes: "Rede com 12 lojas. Interesse em vale refeição para todos os colaboradores.",
      contactName: "Fernando Dias",
      contactRole: "Diretor de Operações",
      contactEmail: "fernando@redesul.com",
      contactPhone: "(41) 98765-1111",
      bestTime: "Terça e quinta, 14h-16h",
      contactAware: true,
      status: "negociacao" as const,
      estimatedCommission: "3800.00",
    },
    {
      partnerId: partnerIds[1],
      companyName: "Construtora Horizonte Verde",
      segment: "Construção Civil",
      city: "Belo Horizonte",
      uf: "MG",
      companySize: "501-1000 funcionários",
      notes: "Grande obra no centro da cidade. Necessidade urgente de seguro saúde para equipe de campo.",
      contactName: "Patrícia Lopes",
      contactRole: "Coordenadora de RH",
      contactEmail: "patricia@horizonteverde.com",
      contactPhone: "(31) 91234-5678",
      bestTime: "Segunda a sexta, 9h-11h",
      contactAware: true,
      status: "em_contato" as const,
      estimatedCommission: "5200.00",
    },
    {
      partnerId: partnerIds[1],
      companyName: "Clínica Bem Estar",
      segment: "Saúde",
      city: "Rio de Janeiro",
      uf: "RJ",
      companySize: "11-50 funcionários",
      notes: "Clínica com 3 unidades. Precisa de ponto eletrônico para médicos e enfermeiros.",
      contactName: "Dr. Ricardo Almeida",
      contactRole: "Diretor Clínico",
      contactEmail: "ricardo@bemestar.com",
      contactPhone: "(21) 99876-2222",
      bestTime: "Quarta, 15h-17h",
      contactAware: true,
      status: "novo" as const,
      estimatedCommission: "480.00",
    },
    {
      partnerId: partnerIds[2],
      companyName: "Indústria Metais do Vale",
      segment: "Indústria",
      city: "Joinville",
      uf: "SC",
      companySize: "1000+ funcionários",
      notes: "Indústria metalúrgica tradicional. Processo judicial motivou busca por novo plano de saúde.",
      contactName: "Paulo Henrique Santos",
      contactRole: "Gerente Geral de RH",
      contactEmail: "paulo@metaisvale.com",
      contactPhone: "(47) 93333-4444",
      bestTime: "Segunda, quarta, sexta, 13h-15h",
      contactAware: true,
      status: "fechado" as const,
      estimatedCommission: "8500.00",
    },
    {
      partnerId: partnerIds[2],
      companyName: "Transportadora Expresso BR",
      segment: "Logística",
      city: "São Paulo",
      uf: "SP",
      companySize: "201-500 funcionários",
      notes: "Frota de 200 caminhões. Motoristas precisam de vale refeição para viagens.",
      contactName: "Luciana Martins",
      contactRole: "Supervisora de RH",
      contactEmail: "luciana@expressobr.com",
      contactPhone: "(11) 94444-5555",
      bestTime: "Segunda a sexta, 10h-12h",
      contactAware: false,
      status: "perdido" as const,
      estimatedCommission: "0.00",
    },
    {
      partnerId: partnerIds[3],
      companyName: "Startup Digital Nomads",
      segment: "Tecnologia",
      city: "Florianópolis",
      uf: "SC",
      companySize: "11-50 funcionários",
      notes: "Startup com equipe 100% remota. Buscam benefícios flexíveis para atrair talentos.",
      contactName: "Gabriel Torres",
      contactRole: "CEO & Co-founder",
      contactEmail: "gabriel@digitalnomads.io",
      contactPhone: "(48) 95555-6666",
      bestTime: "Terça e quinta, 16h-18h",
      contactAware: true,
      status: "negociacao" as const,
      estimatedCommission: "960.00",
    },
    {
      partnerId: partnerIds[3],
      companyName: "Hotelaria Grupo Aurora",
      segment: "Turismo / Hospitalidade",
      city: "Salvador",
      uf: "BA",
      companySize: "51-200 funcionários",
      notes: "Rede hoteleira com 5 hotéis. Temporada alta se aproxima. Precisam contratar e oferecer benefícios.",
      contactName: "Camila Ribeiro",
      contactRole: "Diretora de Pessoas",
      contactEmail: "camila@grupoaurora.com",
      contactPhone: "(71) 96666-7777",
      bestTime: "Segunda, quarta, sexta, 9h-11h",
      contactAware: true,
      status: "em_contato" as const,
      estimatedCommission: "1750.00",
    },
    {
      partnerId: partnerIds[0],
      companyName: "Farmácia Popular Brasileira",
      segment: "Saúde / Varejo",
      city: "Porto Alegre",
      uf: "RS",
      companySize: "201-500 funcionários",
      notes: "Rede de 30 farmácias. Interesse em ponto eletrônico para farmacêuticos e atendentes.",
      contactName: "Eduarda Lima",
      contactRole: "Gerente de RH",
      contactEmail: "eduarda@farmaciapopular.com",
      contactPhone: "(51) 97777-8888",
      bestTime: "Segunda a sexta, 14h-16h",
      contactAware: true,
      status: "fechado" as const,
      estimatedCommission: "2200.00",
    },
    {
      partnerId: partnerIds[1],
      companyName: "Escola Futuro Brilhante",
      segment: "Educação",
      city: "Campinas",
      uf: "SP",
      companySize: "51-200 funcionários",
      notes: "Colégio particular com 3 unidades. Professores e funcionários administrativos precisam de benefícios.",
      contactName: "Helena Moura",
      contactRole: "Diretora Administrativa",
      contactEmail: "helena@futurobrilhante.edu.br",
      contactPhone: "(19) 98888-9999",
      bestTime: "Terça e quinta, 10h-12h",
      contactAware: true,
      status: "novo" as const,
      estimatedCommission: "1450.00",
    },
  ];

  const leadIds: number[] = [];
  for (const lead of demoLeads) {
    const result = await db.insert(schema.leads).values(lead as any).returning();
    leadIds.push(result[0].id);
  }
  console.log(`${demoLeads.length} demo leads seeded.`);

  // Seed lead products
  const leadProducts = [
    { leadId: leadIds[0], product: "vale_refeicao" as const, contextData: "78 funcionários beneficiados" },
    { leadId: leadIds[0], product: "seguro_saude" as const, contextData: "Ticket médio R$ 12.000" },
    { leadId: leadIds[1], product: "vale_refeicao" as const, contextData: "420 colaboradores nas 12 lojas" },
    { leadId: leadIds[2], product: "seguro_saude" as const, contextData: "680 funcionários entre obra e administrativo" },
    { leadId: leadIds[3], product: "ponto_eletronico" as const, contextData: "35 profissionais de saúde" },
    { leadId: leadIds[4], product: "seguro_saude" as const, contextData: "1.200 funcionários industriais" },
    { leadId: leadIds[4], product: "vale_refeicao" as const, contextData: "1.200 funcionários" },
    { leadId: leadIds[5], product: "vale_refeicao" as const, contextData: "280 motoristas" },
    { leadId: leadIds[6], product: "vale_refeicao" as const, contextData: "42 funcionários remotos" },
    { leadId: leadIds[6], product: "seguro_saude" as const, contextData: "42 funcionários" },
    { leadId: leadIds[7], product: "vale_refeicao" as const, contextData: "156 funcionários hoteleiros" },
    { leadId: leadIds[8], product: "ponto_eletronico" as const, contextData: "320 funcionários em 30 unidades" },
    { leadId: leadIds[9], product: "vale_refeicao" as const, contextData: "89 colaboradores entre professores e adm" },
    { leadId: leadIds[9], product: "seguro_saude" as const, contextData: "89 colaboradores" },
  ];

  for (const lp of leadProducts) {
    await db.insert(schema.leadProducts).values(lp as any);
  }
  console.log(`${leadProducts.length} lead products seeded.`);

  // Seed status history (using adminId as the changer)
  const statusHistoryEntries = [
    // Lead 0 - fechado
    { leadId: leadIds[0], status: "novo" as const, changedBy: partnerIds[0], comment: "Lead criado pelo parceiro" },
    { leadId: leadIds[0], status: "em_contato" as const, changedBy: adminId, comment: "Contato inicial realizado. Interesse confirmado pelo RH." },
    { leadId: leadIds[0], status: "negociacao" as const, changedBy: adminId, comment: "Proposta enviada. Aguardando aprovacao da diretoria." },
    { leadId: leadIds[0], status: "fechado" as const, changedBy: adminId, comment: "Contrato assinado! Parabens pela indicacao." },

    // Lead 1 - negociacao
    { leadId: leadIds[1], status: "novo" as const, changedBy: partnerIds[0], comment: "Lead criado pelo parceiro" },
    { leadId: leadIds[1], status: "em_contato" as const, changedBy: adminId, comment: "Contato realizado com Fernando. Interesse alto." },
    { leadId: leadIds[1], status: "negociacao" as const, changedBy: adminId, comment: "Analise de viabilidade em andamento." },

    // Lead 2 - em_contato
    { leadId: leadIds[2], status: "novo" as const, changedBy: partnerIds[1], comment: "Lead criado pelo parceiro" },
    { leadId: leadIds[2], status: "em_contato" as const, changedBy: adminId, comment: "Primeira reuniao agendada para proxima semana." },

    // Lead 4 - fechado
    { leadId: leadIds[4], status: "novo" as const, changedBy: partnerIds[2], comment: "Lead criado pelo parceiro" },
    { leadId: leadIds[4], status: "em_contato" as const, changedBy: adminId, comment: "Contato inicial. Empresa motivada por processo judicial." },
    { leadId: leadIds[4], status: "negociacao" as const, changedBy: adminId, comment: "Negociacao complexa devido ao tamanho da empresa." },
    { leadId: leadIds[4], status: "fechado" as const, changedBy: adminId, comment: "Contrato fechado! Maior comissao do trimestre." },

    // Lead 5 - perdido
    { leadId: leadIds[5], status: "novo" as const, changedBy: partnerIds[2], comment: "Lead criado pelo parceiro" },
    { leadId: leadIds[5], status: "em_contato" as const, changedBy: adminId, comment: "Tentativa de contato. Contato ainda nao informado." },
    { leadId: leadIds[5], status: "perdido" as const, changedBy: adminId, comment: "Contato nao autorizou prospeccao. Lead encerrado." },

    // Lead 8 - fechado
    { leadId: leadIds[8], status: "novo" as const, changedBy: partnerIds[0], comment: "Lead criado pelo parceiro" },
    { leadId: leadIds[8], status: "em_contato" as const, changedBy: adminId, comment: "Eduarda demonstrou interesse imediato." },
    { leadId: leadIds[8], status: "negociacao" as const, changedBy: adminId, comment: "Ajustando proposta para multiplas unidades." },
    { leadId: leadIds[8], status: "fechado" as const, changedBy: adminId, comment: "Contrato assinado para implantacao em todas as unidades." },
  ];

  for (const h of statusHistoryEntries) {
    await db.insert(schema.leadStatusHistory).values(h as any);
  }
  console.log(`${statusHistoryEntries.length} status history entries seeded.`);

  // Seed commissions
  const commissions = [
    // Lead 0 - fechado (comissões confirmadas/pagas)
    { leadId: leadIds[0], partnerId: partnerIds[0], product: "vale_refeicao" as const, amount: "500.00", type: "recorrente" as const, status: "paga" as const, monthYear: "05/2025" },
    { leadId: leadIds[0], partnerId: partnerIds[0], product: "vale_refeicao" as const, amount: "500.00", type: "recorrente" as const, status: "paga" as const, monthYear: "06/2025" },
    { leadId: leadIds[0], partnerId: partnerIds[0], product: "vale_refeicao" as const, amount: "500.00", type: "recorrente" as const, status: "paga" as const, monthYear: "07/2025" },
    { leadId: leadIds[0], partnerId: partnerIds[0], product: "seguro_saude" as const, amount: "750.00", type: "unica" as const, status: "paga" as const, monthYear: "05/2025" },

    // Lead 1 - negociacao (estimada)
    { leadId: leadIds[1], partnerId: partnerIds[0], product: "vale_refeicao" as const, amount: "3000.00", type: "recorrente" as const, status: "estimada" as const, monthYear: "08/2025" },

    // Lead 2 - em_contato (estimada)
    { leadId: leadIds[2], partnerId: partnerIds[1], product: "seguro_saude" as const, amount: "5200.00", type: "unica" as const, status: "estimada" as const, monthYear: "08/2025" },

    // Lead 4 - fechado
    { leadId: leadIds[4], partnerId: partnerIds[2], product: "seguro_saude" as const, amount: "7000.00", type: "unica" as const, status: "confirmada" as const, monthYear: "06/2025" },
    { leadId: leadIds[4], partnerId: partnerIds[2], product: "seguro_saude" as const, amount: "7000.00", type: "unica" as const, status: "paga" as const, monthYear: "06/2025" },
    { leadId: leadIds[4], partnerId: partnerIds[2], product: "vale_refeicao" as const, amount: "1500.00", type: "recorrente" as const, status: "paga" as const, monthYear: "06/2025" },
    { leadId: leadIds[4], partnerId: partnerIds[2], product: "vale_refeicao" as const, amount: "1500.00", type: "recorrente" as const, status: "paga" as const, monthYear: "07/2025" },

    // Lead 8 - fechado
    { leadId: leadIds[8], partnerId: partnerIds[0], product: "ponto_eletronico" as const, amount: "2200.00", type: "unica" as const, status: "confirmada" as const, monthYear: "07/2025" },
    { leadId: leadIds[8], partnerId: partnerIds[0], product: "ponto_eletronico" as const, amount: "2200.00", type: "unica" as const, status: "paga" as const, monthYear: "07/2025" },
  ];

  for (const c of commissions) {
    await db.insert(schema.commissions).values(c as any);
  }
  console.log(`${commissions.length} commissions seeded.`);

  // Seed notifications
  const notifications = [
    { userId: partnerIds[0], title: "Nova indicação recebida", message: "Sua indicação para Supermercados Rede Sul foi recebida.", read: true },
    { userId: partnerIds[0], title: "Status atualizado", message: "TechInova Soluções foi alterado para 'Fechado'. Comissão confirmada!", read: false },
    { userId: partnerIds[0], title: "Comissão paga", message: "R$ 500,00 referente a Vale Refeição - TechInova foi paga.", read: false },
    { userId: partnerIds[1], title: "Lead em negociação", message: "Construtora Horizonte Verde está em negociação. Acompanhe no painel.", read: true },
    { userId: partnerIds[2], title: "Grande vitória!", message: "Metais do Vale fechou! Comissão de R$ 7.000,00 confirmada.", read: false },
    { userId: partnerIds[2], title: "Lead perdido", message: "Expresso BR foi perdido. Contato não autorizou prospecção.", read: true },
  ];

  for (const n of notifications) {
    await db.insert(schema.notifications).values(n as any);
  }
  console.log(`${notifications.length} notifications seeded.`);

  console.log("Seed complete!");
  process.exit(0);
}

seed();
