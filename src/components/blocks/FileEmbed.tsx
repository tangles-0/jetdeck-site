import { Archive, Download, File, FileImage, FileText, FileVideo, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { isSafeHref } from '@/lib/cmsValidation'

type FileEmbedProps = {
  url: string
  description: string
}

const archiveExtensions = new Set(['7z', 'bz2', 'gz', 'rar', 'tar', 'tgz', 'xz', 'zip'])
const documentExtensions = new Set(['csv', 'doc', 'docx', 'md', 'odt', 'ods', 'pdf', 'ppt', 'pptx', 'rtf', 'txt', 'xls', 'xlsx', 'xlxsx'])
const imageExtensions = new Set(['avif', 'bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'tif', 'tiff', 'webp'])
const videoExtensions = new Set(['avi', 'm4v', 'mkv', 'mov', 'mp4', 'mpeg', 'mpg', 'webm'])

const fileNameFromUrl = (url: string) => {
  try {
    const parsed = new URL(url, 'https://example.com')
    const name = parsed.pathname.split('/').filter(Boolean).pop()
    return name ? decodeURIComponent(name) : 'Download file'
  } catch {
    return 'Download file'
  }
}

const extensionFromUrl = (url: string) => {
  const fileName = fileNameFromUrl(url)
  const extension = fileName.split('.').pop()
  return extension && extension !== fileName ? extension.toLowerCase() : ''
}

const iconForExtension = (extension: string): LucideIcon => {
  if (archiveExtensions.has(extension)) {
    return Archive
  }

  if (imageExtensions.has(extension)) {
    return FileImage
  }

  if (videoExtensions.has(extension)) {
    return FileVideo
  }

  if (documentExtensions.has(extension)) {
    return FileText
  }

  return File
}

export const FileEmbed = ({ url, description }: FileEmbedProps) => {
  if (!isSafeHref(url)) {
    return null
  }

  const fileName = fileNameFromUrl(url)
  const extension = extensionFromUrl(url)
  const Icon = iconForExtension(extension)
  const isExternal = !url.startsWith('/')

  return (
    <div className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-950/60 p-5 backdrop-blur md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
            <Icon className="size-6 text-cyan-300" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm text-slate-100">{fileName}</p>
            {extension ? <p className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">{extension}</p> : null}
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          className="border-cyan-500/40 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20 hover:text-cyan-100"
        >
          <a
            href={url}
            download
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            <Download className="size-4" />
            Download
          </a>
        </Button>
      </div>
      <p className="mt-4 border-t border-slate-800 pt-4 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  )
}
