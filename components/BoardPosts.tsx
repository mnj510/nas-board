'use client'

import { useEffect, useState } from 'react'
import { BOARD_NAMES } from '@/lib/utils'
import { useAuth } from './AuthProvider'
import Link from 'next/link'
import Navbar from './Navbar'
import { Plus, Clock, User, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Post {
  id: string
  title: string
  content: string
  board_type: string
  author_id: string
  author_name: string
  thumbnail_url: string | null
  created_at: string
  updated_at: string
  view_count: number
  comment_count: number
}

export default function BoardPosts({ boardType }: { boardType: string }) {
  const { isAdmin } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const boardName = BOARD_NAMES[boardType as keyof typeof BOARD_NAMES]
  const canWrite = isAdmin || boardType === 'question'

  useEffect(() => {
    loadPosts()
  }, [boardType])

  const loadPosts = async () => {
    try {
      const response = await fetch(`/api/posts?board_type=${boardType}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '게시물을 불러오는데 실패했습니다.')
      }

      setPosts(data.posts || [])
    } catch (err) {
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{boardName}</h1>
            {canWrite && (
              <Link
                href={`/board/${boardType}/write`}
                className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>글 작성</span>
              </Link>
            )}
          </div>
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
                href={`/board/${boardType}/${post.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group"
              >
                {post.thumbnail_url && (
                  <div className="relative w-full h-48 overflow-hidden bg-gray-200">
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{post.author_name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>조회 {post.view_count ?? 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {format(new Date(post.created_at), 'yyyy.MM.dd', {
                            locale: ko,
                          })}
                        </span>
                      </div>
                      <span>댓글 {post.comment_count}</span>
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
