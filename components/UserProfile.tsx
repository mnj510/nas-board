'use client'

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { User, FileText, MessageSquare, Clock } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { BOARD_NAMES } from '@/lib/utils'

interface Post {
  id: string
  title: string
  board_type: string
  thumbnail_url: string | null
  created_at: string
}

interface Comment {
  id: string
  content: string
  post_id: string
  post_title: string
  board_type: string
  created_at: string
}

interface Profile {
  id: string
  email: string
  name: string
  is_admin: boolean
  created_at: string
}

export default function UserProfile({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${userId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '프로필을 불러오는데 실패했습니다.')
      }

      setProfile(data.profile)
      setPosts(data.posts || [])
      setComments(data.comments || [])
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600">사용자를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-gray-600 mt-1">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200">
            <div className="flex space-x-4 px-6">
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'posts'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>작성한 게시물 ({posts.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === 'comments'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>작성한 댓글 ({comments.length})</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'posts' ? (
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <p className="text-center text-gray-500 py-12">
                    작성한 게시물이 없습니다.
                  </p>
                ) : (
                  posts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/board/${post.board_type}/${post.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-start space-x-4">
                        {post.thumbnail_url && (
                          <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                            <img
                              src={post.thumbnail_url}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm text-primary-600 font-medium">
                              {BOARD_NAMES[post.board_type as keyof typeof BOARD_NAMES]}
                            </span>
                            <span className="text-sm text-gray-500">
                              {format(new Date(post.created_at), 'yyyy.MM.dd', {
                                locale: ko,
                              })}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-12">
                    작성한 댓글이 없습니다.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <Link
                      key={comment.id}
                      href={`/board/${comment.board_type}/${comment.post_id}#comment-${comment.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-primary-600 font-medium">
                          {BOARD_NAMES[comment.board_type as keyof typeof BOARD_NAMES] || '알 수 없음'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.created_at), 'yyyy.MM.dd HH:mm', {
                            locale: ko,
                          })}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {comment.post_title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2">
                        {comment.content}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
