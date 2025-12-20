"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

interface VersionUpdateBannerProps {
  currentVersion: string
  latestVersion: string
}

export default function VersionUpdateBanner({
  currentVersion,
  latestVersion
}: VersionUpdateBannerProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Add a small delay for the fade-in animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <div className="flex flex-row w-full bg-gradient-to-r from-blue-500 to-purple-600 items-center py-3 px-4 justify-between text-white text-sm">
        <div className="flex items-center space-x-3">
          <span className="bg-white/20 rounded-full px-2 py-1 text-xs font-medium">
            Update Available
          </span>
          <span>
            New version {latestVersion} is available (you have {currentVersion})
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="https://github.com/composecraft/composecraft/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 flex items-center space-x-1"
          >
            <span>View Release</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
