import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://inbcgaoexhnrcjqrqtsc.supabase.co",
  "sb_publishable_3aSOIWb4U10Oxt0bGIu9iQ_Bl-Drgmj"
);

const processes = [
  {
    numero: "2024.00137.00001",
    objeto:
      "Contratação de empresa de engenharia para execução da obra de implantação de sistemas de abastecimento de água em comunidades rurais no município de Água Doce do Maranhão/MA, incluindo fornecimento de materiais, mão de obra, equipamentos e serviços correlatos, com recursos do Termo de Compromisso nº 967148/2024/MCIDADES/CAIXA firmado com a Secretaria de Estado de Governo",
    status: "Aguardando Assinatura do Secretário",
    cor: "#7C3D52",
  },
  {
    numero: "2024.00214.00003",
    objeto:
      "Aquisição de equipamentos de informática e mobiliário para modernização das unidades de atendimento ao cidadão da Secretaria de Administração, compreendendo computadores, monitores, impressoras multifuncionais, mesas e cadeiras ergonômicas, conforme especificações técnicas constantes no Termo de Referência",
    status: "Em Análise Jurídica",
    cor: "#1D4ED8",
  },
  {
    numero: "2025.00089.00002",
    objeto:
      "Contratação de serviços de manutenção preventiva e corretiva da frota de veículos leves e pesados pertencentes ao patrimônio da Secretaria de Saúde, com fornecimento de peças genuínas ou originais, pelo período de 12 (doze) meses, conforme condições e exigências estabelecidas neste instrumento",
    status: "Publicado no Diário Oficial",
    cor: "#065F46",
  },
  {
    numero: "2025.00301.00007",
    objeto:
      "Contratação de empresa especializada para prestação de serviços de limpeza, conservação e higienização das instalações prediais da sede da Prefeitura Municipal e demais órgãos vinculados, com fornecimento de materiais, equipamentos e uniformes, pelo período de 24 (vinte e quatro) meses",
    status: "Aguardando Parecer Técnico",
    cor: "#92400E",
  },
  {
    numero: "2025.00445.00001",
    objeto:
      "Elaboração de projeto executivo e execução de obra de pavimentação asfáltica com drenagem pluvial nas Ruas XV de Novembro, Tiradentes e Marechal Deodoro, no bairro Centro, totalizando aproximadamente 4.200 m² de área pavimentada, incluindo sinalização horizontal e vertical",
    status: "Em Licitação",
    cor: "#1E3A5F",
  },
  {
    numero: "2025.00512.00004",
    objeto:
      "Aquisição de medicamentos, insumos farmacêuticos e materiais médico-hospitalares para abastecimento das Unidades Básicas de Saúde e do Hospital Municipal, conforme programação anual da Secretaria Municipal de Saúde e relação de itens aprovada pela Comissão de Farmácia e Terapêutica",
    status: "Contrato Assinado",
    cor: "#065F46",
  },
  {
    numero: "2025.00678.00002",
    objeto:
      "Contratação de empresa especializada em tecnologia da informação para desenvolvimento, implantação e manutenção de sistema integrado de gestão municipal (ERP) contemplando os módulos de contabilidade pública, folha de pagamento, tributos, almoxarifado, patrimônio e portal de transparência",
    status: "Em Execução",
    cor: "#1D4ED8",
  },
  {
    numero: "2025.00734.00005",
    objeto:
      "Contratação de empresa para execução de obra de reforma e ampliação da Escola Municipal Professora Maria das Dores, localizada na Rua das Acácias, nº 150, Bairro Novo Horizonte, com área de intervenção de 1.850 m², incluindo adaptação para acessibilidade conforme NBR 9050",
    status: "Aguardando Homologação",
    cor: "#7C3D52",
  },
  {
    numero: "2025.00891.00001",
    objeto:
      "Prestação de serviços de vigilância patrimonial ostensiva, desarmada e armada, nas dependências dos prédios públicos municipais durante o período de 24 (vinte e quatro) meses, com fornecimento de uniformes, equipamentos de comunicação e demais materiais necessários à execução dos serviços",
    status: "Suspenso por Decisão Judicial",
    cor: "#DC2626",
  },
  {
    numero: "2026.00023.00001",
    objeto:
      "Aquisição de gêneros alimentícios para atendimento ao Programa Nacional de Alimentação Escolar (PNAE) destinados aos alunos da rede municipal de ensino, compreendendo produtos da agricultura familiar e da alimentação escolar, conforme cardápio aprovado pela nutricionista responsável",
    status: "Em Instrução Processual",
    cor: "#92400E",
  },
  {
    numero: "2026.00105.00003",
    objeto:
      "Contratação de serviços de assessoria técnica e consultoria em gestão ambiental para apoio à implementação do Plano Municipal de Saneamento Básico, incluindo elaboração de estudos, diagnósticos, relatórios e participação em audiências públicas, pelo período de 18 (dezoito) meses",
    status: "Aguardando Publicação",
    cor: "#1E3A5F",
  },
  {
    numero: "2026.00198.00002",
    objeto:
      "Registro de preços para eventual aquisição de combustíveis (gasolina comum, etanol hidratado e óleo diesel S-10) para abastecimento da frota oficial de veículos pertencentes a todos os órgãos e entidades da administração pública municipal, pelo período de 12 (doze) meses",
    status: "Em Análise pela Controladoria",
    cor: "#065F46",
  },
];

async function seed() {
  console.log(`Inserindo ${processes.length} processos...`);

  const { data, error } = await supabase
    .from("processes")
    .insert(processes)
    .select("numero, status");

  if (error) {
    console.error("Erro ao inserir:", error.message);
    console.error("Detalhes:", error.details);
    process.exit(1);
  }

  console.log("Processos inseridos com sucesso:");
  data.forEach((p) => console.log(`  ✓ ${p.numero} — ${p.status}`));
}

seed();
