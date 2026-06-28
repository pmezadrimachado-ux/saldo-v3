export const DB_STORES = {
  ACCOUNTS: 'accounts',
  CATEGORIES: 'categories',
  TRANSACTIONS: 'transactions',
  INSTALLMENT_GROUPS: 'installmentGroups',
  BUDGETS: 'budgets',
  GOALS: 'goals',
  SETTINGS: 'settings',
  PREFERENCES: 'preferences',
  METADATA: 'metadata',
};

export const DB_SCHEMA = [
  {
    name: DB_STORES.ACCOUNTS,
    keyPath: 'id',
    indexes: [
      ['by_type', 'type', { unique: false }],
      ['by_isActive', 'isActive', { unique: false }],
      ['by_archivedAt', 'archivedAt', { unique: false }],
      ['by_createdAt', 'createdAt', { unique: false }],
    ],
  },
  {
    name: DB_STORES.CATEGORIES,
    keyPath: 'id',
    indexes: [
      ['by_type', 'type', { unique: false }],
      ['by_isActive', 'isActive', { unique: false }],
      ['by_archivedAt', 'archivedAt', { unique: false }],
      ['by_sortOrder', 'sortOrder', { unique: false }],
    ],
  },
  {
    name: DB_STORES.TRANSACTIONS,
    keyPath: 'id',
    indexes: [
      ['by_date', 'date', { unique: false }],
      ['by_monthKey', 'monthKey', { unique: false }],
      ['by_weekKey', 'weekKey', { unique: false }],
      ['by_accountId', 'accountId', { unique: false }],
      ['by_categoryId', 'categoryId', { unique: false }],
      ['by_type', 'type', { unique: false }],
      ['by_status', 'status', { unique: false }],
      ['by_origin', 'origin', { unique: false }],
      ['by_installmentGroupId', 'installmentGroupId', { unique: false }],
      ['by_createdAt', 'createdAt', { unique: false }],
    ],
  },
  {
    name: DB_STORES.INSTALLMENT_GROUPS,
    keyPath: 'id',
    indexes: [
      ['by_accountId', 'accountId', { unique: false }],
      ['by_categoryId', 'categoryId', { unique: false }],
      ['by_startMonthKey', 'startMonthKey', { unique: false }],
      ['by_status', 'status', { unique: false }],
      ['by_createdAt', 'createdAt', { unique: false }],
    ],
  },
  {
    name: DB_STORES.BUDGETS,
    keyPath: 'id',
    indexes: [
      ['by_monthKey', 'monthKey', { unique: false }],
      ['by_categoryId', 'categoryId', { unique: false }],
      ['by_type', 'type', { unique: false }],
      ['by_isActive', 'isActive', { unique: false }],
    ],
  },
  {
    name: DB_STORES.GOALS,
    keyPath: 'id',
    indexes: [
      ['by_status', 'status', { unique: false }],
      ['by_targetDate', 'targetDate', { unique: false }],
      ['by_createdAt', 'createdAt', { unique: false }],
    ],
  },
  {
    name: DB_STORES.SETTINGS,
    keyPath: 'id',
    indexes: [],
  },
  {
    name: DB_STORES.PREFERENCES,
    keyPath: 'id',
    indexes: [],
  },
  {
    name: DB_STORES.METADATA,
    keyPath: 'id',
    indexes: [],
  },
];
