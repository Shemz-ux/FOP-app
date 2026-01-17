import { useNavigate, useParams } from 'react-router-dom';
import { EditResourceForm } from './EditResourceForm';
import { mockResources } from '../../services/Admin/admin-analytics';

export default function ResourceEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const resource = mockResources.find(r => r.id === parseInt(id));

  if (!resource) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-foreground mb-2">Resource Not Found</h2>
        <p className="text-muted-foreground">The resource you're trying to edit doesn't exist.</p>
      </div>
    );
  }

  return <EditResourceForm resource={resource} onCancel={() => navigate(`/admin/resources/${id}`)} />;
}
