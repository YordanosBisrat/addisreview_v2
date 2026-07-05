import { FaInbox } from 'react-icons/fa';
import './EmptyState.css';

export default function EmptyState({
  icon: Icon = FaInbox,
  title = 'Nothing here yet',
  message = '',
  action = null,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Icon />
      </div>
      <h3>{title}</h3>
      {message && <p className="text-secondary">{message}</p>}
      {action}
    </div>
  );
}
