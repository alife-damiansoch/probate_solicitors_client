import { CheckCircle } from 'lucide-react';

// SETTLED BADGE - Blue with checkmark (Final completion)
export const SettledBadge = () => {
  return (
    <div className='application-badge-container'>
      <div className='badge badge-blue'>
        <CheckCircle className='me-2' size={18} />
        Settled
      </div>
    </div>
  );
};
export default SettledBadge;
