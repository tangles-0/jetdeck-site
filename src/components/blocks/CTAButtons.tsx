'use client'

import { ExternalLink, Terminal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { isSafeHref } from '@/lib/cmsValidation'

type CTA = {
  label: string
  url: string
  variant?: 'primary' | 'secondary' | null
  icon?: 'none' | 'externalLink' | 'discord' | 'terminal' | null
  id?: string | null
}

const CTAIcon = ({ icon }: { icon?: CTA['icon'] }) => {
  if (icon === 'discord') {
    return <img src="/discord.png" alt="Discord" className="size-8" />
  }

  if (icon === 'terminal') {
    return <Terminal className="size-4" />
  }

  if (icon === 'externalLink') {
    return <ExternalLink className="ml-2 size-5" />
  }

  return null
}

export function CTAButtons({ ctas, align = 'center' }: { ctas?: CTA[] | null; align?: 'left' | 'center' }) {
  const safeCtas = (ctas ?? []).filter((cta) => isSafeHref(cta.url))

  if (!safeCtas.length) return null

  return (
    <div className={`flex flex-col md:flex-row gap-6 ${align === 'center' ? 'justify-center' : ''}`}>
      {safeCtas.map((cta, index) =>
        cta.variant === 'secondary' ? (
          <a
            key={cta.id ?? index}
            href={cta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6"
          >
            <CTAIcon icon={cta.icon} />
            <span>{cta.label}</span>
          </a>
        ) : (
          <Button
            key={cta.id ?? index}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
            asChild
          >
            <a href={cta.url} target="_blank" rel="noopener noreferrer" className="whitespace-normal">
              {cta.label}
              <CTAIcon icon={cta.icon} />
            </a>
          </Button>
        ),
      )}
    </div>
  )
}
