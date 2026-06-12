'use client'

import {
  Antenna,
  Battery,
  Bluetooth,
  Camera,
  Cpu,
  EthernetPort,
  ExternalLink,
  Gamepad2,
  Gpu,
  HardDrive,
  Heart,
  Keyboard,
  MemoryStick,
  Radio,
  Terminal,
  Usb,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'

import type { Media, SiteContent } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ProductCarousel } from './ProductCarousel'

const icons: Record<string, LucideIcon> = {
  Antenna,
  Battery,
  Bluetooth,
  Camera,
  Cpu,
  EthernetPort,
  Gamepad2,
  Gpu,
  HardDrive,
  Heart,
  Keyboard,
  MemoryStick,
  Radio,
  Terminal,
  Usb,
  Wifi,
  Zap,
}

const iconColors: Record<string, string> = {
  cyan: 'text-cyan-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  red: 'text-red-400',
  pink: 'text-pink-400',
}

const asMedia = (value: number | Media | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null

const toImages = (
  items: { image: number | Media }[] | null | undefined,
): { src: string; alt: string }[] =>
  (items ?? [])
    .map((item) => asMedia(item.image))
    .filter((media): media is Media => media !== null)
    .map((media) => ({ src: media.url ?? '', alt: media.alt ?? '' }))

export function HomePage({ content }: { content: SiteContent }) {
  const heroAnimation = asMedia(content.heroAnimation)
  const photoImages = toImages(content.photoCarousel)
  const resinImages = toImages(content.resinCarousel)
  const pcbImages = toImages(content.pcbCarousel)
  const kickstarterUrl = content.kickstarterUrl || '#'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Content */}
      <div className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-black mb-4">
              <span className="text-cyan-300">{content.heroTitlePrimary}</span>{' '}
              <span className="scout-scanline bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-600 bg-clip-text text-transparent">
                {content.heroTitleSecondary}
              </span>
            </h1>
            {content.heroTagline && (
              <p className="text-xl md:text-2xl text-slate-400 mb-2 font-mono">{content.heroTagline}</p>
            )}
            {content.heroSubTagline && (
              <p className="text-lg text-slate-500 max-w-2xl mb-8">{content.heroSubTagline}</p>
            )}
            {heroAnimation && (
              <div className="flex justify-center w-full pt-4">
                <img src={heroAnimation.url ?? ''} alt={heroAnimation.alt} className="mb-16" />
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
                asChild
              >
                <a href={kickstarterUrl} target="_blank" rel="noopener noreferrer">
                  {content.kickstarterLabel}
                  <ExternalLink className="ml-2 size-5" />
                </a>
              </Button>
              {content.discordUrl && (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
                  asChild
                >
                  <a href={content.discordUrl} target="_blank" rel="noopener noreferrer">
                    {content.discordLabel}
                    <img src="/discord.png" alt="Discord" className="size-8" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {(content.stats ?? []).map((stat, index) => {
              const Icon = icons[stat.icon] ?? Cpu
              const color = iconColors[stat.color] ?? iconColors.cyan
              return (
                <Card key={stat.id ?? index} className="bg-slate-900/50 border-slate-800 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <Icon className={`size-8 ${color} mx-auto mb-2`} />
                    <div className={`text-2xl font-mono ${color}`}>{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {(content.computeNote?.lines?.length ?? 0) > 0 && (
            <div className="prose prose-invert prose-cyan max-w-4xl mx-auto mt-4">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur max-w-4xl ">
                <CardContent className="p-6 text-center">
                  {(() => {
                    const Icon = icons[content.computeNote?.icon ?? 'Cpu'] ?? Cpu
                    return <Icon className="size-8 text-cyan-400 mx-auto mb-2" />
                  })()}
                  {(content.computeNote?.lines ?? []).map((line, index) => (
                    <div key={line.id ?? index} className="text-sm text-slate-500">
                      {line.text}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </section>

        {/* Description Section */}
        <section className="container mx-auto px-4 ">
          <div className="max-w-4xl mx-auto pb-12 md:pb-20">
            <h2 className="text-3xl md:text-4xl font-orbitron mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              &gt; {content.whatIsHeading}
            </h2>
            <div className="prose prose-invert prose-cyan max-w-none">
              <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                <CardContent className="p-8">
                  {(content.whatIsParagraphs ?? []).map((paragraph, index, all) => (
                    <p
                      key={paragraph.id ?? index}
                      className={`text-lg text-slate-300 leading-relaxed${index < all.length - 1 ? ' mb-4' : ''}`}
                    >
                      {paragraph.text}
                    </p>
                  ))}
                  {content.badgeText && (
                    <div className="flex justify-center w-full pt-4">
                      <div
                        className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6"
                        onClick={() => window.open(content.badgeUrl || kickstarterUrl, '_blank')}
                      >
                        <Terminal className="size-4" />
                        <span>{content.badgeText}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {photoImages.length > 0 && <ProductCarousel images={photoImages} constrainWidth={true} />}
          {content.photoCaption && (
            <div className="max-w-4xl mx-auto mt-[-40px] mb-6 text-center text-slate-500 italic">
              {content.photoCaption}
            </div>
          )}
          {resinImages.length > 0 && <ProductCarousel images={resinImages} />}
        </section>

        {/* Technical Specs Section */}
        {(content.specTabs?.length ?? 0) > 0 && (
          <section className="container mx-auto px-4 py-12 md:py-20 mb-12 bg-slate-950/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-orbitron mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                &gt; {content.specsHeading}
              </h2>

              <Tabs defaultValue="tab-0" className="w-full">
                <TabsList className="w-full bg-slate-900/50 mb-8 flex flex-wrap md:grid md:grid-cols-5 h-auto gap-2 p-2">
                  {(content.specTabs ?? []).map((tab, index) => (
                    <TabsTrigger
                      key={tab.id ?? index}
                      value={`tab-${index}`}
                      className="data-[state=inactive]:bg-slate-800/50 data-[state=inactive]:text-slate-200 flex-1 min-w-[calc(50%-0.25rem)] md:min-w-0"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {(content.specTabs ?? []).map((tab, index) => (
                  <TabsContent key={tab.id ?? index} value={`tab-${index}`}>
                    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                      <CardHeader>
                        <CardTitle className="text-cyan-400 font-mono">{tab.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="font-mono text-sm">
                        <table className="w-full border-collapse">
                          <tbody className="divide-y divide-slate-800">
                            {(tab.rows ?? []).map((row, rowIndex) => (
                              <tr key={row.id ?? rowIndex}>
                                <td className="py-2 pr-4 text-slate-400 w-1/3">{row.label}</td>
                                <td className="py-2 pl-4 text-slate-200">{row.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </section>
        )}

        {/* About Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          {pcbImages.length > 0 && <ProductCarousel images={pcbImages} noEffect />}

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-orbitron mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              &gt; {content.aboutHeading}
            </h2>
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardContent className="p-8">
                {(content.aboutParagraphs ?? []).map((paragraph, index, all) => (
                  <p
                    key={paragraph.id ?? index}
                    className={`text-lg text-slate-300 leading-relaxed${index < all.length - 1 ? ' mb-4' : ''}`}
                  >
                    {paragraph.text}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12 md:pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-4 md:p-12">
              <h2 className="text-3xl md:text-4xl font-orbitron mb-4 text-cyan-400">{content.ctaHeading}</h2>
              {content.ctaText && (
                <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">{content.ctaText}</p>
              )}
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
                asChild
              >
                <a
                  href={content.ctaButtonUrl || kickstarterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-normal"
                >
                  {content.ctaButtonLabel}
                  <ExternalLink className="ml-2 size-5" />
                </a>
              </Button>
              {content.ctaPriceNote && <p className="text-sm text-slate-500 mt-4">{content.ctaPriceNote}</p>}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-8">
          <div className="container mx-auto px-4 text-center text-slate-500 font-mono text-sm">
            {content.footerLine1 && <p>{content.footerLine1}</p>}
            {content.footerLine2 && <p className="mt-2">{content.footerLine2}</p>}
          </div>
        </footer>
      </div>
    </div>
  )
}
