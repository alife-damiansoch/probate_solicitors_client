import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaCloudUploadAlt,
  FaExclamationTriangle,
  FaFileAlt,
  FaPlus,
  FaUpload,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions.jsx';
import DocumentsGrid from './DocumentUploadsParts/DocumentsGrid';
import DocumentsHeader from './DocumentUploadsParts/DocumentsHeader';
import { DocumentsWaitingState } from './DocumentUploadsParts/DocumentsWaitingState.jsx';
import RequiredDocumentsList from './DocumentUploadsParts/RequiredDocumentsList';
import SigningModal from './DocumentUploadsParts/SigningModal';

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
    setRefresh(!refresh);
  };

  const handleDocumentUploaded = () => {
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

  // No documents case
  if (documents.length === 0 && requirements.length === 0) {
    return (
      <div
        className='modern-main-card mb-4 position-relative overflow-hidden'
        style={{
          background: 'var(--gradient-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '24px',
          boxShadow: `
            0 20px 40px var(--primary-10),
            0 8px 16px var(--primary-20),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateZ(0)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
          e.currentTarget.style.boxShadow = `
            0 32px 64px var(--primary-20),
            0 16px 32px var(--primary-30),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = `
            0 20px 40px var(--primary-10),
            0 8px 16px var(--primary-20),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `;
        }}
      >
        {/* Animated Background Pattern */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
              radial-gradient(circle at 20% 20%, var(--primary-20) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, var(--primary-30) 0%, transparent 50%)
            `,
            opacity: 0.3,
            animation: 'float 6s ease-in-out infinite',
          }}
        />

        {/* Premium Header */}
        <div
          className='px-4 py-4 d-flex align-items-center gap-3 position-relative'
          style={{
            background:
              'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
            color: 'var(--text-primary)',
            borderTopLeftRadius: '22px',
            borderTopRightRadius: '22px',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-muted)',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          {/* Icon with Micro-animation */}
          <div
            className='d-flex align-items-center justify-content-center rounded-circle position-relative'
            style={{
              width: '56px',
              height: '56px',
              background: 'var(--surface-tertiary)',
              border: '2px solid var(--border-muted)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
              e.currentTarget.style.background = 'var(--surface-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.background = 'var(--surface-tertiary)';
            }}
          >
            <FaFileAlt size={20} style={{ color: 'var(--primary-blue)' }} />

            {/* Subtle glow effect */}
            <div
              className='position-absolute rounded-circle'
              style={{
                top: '-10px',
                left: '-10px',
                right: '-10px',
                bottom: '-10px',
                background: 'var(--primary-20)',
                filter: 'blur(8px)',
                zIndex: -1,
              }}
            />
          </div>

          <div className='flex-grow-1'>
            <h5
              className='fw-bold mb-2'
              style={{
                fontSize: '1.4rem',
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              Document Management
            </h5>
            <div
              className='px-3 py-2 rounded-pill fw-semibold'
              style={{
                background: 'var(--primary-20)',
                fontSize: '0.9rem',
                border: '1px solid var(--border-muted)',
                display: 'inline-block',
                backdropFilter: 'blur(10px)',
                letterSpacing: '0.02em',
                color: '#ffffff',
              }}
            >
              Uploads & Requirements
            </div>
          </div>

          {/* Status Badge */}
          <span
            className='px-4 py-3 rounded-pill text-white fw-bold d-flex align-items-center gap-2'
            style={{
              background:
                'linear-gradient(135deg, var(--error-primary), var(--error-dark))',
              fontSize: '0.9rem',
              border: '1px solid var(--border-muted)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 16px var(--error-20)',
              transition: 'all 0.3s ease',
              cursor: 'default',
              letterSpacing: '0.02em',
            }}
          >
            <svg width='18' height='18' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            Required
          </span>
        </div>

        {/* Content */}
        <div className='px-4 pb-4'>
          <div
            className='alert border-0 mb-4'
            style={{
              background: 'var(--error-20)',
              borderRadius: '16px',
              border: '1px solid var(--error-30)',
              backdropFilter: 'blur(10px)',
              color: 'var(--error-primary)',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, var(--error-primary), var(--error-dark))',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 8px 16px var(--error-30)',
              }}
            >
              <FaExclamationTriangle />
            </div>
            <div className='text-center fw-semibold'>
              No documents or requirements available for this application.
            </div>
          </div>

          <div className='text-center'>
            <button
              className='btn px-4 py-3 fw-medium d-inline-flex align-items-center gap-2'
              style={{
                background:
                  'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px var(--primary-30)',
              }}
              onClick={() => {
                navigate(`/upload_new_document/${application.id}`);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow =
                  '0 15px 35px var(--primary-40)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow =
                  '0 8px 20px var(--primary-30)';
              }}
            >
              <FaPlus size={14} />
              Upload Document
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`border-0 my-4 ${
          highlitedSectionId === 'documents' && 'highlited_section'
        }`}
        id='documents'
        style={{
          background: 'var(--gradient-surface)',
          border: '1px solid var(--border-primary)',
          borderRadius: '24px',
          boxShadow: `
            0 20px 40px var(--primary-10),
            0 8px 16px var(--primary-20),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateZ(0)',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
          e.currentTarget.style.boxShadow = `
            0 32px 64px var(--primary-20),
            0 16px 32px var(--primary-30),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = `
            0 20px 40px var(--primary-10),
            0 8px 16px var(--primary-20),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `;
        }}
      >
        {/* Animated Background Pattern */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
              radial-gradient(circle at 20% 20%, var(--primary-20) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, var(--primary-30) 0%, transparent 50%)
            `,
            opacity: 0.3,
            animation: 'float 6s ease-in-out infinite',
          }}
        />

        {/* Premium Header */}
        <div
          className='px-1 py-4 d-flex align-items-center gap-3 position-relative'
          style={{
            background:
              'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
            color: 'var(--text-primary)',
            borderTopLeftRadius: '22px',
            borderTopRightRadius: '22px',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-muted)',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          {/* Icon with Micro-animation */}
          <div
            className='d-flex align-items-center justify-content-center rounded-circle position-relative'
            style={{
              width: '56px',
              height: '56px',
              background: 'var(--surface-tertiary)',
              border: '2px solid var(--border-muted)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
              e.currentTarget.style.background = 'var(--surface-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.background = 'var(--surface-tertiary)';
            }}
          >
            <FaFileAlt size={20} style={{ color: 'var(--primary-blue)' }} />

            {/* Subtle glow effect */}
            <div
              className='position-absolute rounded-circle'
              style={{
                top: '-10px',
                left: '-10px',
                right: '-10px',
                bottom: '-10px',
                background: 'var(--primary-20)',
                filter: 'blur(8px)',
                zIndex: -1,
              }}
            />
          </div>

          <div className='flex-grow-1'>
            <h5
              className='fw-bold mb-2'
              style={{
                fontSize: '1.4rem',
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              Document Management
            </h5>
            <div
              className='px-3 py-2 rounded-pill fw-semibold'
              style={{
                background: 'var(--primary-20)',
                fontSize: '0.9rem',
                border: '1px solid var(--border-muted)',
                display: 'inline-block',
                backdropFilter: 'blur(10px)',
                letterSpacing: '0.02em',
                color: '#ffffff',
              }}
            >
              Uploads & Requirements
            </div>
          </div>

          {/* Status Badge */}
          <span
            className='px-4 py-3 rounded-pill text-white fw-bold d-flex align-items-center gap-2'
            style={{
              background:
                documents.length > 0 || requirements.length > 0
                  ? hasSignatureIssues || hasMissingRequirements
                    ? 'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))'
                    : 'linear-gradient(135deg, var(--success-primary), var(--success-dark))'
                  : 'linear-gradient(135deg, var(--error-primary), var(--error-dark))',
              fontSize: '0.9rem',
              border: '1px solid var(--border-muted)',
              backdropFilter: 'blur(10px)',
              boxShadow:
                documents.length > 0 || requirements.length > 0
                  ? hasSignatureIssues || hasMissingRequirements
                    ? '0 8px 16px var(--warning-20)'
                    : '0 8px 16px var(--success-20)'
                  : '0 8px 16px var(--error-20)',
              transition: 'all 0.3s ease',
              cursor: 'default',
              letterSpacing: '0.02em',
            }}
          >
            <svg width='18' height='18' fill='currentColor' viewBox='0 0 20 20'>
              {documents.length > 0 || requirements.length > 0 ? (
                hasSignatureIssues || hasMissingRequirements ? (
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                ) : (
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                )
              ) : (
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              )}
            </svg>
            {documents.length > 0 || requirements.length > 0
              ? hasSignatureIssues || hasMissingRequirements
                ? 'Attention'
                : 'Complete'
              : 'Required'}
          </span>
        </div>

        <div className='p-1 p-xl-4'>
          <DocumentsHeader
            application={application}
            stats={enhancedStats}
            requirementStatus={requirementStatus}
          />

          {/* Modern App-style Tabs */}
          <div className='my-4 d-flex justify-content-center'>
            <div
              className='py-3 px-1 px-md-3 position-relative'
              style={{
                background: 'var(--surface-secondary)',
                borderRadius: '30px',
                border: '1px solid var(--border-muted)',
                boxShadow: '0 6px 32px var(--primary-10)',
                maxWidth: 700,
                margin: '0 auto',
                transition: 'box-shadow 0.25s',
                backdropFilter: 'blur(18px)',
                zIndex: 2,
              }}
            >
              <div className='d-flex flex-row gap-3 flex-wrap flex-sm-nowrap align-items-center justify-content-center'>
                {/* Uploaded Tab */}
                <button
                  onClick={() => setActiveTab('uploaded')}
                  className={`modern-tab-btn ${
                    activeTab === 'uploaded' ? 'active' : ''
                  } position-relative d-flex align-items-center gap-2 px-4 px-sm-5 py-3 rounded-pill fw-bold border-0 shadow-none`}
                  style={{
                    background:
                      activeTab === 'uploaded'
                        ? hasSignatureIssues
                          ? 'linear-gradient(110deg, var(--error-primary) 10%, var(--error-dark) 100%)'
                          : 'linear-gradient(110deg, var(--primary-blue) 10%, var(--primary-blue-dark) 100%)'
                        : 'var(--surface-tertiary)',
                    color:
                      activeTab === 'uploaded'
                        ? '#fff'
                        : hasSignatureIssues
                        ? 'var(--error-primary)'
                        : 'var(--text-secondary)',
                    fontSize: '1.05rem',
                    boxShadow:
                      activeTab === 'uploaded'
                        ? '0 8px 32px var(--primary-20)'
                        : '0 3px 8px var(--primary-10)',
                    border:
                      activeTab === 'uploaded'
                        ? '2.5px solid var(--primary-blue-dark)'
                        : '2.5px solid transparent',
                    outline: 'none',
                    zIndex: activeTab === 'uploaded' ? 10 : 2,
                    transition: 'all .18s cubic-bezier(.4,0,.2,1)',
                    transform:
                      activeTab === 'uploaded'
                        ? 'translateY(-3px) scale(1.07)'
                        : 'scale(1)',
                    minWidth: 130,
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 'uploaded') {
                      e.currentTarget.style.boxShadow =
                        '0 4px 18px var(--primary-20)';
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 'uploaded') {
                      e.currentTarget.style.boxShadow =
                        '0 3px 8px var(--primary-10)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <FaFileAlt size={20} className='d-block flex-shrink-0' />
                  <span className='d-none d-sm-inline'>Uploaded Documents</span>
                  <span className='d-inline d-sm-none'>Uploaded</span>
                  {hasSignatureIssues && activeTab !== 'uploaded' && (
                    <span
                      className='tab-badge position-absolute'
                      style={{
                        top: 6,
                        right: 14,
                        background: 'var(--error-primary)',
                        color: 'white',
                        width: 20,
                        height: 20,
                        fontSize: 12,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2.5px solid #fff',
                        boxShadow: '0 2px 8px var(--error-20)',
                        fontWeight: 700,
                        zIndex: 12,
                      }}
                    >
                      !
                    </span>
                  )}
                </button>

                {/* Required Tab */}
                <button
                  onClick={() => setActiveTab('required')}
                  className={`modern-tab-btn ${
                    activeTab === 'required' ? 'active' : ''
                  } position-relative d-flex align-items-center gap-2 px-4 px-sm-5 py-3 rounded-pill fw-bold border-0 shadow-none`}
                  style={{
                    background:
                      activeTab === 'required'
                        ? hasMissingRequirements
                          ? 'linear-gradient(110deg, var(--error-primary) 10%, var(--error-dark) 100%)'
                          : 'linear-gradient(110deg, var(--primary-blue) 10%, var(--primary-blue-dark) 100%)'
                        : 'var(--surface-tertiary)',
                    color:
                      activeTab === 'required'
                        ? '#fff'
                        : hasMissingRequirements
                        ? 'var(--error-primary)'
                        : 'var(--text-secondary)',
                    fontSize: '1.05rem',
                    boxShadow:
                      activeTab === 'required'
                        ? '0 8px 32px var(--primary-20)'
                        : '0 3px 8px var(--primary-10)',
                    border:
                      activeTab === 'required'
                        ? '2.5px solid var(--primary-blue-dark)'
                        : '2.5px solid transparent',
                    outline: 'none',
                    zIndex: activeTab === 'required' ? 10 : 2,
                    transition: 'all .18s cubic-bezier(.4,0,.2,1)',
                    transform:
                      activeTab === 'required'
                        ? 'translateY(-3px) scale(1.07)'
                        : 'scale(1)',
                    minWidth: 130,
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 'required') {
                      e.currentTarget.style.boxShadow =
                        '0 4px 18px var(--primary-20)';
                      e.currentTarget.style.transform = 'scale(1.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 'required') {
                      e.currentTarget.style.boxShadow =
                        '0 3px 8px var(--primary-10)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <FaExclamationTriangle
                    size={20}
                    className='d-block flex-shrink-0'
                  />
                  <span className='d-none d-sm-inline'>Required Documents</span>
                  <span className='d-inline d-sm-none'>Required</span>
                  {hasMissingRequirements && activeTab !== 'required' && (
                    <span
                      className='tab-badge position-absolute'
                      style={{
                        top: 6,
                        right: 14,
                        background: 'var(--error-primary)',
                        color: 'white',
                        width: 20,
                        height: 20,
                        fontSize: 12,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2.5px solid #fff',
                        boxShadow: '0 2px 8px var(--error-20)',
                        fontWeight: 700,
                        zIndex: 12,
                      }}
                    >
                      {missingRequirements}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Custom Styles */}
          <style>{`
            .modern-tab-btn {
              cursor: pointer;
              user-select: none;
              letter-spacing: 0.01em;
            }
            .modern-tab-btn:active {
              filter: brightness(0.97);
            }
          `}</style>

          {/* Enhanced Tab Content */}
          <div
            className='position-relative'
            style={{
              background: 'var(--surface-secondary)',
              borderRadius: '18px',
              border: '1px solid var(--border-muted)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 24px var(--primary-10)',
              overflow: 'hidden',
              minHeight: '600px',
            }}
          >
            <div className='p-0 p-lx-2'>
              {activeTab === 'uploaded' ? (
                documents.length > 0 ? (
                  <DocumentsGrid
                    documents={documents}
                    token={token}
                    onSignDocument={handleSignDocument}
                  />
                ) : (
                  <div className='text-center py-5'>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background:
                          'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        boxShadow: '0 20px 40px var(--primary-30)',
                        animation: 'float 3s ease-in-out infinite',
                      }}
                    >
                      <FaCloudUploadAlt size={32} />
                    </div>
                    <h4
                      className='fw-bold mb-3'
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '1.5rem',
                      }}
                    >
                      No Documents Uploaded
                    </h4>
                    <p
                      className='mb-4'
                      style={{
                        fontSize: '1.1rem',
                        maxWidth: '400px',
                        margin: '0 auto',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Upload your first document to get started with the
                      application process.
                    </p>
                    <button
                      className='btn px-4 py-3 fw-medium d-inline-flex align-items-center gap-2'
                      style={{
                        background:
                          'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                        color: 'white',
                        border: 'none',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 20px var(--primary-30)',
                      }}
                      onClick={() => {
                        navigate(`/upload_new_document/${application.id}`);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.boxShadow =
                          '0 15px 35px var(--primary-40)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 20px var(--primary-30)';
                      }}
                    >
                      <FaUpload size={16} />
                      Upload Your First Document
                    </button>
                  </div>
                )
              ) : (
                <RequiredDocumentsList
                  requirements={requirements}
                  application={application}
                  token={token}
                  onDocumentUploaded={handleDocumentUploaded}
                />
              )}
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div
            className='mt-4 pt-4'
            style={{
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--surface-secondary)',
              borderRadius: '16px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className='d-flex flex-wrap gap-3 justify-content-between align-items-center'>
              <div className='d-flex gap-3'>
                <button
                  className='btn px-4 py-3 fw-medium d-inline-flex align-items-center gap-2'
                  style={{
                    background: 'var(--surface-primary)',
                    color: 'var(--primary-blue)',
                    border: '2px solid var(--border-primary)',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px var(--primary-20)',
                  }}
                  onClick={() => {
                    navigate(`/upload_new_document/${application.id}`);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform =
                      'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow =
                      '0 15px 35px var(--primary-40)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--surface-primary)';
                    e.currentTarget.style.color = 'var(--primary-blue)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 15px var(--primary-20)';
                  }}
                >
                  <FaPlus size={14} />
                  Upload New Document
                </button>
              </div>

              {/* Stats Summary */}
              <div className='d-flex gap-4 align-items-center'>
                <div className='text-center'>
                  <div
                    className='fw-bold'
                    style={{
                      color:
                        documents.length > 0
                          ? 'var(--success-primary)'
                          : 'var(--text-muted)',
                      fontSize: '1.2rem',
                    }}
                  >
                    {documents.length}
                  </div>
                  <div
                    className='small'
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Uploaded
                  </div>
                </div>
                <div
                  style={{
                    width: '2px',
                    height: '30px',
                    background:
                      'linear-gradient(to bottom, var(--border-muted), transparent)',
                  }}
                />
                <div className='text-center'>
                  <div
                    className='fw-bold'
                    style={{
                      color:
                        missingRequirements > 0
                          ? 'var(--error-primary)'
                          : 'var(--success-primary)',
                      fontSize: '1.2rem',
                    }}
                  >
                    {missingRequirements}
                  </div>
                  <div
                    className='small'
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Missing
                  </div>
                </div>
                <div
                  style={{
                    width: '2px',
                    height: '30px',
                    background:
                      'linear-gradient(to bottom, var(--border-muted), transparent)',
                  }}
                />
                <div className='text-center'>
                  <div
                    className='fw-bold'
                    style={{
                      color:
                        pendingDocs.length > 0
                          ? 'var(--warning-primary)'
                          : 'var(--success-primary)',
                      fontSize: '1.2rem',
                    }}
                  >
                    {pendingDocs.length}
                  </div>
                  <div
                    className='small'
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Pending Signature
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(2deg);
            }
          }

          @keyframes selectionGlow {
            0% {
              opacity: 0.3;
            }
            100% {
              opacity: 0.6;
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}</style>
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
