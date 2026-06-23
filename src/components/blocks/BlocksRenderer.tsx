'use client'

import { Cpu } from 'lucide-react'

import type { Media } from '@/payload-types'

import { ProductCarousel } from '@/components/ProductCarousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isSafeHref } from '@/lib/cmsValidation'

import { CTAButtons } from './CTAButtons'
import { asMedia, iconColors, icons, toImages } from './blockUtils'

type ParagraphItem = { text: string; id?: string | null }
type CTAItem = {
  label: string
  url: string
  variant?: 'primary' | 'secondary' | null
  icon?: 'none' | 'externalLink' | 'discord' | 'terminal' | null
  id?: string | null
}

type BaseBlock = { id?: string | null; blockType?: string | null }

type PageBlock =
  | (BaseBlock & {
      blockType: 'hero'
      titlePrimary: string
      titleSecondary: string
      tagline?: string | null
      subtagline?: string | null
    })
  | (BaseBlock & {
      blockType: 'singleImage'
      image?: number | Media | null
      constrainWidth?: boolean | null
      caption?: string | null
    })
  | (BaseBlock & {
      blockType: 'photoCarousel'
      images?: { image: number | Media; id?: string | null }[] | null
      caption?: string | null
      constrainWidth?: boolean | null
    })
  | (BaseBlock & {
      blockType: 'cta'
      ctas?: CTAItem[] | null
      align?: 'left' | 'center' | null
    })
  | (BaseBlock & {
      blockType: 'textBlock'
      heading?: string | null
      paragraphs?: ParagraphItem[] | null
    })
  | (BaseBlock & {
      blockType: 'quickStats'
      stats?: { icon: string; color: string; value: string; label: string; id?: string | null }[] | null
    })
  | (BaseBlock & {
      blockType: 'detailStat'
      icon?: string | null
      color?: string | null
      lines?: ParagraphItem[] | null
    })
  | (BaseBlock & {
      blockType: 'specsTable'
      heading?: string | null
      tabs?: {
        label: string
        title: string
        rows?: { label: string; value: string; id?: string | null }[] | null
        id?: string | null
      }[] | null
    })
  | (BaseBlock & {
      blockType: 'ctaContainer'
      title: string
      paragraphs?: ParagraphItem[] | null
      ctas?: CTAItem[] | null
      subtext?: string | null
    })
  | (BaseBlock & {
      blockType: 'footer'
      line1?: string | null
      line2?: string | null
      columns?: {
        title: string
        links?: { label: string; url: string; id?: string | null }[] | null
        id?: string | null
      }[] | null
    })

const sectionHeading = (heading?: string | null) =>
  heading ? (
    <h2 className="text-3xl md:text-4xl font-orbitron mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
      &gt; {heading}
    </h2>
  ) : null

function HeroBlock({ block }: { block: Extract<PageBlock, { blockType: 'hero' }> }) {
  return (
    <section className="container mx-auto px-4 pt-12 md:pt-20 pb-4">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-black mb-4">
          <span className="text-cyan-300">{block.titlePrimary}</span>{' '}
          <span className="scout-scanline bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-600 bg-clip-text text-transparent">
            {block.titleSecondary}
          </span>
        </h1>
        {block.tagline && <p className="text-xl md:text-2xl text-slate-400 mb-2 font-mono">{block.tagline}</p>}
        {block.subtagline && <p className="text-lg text-slate-500 max-w-2xl mb-8">{block.subtagline}</p>}
      </div>
    </section>
  )
}

function SingleImageBlock({ block }: { block: Extract<PageBlock, { blockType: 'singleImage' }> }) {
  const image = asMedia(block.image)
  if (!image) return null

  return (
    <section className="container mx-auto px-4 py-4">
      <div className={`${block.constrainWidth ? 'max-w-3xl' : 'max-w-5xl'} mx-auto text-center`}>
        <img src={image.url ?? ''} alt={image.alt} className="mx-auto h-auto" />
        {block.caption && <div className="mt-4 text-center text-slate-500 italic">{block.caption}</div>}
      </div>
    </section>
  )
}

function PhotoCarouselBlock({ block }: { block: Extract<PageBlock, { blockType: 'photoCarousel' }> }) {
  const images = toImages(block.images)
  if (!images.length) return null

  return (
    <section className="container mx-auto px-4">
      <ProductCarousel images={images} constrainWidth={block.constrainWidth ?? true} />
      {block.caption && (
        <div className="max-w-4xl mx-auto mt-[-40px] mb-6 text-center text-slate-500 italic">{block.caption}</div>
      )}
    </section>
  )
}

function CTABlock({ block }: { block: Extract<PageBlock, { blockType: 'cta' }> }) {
  return (
    <section className="container mx-auto px-4 py-4">
      <CTAButtons ctas={block.ctas} align={block.align ?? 'center'} />
    </section>
  )
}

