import { FaCheckCircle, FaClock, FaFileAlt } from 'react-icons/fa';

const StatusBadge = ({ doc }) => {
  if (doc.is_signed) {
    return (
      <span
        className='badge rounded-pill px-3 py-2 d-flex align-items-center'
        style={{
          backgroundColor: '#dcfce7',
          color: '#378dff',
          border: '1px solid #bbf7d0',
          fontSize: '0.7rem',
          fontWeight: '600',
        }}
      >
        <FaCheckCircle className='me-1' size={10} />
        Signed
      </span>
    );
  }

  if (doc.signature_required) {
    return (
      <span
        className='badge rounded-pill px-3 py-2 d-flex align-items-center'
        style={{
          backgroundColor: '#fef3c7',
          color: '#d97706',
          border: '1px solid #fed7aa',
          fontSize: '0.7rem',
          fontWeight: '600',
        }}
      >
        <FaClock className='me-1' size={10} />
        Pending
      </span>
    );
  }

  return (
    <span
      className='badge rounded-pill px-3 py-2 d-flex align-items-center'
      style={{
        backgroundColor: '#f1f5f9',
        color: '#008643',
        border: '1px solid #e2e8f0',
        fontSize: '0.7rem',
        fontWeight: '600',
      }}
    >
      <FaFileAlt className='me-1' size={10} />
      Complete
    </span>
  );
};

export default StatusBadge;
