import React from 'react';

interface UpdateButtonProps {
    isPending: boolean;
}

export const UpdateButton = ({ isPending }: UpdateButtonProps) => {
    return (
        <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                isPending 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } text-white`}
        >
            {isPending ? '수정 중...' : '수정 완료'}
        </button>
    );
};
