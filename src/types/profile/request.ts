import { ProfileInfo } from './profile';

export type CreateProfileRequest = Omit<ProfileInfo, '_id' | 'accountId' | 'createdAt' | 'updatedAt' | 'deletedAt'> // 백에서 결정됨

// 업데이트용 타입 - CreateProfileRequest와 호환되도록 수정
export type UpdateProfileRequest = CreateProfileRequest; 