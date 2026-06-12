import type { ArrayField, GlobalConfig } from 'payload'

import { revalidateHome } from '../hooks/revalidateHome'

const iconOptions = [
  'Antenna',
  'Battery',
  'Bluetooth',
  'Camera',
  'Cpu',
  'EthernetPort',
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

const colorOptions = [
  { label: 'Cyan', value: 'cyan' },
  { label: 'Blue', value: 'blue' },
  { label: 'Purple', value: 'purple' },
  { label: 'Green', value: 'green' },
  { label: 'Yellow', value: 'yellow' },
  { label: 'Orange', value: 'orange' },
  { label: 'Red', value: 'red' },
  { label: 'Pink', value: 'pink' },
]

/** Array of textarea paragraphs, used by a few sections */
const paragraphsField = (name: string, label: string): ArrayField => ({
  name,
  label,
  type: 'array',
  fields: [{ name: 'text', type: 'textarea', required: true }],
})

/** Array of media uploads, used by the carousels */
const carouselField = (name: string, label: string, description?: string): ArrayField => ({
  name,
  label,
  type: 'array',
  admin: { description },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
})

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  label: 'Site Content',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateHome],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'heroTitlePrimary', type: 'text', required: true, defaultValue: 'JetDeck' },
            { name: 'heroTitleSecondary', type: 'text', required: true, defaultValue: 'SCOUT' },
            { name: 'heroTagline', type: 'text', defaultValue: 'Smart Cyber Ops Utility Tool' },
            { name: 'heroSubTagline', type: 'textarea' },
            {
              name: 'heroAnimation',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'The animated GIF / image shown under the title' },
            },
            { name: 'kickstarterLabel', type: 'text', defaultValue: 'Back on Kickstarter' },
            { name: 'kickstarterUrl', type: 'text' },
            { name: 'discordLabel', type: 'text', defaultValue: 'Join Discord' },
            { name: 'discordUrl', type: 'text' },
          ],
        },
        {
          label: 'Quick Stats',
          fields: [
            {
              name: 'stats',
              type: 'array',
              admin: { description: 'The grid of stat cards under the hero' },
              fields: [
                { name: 'icon', type: 'select', options: iconOptions, required: true },
                { name: 'color', type: 'select', options: colorOptions, required: true },
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
            {
              name: 'computeNote',
              type: 'group',
              admin: { description: 'The wide card under the stats grid (CM5 compatibility note)' },
              fields: [
                { name: 'icon', type: 'select', options: iconOptions, defaultValue: 'Cpu' },
                paragraphsField('lines', 'Lines'),
              ],
            },
          ],
        },
        {
          label: 'What Is It',
          fields: [
            { name: 'whatIsHeading', type: 'text', defaultValue: 'What is the JetDeck SCOUT?' },
            paragraphsField('whatIsParagraphs', 'Paragraphs'),
            { name: 'badgeText', type: 'text', defaultValue: 'Now Live on Kickstarter' },
            { name: 'badgeUrl', type: 'text' },
            carouselField('photoCarousel', 'Photo Carousel', 'First carousel (lifestyle photos)'),
            { name: 'photoCaption', type: 'text', defaultValue: '*prototype designs shown' },
            carouselField('resinCarousel', 'Second Carousel', 'Second, full-width carousel'),
          ],
        },
        {
          label: 'Tech Specs',
          fields: [
            { name: 'specsHeading', type: 'text', defaultValue: 'Technical Specifications' },
            {
              name: 'specTabs',
              type: 'array',
              admin: { description: 'One entry per tab in the specs section' },
              fields: [
                { name: 'label', type: 'text', required: true, admin: { description: 'Tab button label' } },
                { name: 'title', type: 'text', required: true, admin: { description: 'Card title inside the tab' } },
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
        },
        {
          label: 'About',
          fields: [
            carouselField('pcbCarousel', 'PCB Carousel', 'Carousel shown above the about section'),
            { name: 'aboutHeading', type: 'text', defaultValue: 'About the Creator' },
            paragraphsField('aboutParagraphs', 'Paragraphs'),
          ],
        },
        {
          label: 'CTA & Footer',
          fields: [
            { name: 'ctaHeading', type: 'text', defaultValue: 'Ready to Join the Revolution?' },
            { name: 'ctaText', type: 'textarea' },
            { name: 'ctaButtonLabel', type: 'text', defaultValue: 'Back on Kickstarter Now' },
            { name: 'ctaButtonUrl', type: 'text' },
            { name: 'ctaPriceNote', type: 'text' },
            { name: 'footerLine1', type: 'text', defaultValue: '> JetDeck SCOUT © 2026' },
            { name: 'footerLine2', type: 'text', defaultValue: 'Built for hackers, makers, and dreamers.' },
          ],
        },
      ],
    },
  ],
}
