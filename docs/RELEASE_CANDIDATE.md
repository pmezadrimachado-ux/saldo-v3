# Saldo v3.0.0 RC11

## Objetivo

Estabilização estrutural após erros encontrados no RC10.

## Correções

- `form.reset()` não usa mais `event.currentTarget` após operações assíncronas.
- IDs internos de settings/preferences/metadata foram padronizados.
- Seed inicial garante settings, preferences e metadata antes do onboarding.
- Rotas faltantes foram registradas no objeto `ROUTES`.
- Todas as páginas de Ajustes foram registradas no `PAGE_RENDERERS`.
- Lançamento completo filtra categorias por tipo.
- Validação bloqueia categoria incompatível com tipo de lançamento.
- Estado inicial agora inclui `installmentGroups` e `recurrences`.
- Dashboard removeu gráfico semanal mockado e usa dados reais do Analytics Engine.

## Critério de aprovação

- Onboarding conclui.
- Lançamento completo salva sem erro de `reset`.
- Despesa só mostra categorias de despesa.
- Receita só mostra categorias de receita.
- Ajustes abre Parcelamentos, Backup, PWA e Testes.
