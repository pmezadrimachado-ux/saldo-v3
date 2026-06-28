import { DB_STORES } from '../storage/db.schema.js';
import { createBaseRepository } from './base.repository.js';

export const transactionRepository = {
  ...createBaseRepository(DB_STORES.TRANSACTIONS),

  findByMonth(monthKey) {
    return this.findByIndex('by_monthKey', monthKey);
  },

  findByAccount(accountId) {
    return this.findByIndex('by_accountId', accountId);
  },

  findByCategory(categoryId) {
    return this.findByIndex('by_categoryId', categoryId);
  },
};
