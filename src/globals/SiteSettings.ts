import type { GlobalConfig } from 'payload'

import { revalidateAllPages } from '../hooks/revalidateHome'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAllPages],
  },
  fields: [
    {
      name: 'navBrandLabel',
      type: 'text',
      defaultValue: 'JetDeck SCOUT',
    },
    {
      name: 'navLinks',
      label: 'Extra navigation links',
      type: 'array',
      admin: {
        description: 'Optional links shown after CMS-managed page links. Useful for external links.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
