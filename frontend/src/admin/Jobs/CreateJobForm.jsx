import React from 'react';
import { JobForm } from './JobForm';
import { apiPost } from '../../services/api';

export function CreateJobForm({ onCancel }) {
  const handleSubmit = async (jobData) => {
    try {
      await apiPost('/jobs', jobData);
      // Success toast is shown by JobForm component
      setTimeout(() => onCancel(), 2000); // Delay to show toast before navigating away
    } catch (error) {
      // Re-throw error so JobForm can show error toast
      // Form data is preserved because we don't navigate away
      throw error;
    }
  };

  return <JobForm onSubmit={handleSubmit} onCancel={onCancel} isEdit={false} />;
}
