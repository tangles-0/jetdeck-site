import type { CollectionConfig } from 'payload'

import { pageBlocks } from '../fields/pageBuilder'
import { revalidatePage } from '../hooks/revalidateHome'
import { validateOptionalPagePath, validatePagePath } from '../lib/cmsValidation'

type PagePathValue = string | string[] | null | undefined

type PagePathValidationArgs = {
  siblingData?: {
    isKnowledgebasePage?: boolean | null
  }
}

const validatePagePathForPage = (value: PagePathValue, { siblingData }: PagePathValidationArgs) =>
  siblingData?.isKnowledgebasePage ? validateOptionalPagePath(value) : validatePagePath(value)

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'isKnowledgebasePage', 'showInNav', 'updatedAt'],
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.isKnowledgebasePage && typeof data.path === 'string' && data.path.trim() === '') {
          data.path = null
        }

        return data
      },
    ],
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
      unique: true,
      admin: {
        description:
          'Public URL path. Required for normal pages. Knowledgebase pages may leave this blank to derive the URL from their parent and knowledgebase label.',
      },
      validate: validatePagePathForPage,
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
      name: 'isKnowledgebasePage',
      label: 'Include this page in the knowledgebase',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Knowledgebase pages appear in knowledgebase indexes and use the wide article layout.',
      },
    },
    {
      name: 'knowledgebaseLabel',
      label: 'Knowledgebase label',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.isKnowledgebasePage,
        description: 'Optional index label and URL segment. Falls back to the page title.',
      },
    },
    {
      name: 'knowledgebaseDescription',
      label: 'Knowledgebase description',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData.isKnowledgebasePage,
        description: 'Optional summary shown on standalone knowledgebase indexes.',
      },
    },
    {
      name: 'knowledgebaseParent',
      label: 'Knowledgebase parent page',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: false,
      filterOptions: {
        isKnowledgebasePage: {
          equals: true,
        },
      },
      admin: {
        condition: (_, siblingData) => siblingData.isKnowledgebasePage,
        description: 'Optional parent page used to build the visual hierarchy in the knowledgebase index.',
      },
    },
    {
      name: 'knowledgebaseOrder',
      label: 'Knowledgebase order',
      type: 'number',
      defaultValue: 0,
      admin: {
        condition: (_, siblingData) => siblingData.isKnowledgebasePage,
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
