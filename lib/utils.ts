export const ADMIN_EMAIL = 'mnj510@naver.com'
export const ADMIN_PASSWORD = 'asdf6014'

export const BOARD_TYPES = {
  NOTICE: 'notice',
  ECONOMY: 'economy',
  REAL_ESTATE: 'real_estate',
  BUSINESS: 'business',
  QUESTION: 'question',
} as const

export const BOARD_NAMES = {
  [BOARD_TYPES.NOTICE]: '공지사항',
  [BOARD_TYPES.ECONOMY]: '경제',
  [BOARD_TYPES.REAL_ESTATE]: '부동산',
  [BOARD_TYPES.BUSINESS]: '사업',
  [BOARD_TYPES.QUESTION]: '질문',
} as const

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

