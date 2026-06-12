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

const run = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.findGlobal({ slug: 'site-content', depth: 0 })
  if ((existing.stats?.length ?? 0) > 0 && process.env.FORCE_SEED !== 'true') {
    payload.logger.info('site-content already has data - skipping. Set FORCE_SEED=true to overwrite.')
    process.exit(0)
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

  const animation = await uploadImage('animation-1.gif', 'JetDeck SCOUT - Animation')

  const photoCarousel = [
    await uploadImage('IMG_6188 2.jpg', 'JetDeck SCOUT - Photo 1'),
    await uploadImage('IMG_6193.jpg', 'JetDeck SCOUT - Photo 2'),
    await uploadImage('IMG_6187 2.jpg', 'JetDeck SCOUT - Photo 3'),
    await uploadImage('IMG_6153.jpg', 'JetDeck SCOUT - Photo 4'),
    await uploadImage('IMG_6196.jpg', 'JetDeck SCOUT - Photo 5'),
  ]

  const resinCarousel = [
    await uploadImage('P1090600.JPG', 'JetDeck SCOUT - Resin Front View'),
    await uploadImage('P1090597.JPG', 'JetDeck SCOUT - Resin Side View'),
    await uploadImage('P1090601.JPG', 'JetDeck SCOUT - Resin Side View'),
    await uploadImage('P1090603.JPG', 'JetDeck SCOUT - Resin Side View'),
    await uploadImage('P1090607.JPG', 'JetDeck SCOUT - Resin Side View'),
    await uploadImage('P1090593.png', 'JetDeck SCOUT - Resin Side View'),
  ]

  const pcbCarousel = [
    await uploadImage('P1090588.JPG', 'JetDeck SCOUT - PCB Back View'),
    await uploadImage('P1090589.JPG', 'JetDeck SCOUT - PCB Front View'),
  ]

  await payload.updateGlobal({
    slug: 'site-content',
    data: {
      heroTitlePrimary: 'JetDeck',
      heroTitleSecondary: 'SCOUT',
      heroTagline: 'Smart Cyber Ops Utility Tool',
      heroSubTagline:
        'The ultimate handheld Linux computer for hackers, makers, and mobile operations',
      heroAnimation: animation,
      kickstarterLabel: 'Back on Kickstarter',
      kickstarterUrl: KICKSTARTER_URL,
      discordLabel: 'Join Discord',
      discordUrl: DISCORD_URL,
      stats: [
        { icon: 'Antenna', color: 'cyan', value: 'LoRa', label: 'built-in LoRa radio' },
        { icon: 'Battery', color: 'green', value: '10,000mAh', label: 'Battery' },
        { icon: 'Wifi', color: 'purple', value: 'WiFi 6', label: '+ BT 5' },
        { icon: 'Zap', color: 'yellow', value: 'USB-C PD', label: 'bi-directional charging' },
        { icon: 'Gpu', color: 'red', value: 'M.2 M + B', label: 'slots for NVMe and WWAN modules' },
        { icon: 'Heart', color: 'pink', value: 'Open Source', label: 'full CAD and source code' },
        { icon: 'Camera', color: 'orange', value: 'Camera', label: 'rear-facing 5MP autofocus' },
        { icon: 'EthernetPort', color: 'blue', value: 'Ethernet', label: 'Gigabit ethernet port' },
      ],
      computeNote: {
        icon: 'Cpu',
        lines: [
          { text: 'Compatible with Raspberry Pi Compute Module 5' },
          { text: 'Supports CM4 3rd party alternatives' },
        ],
      },
      whatIsHeading: 'What is the JetDeck SCOUT?',
      whatIsParagraphs: [
        {
          text: "The JetDeck SCOUT is a compact, portable cyberdeck designed for professionals and enthusiasts who need serious computing power on the go. Built around the powerful Raspberry Pi CM5, it's the perfect tool for penetration testing, mesh networking, IoT development, and retro gaming.",
        },
        {
          text: "With its integrated display, full QWERTY keyboard, gamepad controls, and extensive connectivity options, the SCOUT puts a complete Linux workstation in the palm of your hand. Whether you're debugging code in the field, running network diagnostics, connecting to mesh networks, or enjoying classic games, the SCOUT has you covered.",
        },
        {
          text: 'The SCOUT features premium components including a high-quality audio DAC with 5W amplifier, NFC reader/writer, and NVMe SSD and WWAN 4G module support. The aluminum housing with integrated cooling ensures your device stays cool during intensive tasks, while the 8000mAh battery provides all-day runtime.',
        },
      ],
      badgeText: 'Now Live on Kickstarter',
      badgeUrl: KICKSTARTER_URL,
      photoCarousel: photoCarousel.map((image) => ({ image })),
      photoCaption: '*prototype designs shown',
      resinCarousel: resinCarousel.map((image) => ({ image })),
      specsHeading: 'Technical Specifications',
      specTabs: [
        {
          label: 'Compute',
          title: 'Compute Core',
          rows: [
            { label: 'Processor', value: 'Raspberry Pi CM5 (CM4 compatible*)' },
            { label: 'Cooling', value: 'Copper heat sink, aluminum rear housing, and integrated fan' },
            {
              label: 'Storage',
              value: 'Optional EMMC (depends on compute module variant), 2230/2245 NVMe SSD',
            },
            { label: 'MicroSD', value: 'TF / MicroSD card slot' },
            { label: 'MCU', value: 'RP2040 MCU' },
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
            { label: 'Wireless', value: 'WiFi 6 / BT 5 (when used with wireless CM variant)' },
            { label: 'NFC', value: 'NFC reader / writer (TBC! see Kickstarter for details)' },
            { label: 'GPIO', value: '40-pin Raspberry Pi header (top edge) + internal breakouts' },
            { label: 'Infrared', value: '940nm TX/RX' },
            { label: 'MIPI', value: '2x 4-lane (camera and display)' },
            { label: 'Optional 4G/LTE', value: 'M.2 B-key for WWAN module + micro SIM slot' },
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
      pcbCarousel: pcbCarousel.map((image) => ({ image })),
      aboutHeading: 'About the Creator',
      aboutParagraphs: [
        {
          text: "Hey there! I'm a hardware hacker and maker with a passion for the Cyberpunk aesthetic and open-source tech. I've set out to create a portable, powerful handheld linux computer that is both functional and stylish. The JetDeck SCOUT is the culmination of years of tinkering with cyberdecks, embedded systems, and mobile computing platforms.",
        },
        {
          text: 'I built the SCOUT because I wanted a device that could truly do it all – from administering my homelab, to casual web browsing and media consumption, to serving as a development platform for IoT projects and mesh networks. I know how important it is to have tools that are both practical and cool :)',
        },
        {
          text: "This gadget is designed to be hackable, extensible, and community-driven. I can't wait to see what you build with the SCOUT! If you're interested in supporting this project, please check out the Kickstarter campaign. Your backing will help bring this vision to life and supports the ongoing development of open-source, hacker-oriented hardware.",
        },
      ],
      ctaHeading: 'Ready to Join the Revolution?',
      ctaText:
        'Back the JetDeck SCOUT on Kickstarter today and be among the first to receive this powerful handheld Linux computer.',
      ctaButtonLabel: 'Back on Kickstarter Now',
      ctaButtonUrl: KICKSTARTER_URL,
      ctaPriceNote: 'Starting at $275 AUD (excl. CM5)',
      footerLine1: '> JetDeck SCOUT © 2026',
      footerLine2: 'Built for hackers, makers, and dreamers.',
    },
  })

  payload.logger.info('site-content seeded successfully')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
