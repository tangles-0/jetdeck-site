import type { CollectionConfig } from 'payload'

import { revalidateHomeOnMediaChange } from '../hooks/revalidateHome'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateHomeOnMediaChange],
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt text shown to screen readers and used while the image loads',
      },
    },
  ],
}
