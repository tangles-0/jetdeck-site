/**
 * Seeds the CMS with the site's original content and images.
 *
 * Run with: pnpm seed
 * (requires DATABASE_URI and PAYLOAD_SECRET in .env or the environment;
 * if BLOB_READ_WRITE_TOKEN is set, images are uploaded straight to Vercel Blob)
 */
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

import config from '../src/payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.resolve(dirname, '../src/assets')

const KICKSTARTER_URL =
  'https://www.kickstarter.com/projects/jetdeck/jetdeck-scout-the-smart-cyber-ops-utility-tool'
const DISCORD_URL = 'https://discord.gg/nX8wnxfAyx'

const imageItems = (images: number[]) => images.map((image) => ({ image }))
const paragraphs = (items: string[]) => items.map((text) => ({ text }))

const run = async () => {
  const databaseUri = process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
  const isLocalDatabase =
    databaseUri.includes('localhost') ||
    databaseUri.includes('127.0.0.1') ||
    databaseUri.includes('host.docker.internal')

  if (!isLocalDatabase && !process.env.BLOB_READ_WRITE_TOKEN && process.env.ALLOW_LOCAL_MEDIA_WITH_REMOTE_DB !== 'true') {
    throw new Error(
      'Refusing to seed media into a remote database without BLOB_READ_WRITE_TOKEN. Add your Vercel Blob token or set ALLOW_LOCAL_MEDIA_WITH_REMOTE_DB=true to override.',
    )
  }

  const payload = await getPayload({ config })

  const existingHome = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    where: {
      path: {
        equals: '/',
      },
    },
  })

  if (existingHome.docs.length > 0 && process.env.FORCE_SEED !== 'true') {
    payload.logger.info('homepage already exists - skipping. Set FORCE_SEED=true to overwrite.')
    process.exit(0)
  }

  if (existingHome.docs[0] && process.env.FORCE_SEED === 'true') {
    await payload.delete({ collection: 'pages', id: existingHome.docs[0].id })
  }

  const uploadImage = async (filename: string, alt: string): Promise<number> => {
    const media = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.join(assetsDir, filename),
    })
    payload.logger.info(`uploaded ${filename} -> media ${media.id}`)
    return media.id
  }

  const animation = await uploadImage(
    'animation-1.gif',
    'an artistic video of the jetdeck scout with purple backlighting and a cyberpunk visualisation playing on the display',
  )

  const photoCarousel = [
    await uploadImage('IMG_6188 2.jpg', 'jetdeck scout on a desk looking resplendent'),
    await uploadImage('IMG_6193.jpg', 'jetdeck scout on a desk looking resplendent'),
    await uploadImage('IMG_6187 2.jpg', 'jetdeck scout on a desk looking resplendent'),
    await uploadImage('IMG_6153.jpg', 'jetdeck scout on a desk looking resplendent'),
    await uploadImage('IMG_6196.jpg', 'jetdeck scout on a desk looking resplendent'),
  ]

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      navBrandLabel: 'JetDeck SCOUT',
      navLinks: [
        { label: 'Kickstarter', url: KICKSTARTER_URL },
        { label: 'Discord', url: DISCORD_URL },
      ],
      footerLine1: '> JetDeck SCOUT © 2026',
      footerLine2: 'Built for hackers, makers, and dreamers.',
      footerColumns: [
        {
          title: 'Community',
          links: [
            { label: 'Kickstarter', url: KICKSTARTER_URL },
            { label: 'Discord', url: DISCORD_URL },
          ],
        },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      path: '/',
      showNavigation: false,
      showInNav: false,
      navOrder: 0,
      layout: [
        {
          blockType: 'hero',
          titlePrimary: 'JetDeck',
          titleSecondary: 'SCOUT',
          tagline: 'Smart Cyber Ops Utility Tool',
          subtagline:
            'The ultimate handheld Linux computer for hackers, makers, and mobile operations',
        },
        {
          blockType: 'singleImage',
          image: animation,
          constrainWidth: false,
        },
        {
          blockType: 'cta',
          ctas: [
            {
              label: 'Back on Kickstarter',
              url: KICKSTARTER_URL,
              variant: 'primary',
              icon: 'externalLink',
            },
            {
              label: 'Join Discord',
              url: DISCORD_URL,
              variant: 'primary',
              icon: 'discord',
            },
          ],
          align: 'center',
        },
        {
          blockType: 'quickStats',
          stats: [
            { icon: 'Antenna', color: 'cyan', value: 'LoRa', label: 'built-in mesh radio' },
            { icon: 'Battery', color: 'green', value: '10,000mAh', label: 'big battery for extended use' },
            { icon: 'Wifi', color: 'purple', value: 'WiFi 6', label: '+ BT 5' },
            { icon: 'Zap', color: 'yellow', value: 'USB-C PD', label: 'bi-directional charging' },
            { icon: 'Gpu', color: 'red', value: 'M.2 M + B', label: 'slots for NVMe and WWAN modules' },
            { icon: 'Heart', color: 'pink', value: 'Open Source', label: 'full CAD and source code' },
            { icon: 'Camera', color: 'orange', value: 'Camera', label: 'rear-facing 5MP auto-focus' },
            { icon: 'EthernetPort', color: 'blue', value: 'Ethernet', label: 'gigabit ethernet port' },
          ],
        },
        {
          blockType: 'detailStat',
          icon: 'Cpu',
          color: 'cyan',
          lines: paragraphs([
            'Compatible with:',
            'Raspberry Pi CM5, Bigtreetech CB2, Radxa CM3, OrangePi CM4',
            '...and more (TBC)',
          ]),
        },
        {
          blockType: 'textBlock',
          heading: 'What is the JetDeck SCOUT?',
          paragraphs: paragraphs([
            "The JetDeck SCOUT is a compact, portable cyberdeck designed for professionals and enthusiasts who need serious computing power on the go. Built around the powerful Raspberry Pi CM5, it's the perfect tool for penetration testing, mesh networking, IoT development, and retro gaming.",
            "With its integrated display, full QWERTY keyboard, gamepad controls, and extensive connectivity options, the SCOUT puts a complete Linux workstation in the palm of your hand. Whether you're debugging code in the field, running network diagnostics, connecting to mesh networks, or enjoying classic games, the SCOUT has you covered.",
            'The SCOUT features premium components including a high-quality audio DAC with 5W amplifier, NFC reader/writer, and NVMe SSD and WWAN 4G module support. The aluminum housing with integrated cooling ensures your device stays cool during intensive tasks, while the 8000mAh battery provides all-day runtime.',
          ]),
        },
        {
          blockType: 'cta',
          ctas: [
            {
              label: 'Now Live on Kickstarter',
              url: KICKSTARTER_URL,
              variant: 'secondary',
              icon: 'terminal',
            },
          ],
          align: 'center',
        },
        {
          blockType: 'photoCarousel',
          images: imageItems(photoCarousel),
          caption: "*engineering prototype shown, production unit may differ slightly (it'll be more betterer)",
          constrainWidth: true,
        },
        {
          blockType: 'specsTable',
          heading: 'Technical Specifications',
          tabs: [
            {
              label: 'Compute',
              title: 'Compute Core',
              rows: [
                {
                  label: 'Processor',
                  value: 'Raspberry Pi CM5 / CM4 (or compatible) (not included - optional add-on at purchase)',
                },
                { label: 'Cooling', value: 'Copper heat sink, aluminum rear housing, and integrated fan' },
                { label: 'Storage', value: 'EMMC or MicroSD card (depends on compute module)' },
                {
                  label: 'SSD / PCI-E',
                  value:
                    'NVMe SSD via M.2 M-key 2230/2245 slot - 1x lane PCI-e 2.0/3.0 when used with CM5 (availability depends on compute module)',
                },
                {
                  label: 'MicroSD',
                  value: 'TF / MicroSD card slot (usually not available if EMMC is present - check compute module specs)',
                },
                {
                  label: 'MCU',
                  value: 'onboard RP2040 MCU used for gamepad / touchscreen via USB, customisable via Arduino sketch',
                },
              ],
            },
            {
              label: 'Connectivity',
              title: 'Connectivity',
              rows: [
                { label: 'Display Output', value: 'Mini-HDMI 2.0' },
                { label: 'USB 3.0', value: '1x USB-C port 5Gbps, 1x USB-A port 5Gbps (CM5 only*)' },
                { label: 'USB 2.0', value: '4x ports (2x USB-C, 2x internal)' },
                { label: 'Ethernet', value: '10/100/1000 Mbps RJ45' },
                { label: 'Audio', value: '3.5mm headphone jack, S/PDIF out, 3.5mm line-in' },
                { label: 'Wireless', value: 'WiFi 6 / BT 5 (when used with wireless CM5 variant)' },
                { label: 'NFC', value: 'NFC reader / writer (TBC! see Kickstarter for details)' },
                { label: 'GPIO', value: '40-pin Raspberry Pi header (top edge) + internal breakouts' },
                { label: 'Infrared', value: '940nm TX/RX' },
                { label: 'MIPI', value: '2x 4-lane (camera and display)' },
                { label: 'WWAN', value: 'M.2 B-key for WWAN module + micro SIM slot' },
              ],
            },
            {
              label: 'Peripherals',
              title: 'Onboard Peripherals',
              rows: [
                { label: 'Display', value: '4.3" 800x480 QLED IPS display' },
                { label: 'Camera', value: '5MP 72-degree rear-facing with autofocus' },
                { label: 'Keyboard', value: 'Backlit full QWERTY (QMK firmware)' },
                {
                  label: 'Gamepad',
                  value: 'Hall-effect joystick + d-pad + 6 buttons + connections for 4 internal buttons',
                },
                { label: 'Audio', value: 'High-quality DAC, Class-D 5W amplifier' },
                { label: 'Speakers', value: 'High-quality stereo speakers' },
                { label: 'Volume Control', value: 'Tactile analog wheel' },
                { label: 'Torch', value: 'High brightness LED' },
              ],
            },
            {
              label: 'Power',
              title: 'Power & Charging',
              rows: [
                { label: 'Battery', value: '10,000mAh Li-ion' },
                { label: 'Charging', value: 'Bi-directional up to PD 15W' },
                { label: 'Accessory Power', value: '6 amp 5V and 3.3V rails' },
                { label: 'Included Cable', value: 'USB-C with voltage/amps/watts display' },
              ],
            },
            {
              label: 'Physical',
              title: 'Physical Specifications',
              rows: [
                { label: 'Dimensions', value: '120W x 175H x 18-22D mm (TBC)' },
                { label: 'Weight', value: '260g (TBC)' },
                { label: 'Included Accessories', value: 'USB-C cable, Philips screwdriver, Microfibre bag' },
              ],
            },
          ],
        },
        {
          blockType: 'textBlock',
          heading: 'About the Creator',
          paragraphs: paragraphs([
            "Hey there! I'm a hardware hacker and maker from Melbourne, Australia, with a passion for practical gadgets and open-source tech. I've set out to create a lovable yet powerful handheld linux computer that is both super functional and stylish. It boasts an aesthetic inspired by the Y2K 'clear craze', if it were dragged kicking and screaming by purple backlighting and military ruggedness into a cyberpunk future, where the streets are adorned with neon and one's tech is an expression of self. The JetDeck SCOUT is the culmination of years of experimenting with electronics, building janky robots, and chasing all manner of niche computing gadgets.",
            "SCOUT was brought into existence to be the device that can truly do it all. Gaming, administering a homelab, surfing the web, watching videos, or serving as a development platform for IoT projects and mesh networks... its capability is only as limited as your imagination. It is both highly practical, compact enough to be more than a toy, and cool enough to be a genuine pleasure to use :) I believe such a product can only be realised by putting aside the rapacious drive to maximise profit and monetisation that is pervasive in our society. SCOUT refuses to compromise in delivering comprehensive features and premium build quality in a package worthy of the tech it contains, and it does it while being fully open-source - from the firmware balancing the charge in the lithium cells to the KiCad schematics complete with PCBA part numbers. Imitation is the highest form of flattery, but nobody will be able to touch SCOUT, because SCOUT isn't about profit margins or quarterly reports, it's about the user experience and making sure the tech you buy belongs to you, forever.",
            'That\'s why this gadget is designed to be hackable, extensible, and community-driven. I\'m doing everything possible to accommodate all the weird and wonderful use-cases being tossed about on Discord, Reddit, and elsewhere, and it truly saddens me when I have to say "sorry, but that isn\'t feasible", which is why I\'m doing it as little possible. You\'re being equipped with the best of the best to make SCOUT into whatever you can imagine, and I can\'t wait to see what you build with it!',
            "If you're interested in supporting this project, please check out the Kickstarter campaign at the links on this page. Your backing will make an enormous difference in helping bring this vision to life and supports the ongoing development of open-source, hacker-oriented hardware.",
          ]),
        },
        {
          blockType: 'ctaContainer',
          title: 'Ready to Join the Revolution?',
          paragraphs: paragraphs([
            'Back the JetDeck SCOUT on Kickstarter today and be among the first to receive this powerful handheld Linux computer.',
          ]),
          ctas: [
            {
              label: 'Back on Kickstarter Now',
              url: KICKSTARTER_URL,
              variant: 'primary',
              icon: 'externalLink',
            },
          ],
          subtext: 'Starting at $275 AUD (excl. compute module)',
        },
      ],
    },
  })

  payload.logger.info('homepage seeded successfully')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
