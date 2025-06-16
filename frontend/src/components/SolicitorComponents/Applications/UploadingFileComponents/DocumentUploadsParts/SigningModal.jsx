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
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className='modal-dialog modal-xl modal-dialog-centered'>
        <div
          className='modal-content'
          style={{ borderRadius: '20px', border: 'none' }}
        >
          <div
            className='modal-header'
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '20px 20px 0 0',
            }}
          >
            <h5 className='modal-title'>
              <FaFileSignature className='me-2' />
              Sign Document: {selectedDocumentForSigning.original_name}
            </h5>
            <button
              type='button'
              className='btn-close btn-close-white'
              onClick={onClose}
            ></button>
          </div>
          <div className='modal-body p-0'>
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
