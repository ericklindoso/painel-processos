-- Adiciona coluna data_sessao para registrar a data agendada da sessão
ALTER TABLE processes ADD COLUMN IF NOT EXISTS data_sessao timestamptz;
