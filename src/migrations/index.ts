import * as migration_20260620_134215_initial from './20260620_134215_initial';
import * as migration_20260620_160536_add_disable_page_cache from './20260620_160536_add_disable_page_cache';
import * as migration_20260623_054812_add_knowledgebase_pages from './20260623_054812_add_knowledgebase_pages';
import * as migration_20260623_062423_make_kb_page_paths_optional from './20260623_062423_make_kb_page_paths_optional';
import * as migration_20260623_065400_add_site_wide_footer from './20260623_065400_add_site_wide_footer';

export const migrations = [
  {
    up: migration_20260620_134215_initial.up,
    down: migration_20260620_134215_initial.down,
    name: '20260620_134215_initial',
  },
  {
    up: migration_20260620_160536_add_disable_page_cache.up,
    down: migration_20260620_160536_add_disable_page_cache.down,
    name: '20260620_160536_add_disable_page_cache',
  },
  {
    up: migration_20260623_054812_add_knowledgebase_pages.up,
    down: migration_20260623_054812_add_knowledgebase_pages.down,
    name: '20260623_054812_add_knowledgebase_pages',
  },
  {
    up: migration_20260623_062423_make_kb_page_paths_optional.up,
    down: migration_20260623_062423_make_kb_page_paths_optional.down,
    name: '20260623_062423_make_kb_page_paths_optional'
  },
  {
    up: migration_20260623_065400_add_site_wide_footer.up,
    down: migration_20260623_065400_add_site_wide_footer.down,
    name: '20260623_065400_add_site_wide_footer'
  },
];
