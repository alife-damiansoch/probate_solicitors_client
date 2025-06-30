import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaPlus,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions.jsx';
import DocumentsGrid from './DocumentUploadsParts/DocumentsGrid';
import DocumentsHeader from './DocumentUploadsParts/DocumentsHeader';
import { DocumentsWaitingState } from './DocumentUploadsParts/DocumentsWaitingState.jsx';
import EmptyState from './DocumentUploadsParts/EmptyState';
import RequiredDocumentsList from './DocumentUploadsParts/RequiredDocumentsList';
import SigningModal from './DocumentUploadsParts/SigningModal';

// Cutting-edge waiting component

const DocumentsUpload = ({
  application,
  highlitedSectionId,
  refresh,
  setRefresh,
}) => {
  const [documents, setDocuments] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [requirementStatus, setRequirementStatus] = useState(null);
  const [showSigningModal, setShowSigningModal] = useState(false);
  const [selectedDocumentForSigning, setSelectedDocumentForSigning] =
    useState(null);
  const [activeTab, setActiveTab] = useState('uploaded');
  const [isLoading, setIsLoading] = useState(true);

  let tokenObj = Cookies.get('auth_token');
  let token = null;
  if (tokenObj) {
    tokenObj = JSON.parse(tokenObj);
    token = tokenObj.access;
  }

  const navigate = useNavigate();

  // Fetch uploaded documents
  const fetchDocuments = async () => {
    if (token && application.id) {
      try {
        const endpoint = `/api/applications/solicitor_applications/document_file/${application.id}/`;
        const response = await fetchData(token, endpoint);
        console.log('DOCUMENTS RESPONSE:', response.data);
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setDocuments([]);
      }
    }
  };

  // Fetch document requirements
  const fetchRequirements = async () => {
    if (token && application.id) {
      try {
        const endpoint = `/api/applications/${application.id}/document-requirements/`;
        const response = await fetchData(token, endpoint);
        console.log('REQUIREMENTS RESPONSE:', response.data);
        setRequirements(response.data);
      } catch (error) {
        console.error('Error fetching requirements:', error);
        setRequirements([]);
      }
    }
  };

  // Fetch requirement status
  const fetchRequirementStatus = async () => {
    if (token && application.id) {
      try {
        const endpoint = `/api/applications/${application.id}/requirement-status/`;
        const response = await fetchData(token, endpoint);
        console.log('REQUIREMENT STATUS RESPONSE:', response.data);
        setRequirementStatus(response.data);
      } catch (error) {
        console.error('Error fetching requirement status:', error);
        setRequirementStatus(null);
      }
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchDocuments(),
        fetchRequirements(),
        fetchRequirementStatus(),
      ]);
      // Add a small delay to show the loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    fetchAllData();
  }, [application.id, token, refresh]);

  const handleSignDocument = (doc) => {
    setSelectedDocumentForSigning(doc);
    setShowSigningModal(true);
  };

  const handleSigningComplete = () => {
    setShowSigningModal(false);
    setSelectedDocumentForSigning(null);
    // Refresh all data
    // fetchDocuments();
    // fetchRequirements();
    // fetchRequirementStatus();
    setRefresh(!refresh);
  };

  const handleDocumentUploaded = () => {
    // Refresh all data when a document is uploaded
    // fetchDocuments();
    // fetchRequirements();
    // fetchRequirementStatus();
    setRefresh(!refresh);
  };

  // Check if we should show the waiting state
  const shouldShowWaitingState =
    isLoading || (documents.length === 0 && requirements.length === 0);

  // Calculate stats from both uploaded documents and requirements
  const signatureRequiredDocs = documents.filter(
    (doc) => doc.signature_required
  );
  const noSignatureRequiredDocs = documents.filter(
    (doc) => !doc.signature_required
  );
  const signedDocs = documents.filter((doc) => doc.is_signed);
  const pendingDocs = documents.filter(
    (doc) => doc.signature_required && !doc.is_signed
  );

  // Enhanced stats including requirements
  const totalRequirements = requirementStatus?.total_requirements || 0;
  const uploadedRequirements = requirementStatus?.uploaded_count || 0;
  const missingRequirements = requirementStatus?.missing_count || 0;

  // Check if there are issues for tab styling
  const hasSignatureIssues = documents.some(
    (doc) => doc.signature_required && !doc.is_signed
  );
  const hasMissingRequirements = missingRequirements > 0;

  const enhancedStats = {
    requirements: [
      {
        label: 'Requirements Fulfilled',
        value: uploadedRequirements,
        icon: FaCheckCircle,
      },
      {
        label: 'Total Required',
        value: totalRequirements,
        icon: FaExclamationTriangle,
      },
      {
        label: 'Still Missing',
        value: missingRequirements,
        icon: FaClock,
      },
    ],
    signatures: [
      {
        label: 'Pending Signatures',
        value: pendingDocs.length,
        icon: FaClock,
      },
      {
        label: 'Signed',
        value: signedDocs.length,
        icon: FaCheckCircle,
      },
    ],
  };

  console.log('APPLICATION IN DOCS: ', application);
  console.log('Requirements IN DOCS: ', requirements);

  // Show waiting state if both documents and requirements are empty or still loading
  if (shouldShowWaitingState) {
    return (
      <div
        className={`border-0 my-4 ${
          highlitedSectionId === 'Uploaded Documents' && 'highlited_section'
        }`}
        id='Uploaded Documents'
      >
        <DocumentsWaitingState application={application} />
      </div>
    );
  }

  return (
    <>
      <div
        className={`border-0 my-4 ${
          highlitedSectionId === 'Uploaded Documents' && 'highlited_section'
        }`}
        id='Uploaded Documents'
        style={{
          borderRadius: '20px',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <DocumentsHeader
          application={application}
          stats={enhancedStats}
          requirementStatus={requirementStatus}
        />

        <div className='p-4'>
          {/* Tab Navigation */}
          <div className='mb-4 d-flex justify-content-center'>
            <div className='d-flex gap-4'>
              <button
                onClick={() => setActiveTab('uploaded')}
                style={{
                  background:
                    activeTab === 'uploaded'
                      ? hasSignatureIssues
                        ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : '#ffffff',
                  border:
                    activeTab === 'uploaded' ? 'none' : '2px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  color:
                    activeTab === 'uploaded'
                      ? '#ffffff'
                      : hasSignatureIssues
                      ? '#dc2626'
                      : '#374151',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  boxShadow:
                    activeTab === 'uploaded'
                      ? '0 8px 25px rgba(59, 130, 246, 0.25)'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  minWidth: '220px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'uploaded') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = hasSignatureIssues
                      ? '#dc2626'
                      : '#3b82f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'uploaded') {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'none',
                    }}
                  >
                    <FaFileAlt
                      size={20}
                      style={{ marginRight: '12px', boxShadow: 'none' }}
                    />
                    <span style={{ boxShadow: 'none' }}>
                      Uploaded Documents
                    </span>
                  </div>
                </div>
                {hasSignatureIssues && activeTab !== 'uploaded' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'none',
                      border: 'none',
                    }}
                  >
                    !
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('required')}
                style={{
                  background:
                    activeTab === 'required'
                      ? hasMissingRequirements
                        ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                      : '#ffffff',
                  border:
                    activeTab === 'required' ? 'none' : '2px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  color:
                    activeTab === 'required'
                      ? '#ffffff'
                      : hasMissingRequirements
                      ? '#dc2626'
                      : '#374151',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  boxShadow:
                    activeTab === 'required'
                      ? '0 8px 25px rgba(59, 130, 246, 0.25)'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  minWidth: '220px',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'required') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(0, 0, 0, 0.12)';
                    e.currentTarget.style.borderColor = hasMissingRequirements
                      ? '#dc2626'
                      : '#3b82f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'required') {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'none',
                    }}
                  >
                    <FaExclamationTriangle
                      size={20}
                      style={{ marginRight: '12px', boxShadow: 'none' }}
                    />
                    <span style={{ boxShadow: 'none' }}>
                      Required Documents
                    </span>
                  </div>
                </div>
                {hasMissingRequirements && activeTab !== 'required' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'none',
                      border: 'none',
                    }}
                  >
                    {missingRequirements}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'uploaded' ? (
            documents.length > 0 ? (
              <DocumentsGrid
                documents={documents}
                token={token}
                onSignDocument={handleSignDocument}
              />
            ) : (
              <EmptyState message='No documents uploaded yet' />
            )
          ) : (
            <RequiredDocumentsList
              requirements={requirements}
              application={application}
              token={token}
              onDocumentUploaded={handleDocumentUploaded}
            />
          )}

          {/* Action Buttons */}
          <div className='mt-4 pt-4' style={{ borderTop: '1px solid #e2e8f0' }}>
            <div className='d-flex flex-wrap gap-3 justify-content-between align-items-center'>
              <div className='d-flex gap-3'>
                <button
                  className='btn px-4 py-2 fw-semibold'
                  style={{
                    background:
                      'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(8, 145, 178, 0.3)',
                  }}
                  onClick={() => {
                    navigate(`/upload_new_document/${application.id}`);
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background =
                      'linear-gradient(135deg, #0e7490 0%, #155e75 100%)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow =
                      '0 8px 25px rgba(8, 145, 178, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background =
                      'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 4px 15px rgba(8, 145, 178, 0.3)';
                  }}
                >
                  <FaPlus className='me-2' size={14} />
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SigningModal
        showSigningModal={showSigningModal}
        selectedDocumentForSigning={selectedDocumentForSigning}
        application={application}
        onClose={() => {
          setShowSigningModal(false);
          setSelectedDocumentForSigning(null);
        }}
        onSigningComplete={handleSigningComplete}
      />
    </>
  );
};

export default DocumentsUpload;
