import { DB_STORES } from '../storage/db.schema.js';
import { createBaseRepository } from './base.repository.js';

const base = createBaseRepository(DB_STORES.PREFERENCES);

export const preferencesRepository = {
  ...base,

  getPreferences() {
    return base.findById('user_preferences');
  },

  savePreferences(preferences) {
    return base.save(preferences);
  },
};
