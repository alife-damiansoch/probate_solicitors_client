import { AlertTriangle } from 'lucide-react';

export const UnderReviewBadge = () => {
  return (
    <div className='application-badge-container'>
      <div className='badge badge-purple'>
        <AlertTriangle className='me-2' size={18} />
        Under Review
      </div>
    </div>
  );
};
export default UnderReviewBadge;
