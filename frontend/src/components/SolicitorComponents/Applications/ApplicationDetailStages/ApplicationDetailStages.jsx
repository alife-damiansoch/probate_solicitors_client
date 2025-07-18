import { motion } from 'framer-motion';
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
  advancement,
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
        } catch {
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
        } catch {
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
    advancement,
  });

  const completedSteps = steps.filter((step) => step.completed).length;
  const overallProgress = (completedSteps / steps.length) * 100;
  const totalIssues = steps.reduce(
    (sum, step) => sum + (step.issueCount || 0),
    0
  );
  const nextActionStep = steps.find((step) => step.actionRequired);

  return (
    <motion.div
      className='stages-glass-container d-flex flex-column position-relative'
      style={{
        maxHeight: 'calc(100vh-110px)',
        paddingTop: '110px',
        background: 'var(--gradient-main-bg)',
        borderRadius: '28px',
        border: '1.5px solid var(--border-primary)',
        boxShadow:
          '0 16px 40px rgba(0,0,0,0.15), 0 4px 20px var(--primary-20), 0 2px 4px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        backdropFilter: 'blur(34px)',
        WebkitBackdropFilter: 'blur(34px)',
        color: 'var(--text-primary)',
        zIndex: 2,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
    >
      {/* Animated glassy float background */}
      <div
        className='position-absolute w-100 h-100 top-0 start-0'
        style={{
          zIndex: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 18% 35%, var(--primary-10) 0%, transparent 55%),
            radial-gradient(circle at 80% 60%, var(--success-20) 0%, transparent 50%),
            radial-gradient(circle at 55% 14%, var(--primary-20) 0%, transparent 34%)
          `,
          animation: 'backgroundFloat 20s ease-in-out infinite',
        }}
      />

      {/* Header */}
      <motion.div
        className='flex-shrink-0 p-3 pt-4'
        style={{ zIndex: 2, background: 'transparent' }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.55 }}
      >
        <StagesHeader
          application={application}
          overallProgress={overallProgress}
          totalIssues={totalIssues}
          completedSteps={completedSteps}
          totalSteps={steps.length}
          nextActionStep={nextActionStep}
        />
      </motion.div>

      {/* Timeline Content */}
      <motion.div
        className='flex-grow-1 overflow-auto px-2 px-md-4 stages-container'
        style={{
          scrollBehavior: 'smooth',
          overflowX: 'hidden',
          zIndex: 2,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.45 }}
      >
        <StagesTimeline
          steps={steps}
          hoveredStep={hoveredStep}
          setHoveredStep={setHoveredStep}
          setHighlightedSectionId={setHighlightedSectionId}
          highlitedSectionId={highlitedSectionId}
        />
      </motion.div>

      {/* Glass + animation styles */}
      <style>{`
        @keyframes backgroundFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.65; }
          33% { transform: translateY(-18px) rotate(120deg); opacity: 0.82; }
          66% { transform: translateY(11px) rotate(240deg); opacity: 0.76; }
        }
        .stages-glass-container {
          background: var(--gradient-surface);
          backdrop-filter: blur(38px);
          -webkit-backdrop-filter: blur(38px);
          border-radius: 28px;
          border: 1.5px solid var(--border-primary);
          box-shadow: 0 24px 56px rgba(0,0,0,0.14), 0 6px 32px var(--primary-20), 0 2px 4px rgba(0,0,0,0.06);
          color: var(--text-primary);
        }
        .stages-glass-container::-webkit-scrollbar {
          width: 7px;
        }
        .stages-glass-container::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
          border-radius: 4px;
        }
        .stages-glass-container::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 4px;
        }
        .stages-glass-container::-webkit-scrollbar-thumb:hover {
          background: var(--scrollbar-thumb-hover);
        }
        .stages-container::-webkit-scrollbar {
          width: 6px;
        }
        .stages-container::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
          border-radius: 3px;
        }
        .stages-container::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 3px;
        }
        .stages-container::-webkit-scrollbar-thumb:hover {
          background: var(--scrollbar-thumb-hover);
        }
      `}</style>
    </motion.div>
  );
};

export default ApplicationDetailStages;
