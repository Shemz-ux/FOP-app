import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ResourceForm } from './ResourceForm';
import { apiGet, apiPatch } from '../../services/api';

export default function ResourceEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const data = await apiGet(`/resources/${id}`);
        setResource(data.resource);
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResource();
  }, [id]);

  const handleSubmit = async (resourceData) => {
    const token = localStorage.getItem('token');
    
    if (resourceData.file) {
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
      
      // Append file
      formData.append('file', resourceData.file);

      await apiPatch(`/resources/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } else {
      // Handle JSON update (no file change)
      const jsonData = {
        title: resourceData.title,
        category: resourceData.category,
        description: resourceData.description,
        detailed_description: resourceData.detailed_description,
        whats_included: resourceData.whats_included,
        uploaded_by: resourceData.uploaded_by,
        is_active: resourceData.is_active,
      };
      
      // Only add upload_type if it's being changed
      if (resourceData.upload_type) {
        jsonData.upload_type = resourceData.upload_type;
      }
      
      // Add video link if it's a link type
      if (resourceData.upload_type === 'link' && resourceData.video_link) {
        jsonData.video_link = resourceData.video_link;
      }
      
      await apiPatch(`/resources/${id}`, jsonData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
    
    navigate(`/admin/resources/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-foreground mb-2">Resource Not Found</h2>
        <p className="text-muted-foreground">The resource you're trying to edit doesn't exist.</p>
      </div>
    );
  }

  return (
    <ResourceForm 
      resource={resource}
      onSubmit={handleSubmit}
      onCancel={() => navigate(`/admin/resources/${id}`)} 
      isEdit={true}
    />
  );
}
