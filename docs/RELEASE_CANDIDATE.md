# Saldo v3.0.0 RC14

## Objetivo

Refatoração controlada após o RC13 quebrar a aplicação com erro de sintaxe.

## Base usada

RC12.

## Alterações

- Valores em R$ no gráfico de gastos por dia da semana.
- Valores em R$ no gráfico de últimos meses.
- Total da semana.
- Total de despesas do período.
- Seletor visual de conta/cartão no lançamento completo.
- Select mantido como fallback.

## Validação

- Sintaxe JS validada com `node --check`.
- Imports e exports validados.
- Assets do Service Worker validados.
