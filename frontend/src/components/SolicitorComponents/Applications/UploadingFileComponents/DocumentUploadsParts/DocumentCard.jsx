import {
  FaDownload,
  FaExclamationTriangle,
  FaFileAlt,
  FaFileSignature,
  FaUser,
  FaUserTie,
} from 'react-icons/fa';
import { downloadFileAxios } from '../../../../GenericFunctions/AxiosGenericFunctions.jsx';
import StatusBadge from './StatusBadge';

const DocumentCard = ({ doc, token, onSignDocument }) => {
  const downloadFile = async (fileUrl) => {
    const fileName = fileUrl.split('/').pop();
    try {
      const endpoint = `/api/applications/solicitor_applications/document_file/download/${fileName}/`;
      const response = await downloadFileAxios(token, endpoint);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const getDocumentType = (doc) => {
    const fileName = doc.original_name || '';
    if (fileName.toLowerCase().includes('agreement')) return 'Agreement';
    if (fileName.toLowerCase().includes('contract')) return 'Contract';
    if (fileName.toLowerCase().includes('form')) return 'Form';
    if (fileName.toLowerCase().includes('letter')) return 'Letter';
    if (fileName.toLowerCase().includes('statement')) return 'Statement';
    if (fileName.toLowerCase().includes('report')) return 'Report';
    if (fileName.toLowerCase().includes('certificate')) return 'Certificate';
    if (fileName.toLowerCase().includes('receipt')) return 'Receipt';
    if (fileName.toLowerCase().includes('invoice')) return 'Invoice';
    return 'Document';
  };

  const getSignerIcon = (signer) => {
    return signer === 'applicant' ? (
      <FaUser className='text-primary' size={12} />
    ) : (
      <FaUserTie className='text-secondary' size={12} />
    );
  };

  return (
    <div
      className='card border-0 h-100 position-relative'
      style={{
        borderRadius: '16px',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        overflow: 'hidden',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow =
          '0 25px 50px -12px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.background =
          'linear-gradient(145deg, #ffffff 0%, #ffffff 100%)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.background =
          'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)';
      }}
    >
      {/* Animated Border */}
      <div
        className='position-absolute'
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: doc.is_signed
            ? 'linear-gradient(90deg, #10b981, #059669)'
            : doc.signature_required
            ? 'linear-gradient(90deg, #f59e0b, #d97706)'
            : 'linear-gradient(90deg, #6b7280, #4b5563)',
        }}
      ></div>

      {/* Status Badge */}
      <div
        className='position-absolute'
        style={{
          top: '16px',
          right: '16px',
          zIndex: 2,
        }}
      >
        <StatusBadge doc={doc} />
      </div>

      <div className='card-body p-4'>
        {/* Document Header */}
        <div className='d-flex align-items-start mb-3'>
          <div
            className='rounded-3 d-flex align-items-center justify-content-center me-3'
            style={{
              width: '48px',
              height: '48px',
              background: doc.is_signed
                ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                : doc.signature_required
                ? 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)'
                : 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
              color: doc.is_signed
                ? '#16a34a'
                : doc.signature_required
                ? '#d97706'
                : '#0891b2',
              border: `2px solid ${
                doc.is_signed
                  ? '#bbf7d0'
                  : doc.signature_required
                  ? '#fed7aa'
                  : '#bae6fd'
              }`,
            }}
          >
            <FaFileAlt size={18} />
          </div>
          <div className='flex-grow-1'>
            <div className='d-flex align-items-center mb-1'>
              <h6
                className='mb-0 fw-bold text-dark me-2'
                style={{ fontSize: '0.9rem' }}
              >
                {getDocumentType(doc)}
              </h6>
              <span
                className='badge'
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '0.65rem',
                  fontWeight: '500',
                }}
              >
                ID: {doc.id}
              </span>
            </div>
            <p
              className='mb-0 text-muted'
              style={{
                fontSize: '0.8rem',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {doc.original_name}
            </p>
          </div>
        </div>

        {/* Document Details */}
        <div className='mb-3'>
          <div className='row g-2 text-center'>
            <div className='col-4'>
              <div
                className='p-2 rounded-3'
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  className='fw-bold text-dark'
                  style={{ fontSize: '0.8rem' }}
                >
                  App
                </div>
                <div className='text-muted' style={{ fontSize: '0.7rem' }}>
                  #{doc.application}
                </div>
              </div>
            </div>
            <div className='col-4'>
              <div
                className='p-2 rounded-3'
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  className='fw-bold text-dark'
                  style={{ fontSize: '0.8rem' }}
                >
                  Status
                </div>
                <div className='text-muted' style={{ fontSize: '0.7rem' }}>
                  {doc.is_signed ? 'Signed' : 'Unsigned'}
                </div>
              </div>
            </div>
            <div className='col-4'>
              <div
                className='p-2 rounded-3'
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  className='fw-bold text-dark'
                  style={{ fontSize: '0.8rem' }}
                >
                  Format
                </div>
                <div className='text-muted' style={{ fontSize: '0.7rem' }}>
                  {doc.document
                    ? doc.document.split('.').pop()?.toUpperCase() || 'FILE'
                    : 'FILE'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Info */}
        {doc.signature_required && (
          <div
            className='mb-3 p-3 rounded-3'
            style={{
              background: doc.is_signed
                ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                : 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
              border: `1px solid ${doc.is_signed ? '#bbf7d0' : '#fed7aa'}`,
            }}
          >
            <div className='d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center'>
                {getSignerIcon(doc.who_needs_to_sign)}
                <div className='ms-2'>
                  <div
                    className='fw-bold'
                    style={{
                      color: doc.is_signed ? '#16a34a' : '#d97706',
                      fontSize: '0.8rem',
                    }}
                  >
                    {doc.who_needs_to_sign === 'applicant'
                      ? 'Applicant'
                      : 'Solicitor'}{' '}
                    Signature
                  </div>
                  <div className='text-muted' style={{ fontSize: '0.7rem' }}>
                    {doc.is_signed
                      ? 'Document has been signed'
                      : 'Signature required to proceed'}
                  </div>
                </div>
              </div>
              {!doc.is_signed && (
                <FaExclamationTriangle size={16} style={{ color: '#d97706' }} />
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='d-flex gap-2'>
          <button
            className='btn flex-fill'
            onClick={() => downloadFile(doc.document)}
            style={{
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '600',
              padding: '0.6rem',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#e2e8f0';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FaDownload className='me-2' size={12} />
            Download
          </button>

          {doc.signature_required && !doc.is_signed && (
            <button
              className='btn flex-fill'
              onClick={() => onSignDocument(doc)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                padding: '0.6rem',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.target.style.background =
                  'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background =
                  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaFileSignature className='me-2' size={12} />
              Sign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
