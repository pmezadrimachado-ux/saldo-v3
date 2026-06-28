# Saldo v3.0.0 RC16

## Objetivo

Adicionar a logo do Mercado Pago ao sistema local de logos bancárias.

## Alterações

- Adicionado `assets/banks/mercado-pago.jpeg`.
- Atualizado `src/config/bank-logo.registry.js`.
- Atualizado Service Worker para cache offline.
- Atualizada documentação de release.

## Critério de aprovação

- Criar conta chamada Mercado Pago deve exibir a logo correta.
- Criar conta chamada mercadopago ou MP também deve reconhecer a logo.
- Logo deve funcionar offline após cache.
