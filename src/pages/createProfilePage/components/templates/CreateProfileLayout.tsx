import React from 'react';
import { CreateProfileForm } from '../organisms';

const CreateProfileLayout: React.FC = () => {
  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Profile</h1>
      <CreateProfileForm />
    </div>
  );
};

export default CreateProfileLayout;