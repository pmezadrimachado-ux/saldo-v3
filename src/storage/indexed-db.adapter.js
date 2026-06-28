import {
  DB_NAME,
  DB_VERSION,
  DB_SCHEMA,
  DB_STORES,
} from './db.schema.js';

let databasePromise = null;

export function openDatabase() {
  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      ensureSchema(request.result);
    };

    request.onsuccess = () => {
      const database = request.result;

      if (!hasFullSchema(database)) {
        database.close();
        databasePromise = forceSchemaUpgrade();
        databasePromise.then(resolve).catch(reject);
        return;
      }

      resolve(database);
    };

    request.onerror = () => {
      databasePromise = null;
      reject(request.error);
    };

    request.onblocked = () => {
      console.warn('Atualização do banco bloqueada por outra aba aberta.');
    };
  });

  return databasePromise;
}

function forceSchemaUpgrade() {
  return new Promise((resolve, reject) => {
    const inspectRequest = indexedDB.open(DB_NAME);

    inspectRequest.onsuccess = () => {
      const currentDatabase = inspectRequest.result;
      const nextVersion = currentDatabase.version + 1;
      currentDatabase.close();

      const upgradeRequest = indexedDB.open(DB_NAME, nextVersion);

      upgradeRequest.onupgradeneeded = () => {
        ensureSchema(upgradeRequest.result);
      };

      upgradeRequest.onsuccess = () => resolve(upgradeRequest.result);

      upgradeRequest.onerror = () => {
        databasePromise = null;
        reject(upgradeRequest.error);
      };

      upgradeRequest.onblocked = () => {
        console.warn('Migração do banco bloqueada por outra aba aberta.');
      };
    };

    inspectRequest.onerror = () => {
      databasePromise = null;
      reject(inspectRequest.error);
    };
  });
}

function hasFullSchema(database) {
  return DB_SCHEMA.every((storeDefinition) => (
    database.objectStoreNames.contains(storeDefinition.name)
  ));
}

function ensureSchema(database) {
  DB_SCHEMA.forEach((storeDefinition) => {
    if (database.objectStoreNames.contains(storeDefinition.name)) return;

    const store = database.createObjectStore(storeDefinition.name, {
      keyPath: storeDefinition.keyPath,
    });

    (storeDefinition.indexes ?? []).forEach(([name, keyPath, options]) => {
      store.createIndex(name, keyPath, options);
    });
  });
}

export async function getById(storeName, id) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAll(storeName) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });
}

export async function getByIndex(storeName, indexName, value) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });
}

export async function put(storeName, record) {
  const database = await openDatabase();
  const normalizedRecord = normalizeRecordForStore(storeName, record);

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(normalizedRecord);

    request.onsuccess = () => resolve(normalizedRecord);
    request.onerror = () => reject(request.error);
  });
}

function normalizeRecordForStore(storeName, record) {
  if (!record || typeof record !== 'object') {
    return record;
  }

  if (record.id) {
    return record;
  }

  if (storeName === DB_STORES.SETTINGS) {
    return { ...record, id: 'app-settings' };
  }

  if (storeName === DB_STORES.PREFERENCES) {
    return { ...record, id: 'user-preferences' };
  }

  if (storeName === DB_STORES.METADATA) {
    return { ...record, id: 'app-metadata' };
  }

  return record;
}

export async function remove(storeName, id) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function clear(storeName) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

export async function exportDatabaseSnapshot() {
  const database = await openDatabase();
  const snapshot = {};

  await Promise.all(DB_SCHEMA.map((storeDefinition) => new Promise((resolve, reject) => {
    const transaction = database.transaction(storeDefinition.name, 'readonly');
    const store = transaction.objectStore(storeDefinition.name);
    const request = store.getAll();

    request.onsuccess = () => {
      snapshot[storeDefinition.name] = request.result ?? [];
      resolve();
    };

    request.onerror = () => reject(request.error);
  })));

  return snapshot;
}

export async function replaceDatabaseSnapshot(snapshot) {
  const database = await openDatabase();
  const storeNames = DB_SCHEMA.map((storeDefinition) => storeDefinition.name);

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeNames, 'readwrite');

    storeNames.forEach((storeName) => {
      const store = transaction.objectStore(storeName);
      store.clear();

      (snapshot[storeName] ?? []).forEach((item) => {
        store.put(item);
      });
    });

    transaction.oncomplete = () => resolve(snapshot);
    transaction.onerror = () => reject(transaction.error);
  });
}

export { DB_STORES };
