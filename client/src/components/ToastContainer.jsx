import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { useToast } from '../hooks/useToast';
import './ToastContainer.css';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="assertive">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
          <span className="toast__icon">
            {toast.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
          </span>
          <span className="toast__message">{toast.message}</span>
          <button
            className="toast__close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
}
