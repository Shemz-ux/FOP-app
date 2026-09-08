import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WebinarForm } from './WebinarForm';
import { testWebinars } from '../../../pages/Webinars/webinars.copy';

export default function WebinarEdit() {
  const { webinarId } = useParams();
  const navigate = useNavigate();
  const [webinar, setWebinar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchWebinar = () => {
      const foundWebinar = testWebinars.find(w => w.webinar_id === parseInt(webinarId));
      setWebinar(foundWebinar);
      setLoading(false);
    };

    fetchWebinar();
  }, [webinarId]);

  const handleSubmit = async (webinarData) => {
    // TODO: Replace with actual API call
    console.log('Updating webinar:', webinarData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate back to webinar detail
    navigate(`/admin/webinars/${webinarId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading webinar...</p>
        </div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-foreground mb-2">Webinar Not Found</h2>
          <p className="text-muted-foreground mb-4">The webinar you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/webinars')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Back to Webinars
          </button>
        </div>
      </div>
    );
  }

  return (
    <WebinarForm 
      webinar={webinar}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/admin/webinars/${webinarId}`)} 
      isEdit={true}
    />
  );
}
