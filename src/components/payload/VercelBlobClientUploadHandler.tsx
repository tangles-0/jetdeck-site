'use client'

import type { ReactNode } from 'react'

// The Vercel Blob storage plugin registers a client upload handler even when
// direct client uploads are disabled. With Next's webpack dev server that pulls
// server-only Payload internals into the browser bundle. Uploads still use
// Payload's normal server upload route, so this shim should never be invoked.
export const VercelBlobClientUploadHandler = ({ children }: { children?: ReactNode }) => children
