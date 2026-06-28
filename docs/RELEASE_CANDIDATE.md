# Saldo v3.0.0 RC12

## Objetivo

Corrigir duplicação de contas e categorias após múltiplos testes de onboarding.

## Correções

- Onboarding deduplica contas antes de salvar.
- Onboarding deduplica categorias antes de salvar.
- Storage remove duplicatas existentes ao inicializar.
- Telas Lançar e Transações exibem listas deduplicadas.
- Duplicatas são identificadas por tipo + nome normalizado.

## Critério de aprovação

- A tela Lançar não deve mostrar categorias repetidas.
- A tela Lançar não deve mostrar contas repetidas.
- Rodar onboarding mais de uma vez não deve multiplicar categorias.
