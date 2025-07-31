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
      <FaUser style={{ color: 'var(--primary-blue)' }} size={12} />
    ) : (
      <FaUserTie style={{ color: 'var(--text-secondary)' }} size={12} />
    );
  };

  return (
    <div
      className='card border-0 h-100 position-relative'
      style={{
        borderRadius: '16px',
        background: 'var(--gradient-surface)',
        border: '1px solid var(--border-muted)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        overflow: 'hidden',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = '0 25px 50px -12px var(--primary-20)';
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.background = 'var(--surface-primary)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.background = 'var(--gradient-surface)';
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
            ? 'linear-gradient(90deg, var(--success-primary), var(--success-dark))'
            : doc.signature_required
            ? 'linear-gradient(90deg, var(--warning-primary), var(--warning-dark))'
            : 'linear-gradient(90deg, var(--text-muted), var(--text-disabled))',
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
                ? 'var(--success-20)'
                : doc.signature_required
                ? 'var(--warning-20)'
                : 'var(--primary-20)',
              color: doc.is_signed
                ? 'var(--success-primary)'
                : doc.signature_required
                ? 'var(--warning-primary)'
                : 'var(--primary-blue)',
              border: `2px solid ${
                doc.is_signed
                  ? 'var(--success-30)'
                  : doc.signature_required
                  ? 'var(--warning-30)'
                  : 'var(--primary-30)'
              }`,
            }}
          >
            <FaFileAlt size={18} />
          </div>
          <div className='flex-grow-1'>
            <div className='d-flex align-items-center mb-1'>
              <h6
                className='mb-0 fw-bold me-2 text-break'
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-primary)',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  maxWidth: '50%', // optional, ensures it doesn't grow too wide
                }}
              >
                {doc.original_name}
              </h6>

              <span
                className='badge'
                style={{
                  backgroundColor: 'var(--surface-secondary)',
                  color: 'var(--text-muted)',
                  fontSize: '0.65rem',
                  fontWeight: '500',
                }}
              >
                ID: {doc.id}
              </span>
            </div>
            <p
              className='mb-0'
              style={{
                fontSize: '0.8rem',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                color: 'var(--text-muted)',
              }}
            >
              {getDocumentType(doc)}
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
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-muted)',
                }}
              >
                <div
                  className='fw-bold'
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  App
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  #{doc.application}
                </div>
              </div>
            </div>
            <div className='col-4'>
              <div
                className='p-2 rounded-3'
                style={{
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-muted)',
                }}
              >
                <div
                  className='fw-bold'
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  Status
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {doc.is_signed ? 'Signed' : 'Unsigned'}
                </div>
              </div>
            </div>
            <div className='col-4'>
              <div
                className='p-2 rounded-3'
                style={{
                  backgroundColor: 'var(--surface-secondary)',
                  border: '1px solid var(--border-muted)',
                }}
              >
                <div
                  className='fw-bold'
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                  }}
                >
                  Format
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                  }}
                >
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
                ? 'var(--success-20)'
                : 'var(--warning-20)',
              border: `1px solid ${
                doc.is_signed ? 'var(--success-30)' : 'var(--warning-30)'
              }`,
            }}
          >
            <div className='d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center'>
                {getSignerIcon(doc.who_needs_to_sign)}
                <div className='ms-2'>
                  <div
                    className='fw-bold'
                    style={{
                      color: doc.is_signed
                        ? 'var(--success-primary)'
                        : 'var(--warning-primary)',
                      fontSize: '0.8rem',
                    }}
                  >
                    {doc.who_needs_to_sign === 'applicant'
                      ? 'Applicant'
                      : 'Solicitor'}{' '}
                    Signature
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {doc.is_signed
                      ? 'Document has been signed'
                      : 'Signature required to proceed'}
                  </div>
                </div>
              </div>
              {!doc.is_signed && (
                <FaExclamationTriangle
                  size={16}
                  style={{ color: 'var(--warning-primary)' }}
                />
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
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-secondary)',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '600',
              padding: '0.6rem',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'var(--surface-tertiary)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'var(--surface-secondary)';
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
                background:
                  'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))',
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
                  'linear-gradient(135deg, var(--warning-dark), var(--warning-primary))';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background =
                  'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))';
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
