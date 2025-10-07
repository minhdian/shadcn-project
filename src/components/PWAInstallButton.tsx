import React from 'react'
import { usePWAInstall } from '../hooks/usePWAInstall'

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, installPWA } = usePWAInstall()

  if (!isInstallable) return null

  return (
    <button
      onClick={installPWA}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      Install App
    </button>
  )
}