export type UserInfo = {
  contactInfo: ContactInfo
  bodyStatus: BodyStatus
  exerciseInfoList: ExerciseInfo[]
  cautions: Cautions
  preferences: Preferences
}

export type ContactInfo = {
  name: string
  phoneNumber: string
  email: string
}

export type BodyStatus = {
  gender: 'male' | 'female'
  birthYear: number | null
  height: number | null
  weight: number | null
  detailInfo?: DetailInfoOfBodyStatus
}

export type DetailInfoOfBodyStatus = {
  bodyFatRatioPercent?: number | null
  skeletalMuscleMassKg?: number | null
  // 추후 다른 것들 더 들어올 수 있음
}

export type ExerciseInfo = {
  exerciseName?: string | null
  exerciseLevel?: 'low' | 'medium' | 'high' | null
  trainingYear?: number | null
  performanceDescription?: string[]
}

export type Cautions = {
  disease: string[]
  injury: string[]
  surgery: string[]
  sensitivePart: string[]
  dangerousPart: string[]
}

export type Preferences = {
  exerciseIntensity?: 'low' | 'medium' | 'high' | null
  exerciseFrequency?: number[]
  exerciseTime?: number[]
  exerciseLocation?: string[]
  exerciseEquipment?: string[]
  // 추후에 추가 및 수정
}