import { useNavigate } from 'react-router-dom';
import { WebinarForm } from './WebinarForm';

export default function WebinarCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (webinarData) => {
    // TODO: Replace with actual API call
    console.log('Creating webinar:', webinarData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate back to webinars list
    navigate('/admin/webinars');
  };

  return (
    <WebinarForm 
      onSubmit={handleSubmit}
      onCancel={() => navigate('/admin/webinars')} 
      isEdit={false}
    />
  );
}
