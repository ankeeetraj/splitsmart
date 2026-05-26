'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar({ groupName }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const isLanding = pathname === '/'
  const isDashboard = pathname === '/dashboard'
  const isGroupRoute = pathname.startsWith('/groups/')
  
  const initials = session?.user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || ''

  return (
    <nav className="bg-positivus-white border-b-2 border-positivus-black flex items-center justify-center sticky top-0 z-50">
      <div className="max-w-[1100px] mx-auto w-full px-[60px] py-5 flex items-center justify-between relative">
        {/* Left */}
        <Link href="/" className="flex items-center">
          <span className="text-[26px] font-extrabold text-positivus-black">SplitSmart</span>
        </Link>
        
        {/* Center */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {isLanding && (
            <>
              <a href="#features" className="text-positivus-black font-medium hover:opacity-70 transition-opacity">Features</a>
              <a href="#how-it-works" className="text-positivus-black font-medium hover:opacity-70 transition-opacity">How it Works</a>
              {session ? (
                <Link href="/dashboard" className="text-positivus-black font-medium hover:opacity-70 transition-opacity">Dashboard</Link>
              ) : (
                <Link href="/login" className="text-positivus-black font-medium hover:opacity-70 transition-opacity">Login</Link>
              )}
            </>
          )}

          {isDashboard && (
            <>
              <span className="text-positivus-black font-medium cursor-pointer">Groups</span>
              <span className="text-[#777777] font-medium cursor-pointer hover:text-positivus-black transition-colors">Activity</span>
            </>
          )}

          {isGroupRoute && (
            <button 
              onClick={() => router.back()} 
              className="text-positivus-black font-medium flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <span>←</span> {groupName || 'Back'}
            </button>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 z-10">
          {!session && isLanding && (
            <Link 
              href="/register"
              className="bg-positivus-black text-positivus-white border-2 border-positivus-black rounded-xl px-[24px] py-[12px] font-bold text-sm hover:opacity-80 transition-opacity"
            >
              Get Started →
            </Link>
          )}

          {session && (
            <Link href="/profile" className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-positivus-green border-2 border-positivus-black text-positivus-black font-bold uppercase hover:opacity-80 transition-opacity" title="Profile">
              {initials}
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
