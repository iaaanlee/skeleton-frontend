import { ProfileInfo } from './profile';

export type CreateProfileRequest = Omit<ProfileInfo, '_id' | 'accountId' | 'createdAt' | 'updatedAt' | 'deletedAt'> // 백에서 결정됨