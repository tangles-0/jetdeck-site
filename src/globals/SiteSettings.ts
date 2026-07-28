import type { GlobalConfig } from 'payload'

import { revalidateAllPages } from '../hooks/revalidateHome'
import { validateSafeHref } from '../lib/cmsValidation'

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
      name: 'disablePageCache',
      label: 'Disable frontend page cache',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Turn this on while editing across local and Vercel so frontend pages read fresh CMS data on every request.',
      },
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
        { name: 'url', type: 'text', required: true, validate: validateSafeHref },
      ],
    },
    {
      name: 'footerLine1',
      label: 'Footer line 1',
      type: 'text',
      defaultValue: '> JetDeck SCOUT © 2026',
    },
    {
      name: 'footerLine2',
      label: 'Footer line 2',
      type: 'text',
      defaultValue: 'Built for hackers, makers, and dreamers.',
    },
    {
      name: 'footerColumns',
      label: 'Footer link columns',
      type: 'array',
      admin: {
        description: 'Optional site-wide footer link columns.',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url', type: 'text', required: true, validate: validateSafeHref },
          ],
        },
      ],
    },
  ],
}
