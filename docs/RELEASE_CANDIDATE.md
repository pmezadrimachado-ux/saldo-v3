# Saldo v3.0.0 RC7

## Objetivo

Corrigir falha real de IndexedDB encontrada no onboarding.

## Correção

- Migração defensiva do IndexedDB.
- Criação automática de stores ausentes em upgrade.
- Versão do banco elevada para forçar migração.
- Preservação de dados existentes quando possível.

## Critério de aprovação

- Abrir em navegador com banco antigo não deve quebrar.
- Onboarding deve finalizar.
- App deve redirecionar para Lançar.
