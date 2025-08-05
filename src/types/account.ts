export type AccountInfo = {
  _id: string
  accountName: string // 별명
  profileIds: string[]
  contactInfo: ContactInfo
  paymentInfo?: PaymentInfo
}

export type ContactInfo = {
  name: string
  phoneNumber: string
  email: string
}

export type PaymentInfo = {
  paymentMethod?: 'card' | 'bank' | 'cash' | null
} 