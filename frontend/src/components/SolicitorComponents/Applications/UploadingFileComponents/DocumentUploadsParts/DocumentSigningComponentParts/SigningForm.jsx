// SigningForm.jsx - Extracted signing form component
import { useRef } from 'react';
import {
  FaExclamationTriangle,
  FaFileAlt,
  FaFileSignature,
  FaTimes,
} from 'react-icons/fa';
import SignatureCanvas from 'react-signature-canvas';
import LoadingComponent from '../../../../../GenericComponents/LoadingComponent';

const SigningForm = ({
  documentData,
  acceptedFiles,
  solicitorFullName,
  setSolicitorFullName,
  checkboxChecked,
  setCheckboxChecked,
  confirmationMessage,
  signatureProvided,
  setSignatureProvided,
  isLoading,
  isUploadingFiles,
  fetchingDocument,
  onSignDocument,
  mode,
}) => {
  const signaturePadRef = useRef(null);

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setSignatureProvided(false);
    }
  };

  const getSignerLabel = () => {
    if (documentData?.who_needs_to_sign === 'applicant')
      return 'Agreement Applicant';
    if (documentData?.who_needs_to_sign === 'solicitor')
      return 'Assigned Solicitor';
    return 'Signer';
  };

  const handleSignDocument = () => {
    if (signaturePadRef.current) {
      onSignDocument(signaturePadRef);
    }
  };

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li
      key={`${file.name}-${file.lastModified || 'existing'}`}
      className='list-group-item d-flex justify-content-between align-items-center'
    >
      <div>
        <strong>{file.name}</strong>
        <small className='text-muted d-block'>
          {file.size
            ? `${Math.round(file.size / 1024)} KB`
            : 'Existing document'}
        </small>
      </div>
      <span className='badge bg-success rounded-pill'>Ready</span>
    </li>
  ));

  return (
    <div className='card-body'>
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '0',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        className='shadow-lg'
      >
        <div className='p-2'>
          <div className='card-body p-0'>
            {/* Document Info for Sign Mode */}
            {mode === 'sign' && documentData && (
              <div
                className='alert alert-info border-0'
                style={{
                  background:
                    'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                  borderRadius: '12px',
                  marginBottom: '15px',
                  padding: '0.75rem 1rem',
                }}
              >
                <div className='d-flex align-items-center'>
                  <FaFileAlt className='text-primary me-3' size={20} />
                  <div>
                    <h6
                      className='alert-heading mb-1'
                      style={{ fontSize: '0.9rem' }}
                    >
                      Document Ready for Signing
                    </h6>
                    <p className='mb-0' style={{ fontSize: '0.85rem' }}>
                      <strong>{documentData.original_name}</strong> is loaded
                      and ready for your signature.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Documents to Sign */}
            <div className='mb-2'>
              <h6
                className='fw-bold text-dark mb-2'
                style={{ fontSize: '0.9rem' }}
              >
                Document{mode === 'upload' ? 's' : ''} to Sign
              </h6>
              {acceptedFiles.length > 0 ? (
                <ul className='list-group list-group-flush'>
                  {acceptedFileItems}
                </ul>
              ) : (
                <div
                  className='alert alert-warning border-0 py-2'
                  style={{ borderRadius: '12px' }}
                >
                  <small>
                    {mode === 'sign' && fetchingDocument
                      ? 'Loading document...'
                      : 'No document loaded yet.'}
                  </small>
                </div>
              )}
            </div>

            {/* Signature Pad */}
            <div className='signature-container mb-2'>
              <h6
                className='fw-bold text-dark mb-2 text-center'
                style={{ fontSize: '0.9rem' }}
              >
                Draw <span className='text-primary'>{getSignerLabel()}</span>{' '}
                Signature
              </h6>
              <div className='text-center'>
                <div
                  className='mx-auto'
                  style={{
                    border: '2px solid #667eea',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '500px',
                    height: '120px',
                    marginBottom: '10px',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <SignatureCanvas
                    ref={signaturePadRef}
                    penColor='#667eea'
                    canvasProps={{
                      width: 500,
                      height: 120,
                      className: 'sigCanvas',
                      style: { width: '100%', height: '100%' },
                    }}
                    onEnd={() => {
                      setSignatureProvided(true);
                    }}
                  />
                </div>
                <button
                  onClick={clearSignature}
                  className='btn btn-outline-secondary btn-sm'
                  style={{ borderRadius: '8px' }}
                >
                  <FaTimes className='me-1' size={12} />
                  Clear Signature
                </button>
              </div>
            </div>

            {/* Input for Signer Full Name */}
            <div className='form-group mb-2'>
              <label
                htmlFor='solicitorFullName'
                className='form-label fw-bold'
                style={{ fontSize: '0.9rem' }}
              >
                <span className='text-primary'>{getSignerLabel()}</span> Full
                Name
              </label>
              <input
                type='text'
                className='form-control'
                id='solicitorFullName'
                value={solicitorFullName}
                onChange={(e) => setSolicitorFullName(e.target.value)}
                placeholder={`Enter ${getSignerLabel()} Full Name`}
                required
                style={{
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 0.75rem',
                }}
              />
            </div>

            {/* Checkbox for Confirmation */}
            <div className='mb-2'>
              <div
                className='card border-0'
                style={{
                  background:
                    'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: '12px',
                }}
              >
                <div className='card-body p-3'>
                  <div className='form-check'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id='solicitorConfirmationCheckbox'
                      checked={checkboxChecked}
                      onChange={(e) => setCheckboxChecked(e.target.checked)}
                      style={{
                        transform: 'scale(1.2)',
                      }}
                    />
                    <label
                      className='form-check-label ms-2'
                      htmlFor='solicitorConfirmationCheckbox'
                    >
                      <div
                        className='text-primary fw-bold'
                        style={{ fontSize: '0.85rem' }}
                      >
                        {confirmationMessage}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning for Sign Mode */}
            {mode === 'sign' && (
              <div
                className='alert alert-warning border-0 py-2 mb-2'
                style={{ borderRadius: '12px' }}
              >
                <small className='text-muted'>
                  <FaExclamationTriangle className='me-2' />
                  You are signing an existing document. Please ensure all
                  details are correct before proceeding.
                </small>
              </div>
            )}

            {/* Sign Button */}
            <div className='text-center'>
              <button
                onClick={handleSignDocument}
                className='btn btn-lg px-4 py-2 fw-bold'
                disabled={
                  acceptedFiles.length < 1 ||
                  !checkboxChecked ||
                  !solicitorFullName ||
                  !signatureProvided ||
                  isLoading ||
                  fetchingDocument
                }
                style={{
                  background:
                    acceptedFiles.length >= 1 &&
                    checkboxChecked &&
                    solicitorFullName &&
                    signatureProvided &&
                    !fetchingDocument
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                      : '#e2e8f0',
                  color:
                    acceptedFiles.length >= 1 &&
                    checkboxChecked &&
                    solicitorFullName &&
                    signatureProvided &&
                    !fetchingDocument
                      ? 'white'
                      : '#9ca3af',
                  border: 'none',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow:
                    acceptedFiles.length >= 1 &&
                    checkboxChecked &&
                    solicitorFullName &&
                    signatureProvided &&
                    !fetchingDocument
                      ? '0 4px 15px rgba(245, 158, 11, 0.3)'
                      : 'none',
                }}
              >
                {isUploadingFiles ? (
                  <LoadingComponent
                    message={
                      mode === 'sign'
                        ? 'Signing document...'
                        : 'Uploading document...'
                    }
                  />
                ) : fetchingDocument ? (
                  <LoadingComponent message='Loading document...' />
                ) : (
                  <>
                    <FaFileSignature className='me-2' />
                    {mode === 'sign'
                      ? 'Sign Document'
                      : 'Sign and Upload Document'}
                  </>
                )}
              </button>

              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className='mt-2 text-muted small'>
                  Debug: Files: {acceptedFiles.length}, Checkbox:{' '}
                  {checkboxChecked ? 'Y' : 'N'}, Name:{' '}
                  {solicitorFullName ? 'Y' : 'N'}, Signature:{' '}
                  {signatureProvided ? 'Y' : 'N'}, Fetching:{' '}
                  {fetchingDocument ? 'Y' : 'N'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigningForm;
