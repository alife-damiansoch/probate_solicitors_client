import { Clock } from 'lucide-react';

export const InProgressBadge = () => {
  return (
    <div className='application-badge-container'>
      <div className='badge badge-warning'>
        <Clock className='me-2' size={18} />
        In Progress
      </div>
    </div>
  );
};

export default InProgressBadge;
