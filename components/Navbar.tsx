'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              게시판
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              홈
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                관리자
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user.name || user.email}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                로그인
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              홈
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                관리자
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href={`/profile/${user.id}`}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>{user.name || user.email}</span>
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-3 py-2 bg-primary-600 text-white rounded-md text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

