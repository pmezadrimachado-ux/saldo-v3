import {
  getAll,
  getById,
  getByIndex,
  put,
  remove,
} from '../storage/indexed-db.adapter.js';

export function createBaseRepository(storeName) {
  return {
    findAll() {
      return getAll(storeName);
    },

    findById(id) {
      return getById(storeName, id);
    },

    findByIndex(indexName, value) {
      return getByIndex(storeName, indexName, value);
    },

    save(entity) {
      return put(storeName, entity);
    },

    removeById(id) {
      return remove(storeName, id);
    },
  };
}
