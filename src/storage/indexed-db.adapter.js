import { DB_CONFIG } from '../config/db.config.js';
import { createLogger } from '../core/logger.js';
import { applyMigrations } from './db.migrations.js';
import { DB_STORES } from './db.schema.js';
import {
  createInitialMetadata,
  createInitialPreferences,
  createInitialSettings,
} from './db.seed.js';

const logger = createLogger('IndexedDB');

let databasePromise = null;

export function openDatabase() {
  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

    request.onupgradeneeded = () => {
      applyMigrations(request.result, request.oldVersion, request.newVersion);
    };

    request.onsuccess = async () => {
      const database = request.result;

      database.onversionchange = () => {
        database.close();
      };

      await seedRequiredRecords(database);

      logger.info('Banco aberto:', DB_CONFIG.name);

      resolve(database);
    };

    request.onerror = () => {
      reject(request.error);
    };

    request.onblocked = () => {
      logger.warn('Abertura do banco bloqueada por outra aba.');
    };
  });

  return databasePromise;
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

export async function put(storeName, value) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value);

    request.onsuccess = () => resolve(value);
    request.onerror = () => reject(request.error);
  });
}

export async function putMany(storeName, values = []) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    values.forEach((value) => store.put(value));

    transaction.oncomplete = () => resolve(values);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function remove(storeName, id) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

export async function clearStore(storeName) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve(storeName);
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

export async function exportDatabaseSnapshot() {
  const snapshot = {};

  for (const storeName of Object.values(DB_STORES)) {
    snapshot[storeName] = await getAll(storeName);
  }

  return snapshot;
}

async function seedRequiredRecords(database) {
  const now = new Date().toISOString();

  const seeds = [
    [DB_STORES.SETTINGS, 'app_settings', createInitialSettings(now)],
    [DB_STORES.PREFERENCES, 'user_preferences', createInitialPreferences(now)],
    [DB_STORES.METADATA, 'app_metadata', createInitialMetadata(now)],
  ];

  await Promise.all(
    seeds.map(([storeName, id, value]) => ensureRecord(database, storeName, id, value)),
  );
}

function ensureRecord(database, storeName, id, value) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      if (getRequest.result) {
        resolve(getRequest.result);
        return;
      }

      const putRequest = store.put(value);

      putRequest.onsuccess = () => resolve(value);
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function replaceDatabaseSnapshot(snapshot) {
  const database = await openDatabase();
  const storeNames = Object.keys(snapshot);

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeNames, 'readwrite');

    storeNames.forEach((storeName) => {
      const store = transaction.objectStore(storeName);
      store.clear();

      snapshot[storeName].forEach((item) => {
        store.put(item);
      });
    });

    transaction.oncomplete = () => resolve(snapshot);
    transaction.onerror = () => reject(transaction.error);
  });
}
