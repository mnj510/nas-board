'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { BOARD_NAMES } from '@/lib/utils'
import Navbar from './Navbar'
import RichTextEditor from './RichTextEditor'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function WritePost({ boardType }: { boardType: string }) {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isPremium, setIsPremium] = useState(false)

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!user) throw new Error('로그인이 필요합니다.')

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '이미지 업로드에 실패했습니다.')
    }

    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.')
      setLoading(false)
      return
    }

    if (!user) {
      setError('로그인이 필요합니다.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          board_type: boardType,
          thumbnail_url: thumbnailUrl,
          // 관리자만 유료글 설정 가능, 질문 게시판은 항상 무료 처리
          is_premium: isAdmin && boardType !== 'question' ? isPremium : false,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '게시물 작성에 실패했습니다.')
      }

      router.push(`/board/${boardType}/${data.post.id}`)
    } catch (err: any) {
      setError(err.message || '게시물 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              href={`/board/${boardType}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {BOARD_NAMES[boardType as keyof typeof BOARD_NAMES]} 글 작성
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                제목
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="제목을 입력하세요"
              />
            </div>

            {isAdmin && boardType !== 'question' && (
              <div className="flex items-center justify-between border border-yellow-200 bg-yellow-50 px-4 py-3 rounded-lg">
                <label className="flex items-center space-x-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={isPremium}
                    onChange={(e) => setIsPremium(e.target.checked)}
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span>
                    이 글을 <span className="font-semibold">유료 회원 전용</span>으로
                    설정
                  </span>
                </label>
                <p className="text-xs text-gray-500">
                  유료 회원으로 설정된 사용자가 모든 글을 볼 수 있습니다.
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                내용
              </label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                onImageUpload={handleImageUpload}
                onThumbnailSelect={setThumbnailUrl}
                thumbnailUrl={thumbnailUrl}
              />
              <p className="mt-2 text-sm text-gray-500">
                이미지를 드래그 앤 드롭하거나 붙여넣기하여 삽입할 수 있습니다. 이미지 중앙의 '썸네일' 버튼을 클릭하여 썸네일로 설정하세요.
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href={`/board/${boardType}`}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? '작성 중...' : '작성하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
