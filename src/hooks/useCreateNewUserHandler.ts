import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreateNewUser } from '../services/mainService/mutation';
import { UserInfo } from '../types/mainType';

interface CreateNewUserHandlerProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateNewUserHandler = ({ 
  onSuccess, 
  onError 
}: CreateNewUserHandlerProps = {}) => {
  const createUserMutation = useCreateNewUser();
  const queryClient = useQueryClient();

  const handleCreateNewUser = async (formData: FormData) => {
    // 데이터 검증
    const name = formData.get('name') as string;
    const contactNumber = formData.get('contactNumber') as string;
    const gender = formData.get('gender') as string;
    const birthYear = formData.get('birthYear') as string;
    const weight = formData.get('weight') as string;
    const height = formData.get('height') as string;

    // 필수 필드 검증
    if (!name || !contactNumber || !gender || !birthYear || !weight || !height) {
      throw new Error('모든 필드를 입력해주세요.');
    }

    // 데이터 타입 검증
    const birthYearNum = parseInt(birthYear);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(birthYearNum) || birthYearNum < 1900 || birthYearNum > 2024) {
      throw new Error('올바른 출생년도를 입력해주세요.');
    }

    if (isNaN(weightNum) || weightNum <= 0) {
      throw new Error('올바른 체중을 입력해주세요.');
    }

    if (isNaN(heightNum) || heightNum <= 0) {
      throw new Error('올바른 키를 입력해주세요.');
    }

    // 성별 검증
    if (gender !== 'male' && gender !== 'female') {
      throw new Error('성별을 선택해주세요.');
    }

    const userData: UserInfo = {
      userBasicInfo: {
        name,
        contactNumber,
      },
      bodyStatus: {
        gender: gender as 'male' | 'female',
        birthYear: birthYearNum,
        weight: weightNum,
        height: heightNum,
      }
    };

    try {
      const response = await createUserMutation.mutateAsync(userData);
      
      // 성공 후 처리
      if (response) {
        // 캐시 무효화 (필요한 경우)
        queryClient.invalidateQueries({ queryKey: ['users'] });
        
        // 성공 콜백 호출
        onSuccess?.();
        
        return response;
      } else {
        throw new Error('사용자 생성에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      
      // 에러 콜백 호출
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      
      throw error;
    }
  };

  return {
    handleCreateNewUser,
    isPending: createUserMutation.isPending,
    isSuccess: createUserMutation.isSuccess,
    isError: createUserMutation.isError,
    error: createUserMutation.error,
  };
}; 