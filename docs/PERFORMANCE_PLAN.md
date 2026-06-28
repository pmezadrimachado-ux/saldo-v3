# Performance Plan — Saldo v3

## Objetivo

Garantir que a V3 continue responsiva com uso diário prolongado.

## Metas

- Abertura após cache: até 2 segundos.
- Navegação entre telas: instantânea.
- Dashboard: sem travamento perceptível.
- Análises: utilizável com milhares de transações.
- PWA: instalável e offline.

## Estratégias aplicadas

- Cache versionado.
- IndexedDB como fonte de dados.
- Analytics Engine centralizado.
- Renderização por telas.
- Logs desativados em Release Candidate.
- Gráficos sem bibliotecas externas.

## Pontos de atenção para testes reais

- Muitas transações parceladas.
- Importação de backup grande.
- Reabertura em modo avião.
- Atualização de Service Worker.
