import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger' // 'danger' or 'primary'
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmButtonClass = confirmVariant === 'danger'
    ? 'bg-red-500 hover:bg-red-600 text-white font-medium'
    : 'bg-primary hover:bg-primary/90 text-primary-foreground font-medium';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-left">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-3xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Close button - top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary/80 rounded-xl transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="p-8 pt-6">
          {/* Vertically aligned content */}
          <div className="flex flex-col items-center text-center">
            {/* Icon at top */}
            {confirmVariant === 'danger' && (
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            )}
            
            {/* Title and Message */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-3">{title}</h2>
              <p className="text-base text-muted-foreground leading-relaxed">{message}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-border hover:bg-secondary text-foreground font-medium transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-6 py-2.5 rounded-xl transition-all ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
