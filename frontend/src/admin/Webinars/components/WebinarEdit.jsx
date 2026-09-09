import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WebinarForm } from './WebinarForm';
import LoadingSpinner from '../../../components/Ui/LoadingSpinner';
import Toast from '../../../components/Ui/Toast';
import { 
  getWebinarAdmin, 
  updateWebinar 
} from '../../../services/Webinars/webinarsService';

export default function WebinarEdit() {
  const { webinarId } = useParams();
  const navigate = useNavigate();
  const [webinar, setWebinar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchWebinar();
  }, [webinarId]);

  const fetchWebinar = async () => {
    try {
      setLoading(true);
      const data = await getWebinarAdmin(webinarId);
      setWebinar(data);
    } catch (error) {
      console.error('Error fetching webinar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (webinarData) => {
    try {
      const updated = await updateWebinar(webinarId, webinarData);
      console.log('Updated webinar:', updated);
      
      // Show success toast
      setToast({
        message: `"${updated.title}" has been updated successfully!`,
        type: 'success'
      });
      
      // Navigate back to webinar detail after a short delay
      setTimeout(() => {
        navigate(`/admin/webinars/${webinarId}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating webinar:', error);
      throw error; // Let the form handle the error display
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
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
    <>
      <WebinarForm 
        webinar={webinar}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/admin/webinars/${webinarId}`)} 
        isEdit={true}
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
