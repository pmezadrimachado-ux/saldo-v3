import { DB_STORES } from '../storage/db.schema.js';
import { createBaseRepository } from './base.repository.js';

export const goalRepository = {
  ...createBaseRepository(DB_STORES.GOALS),

  findActive() {
    return this.findByIndex('by_status', 'active');
  },

  findArchived() {
    return this.findByIndex('by_status', 'archived');
  },
};
