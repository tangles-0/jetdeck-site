import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseUri = process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL
const payloadSecret = process.env.PAYLOAD_SECRET
const enableBlobStorage =
  Boolean(process.env.BLOB_READ_WRITE_TOKEN) &&
  (process.env.VERCEL === '1' || process.env.PAYLOAD_ENABLE_BLOB_STORAGE === 'true')
const serverURL = (
  process.env.PAYLOAD_SERVER_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
).replace(/\/+$/, '')
const allowedOrigins = [
  serverURL,
  ...(process.env.PAYLOAD_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),
]

if (!databaseUri) {
  throw new Error('Missing database connection string. Set DATABASE_URI, DATABASE_URL, or POSTGRES_URL.')
}

if (!payloadSecret || payloadSecret === 'changeme' || payloadSecret.length < 32) {
  throw new Error('Missing or weak PAYLOAD_SECRET. Set it to at least 32 random characters.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Pages, Media],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: payloadSecret,
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  graphQL: {
    disable: process.env.NODE_ENV === 'production',
    disableIntrospectionInProduction: true,
    disablePlaygroundInProduction: true,
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUri,
    },
  }),
  sharp,
  plugins: [
    // On Vercel the filesystem is read-only/ephemeral, so uploads go to Vercel Blob.
    // Locally (no token set) uploads land in ./media on disk.
    ...(enableBlobStorage
      ? [
          vercelBlobStorage({
            clientUploads: false,
            collections: { media: true },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      : []),
  ],
})
