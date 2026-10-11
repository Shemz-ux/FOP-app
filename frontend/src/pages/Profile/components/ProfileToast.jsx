import Toast from '../../../components/Ui/Toast';

// Shows the message held by useToast, if there is one
export default function ProfileToast({ toast, onClose }) {
  if (!toast) return null;

  return <Toast key={toast.id} message={toast.message} type={toast.type} onClose={onClose} />;
}
