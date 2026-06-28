import { DB_STORES } from '../storage/db.schema.js';
import { createBaseRepository } from './base.repository.js';

export const accountRepository = {
  ...createBaseRepository(DB_STORES.ACCOUNTS),

  findActive() {
    return this.findByIndex('by_isActive', true);
  },
};
