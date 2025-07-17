import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions';

import StagesHeader from './ApplicationDetailStagesParts/StagesHeader';
import { getTimelineSteps } from './ApplicationDetailStagesParts/StagesLogic';
import StagesTimeline from './ApplicationDetailStagesParts/StagesTimeline';

const ApplicationDetailStages = ({
  application,
  refresh,
  setHighlightedSectionId,
  advancement, // Add advancement prop
  highlitedSectionId,
  isSidebarOpen,
}) => {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [estates, setEstates] = useState([]);
  const [estatesLoading, setEstatesLoading] = useState(false);

  // Document and requirements states
  const [documents, setDocuments] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [requirementStatus, setRequirementStatus] = useState(null);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  const currency_sign = Cookies.get('currency_sign');

  // Helper function to count total estate items
  const getEstateItemsCount = () => {
    if (!estates || typeof estates !== 'object') return 0;
    return Object.values(estates).reduce((total, category) => {
      return total + (Array.isArray(category) ? category.length : 0);
    }, 0);
  };

  // Fetch estates data
  useEffect(() => {
    const fetchEstates = async () => {
      if (application?.estate_summary) {
        setEstatesLoading(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetchData(token, application.estate_summary);
          setEstates(response.data || response || []);
        } catch (error) {
          console.error('Error fetching estates:', error);
          setEstates([]);
        } finally {
          setEstatesLoading(false);
        }
      }
    };

    fetchEstates();
  }, [application?.estate_summary, refresh]);

  // Fetch documents and requirements
  useEffect(() => {
    const fetchDocumentsAndRequirements = async () => {
      if (application?.id) {
        setDocumentsLoading(true);
        try {
          const token = localStorage.getItem('token');

          // Fetch documents
          const documentsEndpoint = `/api/applications/solicitor_applications/document_file/${application.id}/`;
          const documentsResponse = await fetchData(token, documentsEndpoint);
          setDocuments(documentsResponse.data || []);

          // Fetch requirements
          const requirementsEndpoint = `/api/applications/${application.id}/document-requirements/`;
          const requirementsResponse = await fetchData(
            token,
            requirementsEndpoint
          );
          setRequirements(requirementsResponse.data || []);

          // Fetch requirement status
          const statusEndpoint = `/api/applications/${application.id}/requirement-status/`;
          const statusResponse = await fetchData(token, statusEndpoint);
          setRequirementStatus(statusResponse.data || null);
        } catch (error) {
          console.error('Error fetching documents/requirements:', error);
          setDocuments([]);
          setRequirements([]);
          setRequirementStatus(null);
        } finally {
          setDocumentsLoading(false);
        }
      }
    };

    fetchDocumentsAndRequirements();
  }, [application?.id, refresh]);

  // Get documents and requirements analysis
  const getDocumentsAnalysis = () => {
    const totalRequirements = requirementStatus?.total_requirements || 0;
    const uploadedRequirements = requirementStatus?.uploaded_count || 0;
    const missingRequirements = requirementStatus?.missing_count || 0;

    const signatureRequiredDocs = documents.filter(
      (doc) => doc.signature_required
    );
    const signedDocs = documents.filter((doc) => doc.is_signed);
    const pendingSignatures = documents.filter(
      (doc) => doc.signature_required && !doc.is_signed
    );

    const hasDocuments = documents.length > 0;
    const hasRequirements = requirements.length > 0;
    const allRequirementsFulfilled =
      totalRequirements > 0 && missingRequirements === 0;
    const allDocumentsSigned =
      signatureRequiredDocs.length > 0 && pendingSignatures.length === 0;

    // Determine completion status
    let isComplete = false;
    let status = 'waiting';

    if (!hasDocuments && !hasRequirements) {
      status = 'waiting';
    } else if (hasRequirements && !allRequirementsFulfilled) {
      status = 'requirements_pending';
    } else if (
      hasDocuments &&
      signatureRequiredDocs.length > 0 &&
      !allDocumentsSigned
    ) {
      status = 'signatures_pending';
    } else if (
      (hasRequirements && allRequirementsFulfilled) ||
      (hasDocuments &&
        (signatureRequiredDocs.length === 0 || allDocumentsSigned))
    ) {
      isComplete = true;
      status = 'complete';
    }

    return {
      isComplete,
      status,
      hasDocuments,
      hasRequirements,
      totalRequirements,
      uploadedRequirements,
      missingRequirements,
      totalDocuments: documents.length,
      pendingSignatures: pendingSignatures.length,
      signedDocuments: signedDocs.length,
      allRequirementsFulfilled,
      allDocumentsSigned,
    };
  };

  // Get timeline steps using extracted logic
  const steps = getTimelineSteps({
    application,
    estates,
    estatesLoading,
    documents,
    requirements,
    requirementStatus,
    documentsLoading,
    getDocumentsAnalysis,
    getEstateItemsCount,
    currency_sign,
    advancement, // Pass advancement data
  });

  const completedSteps = steps.filter((step) => step.completed).length;
  const overallProgress = (completedSteps / steps.length) * 100;
  const totalIssues = steps.reduce(
    (sum, step) => sum + (step.issueCount || 0),
    0
  );
  const nextActionStep = steps.find((step) => step.actionRequired);

  return (
    <div
      className='h-100 d-flex flex-column'
      style={{
        background:
          'linear-gradient(180deg, #0a0f1c 0%, #111827 30%, #1f2937 70%, #0a0f1c 100%)',
        width: '400px',
        minHeight: '100vh',
        paddingTop: '100px',
      }}
    >
      <style>
        {`
          @keyframes neonPulse {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2); 
            }
            50% { 
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.7), 0 0 60px rgba(59, 130, 246, 0.4); 
            }
          }
          
          @keyframes criticalPulse {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3); 
            }
            50% { 
              box-shadow: 0 0 35px rgba(239, 68, 68, 0.8), 0 0 70px rgba(239, 68, 68, 0.5); 
            }
          }
          
          @keyframes warningPulse {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.3); 
            }
            50% { 
              box-shadow: 0 0 35px rgba(245, 158, 11, 0.8), 0 0 70px rgba(245, 158, 11, 0.5); 
            }
          }

          @keyframes progressShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          @keyframes issueAlert {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          @keyframes iconSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes progressFill {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
          }

          /* Custom scrollbar styling */
          .stages-container::-webkit-scrollbar {
            width: 6px;
          }

          .stages-container::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.3);
            border-radius: 3px;
          }

          .stages-container::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.4);
            border-radius: 3px;
          }

          .stages-container::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.6);
          }
        `}
      </style>

      {/* Header - Fixed at top with responsive padding */}
      <div className='flex-shrink-0 p-3 pt-5'>
        <StagesHeader
          application={application}
          overallProgress={overallProgress}
          totalIssues={totalIssues}
          completedSteps={completedSteps}
          totalSteps={steps.length}
          nextActionStep={nextActionStep}
        />
      </div>

      {/* Scrollable Timeline Content */}
      <div
        className='flex-grow-1 overflow-auto px-3 stages-container'
        style={{
          scrollBehavior: 'smooth',
          overflowX: 'hidden',
        }}
      >
        <StagesTimeline
          steps={steps}
          hoveredStep={hoveredStep}
          setHoveredStep={setHoveredStep}
          setHighlightedSectionId={setHighlightedSectionId}
          highlitedSectionId={highlitedSectionId}
        />
      </div>

      {/* Footer - Fixed at bottom with responsive padding */}
      {/* <div className='flex-shrink-0 p-3 pb-4'>
        <StagesFooter
          nextActionStep={nextActionStep}
          completedSteps={completedSteps}
          totalSteps={steps.length}
          application={application}
        />
      </div> */}
    </div>
  );
};

export default ApplicationDetailStages;
