import * as migration_20260611_055502_initial from './20260611_055502_initial';

export const migrations = [
  {
    up: migration_20260611_055502_initial.up,
    down: migration_20260611_055502_initial.down,
    name: '20260611_055502_initial'
  },
];
