'use client'

import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { Menu, X, User, Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSignOut = async () => {
    await signOut()
    setMobileMenuOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setMobileMenuOpen(false)
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <nav className="bg-black shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 space-y-3 md:space-y-0">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                행동주의자
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-200 hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* 중앙 검색창 (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 mx-6 max-w-2xl"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색어를 입력해주세요"
                className="w-full pl-4 pr-12 py-2 rounded-full bg-gray-900 border border-gray-700 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-primary-600 text-white hover:bg-primary-700 flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-100 hover:text-primary-300 transition-colors font-medium"
            >
              홈
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-100 hover:text-primary-300 transition-colors font-medium"
              >
                관리자
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center space-x-2 text-gray-100 hover:text-primary-300 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium text-white">
                    {user.name || user.email}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 border border-red-400 text-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
                <Link
                  href="/auth/login"
                  className="px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-black transition-colors"
                >
                  로그인
                </Link>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black">
          <form onSubmit={handleSearch} className="px-4 pt-3 pb-2">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색어를 입력해주세요"
                className="w-full pl-4 pr-10 py-2 rounded-full bg-gray-900 border border-gray-700 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/"
                className="block px-3 py-2 text-gray-100 hover:bg-gray-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              홈
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                  className="block px-3 py-2 text-gray-100 hover:bg-gray-800 rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                관리자
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href={`/profile/${user.id}`}
                  className="block px-3 py-2 text-gray-100 hover:bg-gray-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>{user.name || user.email}</span>
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-gray-800 rounded-md"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-3 py-2 border border-white text-white rounded-md text-center"
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

