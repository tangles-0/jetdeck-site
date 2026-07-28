import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

import { cn } from '@/components/ui/utils'

type RichTextContentProps = {
  content?: SerializedEditorState<SerializedLexicalNode> | null
  isKnowledgebase?: boolean
}

export const RichTextContent = ({ content, isKnowledgebase = false }: RichTextContentProps) => {
  if (!content?.root?.children?.length) {
    return null
  }

  return (
    <article
      className={cn(
        'min-w-0 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 leading-7 text-slate-300 backdrop-blur md:p-8',
        isKnowledgebase ? 'w-full' : 'mx-auto max-w-4xl',
      )}
    >
      <RichText
        data={content}
        disableContainer
        className={cn(
          'max-w-none',
          '[&_a]:text-cyan-300 [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-cyan-200',
          '[&_blockquote]:border-l-2 [&_blockquote]:border-cyan-500/60 [&_blockquote]:pl-4 [&_blockquote]:text-slate-400',
          '[&_code]:rounded [&_code]:border [&_code]:border-cyan-500/20 [&_code]:bg-slate-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-cyan-200',
          '[&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-orbitron [&_h2]:text-3xl [&_h2]:text-cyan-300',
          '[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-orbitron [&_h3]:text-2xl [&_h3]:text-blue-300',
          '[&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:font-mono [&_h4]:text-lg [&_h4]:text-slate-100',
          '[&_li]:my-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6',
          '[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-slate-800 [&_pre]:bg-slate-950 [&_pre]:p-4',
          '[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0',
          '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        )}
      />
    </article>
  )
}
