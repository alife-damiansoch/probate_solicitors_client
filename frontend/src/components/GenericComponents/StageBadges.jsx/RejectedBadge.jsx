import { XCircle } from 'lucide-react';

export const RejectedBadge = () => {
  return (
    <div className='application-badge-container'>
      <div className='badge badge-danger'>
        <XCircle className='me-2' size={18} />
        Rejected
      </div>
    </div>
  );
};

export default RejectedBadge;
