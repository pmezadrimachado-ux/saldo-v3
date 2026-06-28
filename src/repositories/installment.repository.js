import { DB_STORES } from '../storage/db.schema.js';
import { createBaseRepository } from './base.repository.js';

export const installmentRepository = {
  ...createBaseRepository(DB_STORES.INSTALLMENT_GROUPS),

  findActive() {
    return this.findByIndex('by_status', 'active');
  },
};
