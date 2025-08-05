import { AccountInfo } from './account';

export type CreateAccountRequest = Omit<AccountInfo, '_id' | 'profileIds' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  loginInfo: {
    loginId: string
    password: string // 평문 패스워드 (프론트엔드에서 전송)
  }
}

export type LoginRequest = {
  loginId: string
  password: string // 평문 패스워드
} 