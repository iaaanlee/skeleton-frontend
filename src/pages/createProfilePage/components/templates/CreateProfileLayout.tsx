import React from 'react';
import { FormLayout } from '../../../../components/common/templates';
import { CreateProfileForm } from '../organisms';

const CreateProfileLayout: React.FC = () => {
  return (
    <FormLayout title="Create New Profile">
      <CreateProfileForm />
    </FormLayout>
  );
};

export default CreateProfileLayout;