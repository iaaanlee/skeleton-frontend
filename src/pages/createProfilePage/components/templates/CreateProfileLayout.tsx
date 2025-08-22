import React from 'react';
import { ScrollablePageLayout } from '../../../../components/common/templates';
import { FormLayout } from '../../../../components/common/templates';
import { CreateProfileForm } from '../organisms';

const CreateProfileLayout: React.FC = () => {
  return (
    <ScrollablePageLayout>
      <FormLayout title="Create New Profile">
        <CreateProfileForm />
      </FormLayout>
    </ScrollablePageLayout>
  );
};

export default CreateProfileLayout;