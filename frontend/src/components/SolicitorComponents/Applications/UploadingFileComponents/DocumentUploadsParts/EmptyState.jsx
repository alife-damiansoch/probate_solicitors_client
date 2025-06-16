import { FaFileAlt } from 'react-icons/fa';

const EmptyState = () => {
  return (
    <div
      className='text-center py-5'
      style={{
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        borderRadius: '20px',
        border: '1px solid #fecaca',
      }}
    >
      <div
        className='rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3'
        style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          color: '#dc2626',
          border: '3px solid #fecaca',
        }}
      >
        <FaFileAlt size={32} />
      </div>
      <h4 className='fw-bold mb-2' style={{ color: '#dc2626' }}>
        No Documents Found
      </h4>
      <p className='mb-0 text-muted'>
        Documents are pending. Please upload them at your earliest convenience.
      </p>
    </div>
  );
};

export default EmptyState;
