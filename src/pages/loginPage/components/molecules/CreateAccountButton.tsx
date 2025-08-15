import React from 'react';

type CreateAccountButtonProps = {
  onClick: () => void;
};

const CreateAccountButton: React.FC<CreateAccountButtonProps> = ({ onClick }) => {
  return (
    <div className="mt-6 text-center">
      <button
        onClick={onClick}
        className="text-blue-600 hover:text-blue-500 font-medium"
      >
        신규 계정 생성
      </button>
    </div>
  );
};

export default CreateAccountButton;