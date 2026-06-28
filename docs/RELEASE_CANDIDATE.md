# Saldo v3.0.0 RC9

## Objetivo

Corrigir o comportamento do botão Adicionar no onboarding.

## Correção

- O botão Adicionar não chama mais toast global.
- O toast global causava re-render e apagava o chip recém-criado.
- O item personalizado agora aparece como chip visível.
- O chip pode ser removido antes de finalizar.

## Critério de aprovação

- Digitar uma categoria personalizada.
- Clicar em Adicionar.
- Ver o chip aparecer abaixo do campo.
- Finalizar configuração.
- Categoria aparecer no app.
