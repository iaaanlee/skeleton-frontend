import React from 'react';
import { FormLayout } from '../../../../components/common/templates';
import { CreateAccountForm } from '../organisms';

const CreateAccountLayout: React.FC = () => {
  return (
    <FormLayout title="Create New Account">
      <CreateAccountForm />
    </FormLayout>
  );
};

export default CreateAccountLayout;