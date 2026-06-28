# Saldo v3.0.0 RC5

## Tipo

Release Candidate com correções de auditoria.

## Corrigido

### Backup

- Agora o app cria um snapshot de segurança antes de importar um backup.
- Backups com stores ausentes são normalizados com arrays vazios.
- A importação continua validando versão e estrutura.

### Parcelamentos

- A última parcela agora absorve diferenças de centavos.
- Exemplo: R$100,00 em 3x vira R$33,33 + R$33,33 + R$33,34.
- `weekKey` agora é calculado no model de parcelamento.

## Próximo passo

Teste real no celular.
