'use client'

import { Cpu } from 'lucide-react'

import type { Page } from '@/payload-types'

import { FileEmbed } from '@/components/blocks/FileEmbed'
import { ProductCarousel } from '@/components/ProductCarousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KnowledgebaseIndex } from '@/components/knowledgebase/KnowledgebaseIndex'
import type { KnowledgebasePage } from '@/components/knowledgebase/knowledgebaseTree'

import { CTAButtons } from './CTAButtons'
import { asMedia, iconColors, icons, toImages } from './blockUtils'
import { RichTextContent } from './RichTextContent'

type PageBlock = Page['layout'][number]
type PageLayoutVariant = 'default' | 'knowledgebase'

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

function RichTextBlock({
  block,
  variant,
}: {
  block: Extract<PageBlock, { blockType: 'richText' }>
  variant: PageLayoutVariant
}) {
  return (
    <section className={variant === 'knowledgebase' ? 'py-4' : 'container mx-auto px-4 py-12 md:py-20'}>
      <RichTextContent content={block.content} isKnowledgebase={variant === 'knowledgebase'} />
    </section>
  )
}

function KnowledgebaseIndexBlock({
  block,
  currentPath,
  knowledgebasePages,
}: {
  block: Extract<PageBlock, { blockType: 'knowledgebaseIndex' }>
  currentPath?: string | null
  knowledgebasePages?: KnowledgebasePage[] | null
}) {
  return (
    <KnowledgebaseIndex
      pages={knowledgebasePages}
      currentPath={currentPath}
      variant={block.variant ?? 'standalone'}
      heading={block.heading}
      intro={block.intro}
      className={block.variant === 'sidebar' ? 'mx-auto w-full max-w-md px-4 py-6' : undefined}
    />
  )
}

function FileDownloadBlock({
  block,
  variant,
}: {
  block: Extract<PageBlock, { blockType: 'fileDownload' }>
  variant: PageLayoutVariant
}) {
  return (
    <section className={variant === 'knowledgebase' ? 'py-4' : 'container mx-auto px-4 py-6'}>
      <FileEmbed url={block.url} description={block.description} />
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

export function BlocksRenderer({
  blocks,
  currentPath,
  knowledgebasePages,
  variant = 'default',
}: {
  blocks?: PageBlock[] | null
  currentPath?: string | null
  knowledgebasePages?: KnowledgebasePage[] | null
  variant?: PageLayoutVariant
}) {
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
      case 'richText':
        return <RichTextBlock key={key} block={block} variant={variant} />
      case 'knowledgebaseIndex':
        return (
          <KnowledgebaseIndexBlock
            key={key}
            block={block}
            currentPath={currentPath}
            knowledgebasePages={knowledgebasePages}
          />
        )
      case 'fileDownload':
        return <FileDownloadBlock key={key} block={block} variant={variant} />
      case 'quickStats':
        return <QuickStatsBlock key={key} block={block} />
      case 'detailStat':
        return <DetailStatBlock key={key} block={block} />
      case 'specsTable':
        return <SpecsTableBlock key={key} block={block} />
      case 'ctaContainer':
        return <CTAContainerBlock key={key} block={block} />
      default:
        return null
    }
  })
}
