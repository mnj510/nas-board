'use client'

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Users, Crown, Mail, ShieldAlert, Trash2 } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  name: string
  is_admin: boolean
  created_at: string
  is_banned?: boolean
  banned_until?: string | null
  is_paid?: boolean
}

export default function AdminPanel() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '사용자 목록을 불러오는데 실패했습니다.')
      }

      setUsers(data.users || [])
    } catch (err) {
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`이 사용자를 ${currentStatus ? '일반 사용자로' : '관리자로'} 변경하시겠습니까?`))
      return

    try {
      setUpdatingId(userId)
      const response = await fetch(`/api/users/${userId}/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_admin: !currentStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '관리자 상태 변경에 실패했습니다.')
      }

      await loadUsers()
    } catch (err: any) {
      alert(err.message || '관리자 상태 변경에 실패했습니다.')
    } finally {
      setUpdatingId(null)
    }
  }

  const updateBan = async (userId: string, days: number | null) => {
    const label =
      days === null
        ? '정지를 해제'
        : days === 7
        ? '7일 정지'
        : days === 30
        ? '30일 정지'
        : `${days}일 정지`

    if (!confirm(`이 사용자를 ${label} 하시겠습니까?`)) return

    try {
      setUpdatingId(userId)
      const response = await fetch(`/api/users/${userId}/ban`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '정지 상태 변경에 실패했습니다.')
      }

      await loadUsers()
    } catch (err: any) {
      alert(err.message || '정지 상태 변경에 실패했습니다.')
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteUser = async (userId: string) => {
    if (
      !confirm(
        '정말 이 사용자를 완전히 삭제하시겠습니까?\n삭제된 계정은 다시 로그인할 수 없습니다.'
      )
    )
      return

    try {
      setUpdatingId(userId)
      const response = await fetch(`/api/users/${userId}/delete`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '사용자 삭제에 실패했습니다.')
      }

      await loadUsers()
    } catch (err: any) {
      alert(err.message || '사용자 삭제에 실패했습니다.')
    } finally {
      setUpdatingId(null)
    }
  }

  const togglePaid = async (userId: string, currentStatus: boolean) => {
    if (
      !confirm(
        `이 사용자를 ${currentStatus ? '무료 회원으로' : '유료 회원으로'} 변경하시겠습니까?`
      )
    )
      return

    try {
      setUpdatingId(userId)
      const response = await fetch(`/api/users/${userId}/paid`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_paid: !currentStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '유료 회원 상태 변경에 실패했습니다.')
      }

      await loadUsers()
    } catch (err: any) {
      alert(err.message || '유료 회원 상태 변경에 실패했습니다.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Crown className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">관리자 페이지</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="w-6 h-6" />
              <span>회원 목록</span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      이름
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      이메일
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      상태
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      유료 회원
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      정지
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      가입일
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </td>
                      <td className="px-4 py-4">
                        {user.is_admin ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Crown className="w-3 h-3 mr-1" />
                            관리자
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            일반
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-4">
                        {user.is_paid ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            유료 회원
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            무료 회원
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {user.is_banned && user.banned_until ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <ShieldAlert className="w-3 h-3 mr-1" />
                            정지 ~{' '}
                            {new Date(user.banned_until).toLocaleDateString(
                              'ko-KR'
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            활동 가능
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleAdmin(user.id, user.is_admin)}
                          disabled={updatingId === user.id}
                          className={`px-3 py-2 mr-2 rounded-lg text-xs font-medium transition-colors ${
                            user.is_admin
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-primary-600 text-white hover:bg-primary-700'
                          }`}
                        >
                          {user.is_admin ? '일반으로 변경' : '관리자로 임명'}
                        </button>
                        <button
                          onClick={() => togglePaid(user.id, !!user.is_paid)}
                          disabled={updatingId === user.id}
                          className="px-3 py-2 mr-2 rounded-lg text-xs font-medium transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {user.is_paid ? '무료로 변경' : '유료로 변경'}
                        </button>
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => updateBan(user.id, 7)}
                            disabled={updatingId === user.id}
                            className="px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          >
                            7일 정지
                          </button>
                          <button
                            onClick={() => updateBan(user.id, 30)}
                            disabled={updatingId === user.id}
                            className="px-2 py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-800 hover:bg-orange-200"
                          >
                            30일 정지
                          </button>
                          <button
                            onClick={() => updateBan(user.id, null)}
                            disabled={updatingId === user.id}
                            className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            정지 해제
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => deleteUser(user.id)}
                          disabled={updatingId === user.id}
                          className="px-3 py-2 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 inline-flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>계정 삭제</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
