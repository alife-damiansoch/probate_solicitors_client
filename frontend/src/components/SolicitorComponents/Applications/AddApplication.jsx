import React from 'react';
import NewApplicationForm from './AddApplicationParts/NewApplicationForm';
import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';

const AddApplication = () => {
  return (
    <div>
      <BackToApplicationsIcon backUrl='/applications' />
      <NewApplicationForm />
    </div>
  );
};

export default AddApplication;
