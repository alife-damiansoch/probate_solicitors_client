import { Zap } from 'lucide-react';

export const ProcessingBadge = () => {
  return (
    <div className='application-badge-container'>
      <div className='badge badge-purple'>
        <Zap className='me-2' size={18} />
        Processing
      </div>
    </div>
  );
};

export default ProcessingBadge;
