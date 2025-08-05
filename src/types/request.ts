import { UserProfileInfo } from './userProfile';

export type CreateUserProfileRequest = Omit<UserProfileInfo, '_id' | 'accountId' | 'createdAt' | 'updatedAt' | 'deletedAt'> // 백에서 결정됨