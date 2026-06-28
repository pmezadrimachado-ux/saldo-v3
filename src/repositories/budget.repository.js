import { DB_STORES } from '../storage/db.schema.js';
import { createBaseRepository } from './base.repository.js';

export const budgetRepository = {
  ...createBaseRepository(DB_STORES.BUDGETS),

  findByMonth(monthKey) {
    return this.findByIndex('by_monthKey', monthKey);
  },

  findActive() {
    return this.findByIndex('by_isActive', true);
  },
};
