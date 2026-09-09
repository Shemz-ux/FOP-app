import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebinarForm } from './WebinarForm';
import Toast from '../../../components/Ui/Toast';
import { createWebinar } from '../../../services/Webinars/webinarsService';

export default function WebinarCreate() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleSubmit = async (webinarData) => {
    try {
      const created = await createWebinar(webinarData);
      console.log('Created webinar:', created);
      
      // Show success toast
      setToast({
        message: `"${created.title}" has been created successfully!`,
        type: 'success'
      });
      
      // Navigate to the created webinar's detail page after a short delay
      setTimeout(() => {
        navigate(`/admin/webinars/${created.webinar_id}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating webinar:', error);
      throw error; // Let the form handle the error display
    }
  };

  return (
    <>
      <WebinarForm 
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/webinars')} 
        isEdit={false}
      />
      
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
