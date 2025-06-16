import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  FaExclamationTriangle,
  FaFileAlt,
  FaFileSignature,
  FaTimes,
} from 'react-icons/fa';
import { TbClick } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { API_URL } from '../../../../../baseUrls';
import {
  fetchData,
  fetchDocumentForSigning,
  uploadFile,
} from '../../../../GenericFunctions/AxiosGenericFunctions';

import LoadingComponent from '../../../../GenericComponents/LoadingComponent';
import {
  getDeviceInfo,
  getPublicIp,
} from '../../../../GenericFunctions/HelperGenericFunctions';

const DocumentSigningComponent = ({
  applicationId,
  documentId,
  existingDocument = null,
  mode = 'upload', // 'upload' for new documents, 'sign' for existing documents
  onSigningComplete = null,
}) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [fileRejections, setFileRejections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [solicitorFullName, setSolicitorFullName] = useState('');
  const [signatureProvided, setSignatureProvided] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [documentData, setDocumentData] = useState(existingDocument);
  const [fetchingDocument, setFetchingDocument] = useState(false);
  const signaturePadRef = useRef(null);
  const navigate = useNavigate();

  // Get token
  let tokenObj = Cookies.get('auth_token');
  let token = null;
  if (tokenObj) {
    tokenObj = JSON.parse(tokenObj);
    token = tokenObj.access;
  }

  // Fetch existing document if in sign mode
  useEffect(() => {
    const fetchExistingDocument = async () => {
      if (mode === 'sign' && documentId && token) {
        setFetchingDocument(true);
        console.log('Starting to fetch document for signing...', {
          documentId,
          applicationId,
        });

        try {
          // First get document details
          const docDetailsResponse = await fetchData(
            token,
            `/api/applications/solicitor_applications/document_file/${applicationId}/`
          );
          const documents = docDetailsResponse.data;
          console.log('All documents:', documents);

          const targetDoc = documents.find(
            (doc) => doc.id === parseInt(documentId)
          );
          console.log('Target document found:', targetDoc);

          if (targetDoc) {
            setDocumentData(targetDoc);

            // Fetch the actual file
            const fileName = targetDoc.document.split('/').pop();
            console.log('Fetching file:', fileName);

            try {
              const fileResponse = await fetchDocumentForSigning(
                token,
                `/api/applications/solicitor_applications/document_file/download/${fileName}/`
              );
              console.log('File response:', fileResponse);

              if (fileResponse && fileResponse.data) {
                // Ensure filename has .pdf extension
                let fileName = targetDoc.original_name;
                if (!fileName.toLowerCase().endsWith('.pdf')) {
                  fileName = fileName + '.pdf';
                }

                // Convert blob to file object with proper MIME type and PDF extension
                const file = new File([fileResponse.data], fileName, {
                  type: 'application/pdf', // Explicitly set PDF MIME type
                  lastModified: Date.now(),
                });

                console.log('Created file object:', {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  hasExtension: file.name.toLowerCase().endsWith('.pdf'),
                });

                // Set the file in acceptedFiles so the form validation works
                setAcceptedFiles([file]);
                console.log('Document loaded for signing successfully!');
              } else {
                console.error('No file data received');
              }
            } catch (fileError) {
              console.error('Error fetching file:', fileError);

              // Fallback: create a placeholder file for testing with proper PDF name
              console.log('Creating placeholder file for testing...');
              const placeholderFile = new File(
                ['placeholder'],
                targetDoc.original_name.endsWith('.pdf')
                  ? targetDoc.original_name
                  : targetDoc.original_name + '.pdf',
                {
                  type: 'application/pdf',
                  lastModified: Date.now(),
                }
              );
              setAcceptedFiles([placeholderFile]);
            }
          } else {
            console.error('Target document not found');
          }
        } catch (error) {
          console.error('Error fetching document details:', error);
        } finally {
          setFetchingDocument(false);
          console.log('Finished fetching document');
        }
      }
    };

    fetchExistingDocument();
  }, [mode, documentId, applicationId, token]);

  // Set confirmation message based on document type
  useEffect(() => {
    if (documentData) {
      if (documentData.is_undertaking) {
        setConfirmationMessage(
          'I confirm that I am the solicitor currently assigned to this application.'
        );
      } else if (documentData.is_loan_agreement) {
        setConfirmationMessage(
          'By signing this agreement, you are confirming that you have read the Pre-contract Information, Adequate Explanation, Privacy Notice, and Terms & Conditions, and had the opportunity to ask for further information.'
        );
      } else {
        setConfirmationMessage(
          'I confirm the details and agree to sign this document.'
        );
      }
    }
  }, [documentData]);

  const validExtensions = useMemo(() => ['.pdf'], []);

  const signDocumentHandler = async () => {
    setIsLoading(true);
    setIsUploadingFiles(true);

    // Get the public IP of the client
    const publicIp = await getPublicIp();
    const deviceInfo = getDeviceInfo();

    console.log('Device info:', deviceInfo);

    // Check if we have a file
    if (acceptedFiles.length < 1) {
      setIsLoading(false);
      alert('No document available. Please try again.');
      return;
    }

    // Check if the signature pad has been signed
    if (!signaturePadRef.current) {
      setIsLoading(false);
      alert('Please provide a signature.');
      return;
    }

    const canvas = signaturePadRef.current.getCanvas();
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;

    // Create a new canvas context and set a white background
    const context = newCanvas.getContext('2d');
    context.fillStyle = 'white'; // Set white background
    context.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw the existing signature on top of the white background
    context.drawImage(canvas, 0, 0);

    // Convert the new canvas with white background to a base64 string
    const signatureBase64 = newCanvas.toDataURL('image/png');
    console.log('Signature created');

    try {
      const file = acceptedFiles[0];
      console.log('File to be processed:', {
        name: file.name,
        size: file.size,
        type: file.type,
        endsWithPdf: file.name.toLowerCase().endsWith('.pdf'),
        constructor: file.constructor.name,
      });

      const formData = new FormData();

      // ALWAYS add the document file - this is required by your backend
      formData.append('document', file, file.name);
      console.log('Added file to FormData with name:', file.name);

      // Add document ID for signing mode
      if (mode === 'sign' && documentId) {
        formData.append('document_id', documentId);
      }

      // Add all the same fields as your original component
      formData.append('signature_image', signatureBase64);
      formData.append('solicitor_full_name', solicitorFullName);
      formData.append('confirmation', checkboxChecked ? 'true' : 'false');
      formData.append('confirmation_message', confirmationMessage);
      formData.append('is_undertaking', documentData?.is_undertaking || false);
      formData.append(
        'is_loan_agreement',
        documentData?.is_loan_agreement || false
      );
      formData.append('device_info', JSON.stringify(deviceInfo));

      // Include the public IP in the form data
      if (publicIp) {
        formData.append('ip_address', publicIp);
      }

      console.log('FormData prepared with document file');

      // For both sign and upload modes, use the upload endpoint since your backend expects the file
      const endpoint = `${API_URL}/api/signed_documents/upload/${applicationId}/`;

      // Use your uploadFile function
      const response = await uploadFile(endpoint, formData);

      if (response.status === 201) {
        setIsLoading(false);
        if (onSigningComplete) {
          onSigningComplete();
        } else {
          navigate(`/applications/${applicationId}`);
        }
      } else {
        setIsLoading(false);
        console.error('Error processing document:', response);
        alert('Error processing document. Please try again.');
      }
    } catch (error) {
      console.error(`Error processing document:`, error);
      setIsLoading(false);
      alert('Error processing document. Please try again.');
    }

    setIsUploadingFiles(false);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (mode === 'sign') {
        // Don't allow file drops in sign mode
        return;
      }

      let newAcceptedFiles = [];
      let newFileRejections = [...fileRejections];

      if (acceptedFiles.length > 0) {
        const lastAcceptedFile = acceptedFiles[acceptedFiles.length - 1];

        if (acceptedFiles.length > 1) {
          acceptedFiles.slice(0, -1).forEach((file) => {
            newFileRejections.push({
              file,
              errors: [
                {
                  code: 'file-replaced',
                  message: 'This file was replaced by a newer one.',
                },
              ],
            });
          });
        }

        const fileExtension = lastAcceptedFile.name
          .slice(lastAcceptedFile.name.lastIndexOf('.'))
          .toLowerCase();
        if (validExtensions.includes(fileExtension)) {
          newAcceptedFiles = [lastAcceptedFile];
        } else {
          newFileRejections.push({
            file: lastAcceptedFile,
            errors: [
              { code: 'file-invalid-type', message: 'File type not accepted.' },
            ],
          });
        }
      }

      setAcceptedFiles(newAcceptedFiles);
      setFileRejections(newFileRejections);
    },
    [fileRejections, validExtensions, mode]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    disabled: mode === 'sign', // Disable dropzone in sign mode
  });

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

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li
      key={`${file.name}-${file.lastModified}`}
      className='list-group-item list-group-item-danger'
    >
      <strong>{file.name}</strong> - {Math.round(file.size / 1024)} KB
      <ul className='mb-0 mt-1'>
        {errors.map((e) => (
          <li key={e.code} className='text-danger small'>
            {e.message}
          </li>
        ))}
      </ul>
    </li>
  ));

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setSignatureProvided(false);
    }
  };

  const getDocumentTypeLabel = () => {
    if (documentData?.is_undertaking) return 'Solicitor Undertaking';
    if (documentData?.is_loan_agreement) return 'Advancement Agreement';
    return 'Document';
  };

  const getSignerLabel = () => {
    if (documentData?.who_needs_to_sign === 'applicant')
      return 'Agreement Applicant';
    if (documentData?.who_needs_to_sign === 'solicitor')
      return 'Assigned Solicitor';
    return 'Signer';
  };

  if (fetchingDocument) {
    return (
      <div className='text-center py-3'>
        <LoadingComponent message='Loading document for signing...' />
      </div>
    );
  }

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
        {mode === 'upload' && (
          <div
            className='card-header'
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px 16px 0 0',
              padding: '0.75rem 1rem',
            }}
          >
            <h5 className='card-title mb-0'>
              Upload{' '}
              <span className='text-warning'>{getDocumentTypeLabel()}</span>{' '}
              Document
            </h5>
          </div>
        )}

        <div className='p-2'>
          <div className='card-body p-0'>
            {mode === 'upload' && (
              <div
                {...getRootProps({ className: 'dropzone' })}
                style={{
                  border: '2px dashed #667eea',
                  padding: '20px',
                  textAlign: 'center',
                  borderRadius: '12px',
                  background:
                    'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
                  marginBottom: '15px',
                }}
              >
                <input {...getInputProps()} />
                <div className='row mx-1'>
                  <div className='col-10'>
                    <p className='mb-1'>
                      Drag & drop a{' '}
                      <span className='text-primary fw-bold'>
                        {getDocumentTypeLabel()}
                      </span>{' '}
                      (PDF) document here, or click to select a file.
                    </p>
                    <em className='text-muted' style={{ fontSize: '0.8rem' }}>
                      (Only one PDF file is accepted)
                    </em>
                  </div>
                  <div className='col-2'>
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 0.9, 1] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: 'loop',
                        repeatDelay: 0.5,
                      }}
                    >
                      <TbClick size={30} className='text-primary' />
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

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

              {fileRejectionItems.length > 0 && (
                <>
                  <h6
                    className='fw-bold text-danger mt-2 mb-1'
                    style={{ fontSize: '0.8rem' }}
                  >
                    Rejected Files
                  </h6>
                  <ul className='list-group list-group-flush'>
                    {fileRejectionItems}
                  </ul>
                </>
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

            <div className='text-center'>
              <button
                onClick={signDocumentHandler}
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

export default DocumentSigningComponent;
