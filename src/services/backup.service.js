import { APP_CONFIG } from '../config/app.config.js';
import { DB_STORES } from '../storage/db.schema.js';
import {
  exportDatabaseSnapshot,
  replaceDatabaseSnapshot,
} from '../storage/indexed-db.adapter.js';

const BACKUP_VERSION = 1;

export async function exportBackupFile() {
  const backup = await createBackupObject();
  downloadBackupObject(backup, `saldo-backup-${backup.exportedAt.slice(0, 10)}.json`);
  return backup;
}

export async function createBackupObject() {
  const snapshot = await exportDatabaseSnapshot();
  const now = new Date().toISOString();

  return {
    backupVersion: BACKUP_VERSION,
    appName: APP_CONFIG.name,
    appVersion: APP_CONFIG.version,
    schemaVersion: 1,
    exportedAt: now,
    data: snapshot,
  };
}

export async function importBackupFile(file) {
  const safetyBackup = await createBackupObject();

  const text = await file.text();
  let backup;

  try {
    backup = JSON.parse(text);
  } catch {
    throw new Error('Backup inválido. O arquivo não é um JSON válido.');
  }

  const normalizedBackup = normalizeAndValidateBackup(backup);

  try {
    await replaceDatabaseSnapshot(normalizedBackup.data);
  } catch (error) {
    downloadBackupObject(
      safetyBackup,
      `saldo-backup-seguranca-${safetyBackup.exportedAt.slice(0, 10)}.json`,
    );

    throw error;
  }

  return normalizedBackup;
}

export function normalizeAndValidateBackup(backup) {
  if (!backup || typeof backup !== 'object') {
    throw new Error('Backup inválido.');
  }

  if (backup.backupVersion !== BACKUP_VERSION) {
    throw new Error('Versão de backup incompatível.');
  }

  if (!backup.data || typeof backup.data !== 'object') {
    throw new Error('Backup sem dados.');
  }

  const normalizedData = {};

  Object.values(DB_STORES).forEach((storeName) => {
    normalizedData[storeName] = Array.isArray(backup.data[storeName])
      ? backup.data[storeName]
      : [];
  });

  return {
    ...backup,
    data: normalizedData,
  };
}

export function validateBackup(backup) {
  normalizeAndValidateBackup(backup);
  return true;
}

function downloadBackupObject(backup, filename) {
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
