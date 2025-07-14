import { EuroIcon } from 'lucide-react';

export const PaidOutBadge = () => {
  return (
    <div className='application-badge-container'>
      <div className='badge badge-gold'>
        <EuroIcon className='me-2' size={18} />
        Paid Out
      </div>
    </div>
  );
};

export default PaidOutBadge;
