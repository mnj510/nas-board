'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import Navbar from './Navbar'
import { ArrowLeft, Edit, Trash2, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import CommentSection from './CommentSection'

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
}

export default function PostDetail({
  postId,
  boardType,
}: {
  postId: string
  boardType: string
}) {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '게시물을 불러오는데 실패했습니다.')
      }

      setPost(data.post)
    } catch (err) {
      console.error('Error loading post:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '삭제에 실패했습니다.')
      }

      router.push(`/board/${boardType}`)
    } catch (err: any) {
      console.error('Error deleting post:', err)
      alert(err.message || '삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600">게시물을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  const canEdit = isAdmin || user?.id === post.author_id

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href={`/board/${boardType}`}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>목록으로</span>
            </Link>
            {canEdit && (
              <div className="flex items-center space-x-2">
                <Link
                  href={`/board/${boardType}/${postId}/edit`}
                  className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6 pb-6 border-b">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <Link
                href={`/profile/${post.author_id}`}
                className="hover:text-primary-600 transition-colors"
              >
                {post.author_name}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>
                {format(new Date(post.created_at), 'yyyy년 MM월 dd일 HH:mm', {
                  locale: ko,
                })}
              </span>
            </div>
            <span>조회 {post.view_count}</span>
          </div>

          <div
            className="post-content prose max-w-none mb-8 text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              wordBreak: 'break-word',
              color: '#111827',
            }}
          />

          <CommentSection postId={postId} />
        </div>
      </div>
    </div>
  )
}
