import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://inbcgaoexhnrcjqrqtsc.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Cores por status
const COR_ANALISE = "#1E3A5F";      // Marinho — em análise
const COR_AGUARDANDO = "#92400E";   // Bronze — aguardando

const processes = [
  { numero: "202511012403320", objeto: "VOÇOROCA 9 MILHÕES",                                                     status: "EM ANÁLISE DE HABILITAÇÃO",       cor: COR_ANALISE },
  { numero: "202511012404929", objeto: "VOÇOROCA 38 MILHÕES",                                                    status: "EM ANÁLISE DE HABILITAÇÃO",       cor: COR_ANALISE },
  { numero: "202511012406228", objeto: "SAA DE ÁGUA DOCE DO MARANHÃO",                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405521", objeto: "SAA CONCEIÇÃO DO LAGO AÇU",                                              status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012404930", objeto: "SAA DE PEDRO DO ROSÁRIO",                                                status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405528", objeto: "SAA DE FERNANDO FALCÃO",                                                 status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405988", objeto: "SAA AMARANTE",                                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405599", objeto: "SAA SATUBINHA",                                                          status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405557", objeto: "SAA DE SÃO JOÃO DO SOTER",                                              status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405558", objeto: "SAA LAGOA GRANDE DO MARANHÃO",                                          status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405716", objeto: "SAA SÃO JOÃO DO CARU",                                                  status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405717", objeto: "SAA CENTRO NOVO DO MARANHÃO",                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405943", objeto: "SAA SANTO AMARO DO MARANHÃO",                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405944", objeto: "SAA SANTANA DO MARANHÃO",                                               status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405945", objeto: "SAA BELÁGUA",                                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405715", objeto: "SAA GOVERNADOR EUGÊNIO BARROS",                                         status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406156", objeto: "SAA PINHEIRO",                                                          status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406157", objeto: "SAA PAULO RAMOS",                                                       status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406221", objeto: "SAA URBANO PAULINO NEVES",                                              status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406210", objeto: "SAA OLHO D'ÁGUA DAS CUNHÃS",                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406255", objeto: "SAA FORTALEZA DOS NOGUEIRAS",                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406212", objeto: "SAA FEIRA NOVA DO MARANHÃO",                                            status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112400009",  objeto: "SAA CHAPADINHA",                                                        status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406213", objeto: "SAA PIRAPEMAS",                                                         status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406348", objeto: "SAA FORTUNA",                                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406292", objeto: "SAA GOVERNADOR ARCHER",                                                 status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406281", objeto: "SAA ICATU",                                                             status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112400032",  objeto: "SAA MIRADOR",                                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112400064",  objeto: "SAA LUIS DOMINGUES",                                                    status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112400033",  objeto: "SAA LAGO VERDE",                                                        status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112400115",  objeto: "SAA GOVERNADOR LUÍS ROCHA",                                             status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112400036",  objeto: "SAA MORROS",                                                            status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112400037",  objeto: "SAA POÇÃO DE PEDRAS",                                                   status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112400038",  objeto: "SAA TUTÓIA",                                                            status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012403356", objeto: "SAA SIMPLIFICADO",                                                      status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405942", objeto: "SAA SIMPLIFICADO (BARRA DO CORDA, LAGO DO JUNCO, PINHEIRO E ARAIOSES)", status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012406152", objeto: "TRATAMENTO DE LODO DO ITAQUI",                                          status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012403289", objeto: "CONVENTO DAS MERCÊS",                                                   status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112401637",  objeto: "SAA COROATÁ",                                                           status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112401847",  objeto: "SAA ITAPECURU MIRIM",                                                   status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112401835",  objeto: "SAA MIRANDA DO NORTE",                                                  status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112401848",  objeto: "SES ITAPECURU MIRIM",                                                   status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112401644",  objeto: "SAA BARREIRINHAS",                                                      status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112401680",  objeto: "SES BARREIRINHAS",                                                      status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112401356",  objeto: "SAA SÃO LUÍS",                                                         status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "20261112400163",  objeto: "SAA SÃO LUÍS - SACAVÉM",                                               status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
  { numero: "202511012405529", objeto: "SAA IMPERATRIZ",                                                        status: "AGUARDANDO ABERTURA DE SESSÃO",   cor: COR_AGUARDANDO },
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
