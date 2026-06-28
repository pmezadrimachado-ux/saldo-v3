# Saldo v3.0.0 RC10

## Objetivo

Corrigir o redirecionamento após finalizar o onboarding.

## Correção

- Após concluir a configuração, `state.onboarding.completed` é forçado para `true`.
- O app muda diretamente para `#/quick-add`.
- A aplicação renderiza novamente após a navegação.
- Mantém chips personalizados do RC9.

## Critério de aprovação

- Finalizar onboarding.
- Ver popup "Configuração concluída."
- Sair automaticamente da tela de onboarding.
- Entrar na tela Lançar.
