import type { ArrayField, Block, Field } from 'payload'

import { validateSafeHref } from '../lib/cmsValidation'

export const iconOptions = [
  'Antenna',
  'Battery',
  'Bluetooth',
  'Camera',
  'Cpu',
  'EthernetPort',
  'ExternalLink',
  'Gamepad2',
  'Gpu',
  'HardDrive',
  'Heart',
  'Keyboard',
  'MemoryStick',
  'Radio',
  'Terminal',
  'Usb',
  'Wifi',
  'Zap',
].map((icon) => ({ label: icon, value: icon }))

export const colorOptions = [
  { label: 'Cyan', value: 'cyan' },
  { label: 'Blue', value: 'blue' },
  { label: 'Purple', value: 'purple' },
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Orange', value: 'orange' },
  { label: 'Red', value: 'red' },
  { label: 'Pink', value: 'pink' },
]

export const ctaVariantOptions = [
  { label: 'Primary button', value: 'primary' },
  { label: 'Secondary badge', value: 'secondary' },
]

export const ctaIconOptions = [
  { label: 'None', value: 'none' },
  { label: 'External link', value: 'externalLink' },
  { label: 'Discord', value: 'discord' },
  { label: 'Terminal', value: 'terminal' },
]

export const paragraphsField = (name = 'paragraphs', label = 'Paragraphs'): ArrayField => ({
  name,
  label,
  type: 'array',
  fields: [{ name: 'text', type: 'textarea', required: true }],
})

export const mediaItemsField = (name = 'images', label = 'Images'): ArrayField => ({
  name,
  label,
  type: 'array',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
})

export const ctasField = (name = 'ctas', label = 'CTAs'): ArrayField => ({
  name,
  label,
  type: 'array',
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'url', type: 'text', required: true, validate: validateSafeHref },
    {
      name: 'variant',
      type: 'select',
      options: ctaVariantOptions,
      required: true,
      defaultValue: 'primary',
    },
    {
      name: 'icon',
      type: 'select',
      options: ctaIconOptions,
      required: true,
      defaultValue: 'externalLink',
    },
  ],
})

const headingField = (defaultValue?: string): Field => ({
  name: 'heading',
  type: 'text',
  defaultValue,
})

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero Section', plural: 'Hero Sections' },
  fields: [
    { name: 'titlePrimary', type: 'text', required: true, defaultValue: 'JetDeck' },
    { name: 'titleSecondary', type: 'text', required: true, defaultValue: 'SCOUT' },
    { name: 'tagline', type: 'text', defaultValue: 'Smart Cyber Ops Utility Tool' },
    { name: 'subtagline', type: 'textarea' },
  ],
}

export const SingleImageBlock: Block = {
  slug: 'singleImage',
  labels: { singular: 'Single Image', plural: 'Single Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'constrainWidth',
      label: 'Constrain width',
      type: 'checkbox',
      defaultValue: false,
    },
    { name: 'caption', type: 'text' },
  ],
}

export const PhotoCarouselBlock: Block = {
  slug: 'photoCarousel',
  labels: { singular: 'Photo Carousel', plural: 'Photo Carousels' },
  fields: [
    mediaItemsField('images', 'Images'),
    { name: 'caption', type: 'text' },
    {
      name: 'constrainWidth',
      label: 'Constrain width',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}

export const CTABlock: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    ctasField(),
    {
      name: 'align',
      type: 'select',
      options: [
        { label: 'Center', value: 'center' },
        { label: 'Left', value: 'left' },
      ],
      defaultValue: 'center',
      required: true,
    },
  ],
}

export const TextBlock: Block = {
  slug: 'textBlock',
  labels: { singular: 'Text Block', plural: 'Text Blocks' },
  fields: [headingField(), paragraphsField()],
}

export const QuickStatsBlock: Block = {
  slug: 'quickStats',
  labels: { singular: 'Quick Stats', plural: 'Quick Stats' },
  fields: [
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'icon', type: 'select', options: iconOptions, required: true },
        { name: 'color', type: 'select', options: colorOptions, required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const DetailStatBlock: Block = {
  slug: 'detailStat',
  labels: { singular: 'Detail Stat', plural: 'Detail Stats' },
  fields: [
    { name: 'icon', type: 'select', options: iconOptions, defaultValue: 'Cpu' },
    { name: 'color', type: 'select', options: colorOptions, defaultValue: 'cyan' },
    paragraphsField('lines', 'Lines'),
  ],
}

export const SpecsTableBlock: Block = {
  slug: 'specsTable',
  labels: { singular: 'Specs Table', plural: 'Specs Tables' },
  fields: [
    headingField('Technical Specifications'),
    {
      name: 'tabs',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        {
          name: 'rows',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
  ],
}

export const CTAContainerBlock: Block = {
  slug: 'ctaContainer',
  labels: { singular: 'CTA Container', plural: 'CTA Containers' },
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Ready to Join the Revolution?' },
    paragraphsField(),
    ctasField(),
    { name: 'subtext', type: 'text' },
  ],
}

export const FooterBlock: Block = {
  slug: 'footer',
  labels: { singular: 'Footer', plural: 'Footers' },
  fields: [
    { name: 'line1', type: 'text', defaultValue: '> JetDeck SCOUT © 2026' },
    { name: 'line2', type: 'text', defaultValue: 'Built for hackers, makers, and dreamers.' },
    {
      name: 'columns',
      type: 'array',
      admin: { description: 'Optional sitemap-style footer link columns.' },
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

export const pageBlocks: Block[] = [
  HeroBlock,
  SingleImageBlock,
  PhotoCarouselBlock,
  CTABlock,
  TextBlock,
  QuickStatsBlock,
  DetailStatBlock,
  SpecsTableBlock,
  CTAContainerBlock,
  FooterBlock,
]
