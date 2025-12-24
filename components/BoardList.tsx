'use client'

import Link from 'next/link'
import { BOARD_TYPES, BOARD_NAMES } from '@/lib/utils'
import { FileText, TrendingUp, Home, Briefcase, HelpCircle } from 'lucide-react'
import Navbar from './Navbar'

const boardIcons = {
  [BOARD_TYPES.NOTICE]: FileText,
  [BOARD_TYPES.ECONOMY]: TrendingUp,
  [BOARD_TYPES.REAL_ESTATE]: Home,
  [BOARD_TYPES.BUSINESS]: Briefcase,
  [BOARD_TYPES.QUESTION]: HelpCircle,
}

export default function BoardList() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            게시판 목록
          </h1>
          <p className="text-gray-600 text-lg">
            원하는 게시판을 선택해주세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(BOARD_NAMES).map(([type, name]) => {
            const Icon = boardIcons[type as keyof typeof boardIcons]
            return (
              <Link
                key={type}
                href={`/board/${type}`}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
              >
                <div className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {name}
                  </h2>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                    게시물 보기 →
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

