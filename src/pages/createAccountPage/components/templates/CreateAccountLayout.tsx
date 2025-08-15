import React from 'react';
import { CreateAccountForm } from '../organisms';

const CreateAccountLayout: React.FC = () => {
  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Account</h1>
      <CreateAccountForm />
    </div>
  );
};

export default CreateAccountLayout;