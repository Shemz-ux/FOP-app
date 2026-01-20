import { useNavigate } from 'react-router-dom';
import { ResourceForm } from './ResourceForm';
import { apiPost } from '../../services/api';

export default function ResourceCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (resourceData) => {
    const token = localStorage.getItem('token');
    
    if (resourceData.upload_type === 'file' && resourceData.file) {
      // Handle file upload with FormData
      const formData = new FormData();
      
      // Append all resource data except file and internal fields
      Object.keys(resourceData).forEach(key => {
        if (key !== 'file' && 
            key !== 'existing_file_name' && 
            key !== 'existing_file_size' && 
            resourceData[key] !== null && 
            resourceData[key] !== undefined && 
            resourceData[key] !== '') {
          formData.append(key, resourceData[key]);
        }
      });
      
      // Append file last
      if (resourceData.file) {
        formData.append('file', resourceData.file);
      }

      await apiPost('/resources', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } else {
      // Handle video link with JSON
      const jsonData = {
        title: resourceData.title,
        category: resourceData.category,
        description: resourceData.description,
        detailed_description: resourceData.detailed_description,
        whats_included: resourceData.whats_included,
        uploaded_by: resourceData.uploaded_by,
        upload_type: resourceData.upload_type,
        video_link: resourceData.video_link,
      };
      
      await apiPost('/resources', jsonData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
    
    navigate('/admin/resources');
  };

  return (
    <ResourceForm 
      onSubmit={handleSubmit}
      onCancel={() => navigate('/admin/resources')} 
      isEdit={false}
    />
  );
}
