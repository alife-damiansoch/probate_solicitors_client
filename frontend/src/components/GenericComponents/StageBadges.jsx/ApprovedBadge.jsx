import { FileCheck } from 'lucide-react';

export const ApprovedBadge = () => {
  return (
    <div className='application-badge-container'>
      <div className='badge badge-success'>
        <FileCheck className='me-2' size={18} />
        Approved
      </div>
    </div>
  );
};

export default ApprovedBadge;
