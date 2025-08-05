export type AccountInfo = {
  _id: string
  accountName: string // 별명
  loginInfo: LoginInfo
  contactInfo: ContactInfo
  paymentInfo?: PaymentInfo
  profileIds: string[]
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export type LoginInfo = {
  loginId: string
  password: string // 해시된 패스워드 (백엔드에서만 사용)
}

export type ContactInfo = {
  name: string
  phoneNumber: string
  email: string
}

export type PaymentInfo = {
  paymentMethod?: 'card' | 'bank' | 'cash' | null
} 