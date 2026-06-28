import { DB_STORES } from '../storage/db.schema.js';
import { createBaseRepository } from './base.repository.js';

export const categoryRepository = {
  ...createBaseRepository(DB_STORES.CATEGORIES),

  findActive() {
    return this.findByIndex('by_isActive', true);
  },

  findByType(type) {
    return this.findByIndex('by_type', type);
  },
};
