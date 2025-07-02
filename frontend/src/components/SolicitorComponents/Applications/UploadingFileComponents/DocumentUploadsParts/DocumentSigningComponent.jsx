// DocumentSigningComponent.jsx - Main refactored component
import Cookies from 'js-cookie';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../../baseUrls';
import LoadingComponent from '../../../../GenericComponents/LoadingComponent';
import {
  fetchData,
  fetchDocumentForSigning,
  uploadFile,
} from '../../../../GenericFunctions/AxiosGenericFunctions';
import {
  getDeviceInfo,
  getPublicIp,
} from '../../../../GenericFunctions/HelperGenericFunctions';

// Import our new components
import DocumentModal from './DocumentSigningComponentParts/DocumentModal';
import DocumentReadingProgress from './DocumentSigningComponentParts/DocumentReadingProgress';
import SigningForm from './DocumentSigningComponentParts/SigningForm';
import UploadDropzone from './DocumentSigningComponentParts/UploadDropzone';

const DocumentSigningComponent = ({
  applicationId,
  documentId,
  existingDocument = null,
  mode = 'upload', // 'upload' for new documents, 'sign' for existing documents
  onSigningComplete = null,
}) => {
  // Existing state
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

  // New state for document reading flow
  const [allDocuments, setAllDocuments] = useState([]);
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [readDocuments, setReadDocuments] = useState([]);
  const [currentModalDocument, setCurrentModalDocument] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showSigningForm, setShowSigningForm] = useState(false);

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

          // Store all documents
          setAllDocuments(documents);

          const targetDoc = documents.find(
            (doc) => doc.id === parseInt(documentId)
          );
          console.log('Target document found:', targetDoc);

          if (targetDoc) {
            setDocumentData(targetDoc);

            // Check if this is a loan agreement that requires pre-reading
            if (targetDoc.is_loan_agreement) {
              // Filter documents that need to be read first
              const docsToRead = documents.filter(
                (doc) => doc.is_terms_of_business || doc.is_secci
              );
              console.log('Documents requiring pre-reading:', docsToRead);
              setRequiredDocuments(docsToRead);

              // If there are documents to read, don't show signing form yet
              if (docsToRead.length > 0) {
                setShowSigningForm(false);
                return;
              }
            }

            // If no pre-reading required, load the document for signing
            await loadDocumentFile(targetDoc);
            setShowSigningForm(true);
          } else {
            console.error('Target document not found');
          }
        } catch (error) {
          console.error('Error fetching document details:', error);
        } finally {
          setFetchingDocument(false);
          console.log('Finished fetching document');
        }
      } else if (mode === 'upload') {
        setShowSigningForm(true);
      }
    };

    fetchExistingDocument();
  }, [mode, documentId, applicationId, token]);

  // Load document file
  const loadDocumentFile = async (doc) => {
    try {
      const fileName = doc.document.split('/').pop();
      console.log('Fetching file:', fileName);

      const fileResponse = await fetchDocumentForSigning(
        token,
        `/api/applications/solicitor_applications/document_file/download/${fileName}/`
      );
      console.log('File response:', fileResponse);

      if (fileResponse && fileResponse.data) {
        let fileNameToUse = doc.original_name;
        if (!fileNameToUse.toLowerCase().endsWith('.pdf')) {
          fileNameToUse = fileNameToUse + '.pdf';
        }

        const file = new File([fileResponse.data], fileNameToUse, {
          type: 'application/pdf',
          lastModified: Date.now(),
        });

        console.log('Created file object:', {
          name: file.name,
          size: file.size,
          type: file.type,
          hasExtension: file.name.toLowerCase().endsWith('.pdf'),
        });

        setAcceptedFiles([file]);
        console.log('Document loaded for signing successfully!');
      } else {
        console.error('No file data received');
      }
    } catch (fileError) {
      console.error('Error fetching file:', fileError);
      // Fallback: create a placeholder file
      const placeholderFile = new File(
        ['placeholder'],
        doc.original_name.endsWith('.pdf')
          ? doc.original_name
          : doc.original_name + '.pdf',
        {
          type: 'application/pdf',
          lastModified: Date.now(),
        }
      );
      setAcceptedFiles([placeholderFile]);
    }
  };

  // Set confirmation message based on document type
  useEffect(() => {
    if (documentData) {
      if (documentData.is_undertaking) {
        setConfirmationMessage(
          'I confirm that I am the solicitor currently assigned to this application.'
        );
      } else if (documentData.is_loan_agreement) {
        setConfirmationMessage(
          'By signing this agreement, you are confirming that you have read the Terms & Conditions, SECCI documentation, Pre-contract Information, Adequate Explanation, Privacy Notice, and had the opportunity to ask for further information.'
        );
      } else {
        setConfirmationMessage(
          'I confirm the details and agree to sign this document.'
        );
      }
    }
  }, [documentData]);

  const validExtensions = useMemo(() => ['.pdf'], []);

  // Document reading handlers
  const handleDocumentClick = (document) => {
    setCurrentModalDocument(document);
    setShowDocumentModal(true);
  };

  const handleDocumentRead = (document) => {
    setReadDocuments((prev) => {
      if (!prev.some((doc) => doc.id === document.id)) {
        return [...prev, document];
      }
      return prev;
    });
  };

  const handleProceedToSigning = async () => {
    if (documentData) {
      await loadDocumentFile(documentData);
      setShowSigningForm(true);
    }
  };

  const allDocumentsRead =
    requiredDocuments.length > 0 &&
    readDocuments.length === requiredDocuments.length;

  // Original signing handler
  const signDocumentHandler = async (signaturePadRef) => {
    setIsLoading(true);
    setIsUploadingFiles(true);

    const publicIp = await getPublicIp();
    const deviceInfo = getDeviceInfo();

    if (acceptedFiles.length < 1) {
      setIsLoading(false);
      alert('No document available. Please try again.');
      return;
    }

    if (!signaturePadRef.current) {
      setIsLoading(false);
      alert('Please provide a signature.');
      return;
    }

    const canvas = signaturePadRef.current.getCanvas();
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;

    const context = newCanvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, newCanvas.width, newCanvas.height);
    context.drawImage(canvas, 0, 0);

    const signatureBase64 = newCanvas.toDataURL('image/png');

    try {
      const file = acceptedFiles[0];
      const formData = new FormData();

      formData.append('document', file, file.name);

      if (mode === 'sign' && documentId) {
        formData.append('document_id', documentId);
      }

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

      if (publicIp) {
        formData.append('ip_address', publicIp);
      }

      const endpoint = `${API_URL}/api/signed_documents/upload/${applicationId}/`;
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

  // Dropzone handlers
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (mode === 'sign') return;

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
    disabled: mode === 'sign',
  });

  if (fetchingDocument) {
    return (
      <div className='text-center py-5'>
        <LoadingComponent message='Loading document for signing...' />
      </div>
    );
  }

  return (
    <div className='container-fluid'>
      {/* Document Reading Flow for Loan Agreements */}
      {documentData?.is_loan_agreement &&
        requiredDocuments.length > 0 &&
        !showSigningForm && (
          <>
            <DocumentReadingProgress
              documents={requiredDocuments}
              readDocuments={readDocuments}
              onDocumentClick={handleDocumentClick}
              currentDocument={currentModalDocument}
              allDocumentsRead={allDocumentsRead}
              onProceedToSigning={handleProceedToSigning}
            />

            <DocumentModal
              isOpen={showDocumentModal}
              onClose={() => setShowDocumentModal(false)}
              document={currentModalDocument}
              onRead={handleDocumentRead}
              token={token}
            />
          </>
        )}

      {/* Signing Form */}
      {showSigningForm && (
        <>
          {mode === 'upload' && (
            <UploadDropzone
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              documentType={documentData}
              acceptedFiles={acceptedFiles}
              fileRejections={fileRejections}
            />
          )}

          <SigningForm
            documentData={documentData}
            acceptedFiles={acceptedFiles}
            solicitorFullName={solicitorFullName}
            setSolicitorFullName={setSolicitorFullName}
            checkboxChecked={checkboxChecked}
            setCheckboxChecked={setCheckboxChecked}
            confirmationMessage={confirmationMessage}
            signatureProvided={signatureProvided}
            setSignatureProvided={setSignatureProvided}
            isLoading={isLoading}
            isUploadingFiles={isUploadingFiles}
            fetchingDocument={fetchingDocument}
            onSignDocument={signDocumentHandler}
            mode={mode}
          />
        </>
      )}
    </div>
  );
};

export default DocumentSigningComponent;
