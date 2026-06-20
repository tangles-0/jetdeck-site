import type { CollectionConfig } from 'payload'

import { pageBlocks } from '../fields/pageBuilder'
import { revalidatePage } from '../hooks/revalidateHome'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'showInNav', 'updatedAt'],
  },
  hooks: {
    afterChange: [revalidatePage],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal title used to organise pages in the CMS.',
      },
    },
    {
      name: 'path',
      type: 'text',
      required: true,
      unique: true,
      defaultValue: '/',
      admin: {
        description: 'Public URL path. Use / for the homepage, /about for a top-level page, etc.',
      },
      validate: (value: string | string[] | null | undefined) =>
        typeof value === 'string' && value.startsWith('/')
          ? true
          : 'Path must start with /',
    },
    {
      name: 'showNavigation',
      label: 'Show navigation on this page',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showInNav',
      label: 'Show this page in navigation',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'navLabel',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.showInNav,
        description: 'Optional label used in the navigation. Falls back to the page title.',
      },
    },
    {
      name: 'navOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        condition: (_, siblingData) => siblingData.showInNav,
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: pageBlocks,
    },
  ],
}
