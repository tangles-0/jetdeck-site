import * as migration_20260620_134215_initial from './20260620_134215_initial';
import * as migration_20260620_160536_add_disable_page_cache from './20260620_160536_add_disable_page_cache';

export const migrations = [
  {
    up: migration_20260620_134215_initial.up,
    down: migration_20260620_134215_initial.down,
    name: '20260620_134215_initial',
  },
  {
    up: migration_20260620_160536_add_disable_page_cache.up,
    down: migration_20260620_160536_add_disable_page_cache.down,
    name: '20260620_160536_add_disable_page_cache'
  },
];
