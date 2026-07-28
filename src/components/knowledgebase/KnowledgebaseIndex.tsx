import Link from 'next/link'

import { ArrowLeft, BookOpen, ChevronDown, FileText } from 'lucide-react'

import { cn } from '@/components/ui/utils'

import { buildKnowledgebaseTree, type KnowledgebasePage, type KnowledgebaseTreeItem } from './knowledgebaseTree'

type KnowledgebaseIndexProps = {
  pages?: KnowledgebasePage[] | null
  currentPath?: string | null
  variant?: 'standalone' | 'sidebar' | null
  heading?: string | null
  intro?: string | null
  className?: string
}

const itemLabel = (item: KnowledgebaseTreeItem) => item.knowledgebaseLabel ?? item.title

const renderTree = ({
  currentPath,
  items,
  level = 0,
  variant,
}: {
  currentPath?: string | null
  items: KnowledgebaseTreeItem[]
  level?: number
  variant: 'standalone' | 'sidebar'
}) => (
  <ul className={cn(variant === 'standalone' ? 'grid gap-3' : 'space-y-1')}>
    {items.map(item => {
      const hasChildren = item.children.length > 0
      const isCurrent = item.resolvedPath === currentPath
      const Icon = hasChildren ? BookOpen : FileText
      const itemContent = (
        <>
          <Icon className="mt-0.5 size-4 shrink-0 text-cyan-400" />
          <span className="min-w-0">
            <span className="block font-mono">{itemLabel(item)}</span>
            {variant === 'standalone' && item.knowledgebaseDescription ? (
              <span className="mt-2 block text-sm leading-6 text-slate-500">{item.knowledgebaseDescription}</span>
            ) : null}
          </span>
        </>
      )

      return (
        <li key={item.id}>
          {item.resolvedPath ? (
            <Link
              href={item.resolvedPath}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                'group flex gap-3 rounded-xl border transition-colors',
                variant === 'standalone'
                  ? 'border-slate-800 bg-slate-950/60 p-4 hover:border-cyan-500/50 hover:bg-cyan-500/5'
                  : 'border-transparent px-3 py-2 text-sm hover:bg-cyan-500/10',
                isCurrent ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200' : 'text-slate-300',
              )}
              style={variant === 'sidebar' ? { paddingLeft: `${0.75 + level * 0.75}rem` } : undefined}
            >
              {itemContent}
            </Link>
          ) : (
            <div
              className={cn(
                'flex gap-3 rounded-xl border border-slate-800 text-slate-500',
                variant === 'standalone' ? 'bg-slate-950/60 p-4' : 'px-3 py-2 text-sm',
              )}
              style={variant === 'sidebar' ? { paddingLeft: `${0.75 + level * 0.75}rem` } : undefined}
            >
              {itemContent}
            </div>
          )}

          {hasChildren ? (
            <div className={cn(variant === 'standalone' ? 'mt-3 border-l border-slate-800 pl-4' : 'mt-1')}>
              {renderTree({ currentPath, items: item.children, level: level + 1, variant })}
            </div>
          ) : null}
        </li>
      )
    })}
  </ul>
)

export const KnowledgebaseIndex = ({
  pages,
  currentPath,
  variant = 'standalone',
  heading = 'Knowledgebase',
  intro,
  className,
}: KnowledgebaseIndexProps) => {
  const tree = buildKnowledgebaseTree(pages ?? [])
  const resolvedVariant = variant ?? 'standalone'

  const content =
    tree.length > 0 ? (
      renderTree({ currentPath, items: tree, variant: resolvedVariant })
    ) : (
      <p className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-500">
        No knowledgebase pages have been published yet.
      </p>
    )

  if (resolvedVariant === 'sidebar') {
    return (
      <aside className={cn('space-y-3 lg:sticky lg:top-6 lg:self-start', className)}>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 font-mono text-sm text-slate-300 backdrop-blur transition-colors hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-200"
        >
          <ArrowLeft className="size-4 text-cyan-400" />
          Back to site
        </Link>
        <details
          open
          className="group rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-mono text-sm text-cyan-300 [&::-webkit-details-marker]:hidden">
            <span>{heading}</span>
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-slate-800 p-2">{content}</div>
        </details>
      </aside>
    )
  }

  return (
    <section className={cn('mx-auto w-full max-w-6xl px-4 py-10 md:py-16', className)}>
      <div className="mb-8">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-cyan-400">Knowledgebase</p>
        <h1 className="mt-3 font-orbitron text-4xl font-bold text-slate-100 md:text-5xl">{heading}</h1>
        {intro ? <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">{intro}</p> : null}
      </div>
      {content}
    </section>
  )
}
