import { DB_STORES } from '../storage/db.schema.js';
import { createBaseRepository } from './base.repository.js';

const base = createBaseRepository(DB_STORES.METADATA);

export const metadataRepository = {
  ...base,

  getMetadata() {
    return base.findById('app_metadata');
  },

  saveMetadata(metadata) {
    return base.save(metadata);
  },
};
