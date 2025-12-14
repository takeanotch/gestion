// components/SuspenseBoundary.tsx
'use client'

import { Suspense } from 'react'
import Loader from './Loader' // Créez ce composant

export default function SuspenseBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  return <Suspense fallback={<Loader />}>{children}</Suspense>
}