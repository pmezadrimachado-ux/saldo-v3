import { goalRepository } from '../repositories/goal.repository.js';
import { createGoal } from '../domain/goals/goal.model.js';
import { validateGoal } from '../domain/goals/goal.validators.js';

export async function addGoal(input) {
  const goal = createGoal(input);
  const errors = validateGoal(goal);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  return goalRepository.save(goal);
}

export async function updateGoal(id, input) {
  const existing = await goalRepository.findById(id);

  if (!existing) {
    throw new Error('Meta não encontrada.');
  }

  const goal = createGoal({
    ...existing,
    ...input,
    id: existing.id,
    createdAt: existing.createdAt,
    archivedAt: existing.archivedAt,
  });

  const errors = validateGoal(goal);

  if (errors.length) {
    throw new Error(errors[0]);
  }

  return goalRepository.save(goal);
}

export async function archiveGoal(id) {
  const existing = await goalRepository.findById(id);

  if (!existing) {
    throw new Error('Meta não encontrada.');
  }

  return goalRepository.save({
    ...existing,
    status: 'archived',
    archivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function reactivateGoal(id) {
  const existing = await goalRepository.findById(id);

  if (!existing) {
    throw new Error('Meta não encontrada.');
  }

  return goalRepository.save({
    ...existing,
    status: 'active',
    archivedAt: null,
    updatedAt: new Date().toISOString(),
  });
}
