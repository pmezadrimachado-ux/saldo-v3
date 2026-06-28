# Sprint 5 — Contas, Cartões e Categorias

## Status

Concluída.

## Entregas

### Contas e cartões

- Criar conta/cartão.
- Editar nome.
- Arquivar.
- Reativar.
- Listar ativos.
- Listar arquivados.
- Preservar histórico via arquivamento lógico.

### Categorias

- Criar categoria.
- Editar nome.
- Arquivar.
- Reativar.
- Listar ativas.
- Listar arquivadas.
- Preservar histórico via arquivamento lógico.

## Detalhes técnicos

- `account.service.js`
- `category.service.js`
- `entity-list.component.js`
- Integração das páginas `Accounts` e `Categories`.
- Persistência via IndexedDB.
- Atualização de estado após operações.

## Critérios de aceite

- Conta criada aparece na lista.
- Conta arquivada sai da lista ativa e aparece em arquivadas.
- Conta reativada volta para ativos.
- Categoria criada aparece na lista.
- Categoria arquivada sai da lista ativa e aparece em arquivadas.
- Categoria reativada volta para ativas.
- Histórico será preservado porque arquivamento não remove registros.
- Imports, exports, sintaxe e assets validados.

## Próxima Sprint

Sprint 6 — Lançamentos.
