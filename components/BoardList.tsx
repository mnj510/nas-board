'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BOARD_TYPES, BOARD_NAMES } from '@/lib/utils'
import {
  FileText,
  TrendingUp,
  Home,
  Briefcase,
  HelpCircle,
  Clock,
  User,
  Eye,
} from 'lucide-react'
import Navbar from './Navbar'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface PostSummary {
  id: string
  title: string
  content: string
  board_type: string
  author_id: string
  author_name: string
  thumbnail_url: string | null
  created_at: string
  view_count: number
  comment_count: number
}

const boardIcons = {
  [BOARD_TYPES.NOTICE]: FileText,
  [BOARD_TYPES.ECONOMY]: TrendingUp,
  [BOARD_TYPES.REAL_ESTATE]: Home,
  [BOARD_TYPES.BUSINESS]: Briefcase,
  [BOARD_TYPES.QUESTION]: HelpCircle,
}

export default function BoardList() {
  const [selectedBoard, setSelectedBoard] = useState<string>(BOARD_TYPES.NOTICE)
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts(selectedBoard)
  }, [selectedBoard])

  const loadPosts = async (boardType: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts?board_type=${boardType}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '게시물을 불러오는데 실패했습니다.')
      }

      setPosts(data.posts || [])
    } catch (error) {
      console.error('Load home posts error:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 상단 게시판 탭 메뉴 */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 overflow-x-auto">
          <div className="flex items-center space-x-4 min-w-max">
            {Object.entries(BOARD_NAMES).map(([type, name]) => {
              const Icon = boardIcons[type as keyof typeof boardIcons]
              const isActive = selectedBoard === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedBoard(type)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 선택된 게시판의 게시물 리스트 */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {BOARD_NAMES[selectedBoard as keyof typeof BOARD_NAMES]} 최신 글
          </h1>
          <Link
            href={`/board/${selectedBoard}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            전체 보기 →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">아직 게시물이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/board/${post.board_type}/${post.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group"
              >
                {post.thumbnail_url && (
                  <div className="relative w-full h-40 overflow-hidden bg-gray-200">
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {
                        BOARD_NAMES[
                          post.board_type as keyof typeof BOARD_NAMES
                        ]
                      }
                    </span>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>조회 {post.view_count ?? 0}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        댓글 {post.comment_count ?? 0}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 80)}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {format(new Date(post.created_at), 'yyyy.MM.dd', {
                          locale: ko,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


