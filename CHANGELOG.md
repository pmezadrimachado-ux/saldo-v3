# CHANGELOG

## 3.0.0-rc.17

### Corrigido

- Popups/toasts causavam re-render e zeravam formulários.
- Toast agora é renderizado em host isolado no DOM.

### Adicionado

- Componente `toast-host.component.js`.


## 3.0.0-rc.16

### Adicionado

- Logo do Mercado Pago ao sistema de logos bancárias.


## 3.0.0-rc.15

### Adicionado

- Logos locais de bancos e cartões de benefício.
- Registry de logos com aliases.
- Componente reutilizável de logo bancária.
- Integração de logos no seletor visual de contas.


## 3.0.0-rc.14

### Adicionado

- Valores em R$ nos gráficos de semana e últimos meses.
- Totais nos gráficos.
- Seletor visual de conta/cartão no lançamento completo.

### Corrigido

- RC13 descartado como base por erro de sintaxe.


## 3.0.0-rc.12

### Corrigido

- Categorias repetidas.
- Contas repetidas.
- Onboarding criando duplicatas em testes sucessivos.

### Adicionado

- Utilitário central de deduplicação.
- Reparo automático de duplicatas no storage.


## 3.0.0-rc.11

### Corrigido

- `form.reset()` após `await`.
- IDs internos de settings/preferences/metadata.
- Seed inicial do banco.
- Rotas e renderers faltantes.
- Compatibilidade entre tipo de lançamento e categoria.
- Dashboard com gráfico semanal mockado.

### Adicionado

- Filtro dinâmico de categorias no lançamento completo.
- Estado inicial com `installmentGroups` e `recurrences`.


## 3.0.0-rc.10

### Corrigido

- App ficava preso na tela de onboarding após finalizar configuração.
- Redirecionamento pós-onboarding para Lançar.


## 3.0.0-rc.9

### Corrigido

- Item personalizado sumia após clicar em Adicionar no onboarding.

### Adicionado

- Feedback inline no onboarding.
- Chips personalizados removíveis.


## 3.0.0-rc.8

### Corrigido

- Erro de gravação em object stores com keyPath.
- Onboarding de itens personalizados.

### Adicionado

- Botão Adicionar para conta personalizada.
- Botão Adicionar para categoria de despesa personalizada.
- Botão Adicionar para categoria de receita personalizada.
- Chips visuais de itens personalizados.


## 3.0.0-rc.7

### Corrigido

- Erro de IndexedDB com stores ausentes.
- Migração defensiva do banco local.
- Compatibilidade do adapter IndexedDB com repositories existentes.


## 3.0.0-rc.6

### Corrigido

- Onboarding não avançando após clicar em Finalizar configuração.
- Tratamento de erro no onboarding.
- Estado de carregamento no botão de configuração.

### Adicionado

- Categoria de receita personalizada no onboarding.


## 3.0.0-rc.5

### Corrigido

- Backup de segurança automático antes de importação.
- Importação mais tolerante a backups com stores ausentes.
- Diferença de centavos em parcelamentos.
- `weekKey` de parcelas calculado no model.


## 3.0.0-rc.4

### Adicionado

- Checklist final de release.
- Release notes RC4.
- Documentação final de validação.

### Alterado

- Versão consolidada como Release Candidate final.


## 3.0.0-rc.3

### Adicionado

- Tela de Testes.
- Diagnóstico operacional.
- Checklist manual no app.
- Plano de performance.
- Script manual de testes.

### Alterado

- Logs desativados no ambiente Release Candidate.


## 3.0.0-rc.2

### Adicionado

- Manifest PWA expandido.
- Atalhos rápidos.
- Metatags para iOS.
- Tela de status PWA.
- Fluxo básico de atualização do Service Worker.


## 3.0.0-rc.1

### Adicionado

- Exportação completa de backup em JSON.
- Importação de backup JSON.
- Validação básica de backup.
- Tela de Backup.
- Documentação de Release Candidate.

### Base incluída

- Onboarding.
- Contas e cartões.
- Categorias.
- Lançamentos.
- Dashboard inteligente.
- Análises.
- Orçamentos.
- Metas.
- Parcelamentos.
- Faturas de cartão.
- Projeções futuras.