function TextBlock({ block }: { block: Extract<PageBlock, { blockType: 'textBlock' }> }) {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {sectionHeading(block.heading)}
        <div className="prose prose-invert prose-cyan max-w-none">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
            <CardContent className="p-8">
              {(block.paragraphs ?? []).map((paragraph, index, all) => (
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
      </div>
    </section>
  )
}

function QuickStatsBlock({ block }: { block: Extract<PageBlock, { blockType: 'quickStats' }> }) {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {(block.stats ?? []).map((stat, index) => {
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
    </section>
  )
}

function DetailStatBlock({ block }: { block: Extract<PageBlock, { blockType: 'detailStat' }> }) {
  const Icon = icons[block.icon ?? 'Cpu'] ?? Cpu
  const color = iconColors[block.color ?? 'cyan'] ?? iconColors.cyan

  return (
    <section className="container mx-auto px-4 pb-8">
      <div className="prose prose-invert prose-cyan max-w-4xl mx-auto">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur max-w-4xl">
          <CardContent className="p-6 text-center">
            <Icon className={`size-8 ${color} mx-auto mb-2`} />
            {(block.lines ?? []).map((line, index) => (
              <div key={line.id ?? index} className="text-sm text-slate-500">
                {line.text}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function SpecsTableBlock({ block }: { block: Extract<PageBlock, { blockType: 'specsTable' }> }) {
  if (!block.tabs?.length) return null

  return (
    <section className="container mx-auto px-4 py-12 md:py-20 mb-12 bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        {sectionHeading(block.heading)}

        <Tabs defaultValue="tab-0" className="w-full">
          <TabsList className="w-full bg-slate-900/50 mb-8 flex flex-wrap md:grid md:grid-cols-5 h-auto gap-2 p-2">
            {block.tabs.map((tab, index) => (
              <TabsTrigger
                key={tab.id ?? index}
                value={`tab-${index}`}
                className="data-[state=inactive]:bg-slate-800/50 data-[state=inactive]:text-slate-200 flex-1 min-w-[calc(50%-0.25rem)] md:min-w-0"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {block.tabs.map((tab, index) => (
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
  )
}

function CTAContainerBlock({ block }: { block: Extract<PageBlock, { blockType: 'ctaContainer' }> }) {
  return (
    <section className="container mx-auto px-4 py-12 md:pb-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-4 md:p-12">
          <h2 className="text-3xl md:text-4xl font-orbitron mb-4 text-cyan-400">{block.title}</h2>
          {(block.paragraphs ?? []).map((paragraph, index) => (
            <p key={paragraph.id ?? index} className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              {paragraph.text}
            </p>
          ))}
          <CTAButtons ctas={block.ctas} />
          {block.subtext && <p className="text-sm text-slate-500 mt-4">{block.subtext}</p>}
        </div>
      </div>
    </section>
  )
}

function FooterBlock({ block }: { block: Extract<PageBlock, { blockType: 'footer' }> }) {
  const columns = block.columns ?? []

  return (
    <footer className="border-t border-slate-800 py-8">
      <div className="container mx-auto px-4">
        {columns.length > 0 && (
          <div className="grid gap-8 md:grid-cols-3 mb-8 text-sm">
            {columns.map((column, index) => (
              <div key={column.id ?? index}>
                <h3 className="font-mono text-cyan-400 mb-3">{column.title}</h3>
                <div className="flex flex-col gap-2">
                  {(column.links ?? [])
                    .filter((link) => isSafeHref(link.url))
                    .map((link, linkIndex) => {
                      const isExternal = !link.url.startsWith('/')

                      return (
                        <a
                          key={link.id ?? linkIndex}
                          href={link.url}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          className="text-slate-500 hover:text-cyan-300 transition-colors"
                        >
                          {link.label}
                        </a>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center text-slate-500 font-mono text-sm">
          {block.line1 && <p>{block.line1}</p>}
          {block.line2 && <p className="mt-2">{block.line2}</p>}
        </div>
      </div>
    </footer>
  )
}

export function BlocksRenderer({ blocks }: { blocks?: PageBlock[] | null }) {
  if (!blocks?.length) return null

  return blocks.map((block, index) => {
    const key = block.id ?? `${block.blockType}-${index}`

    switch (block.blockType) {
      case 'hero':
        return <HeroBlock key={key} block={block} />
      case 'singleImage':
        return <SingleImageBlock key={key} block={block} />
      case 'photoCarousel':
        return <PhotoCarouselBlock key={key} block={block} />
      case 'cta':
        return <CTABlock key={key} block={block} />
      case 'textBlock':
        return <TextBlock key={key} block={block} />
      case 'quickStats':
        return <QuickStatsBlock key={key} block={block} />
      case 'detailStat':
        return <DetailStatBlock key={key} block={block} />
      case 'specsTable':
        return <SpecsTableBlock key={key} block={block} />
      case 'ctaContainer':
        return <CTAContainerBlock key={key} block={block} />
      case 'footer':
        return <FooterBlock key={key} block={block} />
      default:
        return null
    }
  })
}
