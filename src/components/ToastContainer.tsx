import { useSecretSantaStore } from '../stores/useSecretSantaStore';
import type { Toast } from '../types';
import { ICONS } from '../constants/config';

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: () => void }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return ICONS.checkmark;
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return ICONS.info;
      default:
        return ICONS.info;
    }
  };

  const getTypeClass = () => {
    switch (toast.type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
        return 'toast-info';
      default:
        return 'toast-info';
    }
  };

  return (
    <div
      className={`toast ${getTypeClass()} p-4 mb-3 flex items-center justify-between gap-3`}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {getIcon()}
        </span>
        <p className="font-medium">{toast.message}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded p-1"
        aria-label="Close notification"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const toasts = useSecretSantaStore((state) => state.toasts);
  const removeToast = useSecretSantaStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-3"
      aria-label="Notifications"
      role="region"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};
