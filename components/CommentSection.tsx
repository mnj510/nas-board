'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './AuthProvider'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Send, Edit, Trash2, Reply } from 'lucide-react'

interface Comment {
  id: string
  content: string
  author_id: string
  author_name: string
  post_id: string
  parent_id: string | null
  created_at: string
  updated_at: string
  replies?: Comment[]
}

export default function CommentSection({ postId }: { postId: string }) {
  const { user, isAdmin } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments?post_id=${postId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '댓글을 불러오는데 실패했습니다.')
      }

      setComments(data.comments || [])
    } catch (err) {
      console.error('Error loading comments:', err)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setLoading(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          post_id: postId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '댓글 작성에 실패했습니다.')
      }

      setNewComment('')
      loadComments()
    } catch (err: any) {
      alert(err.message || '댓글 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return

    setLoading(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          post_id: postId,
          parent_id: parentId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '대댓글 작성에 실패했습니다.')
      }

      setReplyContent('')
      setReplyingTo(null)
      loadComments()
    } catch (err: any) {
      alert(err.message || '대댓글 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '댓글 수정에 실패했습니다.')
      }

      setEditingId(null)
      setEditContent('')
      loadComments()
    } catch (err: any) {
      alert(err.message || '댓글 수정에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '댓글 삭제에 실패했습니다.')
      }

      loadComments()
    } catch (err: any) {
      alert(err.message || '댓글 삭제에 실패했습니다.')
    }
  }

  const canEdit = (comment: Comment) => {
    return isAdmin || user?.id === comment.author_id
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">댓글</h2>

      {/* 댓글 작성 폼 */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex space-x-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows={3}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center text-gray-600">
          댓글을 작성하려면 로그인이 필요합니다.
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">
                    {comment.author_name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(
                      new Date(comment.created_at),
                      'yyyy.MM.dd HH:mm',
                      { locale: ko }
                    )}
                  </span>
                </div>
                {canEdit(comment) && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(comment.id)
                        setEditContent(comment.content)
                      }}
                      className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setEditContent('')
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleEdit(comment.id)}
                      disabled={loading}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  {user && (
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <Reply className="w-4 h-4" />
                      <span>답글</span>
                    </button>
                  )}
                </>
              )}

              {/* 대댓글 작성 폼 */}
              {replyingTo === comment.id && user && (
                <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="대댓글을 입력하세요..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none mb-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent('')
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={loading || !replyContent.trim()}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      작성
                    </button>
                  </div>
                </div>
              )}

              {/* 대댓글 목록 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-8 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            {reply.author_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(
                              new Date(reply.created_at),
                              'yyyy.MM.dd HH:mm',
                              { locale: ko }
                            )}
                          </span>
                        </div>
                        {canEdit(reply) && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingId(reply.id)
                                setEditContent(reply.content)
                              }}
                              className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(reply.id)}
                              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      {editingId === reply.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setEditingId(null)
                                setEditContent('')
                              }}
                              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => handleEdit(reply.id)}
                              disabled={loading}
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
