import { DB_STORES } from '../storage/db.schema.js';
import { createBaseRepository } from './base.repository.js';

const base = createBaseRepository(DB_STORES.SETTINGS);

export const settingsRepository = {
  ...base,

  getSettings() {
    return base.findById('app_settings');
  },

  saveSettings(settings) {
    return base.save(settings);
  },
};
