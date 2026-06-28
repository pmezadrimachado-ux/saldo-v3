# Saldo v3.0.0 RC17

## Objetivo

Corrigir popup/toast recarregando ou re-renderizando a tela inteira.

## Problema

O toast global chamava renderização completa da aplicação. Em formulários, isso apagava valores digitados e interrompia edições em andamento.

## Correção

- Criado `toast-host.component.js`.
- Toast agora é renderizado diretamente em um host isolado no `document.body`.
- Mostrar popup não re-renderiza página, formulário ou rota.
- Campos preenchidos permanecem intactos.
- Botão de fechar no toast.
- Timeout automático mantido para avisos não críticos.
- Erros permanecem visíveis até fechamento manual.

## Critério de aprovação

- Digitar valores em um formulário.
- Disparar um popup/toast.
- Confirmar que os valores digitados continuam na tela.
- Confirmar que o app não troca de rota nem reinicia a página.
