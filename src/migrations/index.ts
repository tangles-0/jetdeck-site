import * as migration_20260620_134215_initial from './20260620_134215_initial';

export const migrations = [
  {
    up: migration_20260620_134215_initial.up,
    down: migration_20260620_134215_initial.down,
    name: '20260620_134215_initial'
  },
];
