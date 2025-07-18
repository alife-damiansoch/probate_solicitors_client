import { FaFileSignature } from 'react-icons/fa';
import DocumentSigningComponent from './DocumentSigningComponent';

const SigningModal = ({
  showSigningModal,
  selectedDocumentForSigning,
  application,
  onClose,
  onSigningComplete,
}) => {
  if (!showSigningModal || !selectedDocumentForSigning) {
    return null;
  }

  return (
    <div
      className='modal show d-block'
      style={{
        backgroundColor: 'var(--primary-50)',
        zIndex: 1050,
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className='modal-dialog modal-xl modal-dialog-centered'>
        <div
          className='modal-content'
          style={{
            borderRadius: '20px',
            border: '1px solid var(--border-primary)',
            background: 'var(--surface-primary)',
            boxShadow: '0 25px 50px var(--primary-30)',
          }}
        >
          <div
            className='modal-header'
            style={{
              background: 'var(--gradient-header)',
              color: 'var(--text-primary)',
              borderRadius: '20px 20px 0 0',
              border: 'none',
              borderBottom: '1px solid var(--border-primary)',
            }}
          >
            <h5
              className='modal-title'
              style={{ color: 'var(--text-primary)' }}
            >
              <FaFileSignature
                className='me-2'
                style={{ color: 'var(--warning-primary)' }}
              />
              Sign Document: {selectedDocumentForSigning.original_name}
            </h5>
            <button
              type='button'
              className='btn-close'
              onClick={onClose}
              style={{
                filter: 'invert(1) brightness(0.8)',
                opacity: 0.9,
              }}
            ></button>
          </div>
          <div
            className='modal-body p-0'
            style={{ background: 'var(--surface-primary)' }}
          >
            <DocumentSigningComponent
              applicationId={application.id}
              documentId={selectedDocumentForSigning.id}
              mode='sign'
              existingDocument={selectedDocumentForSigning}
              onSigningComplete={onSigningComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigningModal;
