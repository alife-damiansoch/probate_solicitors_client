import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FaCheck,
  FaClock,
  FaFileAlt,
  FaFileUpload,
  FaGavel,
  FaInfoCircle,
  FaMoneyBillWave,
  FaTimes,
  FaUser,
} from 'react-icons/fa';

const ModernApplicationProgress = ({
  application,
  setHighlightedSectionId,
  estates = [],
  advancement = {},
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);

  // Hover info content (from original component)
  const getHoverInfo = (stepId) => {
    const hoverData = {
      submitted: {
        header: 'Application Submission',
        content: `
          <div>
            <p><strong>Required Information:</strong></p>
            <ul>
              <li>Application amount and term</li>
              <li>Deceased person details</li>
              <li>At least one applicant</li>
              <li>Estate information</li>
            </ul>
            <p><small>All basic details must be completed before proceeding.</small></p>
          </div>
        `,
      },
      solicitor: {
        header: 'Solicitor Assignment',
        content: `
          <div>
            <p><strong>Solicitor Selection:</strong></p>
            <p>A qualified solicitor must be assigned to handle the legal aspects of this application.</p>
            <ul>
              <li>Choose from your firm's solicitor list</li>
              <li>Solicitor will handle documentation</li>
              <li>Required for legal compliance</li>
            </ul>
          </div>
        `,
      },
      documents: {
        header: 'Document Upload Requirements',
        content: `
          <div>
            <p><strong>Required Documents:</strong></p>
            <ul>
              <li><strong>Undertaking:</strong> Legal undertaking document</li>
              <li><strong>Advancement Agreement:</strong> Loan agreement documentation</li>
              <li><strong>Supporting Documents:</strong> Additional required files</li>
            </ul>
            <p><small>All documents must be uploaded and properly signed.</small></p>
          </div>
        `,
      },
      review: {
        header: 'Review Process',
        content: `
          <div>
            <p><strong>Application Review:</strong></p>
            <p>Your application is being reviewed by our team.</p>
            <ul>
              <li>All documents are verified</li>
              <li>Financial assessment conducted</li>
              <li>Legal compliance checked</li>
              ${
                application.loan?.needs_committee_approval
                  ? '<li>Committee approval required</li>'
                  : ''
              }
            </ul>
          </div>
        `,
      },
      decision: {
        header: 'Final Decision',
        content: `
          <div>
            <p><strong>Application Status:</strong></p>
            ${
              application.approved
                ? '<p class="text-success"><strong>✓ Application Approved</strong></p><p>Your application has been approved and is ready for advancement.</p>'
                : application.is_rejected
                ? '<p class="text-danger"><strong>✗ Application Rejected</strong></p><p>Unfortunately, your application has been rejected.</p>'
                : '<p><strong>Pending Decision</strong></p><p>Your application is awaiting final approval decision.</p>'
            }
          </div>
        `,
      },
      paidout: {
        header: 'Payment Status',
        content: `
          <div>
            <p><strong>Payment Processing:</strong></p>
            ${
              advancement?.is_paid_out
                ? '<p class="text-success"><strong>✓ Payment Completed</strong></p><p>The approved amount has been paid out successfully.</p>'
                : '<p><strong>Payment Pending</strong></p><p>Payment is being processed and will be completed shortly.</p>'
            }
            <ul>
              <li>Payment amount processed</li>
              <li>Funds transferred to beneficiary</li>
              <li>Transaction completed</li>
            </ul>
          </div>
        `,
      },
    };
    return (
      hoverData[stepId] || {
        header: 'Information',
        content: 'No additional information available.',
      }
    );
  };

  // Define the steps with their conditions and click handlers
  const steps = [
    {
      id: 'submitted',
      label: 'Submitted',
      icon: FaFileAlt,
      section: 'Basic Details',
      completed:
        application.amount &&
        application.term &&
        application.deceased?.first_name &&
        application.deceased?.last_name &&
        application.applicants?.length > 0 &&
        estates?.length > 0,
      shortDesc: 'Details',
    },
    {
      id: 'solicitor',
      label: 'Solicitor',
      icon: FaUser,
      section: 'Solicitor Part',
      completed: application.solicitor !== null,
      shortDesc: 'Assigned',
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FaFileUpload,
      section: 'Uploaded Documents',
      completed:
        application.undertaking_ready &&
        application.loan_agreement_ready &&
        (application.documents?.length > 0 ||
          application.signed_documents?.length > 0),
      shortDesc: 'Uploaded',
    },
    {
      id: 'review',
      label: 'Review',
      icon: FaClock,
      section: '',
      completed: false,
      inProgress: !application.approved && !application.is_rejected,
      shortDesc: application.loan?.needs_committee_approval
        ? 'Committee'
        : 'Review',
    },
    {
      id: 'decision',
      label: 'Decision',
      icon: application.approved
        ? FaCheck
        : application.is_rejected
        ? FaTimes
        : FaGavel,
      section: '',
      completed: application.approved || application.is_rejected,
      approved: application.approved,
      rejected: application.is_rejected,
      shortDesc: application.approved
        ? 'Approved'
        : application.is_rejected
        ? 'Rejected'
        : 'Pending',
    },
    // Add Paid Out step - only show when approved and no committee needed
    ...(application.approved && !application.loan?.needs_committee_approval
      ? [
          {
            id: 'paidout',
            label: 'Paid Out',
            icon: FaMoneyBillWave,
            section: '',
            completed: advancement?.is_paid_out || false,
            shortDesc: advancement?.is_paid_out ? 'Paid' : 'Pending',
          },
        ]
      : []),
  ];

  // Calculate current step based on completion
  useEffect(() => {
    const completedSteps = steps.filter((step) => step.completed).length;
    setCurrentStep(completedSteps);
  }, [application, steps]);

  const handleStepClick = (step) => {
    if (step.section) {
      setHighlightedSectionId(step.section);
    }
  };

  const getStepStatus = (step, index) => {
    // For rejected applications
    if (application.is_rejected) {
      if (step.id === 'decision') return 'rejected';
      return step.completed ? 'completed' : 'incomplete';
    }

    // For approved applications that need committee approval
    if (application.approved && application.loan?.needs_committee_approval) {
      if (step.id === 'decision') return 'in-progress';
      if (step.id === 'review') return 'in-progress';
      return step.completed ? 'completed' : 'incomplete';
    }

    // For fully approved applications (no committee needed)
    if (application.approved && !application.loan?.needs_committee_approval) {
      if (step.id === 'paidout') {
        return step.completed ? 'completed' : 'in-progress';
      }
      if (step.id === 'decision') return 'approved';
      if (step.id === 'review') return 'completed';
      return step.completed ? 'completed' : 'incomplete';
    }

    // For in-progress applications (not approved yet, not rejected)
    if (
      step.id === 'review' &&
      !application.approved &&
      !application.is_rejected
    ) {
      return 'in-progress';
    }

    // Default logic for other steps
    if (step.completed) return 'completed';
    return 'incomplete';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'approved':
        return '#22c55e';
      case 'rejected':
        return '#ef4444';
      case 'in-progress':
        return '#f59e0b';
      case 'incomplete':
        return '#9ca3af';
      default:
        return '#e5e7eb';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'completed':
        return '#f0fdf4';
      case 'approved':
        return '#f0fdf4';
      case 'rejected':
        return '#fef2f2';
      case 'in-progress':
        return '#fefbf3';
      case 'incomplete':
        return '#f9fafb';
      default:
        return '#f9fafb';
    }
  };

  // Check if first 3 steps are completed
  const firstThreeCompleted = steps.slice(0, 3).every((s) => s.completed);

  return (
    <>
      {/* Compact Progress Header */}
      <div
        className='sticky-top bg-white border-bottom'
        style={{
          zIndex: 1020,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          top: '0',
        }}
      >
        <div className='container-fluid px-4 py-2'>
          {/* Single Row Layout */}
          <div className='d-flex align-items-center justify-content-between'>
            {/* Left: Title */}
            <div className='d-flex align-items-center'>
              <h6 className='mb-0 fw-semibold text-slate-700 me-3'>
                Application #{application.id}
              </h6>

              {/* Progress Bar */}
              <div className='d-flex align-items-center me-3'>
                <div
                  className='progress me-2'
                  style={{
                    width: '100px',
                    height: '6px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '3px',
                  }}
                >
                  <div
                    className='progress-bar'
                    style={{
                      width: `${(currentStep / (steps.length - 1)) * 100}%`,
                      backgroundColor: '#3b82f6',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <span
                  className='small fw-medium text-slate-600'
                  style={{ fontSize: '0.75rem' }}
                >
                  {Math.round((currentStep / (steps.length - 1)) * 100)}%
                </span>
              </div>
            </div>

            {/* Right: Compact Steps */}
            <div className='d-flex align-items-center' style={{ gap: '8px' }}>
              {steps.map((step, index) => {
                const status = getStepStatus(step, index);
                const IconComponent = step.icon;
                const hoverInfo = getHoverInfo(step.id);
                const isReviewDivider = index === 3; // Before review step

                return (
                  <div
                    key={step.id}
                    className='d-flex align-items-center'
                    style={{ gap: '8px' }}
                  >
                    {/* Add divider before review step */}
                    {isReviewDivider && (
                      <div className='d-flex flex-column align-items-center mx-2'>
                        <div
                          style={{
                            width: '2px',
                            height: '25px',
                            backgroundColor: firstThreeCompleted
                              ? '#22c55e'
                              : '#e5e7eb',
                            borderRadius: '1px',
                          }}
                        />
                        <span
                          className='small'
                          style={{
                            fontSize: '0.6rem',
                            color: firstThreeCompleted ? '#22c55e' : '#9ca3af',
                            fontWeight: '500',
                            marginTop: '2px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {firstThreeCompleted ? 'Ready' : 'Pending'}
                        </span>
                      </div>
                    )}

                    <div
                      className='position-relative'
                      onMouseEnter={() => setHoveredStep(step.id)}
                      onMouseLeave={() => setHoveredStep(null)}
                    >
                      {/* Step Button */}
                      <div
                        className={`d-flex align-items-center px-2 py-1 rounded-pill ${
                          step.section ? 'cursor-pointer' : ''
                        }`}
                        style={{
                          backgroundColor: getStatusBg(status),
                          border: `2px solid ${getStatusColor(status)}`,
                          transition: 'all 0.2s ease',
                          cursor: step.section ? 'pointer' : 'default',
                          minWidth: '80px',
                          // CHANGED: Much more aggressive dimming - barely visible when pending
                          opacity:
                            !firstThreeCompleted && index >= 3 ? 0.15 : 1,
                        }}
                        onClick={() => handleStepClick(step)}
                        onMouseOver={(e) => {
                          if (step.section) {
                            e.currentTarget.style.transform =
                              'translateY(-1px)';
                            e.currentTarget.style.boxShadow =
                              '0 2px 4px rgba(0, 0, 0, 0.1)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (step.section) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {/* Icon with status-based styling */}
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center me-1'
                          style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: getStatusColor(status),
                            color: 'white',
                            fontSize: '10px',
                          }}
                        >
                          {status === 'completed' || status === 'approved' ? (
                            <FaCheck size={10} />
                          ) : status === 'rejected' ? (
                            <FaTimes size={10} />
                          ) : status === 'incomplete' ? (
                            <FaTimes size={10} />
                          ) : (
                            <IconComponent size={10} />
                          )}
                        </div>

                        {/* Label */}
                        <span
                          className='small fw-medium'
                          style={{
                            color: getStatusColor(status),
                            fontSize: '0.7rem',
                          }}
                        >
                          {step.shortDesc}
                        </span>

                        {/* Info Icon */}
                        <FaInfoCircle
                          className='ms-1 opacity-50'
                          size={8}
                          style={{ color: getStatusColor(status) }}
                        />
                      </div>

                      {/* Pulsing effect for in-progress */}
                      {status === 'in-progress' && (
                        <motion.div
                          className='position-absolute top-0 start-0 w-100 h-100 rounded-pill'
                          style={{
                            border: '2px solid #f59e0b',
                            zIndex: -1,
                          }}
                          animate={{
                            boxShadow: [
                              '0 0 0 0 rgba(245, 158, 11, 0.4)',
                              '0 0 0 4px rgba(245, 158, 11, 0)',
                            ],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: 'loop',
                          }}
                        />
                      )}

                      {/* Hover Tooltip */}
                      {hoveredStep === step.id && (
                        <div
                          className='position-absolute bg-white border rounded-3 p-3 shadow-lg'
                          style={{
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginTop: '8px',
                            width: '280px',
                            zIndex: 1030,
                            fontSize: '0.8rem',
                            lineHeight: '1.4',
                          }}
                        >
                          {/* Arrow */}
                          <div
                            className='position-absolute bg-white border'
                            style={{
                              top: '-6px',
                              left: '50%',
                              transform: 'translateX(-50%) rotate(45deg)',
                              width: '12px',
                              height: '12px',
                              borderBottom: 'none',
                              borderRight: 'none',
                            }}
                          />

                          {/* Content */}
                          <div className='position-relative'>
                            <h6
                              className='fw-bold mb-2 text-slate-800'
                              style={{ fontSize: '0.85rem' }}
                            >
                              {hoverInfo.header}
                            </h6>
                            <div
                              className='text-slate-600'
                              dangerouslySetInnerHTML={{
                                __html: hoverInfo.content,
                              }}
                              style={{ fontSize: '0.75rem' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Connection Line */}
                      {index < steps.length - 1 && !isReviewDivider && (
                        <div
                          className='position-absolute'
                          style={{
                            top: '50%',
                            right: '-4px',
                            width: '8px',
                            height: '1px',
                            backgroundColor:
                              status === 'completed' || status === 'approved'
                                ? '#22c55e'
                                : '#e5e7eb',
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rejection Reason - Compact */}
          {application.is_rejected && application.rejected_reason && (
            <div
              className='alert border-0 mt-2 mb-0 py-1 px-2'
              style={{
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                borderRadius: '6px',
                fontSize: '0.75rem',
              }}
            >
              <div className='d-flex align-items-center'>
                <FaTimes className='me-1' size={10} />
                <span className='fw-medium me-2'>Rejected:</span>
                <span>{application.rejected_reason}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModernApplicationProgress;
