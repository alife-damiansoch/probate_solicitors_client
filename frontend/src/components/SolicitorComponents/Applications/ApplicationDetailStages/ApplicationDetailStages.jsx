// TimelineStep.jsx - Expandable Cutting-Edge Timeline
import { useEffect, useState } from 'react';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions';

const ApplicationDetailStages = ({
  application,
  refresh,
  setRefresh,
  currentRequirements,
  allStagesCompleted,
  setAllStagesCompleted,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredStep, setHoveredStep] = useState(null);
  const [estates, setEstates] = useState([]);
  const [estatesLoading, setEstatesLoading] = useState(false);

  // New states for documents and requirements
  const [documents, setDocuments] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [requirementStatus, setRequirementStatus] = useState(null);
  const [documentsLoading, setDocumentsLoading] = useState(false);

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

  // Get timeline steps (enhanced version)
  const getTimelineSteps = () => {
    const estateValue =
      parseFloat(application.value_of_the_estate_after_expenses) || 0;
    const documentsAnalysis = getDocumentsAnalysis();

    // Check if any estate category has items
    const hasEstateItems =
      estates && typeof estates === 'object'
        ? Object.values(estates).some(
            (category) => Array.isArray(category) && category.length > 0
          )
        : false;

    const estateValueComplete = hasEstateItems;
    const solicitorAssigned = application.solicitor !== null;

    const amountValid =
      application.amount && parseFloat(application.amount) > 0;
    const applicantsValid =
      application.applicants && application.applicants.length > 0;
    const deceasedValid =
      application.deceased &&
      application.deceased.first_name &&
      application.deceased.first_name.trim() !== '' &&
      application.deceased.last_name &&
      application.deceased.last_name.trim() !== '';

    const submittedComplete = amountValid && applicantsValid && deceasedValid;
    const processingStatusComplete =
      application.processing_status?.application_details_completed_confirmed ||
      false;

    // Documents step configuration
    const getDocumentsStepConfig = () => {
      if (documentsLoading) {
        return {
          completed: false,
          actionRequired: false,
          progress: 20,
          description: 'Loading documents and requirements...',
        };
      }

      switch (documentsAnalysis.status) {
        case 'waiting':
          return {
            completed: false,
            actionRequired: false,
            progress: 10,
            description:
              'Waiting for documents and requirements to be assigned',
          };
        case 'requirements_pending':
          return {
            completed: false,
            actionRequired: true,
            progress: 40,
            description: `📋 ${documentsAnalysis.missingRequirements} of ${documentsAnalysis.totalRequirements} requirements still need to be fulfilled`,
          };
        case 'signatures_pending':
          return {
            completed: false,
            actionRequired: true,
            progress: 70,
            description: `✍️ ${documentsAnalysis.pendingSignatures} document(s) require your signature`,
          };
        case 'complete':
          return {
            completed: true,
            actionRequired: false,
            progress: 100,
            description: documentsAnalysis.hasRequirements
              ? `✅ All ${
                  documentsAnalysis.totalRequirements
                } requirements fulfilled${
                  documentsAnalysis.hasDocuments
                    ? ` • ${documentsAnalysis.signedDocuments} document(s) signed`
                    : ''
                }`
              : `✅ All ${documentsAnalysis.totalDocuments} document(s) processed and signed`,
          };
        default:
          return {
            completed: false,
            actionRequired: false,
            progress: 0,
            description: 'Documents processing pending',
          };
      }
    };

    const documentsConfig = getDocumentsStepConfig();

    return [
      {
        id: 'submitted',
        title: 'Application Submitted',
        icon: '📝',
        completed: submittedComplete,
        actionRequired: !submittedComplete,
        progress: submittedComplete ? 100 : 30,
      },
      {
        id: 'solicitor',
        title: 'Solicitor Assignment',
        icon: '👨‍💼',
        completed: solicitorAssigned,
        actionRequired: !solicitorAssigned && submittedComplete,
        progress: solicitorAssigned ? 100 : submittedComplete ? 60 : 0,
      },
      {
        id: 'estate',
        title: 'Estate Information',
        icon: '🏠',
        completed: estateValueComplete,
        actionRequired: !estateValueComplete && solicitorAssigned,
        progress: estateValueComplete ? 100 : solicitorAssigned ? 40 : 0,
        description: estateValueComplete
          ? `Estate value: ${
              estateValue > 0 ? `£${estateValue.toLocaleString()}` : 'Set'
            } • ${getEstateItemsCount()} item(s) configured`
          : estatesLoading
          ? 'Loading estate information...'
          : hasEstateItems
          ? 'Estate items configured, but total value missing'
          : 'Estate value and items required',
      },
      {
        id: 'processing',
        title: 'Details Confirmation',
        icon: '🤝',
        completed: processingStatusComplete,
        actionRequired: !processingStatusComplete && estateValueComplete,
        progress: processingStatusComplete ? 100 : estateValueComplete ? 70 : 0,
        description: processingStatusComplete
          ? '✅ Details confirmed by agent'
          : `All provided details must be reviewed and confirmed by your assigned agent.
Once all preceding sections are completed, you may reach out to your agent to initiate the confirmation process. Alternatively, your agent will contact you once verification is complete to advise on the next steps.`,
      },
      {
        id: 'documents',
        title: 'Documents & Requirements',
        icon:
          documentsAnalysis.status === 'complete'
            ? '✅'
            : documentsAnalysis.status === 'waiting'
            ? '⏳'
            : documentsAnalysis.status === 'requirements_pending'
            ? '📋'
            : '✍️',
        completed: documentsConfig.completed,
        actionRequired:
          documentsConfig.actionRequired && processingStatusComplete,
        progress: documentsConfig.progress,
        description: documentsConfig.description,
      },
      {
        id: 'review',
        title: 'Under Review',
        icon: application.approved
          ? '✅'
          : application.is_rejected
          ? '❌'
          : '🔍',
        completed: application.approved || application.is_rejected,
        actionRequired: false,
        progress: application.approved
          ? 100
          : application.is_rejected
          ? 100
          : documentsConfig.completed
          ? 90
          : 80,
      },
    ];
  };

  const steps = getTimelineSteps();
  const completedSteps = steps.filter((step) => step.completed).length;
  const overallProgress = (completedSteps / steps.length) * 100;

  const getStepTheme = (step) => {
    if (step.completed) {
      return {
        bg: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        accent: '#10b981',
        glow: '0 0 20px rgba(16, 185, 129, 0.4)',
      };
    }
    if (step.actionRequired) {
      return {
        bg: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)',
        accent: '#f59e0b',
        glow: '0 0 20px rgba(245, 158, 11, 0.5)',
      };
    }
    return {
      bg: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
      accent: '#6b7280',
      glow: 'none',
    };
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        overflow: isExpanded ? 'hidden' : 'visible',
        position: 'relative',
        boxShadow:
          '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(59, 130, 246, 0.1)',
      }}
    >
      <style>
        {`
          @keyframes neonPulse {
            0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.6); }
          }
          
          @keyframes dataFlow {
            0% { transform: translateX(-100px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100px); opacity: 0; }
          }
          
          @keyframes hologramShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          @keyframes statusPulse {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }

          @keyframes documentFlow {
            0% { transform: translateY(-10px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(10px); opacity: 0; }
          }
        `}
      </style>

      {/* Enhanced Compact Header - Always Visible */}
      <div
        className='d-flex align-items-center justify-content-between p-3'
        style={{
          borderBottom: isExpanded
            ? '1px solid rgba(59, 130, 246, 0.2)'
            : 'none',
          cursor: 'pointer',
          minHeight: '85px',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Left: Enhanced Progress Info */}
        <div className='d-flex align-items-center gap-4'>
          {/* Enhanced Overall Progress Ring */}
          <div
            className='position-relative'
            style={{ width: '60px', height: '60px' }}
          >
            {/* Outer Glow Ring */}
            <div
              style={{
                position: 'absolute',
                width: '66px',
                height: '66px',
                top: '-3px',
                left: '-3px',
                borderRadius: '50%',
                background: `conic-gradient(from 0deg, #3b82f620, transparent, #3b82f620)`,
                animation: 'neonPulse 3s infinite',
              }}
            />

            <svg width='60' height='60' className='position-absolute'>
              <circle
                cx='30'
                cy='30'
                r='25'
                fill='none'
                stroke='rgba(59, 130, 246, 0.2)'
                strokeWidth='3'
              />
              <circle
                cx='30'
                cy='30'
                r='25'
                fill='none'
                stroke='#3b82f6'
                strokeWidth='3'
                strokeDasharray={`${(overallProgress / 100) * 157.08} 157.08`}
                strokeLinecap='round'
                transform='rotate(-90 30 30)'
                style={{
                  transition: 'stroke-dasharray 0.6s ease',
                  filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))',
                }}
              />
            </svg>
            <div
              className='position-absolute d-flex align-items-center justify-content-center'
              style={{
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                color: '#3b82f6',
                fontSize: '0.8rem',
                fontWeight: '700',
                textShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
              }}
            >
              {Math.round(overallProgress)}%
            </div>
          </div>

          {/* Enhanced Title & Status */}
          <div>
            <div className='d-flex align-items-center gap-3 mb-1'>
              <h5
                style={{
                  color: 'white',
                  margin: 0,
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
                }}
              >
                Application Progress
              </h5>

              {/* Live Status Badge */}
              {(() => {
                const nextActionStep = steps.find(
                  (step) => step.actionRequired
                );
                const statusColor = nextActionStep
                  ? '#f59e0b'
                  : completedSteps === steps.length
                  ? '#10b981'
                  : '#3b82f6';
                const statusText = nextActionStep
                  ? 'Action Required'
                  : completedSteps === steps.length
                  ? 'Complete'
                  : 'In Progress';

                return (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: `${statusColor}15`,
                      border: `1px solid ${statusColor}30`,
                      borderRadius: '16px',
                      padding: '4px 10px',
                    }}
                  >
                    <div
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: statusColor,
                        boxShadow: `0 0 8px ${statusColor}`,
                        animation: nextActionStep
                          ? 'statusPulse 2s infinite'
                          : 'none',
                      }}
                    />
                    <span
                      style={{
                        color: statusColor,
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {statusText}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Enhanced Status Message */}
            <div className='d-flex flex-column gap-1'>
              <p
                style={{
                  color: '#e2e8f0',
                  margin: 0,
                  fontSize: '0.85rem',
                  fontWeight: '500',
                }}
              >
                {(() => {
                  const nextActionStep = steps.find(
                    (step) => step.actionRequired
                  );
                  const currentStage =
                    steps.find((step) => !step.completed)?.title || 'Complete';

                  if (nextActionStep) {
                    return `Action needed: ${nextActionStep.title}`;
                  }
                  if (completedSteps === steps.length) {
                    return 'All stages completed';
                  }
                  return `Currently at: ${currentStage}`;
                })()}
              </p>
              <div className='d-flex align-items-center gap-3'>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                  {completedSteps} of {steps.length} stages completed
                </span>
                {application.solicitor && (
                  <>
                    <span style={{ color: '#475569' }}>•</span>
                    <span style={{ color: '#10b981', fontSize: '0.75rem' }}>
                      👨‍💼 {application.solicitor.name || 'Assigned'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Compact Steps Preview */}
        <div className='d-flex align-items-center gap-2'>
          {steps.map((step, index) => {
            const theme = getStepTheme(step);
            return (
              <div key={step.id} className='d-flex align-items-center'>
                <div
                  className='position-relative'
                  style={{
                    width: '36px',
                    height: '36px',
                    background: theme.bg,
                    borderRadius: '50%',
                    border: `2px solid ${theme.accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    animation: step.actionRequired
                      ? 'neonPulse 2s infinite'
                      : 'none',
                    transition: 'all 0.3s ease',
                    transform:
                      hoveredStep === step.id ? 'scale(1.1)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {step.completed ? (
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                      <path
                        d='M9 12L11 14L15 10'
                        stroke='#10b981'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  ) : (
                    <span
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))',
                      }}
                    >
                      {step.icon}
                    </span>
                  )}

                  {/* Progress Ring Around Icon */}
                  <svg
                    width='40'
                    height='40'
                    className='position-absolute'
                    style={{ top: '-2px', left: '-2px' }}
                  >
                    <circle
                      cx='20'
                      cy='20'
                      r='18'
                      fill='none'
                      stroke={`${theme.accent}20`}
                      strokeWidth='1'
                    />
                    <circle
                      cx='20'
                      cy='20'
                      r='18'
                      fill='none'
                      stroke={theme.accent}
                      strokeWidth='1'
                      strokeDasharray={`${(step.progress / 100) * 113.1} 113.1`}
                      strokeLinecap='round'
                      transform='rotate(-90 20 20)'
                      style={{
                        transition: 'stroke-dasharray 0.6s ease',
                        opacity: 0.6,
                      }}
                    />
                  </svg>

                  {/* Enhanced Connection Line */}
                  {index < steps.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '-8px',
                        width: '6px',
                        height: '2px',
                        background: step.completed
                          ? 'linear-gradient(90deg, #10b981, rgba(16, 185, 129, 0.5))'
                          : 'rgba(107, 114, 128, 0.3)',
                        borderRadius: '1px',
                      }}
                    />
                  )}

                  {/* Enhanced Hover Tooltip */}
                  {hoveredStep === step.id && !isExpanded && (
                    <div
                      style={{
                        position: 'fixed',
                        bottom: 'auto',
                        top: '-80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background:
                          'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
                        border: `1px solid ${theme.accent}40`,
                        borderRadius: '12px',
                        padding: '10px 14px',
                        color: 'white',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        backdropFilter: 'blur(20px)',
                        boxShadow: `0 10px 25px rgba(0,0,0,0.3), 0 0 20px ${theme.accent}20`,
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                        {step.title}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.65rem' }}>
                        {step.progress}% complete
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          borderLeft: '5px solid transparent',
                          borderRight: '5px solid transparent',
                          borderTop: `5px solid ${theme.accent}40`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expand/Collapse Button */}
        <div
          style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
          }}
        >
          <svg
            width='16'
            height='16'
            fill='white'
            viewBox='0 0 24 24'
            style={{
              transition: 'transform 0.3s ease',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <path d='M7 10L12 15L17 10H7Z' />
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      <div
        style={{
          height: isExpanded ? 'auto' : '0',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className='p-4' style={{ paddingTop: isExpanded ? '20px' : '0' }}>
          {/* Detailed Timeline */}
          {steps.map((step, index) => {
            const theme = getStepTheme(step);
            const isLastStep = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className='position-relative d-flex'
                style={{ minHeight: '80px' }}
              >
                {/* Timeline Node */}
                <div
                  className='d-flex flex-column align-items-center'
                  style={{ width: '60px' }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      background: theme.bg,
                      borderRadius: '50%',
                      border: `3px solid ${theme.accent}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      boxShadow: theme.glow,
                      animation: step.actionRequired
                        ? 'neonPulse 2s infinite'
                        : 'none',
                      position: 'relative',
                      zIndex: 2,
                    }}
                  >
                    {step.completed ? (
                      <svg
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <path
                          d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                          stroke='#10b981'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    ) : (
                      <span
                        style={{
                          filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))',
                        }}
                      >
                        {step.icon}
                      </span>
                    )}

                    {/* Step Number Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        width: '20px',
                        height: '20px',
                        background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}80)`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: '700',
                        border: '2px solid #0f172a',
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Special Documents Step Animation */}
                    {step.id === 'documents' && step.actionRequired && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '4px',
                          height: '4px',
                          background: theme.accent,
                          borderRadius: '50%',
                          animation: 'documentFlow 2s infinite',
                          opacity: 0.8,
                        }}
                      />
                    )}
                  </div>

                  {/* Vertical Connector */}
                  {!isLastStep && (
                    <div
                      className='position-relative'
                      style={{ width: '3px', height: '40px', marginTop: '8px' }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          background: 'rgba(107, 114, 128, 0.3)',
                          borderRadius: '1.5px',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: step.completed ? '100%' : '0%',
                          background: `linear-gradient(180deg, ${theme.accent}, ${theme.accent}80)`,
                          borderRadius: '1.5px',
                          transition: 'height 0.8s ease',
                          boxShadow: `0 0 10px ${theme.accent}40`,
                        }}
                      />

                      {/* Data Flow Effect */}
                      {step.completed && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '5px',
                            height: '5px',
                            background: theme.accent,
                            borderRadius: '50%',
                            boxShadow: `0 0 8px ${theme.accent}`,
                            animation: 'dataFlow 3s infinite',
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Content Card */}
                <div className='flex-grow-1 ms-3' style={{ marginTop: '8px' }}>
                  <div
                    style={{
                      background: `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)`,
                      border: `1px solid ${theme.accent}40`,
                      borderRadius: '16px',
                      padding: '16px 20px',
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Holographic Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${theme.accent}60, transparent)`,
                        animation: step.actionRequired
                          ? 'hologramShimmer 2s infinite'
                          : 'none',
                      }}
                    />

                    {/* Header */}
                    <div className='d-flex align-items-center justify-content-between mb-2'>
                      <h6
                        style={{
                          color: 'white',
                          margin: 0,
                          fontSize: '1rem',
                          fontWeight: '600',
                          textShadow: `0 0 10px ${theme.accent}40`,
                        }}
                      >
                        {step.title}
                      </h6>

                      {/* Enhanced Status Badge for Documents Step */}
                      {step.id === 'documents' && !documentsLoading && (
                        <div className='d-flex align-items-center gap-2'>
                          {(() => {
                            const analysis = getDocumentsAnalysis();

                            if (analysis.status === 'waiting') {
                              return (
                                <div
                                  style={{
                                    background: `rgba(107, 114, 128, 0.2)`,
                                    border: `1px solid rgba(107, 114, 128, 0.5)`,
                                    borderRadius: '20px',
                                    padding: '4px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: '#6b7280',
                                      animation: 'statusPulse 2s infinite',
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: '#9ca3af',
                                      fontSize: '0.7rem',
                                      fontWeight: '600',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    Waiting
                                  </span>
                                </div>
                              );
                            }

                            if (analysis.status === 'requirements_pending') {
                              return (
                                <div
                                  style={{
                                    background: `${theme.accent}20`,
                                    border: `1px solid ${theme.accent}50`,
                                    borderRadius: '20px',
                                    padding: '4px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: theme.accent,
                                      boxShadow: `0 0 8px ${theme.accent}`,
                                      animation: 'neonPulse 1.5s infinite',
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: theme.accent,
                                      fontSize: '0.7rem',
                                      fontWeight: '600',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    Requirements Missing
                                  </span>
                                </div>
                              );
                            }

                            if (analysis.status === 'signatures_pending') {
                              return (
                                <div
                                  style={{
                                    background: `${theme.accent}20`,
                                    border: `1px solid ${theme.accent}50`,
                                    borderRadius: '20px',
                                    padding: '4px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: theme.accent,
                                      boxShadow: `0 0 8px ${theme.accent}`,
                                      animation: 'neonPulse 1.5s infinite',
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: theme.accent,
                                      fontSize: '0.7rem',
                                      fontWeight: '600',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    Signatures Required
                                  </span>
                                </div>
                              );
                            }

                            if (analysis.status === 'complete') {
                              return (
                                <div
                                  style={{
                                    background: `rgba(16, 185, 129, 0.2)`,
                                    border: `1px solid rgba(16, 185, 129, 0.5)`,
                                    borderRadius: '20px',
                                    padding: '4px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: '#10b981',
                                      boxShadow: '0 0 8px #10b981',
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: '#10b981',
                                      fontSize: '0.7rem',
                                      fontWeight: '600',
                                      textTransform: 'uppercase',
                                    }}
                                  >
                                    Complete
                                  </span>
                                </div>
                              );
                            }

                            return null;
                          })()}
                        </div>
                      )}

                      {/* Standard Action Required Badge for Other Steps */}
                      {step.actionRequired && step.id !== 'documents' && (
                        <div
                          style={{
                            background: `${theme.accent}20`,
                            border: `1px solid ${theme.accent}50`,
                            borderRadius: '20px',
                            padding: '4px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: theme.accent,
                              boxShadow: `0 0 8px ${theme.accent}`,
                              animation: 'neonPulse 1.5s infinite',
                            }}
                          />
                          <span
                            style={{
                              color: theme.accent,
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                            }}
                          >
                            Action Required
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        background: 'rgba(107, 114, 128, 0.2)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: `${step.progress}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}80)`,
                          borderRadius: '2px',
                          transition: 'width 0.8s ease',
                          boxShadow: `0 0 8px ${theme.accent}40`,
                        }}
                      />
                    </div>

                    {/* Enhanced Status Text with Documents Details */}
                    <div>
                      <p
                        style={{
                          color: '#94a3b8',
                          margin: 0,
                          fontSize: '0.85rem',
                          lineHeight: '1.4',
                          marginBottom: step.id === 'documents' ? '8px' : '0',
                        }}
                      >
                        {step.description ||
                          (step.completed
                            ? '✅ Completed successfully'
                            : step.actionRequired
                            ? '⚡ Action required to proceed'
                            : '⏳ Waiting for previous steps')}
                      </p>

                      {/* Enhanced Documents Step Details */}
                      {step.id === 'documents' && !documentsLoading && (
                        <div className='mt-2'>
                          {(() => {
                            const analysis = getDocumentsAnalysis();

                            if (analysis.status === 'waiting') {
                              return (
                                <div
                                  style={{
                                    background: 'rgba(107, 114, 128, 0.1)',
                                    border:
                                      '1px solid rgba(107, 114, 128, 0.2)',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                  }}
                                >
                                  <div
                                    style={{
                                      color: '#9ca3af',
                                      fontSize: '0.75rem',
                                      fontWeight: '500',
                                    }}
                                  >
                                    📄 No documents or requirements have been
                                    assigned yet
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div className='d-flex flex-wrap gap-2'>
                                {/* Requirements Summary */}
                                {analysis.hasRequirements && (
                                  <div
                                    style={{
                                      background:
                                        analysis.allRequirementsFulfilled
                                          ? 'rgba(16, 185, 129, 0.1)'
                                          : 'rgba(245, 158, 11, 0.1)',
                                      border: analysis.allRequirementsFulfilled
                                        ? '1px solid rgba(16, 185, 129, 0.3)'
                                        : '1px solid rgba(245, 158, 11, 0.3)',
                                      borderRadius: '8px',
                                      padding: '6px 10px',
                                      flex: '1',
                                      minWidth: '120px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: analysis.allRequirementsFulfilled
                                          ? '#10b981'
                                          : '#f59e0b',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        marginBottom: '2px',
                                      }}
                                    >
                                      📋 REQUIREMENTS
                                    </div>
                                    <div
                                      style={{
                                        color: '#94a3b8',
                                        fontSize: '0.65rem',
                                      }}
                                    >
                                      {analysis.uploadedRequirements}/
                                      {analysis.totalRequirements} fulfilled
                                      {analysis.missingRequirements > 0 && (
                                        <span
                                          style={{
                                            color: '#f59e0b',
                                            fontWeight: '500',
                                          }}
                                        >
                                          {' '}
                                          • {analysis.missingRequirements}{' '}
                                          missing
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Documents Summary */}
                                {analysis.hasDocuments && (
                                  <div
                                    style={{
                                      background: analysis.allDocumentsSigned
                                        ? 'rgba(16, 185, 129, 0.1)'
                                        : analysis.pendingSignatures > 0
                                        ? 'rgba(245, 158, 11, 0.1)'
                                        : 'rgba(59, 130, 246, 0.1)',
                                      border: analysis.allDocumentsSigned
                                        ? '1px solid rgba(16, 185, 129, 0.3)'
                                        : analysis.pendingSignatures > 0
                                        ? '1px solid rgba(245, 158, 11, 0.3)'
                                        : '1px solid rgba(59, 130, 246, 0.3)',
                                      borderRadius: '8px',
                                      padding: '6px 10px',
                                      flex: '1',
                                      minWidth: '120px',
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: analysis.allDocumentsSigned
                                          ? '#10b981'
                                          : analysis.pendingSignatures > 0
                                          ? '#f59e0b'
                                          : '#3b82f6',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        marginBottom: '2px',
                                      }}
                                    >
                                      ✍️ DOCUMENTS
                                    </div>
                                    <div
                                      style={{
                                        color: '#94a3b8',
                                        fontSize: '0.65rem',
                                      }}
                                    >
                                      {analysis.totalDocuments} uploaded
                                      {analysis.pendingSignatures > 0 && (
                                        <span
                                          style={{
                                            color: '#f59e0b',
                                            fontWeight: '500',
                                          }}
                                        >
                                          {' '}
                                          • {analysis.pendingSignatures} need
                                          signing
                                        </span>
                                      )}
                                      {analysis.signedDocuments > 0 && (
                                        <span
                                          style={{
                                            color: '#10b981',
                                            fontWeight: '500',
                                          }}
                                        >
                                          {' '}
                                          • {analysis.signedDocuments} signed
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailStages;
