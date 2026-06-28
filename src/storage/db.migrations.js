import { DB_SCHEMA } from './db.schema.js';

export function applyMigrations(database, oldVersion, newVersion) {
  if (oldVersion < 1) {
    createVersion1Schema(database);
  }
}

function createVersion1Schema(database) {
  DB_SCHEMA.forEach((storeSchema) => {
    if (database.objectStoreNames.contains(storeSchema.name)) {
      return;
    }

    const store = database.createObjectStore(storeSchema.name, {
      keyPath: storeSchema.keyPath,
    });

    storeSchema.indexes.forEach(([indexName, keyPath, options]) => {
      store.createIndex(indexName, keyPath, options);
    });
  });
}
