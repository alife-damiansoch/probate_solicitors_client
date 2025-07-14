// Modified RequiredDetailsPart.js - Stage-Connected Component Display
import { useEffect, useState } from 'react';
import { patchData } from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

import ApplicantsPart from './ApplicantsPart';
import EstatesPart from './EstatesPart';
import SolicitorPart from './SolicitorPart';

import Cookies from 'js-cookie';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import AdvancementInfo from '../Applications/AdvancementInfo.jsx';
import DocumentsUpload from '../Applications/UploadingFileComponents/DocumentsUpload.jsx';
import BasicDetailsSection from './BasicDetailsSection.jsx';

const RequiredDetailsPart = ({
  application,
  setApplication,
  id,
  refresh,
  setRefresh,
  highlitedSectionId,
  isApplicationLocked,
  advancement, // Add advancement prop
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [triggerHandleChange, setTriggerChandleChange] = useState(false);
  const [originalApplication, setOriginalApplication] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeSection, setActiveSection] = useState('basic_details');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currency_sign = Cookies.get('currency_sign');

  // Handle section changes with smooth transitions
  useEffect(() => {
    if (highlitedSectionId && highlitedSectionId !== activeSection) {
      setIsTransitioning(true);

      setTimeout(() => {
        setActiveSection(highlitedSectionId);
        setIsTransitioning(false);
      }, 150);
    }
  }, [highlitedSectionId, activeSection]);

  // Initialize the original application state when the component mounts
  useEffect(() => {
    if (application) {
      setOriginalApplication(JSON.parse(JSON.stringify(application))); // Deep copy of the application state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (application && !application.applicants) {
      setApplication({
        ...application,
        applicants: [],
      });
    }
  }, [application]);

  // Get stage info for styling
  const getStageTitleAndIcon = (stageId) => {
    const stageMap = {
      advancement_details: {
        title: 'Advancement Details',
        icon: 'fas fa-money-bill-wave',
        color: '#059669',
      },
      basic_details: {
        title: 'Application Information',
        icon: 'fas fa-info-circle',
        color: '#3b82f6',
      },
      applicant_registration: {
        title: 'Applicant Registration',
        icon: 'fas fa-user-plus',
        color: '#8b5cf6',
      },
      legal_representation: {
        title: 'Legal Representation',
        icon: 'fas fa-balance-scale',
        color: '#10b981',
      },
      estate_assessment: {
        title: 'Estate Assessment',
        icon: 'fas fa-home',
        color: '#f59e0b',
      },
      information_verification: {
        title: 'Information Verification',
        icon: 'fas fa-shield-check',
        color: '#ef4444',
      },
      documentation_requirements: {
        title: 'Documentation & Requirements',
        icon: 'fas fa-file-upload',
        color: '#6366f1',
      },
    };
    return stageMap[stageId] || stageMap['basic_details'];
  };

  const currentStage = getStageTitleAndIcon(activeSection);

  const getFilteredApplicationData = (application) => {
    const {
      amount,
      term,
      deceased,
      dispute,
      applicants,
      was_will_prepared_by_solicitor,
    } = application;

    return {
      amount,
      term,
      deceased: {
        first_name: deceased.first_name,
        last_name: deceased.last_name,
      },
      dispute: {
        details: dispute.details,
      },
      applicants: applicants.map(
        ({
          id,
          title,
          first_name,
          last_name,
          pps_number,
          address_line_1,
          address_line_2,
          city,
          county,
          postal_code,
          country,
          date_of_birth,
          email,
          phone_number,
        }) => ({
          id,
          title,
          first_name,
          last_name,
          pps_number,
          address_line_1,
          address_line_2,
          city,
          county,
          postal_code,
          country,
          date_of_birth,
          email,
          phone_number,
        })
      ),
      was_will_prepared_by_solicitor,
    };
  };

  const handleChange = (e, field) => {
    setApplication({
      ...application,
      [field]: e.target.value,
    });
  };

  const handleNestedChange = (e, parentField, field) => {
    setApplication({
      ...application,
      [parentField]: {
        ...application[parentField],
        [field]: e.target.value,
      },
    });
  };

  const handleListChange = (e, index, listName, field) => {
    const newList = application[listName].slice();
    newList[index][field] = e.target.value;
    setApplication({
      ...application,
      [listName]: newList,
    });
  };

  const addItem = (listName, newItem) => {
    if (listName === 'applicants') {
      setApplication({
        ...application,
        [listName]: [newItem],
      });
    } else {
      setApplication({
        ...application,
        [listName]: [...(application[listName] || []), newItem],
      });
    }
  };

  const removeItem = (listName, index) => {
    const newList = application[listName].slice();
    newList.splice(index, 1);
    console.log(newList);
    setApplication({
      ...application,
      [listName]: newList,
    });
    setTriggerChandleChange(!triggerHandleChange);
  };

  const toggleEditMode = (field) => {
    setEditMode({
      [field]: !editMode[field],
    });
  };

  const submitChangesHandler = async () => {
    setErrorMessage('');
    setIsError(false);

    if (application && originalApplication) {
      if (JSON.stringify(application) === JSON.stringify(originalApplication)) {
        console.log('No changes detected, skipping update.');
        return;
      }

      const filteredApplication = getFilteredApplicationData(application);
      if (filteredApplication.dispute.details.trim() === '') {
        filteredApplication.dispute.details = 'No dispute';
      }

      try {
        setIsUpdating(true);
        const endpoint = `/api/applications/solicitor_applications/${id}/`;
        const response = await patchData(endpoint, filteredApplication);
        if (response.status !== 200) {
          setIsError(true);
          setErrorMessage(response.data);
        } else {
          setErrorMessage({ Application: 'updated' });
          setIsError(false);

          setTimeout(function () {
            setErrorMessage('');
          }, 3000);
        }
      } catch (error) {
        console.error('Error updating application:', error);
        setIsError(true);

        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage(error.message);
        }
      } finally {
        setIsUpdating(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setRefresh(!refresh);
      }
    }
  };

  useEffect(() => {
    submitChangesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerHandleChange]);

  const FinalReviewComponent = () => {
    const isApproved = application.approved;
    const isRejected = application.is_rejected;
    const loan = application.loan || {};
    const needsCommittee = !!loan.needs_committee_approval;
    const isCommitteeApproved = loan.is_committee_approved;
    const isPaidOut = loan.is_paid_out;
    const isSettled = loan.is_settled;
    const paidOutDate = loan.paid_out_date;

    // Logic for icon, color, main status, and description
    let statusColor = '#64748b';
    let icon = 'fa-search';
    let statusText = 'Under Final Review';
    let detailText =
      'Your application is under final review by our processing team. You will be notified of the decision soon.';

    if (isRejected) {
      statusColor = '#dc2626';
      icon = 'fa-times-circle';
      statusText = 'Application Rejected';
      detailText =
        'Your application has been rejected. Contact your agent for details and next steps.';
    } else if (isApproved) {
      // Order: committee → payout → finance check → settlement
      if (needsCommittee) {
        if (isCommitteeApproved === null || isCommitteeApproved === undefined) {
          statusColor = '#f59e0b';
          icon = 'fa-users';
          statusText = 'Awaiting Committee Approval';
          detailText =
            'Your application has been approved and is now pending committee review. You will be notified once a decision has been made.';
        } else if (isCommitteeApproved === false) {
          statusColor = '#dc2626';
          icon = 'fa-times-circle';
          statusText = 'Committee Rejected';
          detailText =
            'Your application was not approved by the committee. Please contact your agent for further details.';
        } else if (isCommitteeApproved === true) {
          if (!isPaidOut) {
            statusColor = '#2563eb';
            icon = 'fa-credit-card';
            statusText = 'Awaiting Payment';
            detailText =
              'Your application has passed all approvals and is now awaiting payment. Your assigned agent will contact you with further details.';
          } else if (isPaidOut && !paidOutDate) {
            // NEW: Finance team final check stage
            statusColor = '#7c3aed';
            icon = 'fa-calculator';
            statusText = 'Finance Team Final Check';
            detailText =
              'Your application has been approved for payout and our finance team is conducting a final compliance check to ensure all requirements have been met. Payment will be processed once this review is complete.';
          } else if (!isSettled) {
            statusColor = '#6366f1';
            icon = 'fa-file-alt';
            statusText = 'Awaiting Settlement';
            detailText =
              'Your application has been fully processed and payment has been issued. The advancement process is now complete. Once the probate process is finalised, please notify your agent so that settlement arrangements can be made. If you require any documentation or further assistance in the meantime, please contact your agent.';
          } else {
            statusColor = '#059669';
            icon = 'fa-check-circle';
            statusText = 'Advancement Process Completed';
            detailText =
              'Your advancement has been fully settled and the process is now complete. If you require any documentation or further support, please contact your agent.';
          }
        }
      } else {
        // Non-committee path
        if (!isPaidOut) {
          statusColor = '#2563eb';
          icon = 'fa-credit-card';
          statusText = 'Awaiting Payment';
          detailText =
            'Your application has been approved and is now awaiting payment. Your assigned agent will contact you with further details.';
        } else if (isPaidOut && !paidOutDate) {
          // NEW: Finance team final check stage
          statusColor = '#7c3aed';
          icon = 'fa-calculator';
          statusText = 'Finance Team Final Check';
          detailText =
            'Your application has been approved for payout and our finance team is conducting a final compliance check to ensure all requirements have been met. Payment will be processed once this review is complete.';
        } else if (!isSettled) {
          statusColor = '#6366f1';
          icon = 'fa-file-alt';
          statusText = 'Awaiting Settlement';
          detailText =
            'Your application has been fully processed and payment has been issued. The advancement process is now complete. Once the probate process is finalised, please notify your agent so that settlement arrangements can be made. If you require any documentation or further assistance in the meantime, please contact your agent.';
        } else {
          statusColor = '#059669';
          icon = 'fa-check-circle';
          statusText = 'Advancement Process Completed';
          detailText =
            'Your advancement has been fully settled and the process is now complete. If you require any documentation or further support, please contact your agent.';
        }
      }
    }

    // --- UI below is unchanged except for using above variables ---

    return (
      <div
        className='modern-main-card mb-4 position-relative overflow-hidden mt-4'
        style={{
          background: `
          linear-gradient(135deg, rgba(255,255,255,0.10), rgba(248,250,252,0.05)),
          radial-gradient(circle at 30% 10%, rgba(255,255,255,0.45), transparent 50%),
          radial-gradient(circle at 70% 90%, ${statusColor}10, transparent 50%)
        `,
          border: '1px solid rgba(255,255,255,0.28)',
          borderRadius: '24px',
          boxShadow: `
          0 20px 40px rgba(0,0,0,0.08),
          0 8px 16px rgba(0,0,0,0.06),
          inset 0 1px 0 rgba(255,255,255,0.3)
        `,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Animated Background */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
            radial-gradient(circle at 20% 20%, ${statusColor}12 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${statusColor}09 0%, transparent 50%)
          `,
            opacity: 0.2,
            animation: 'float 6s ease-in-out infinite',
          }}
        />

        {/* Header */}
        <div
          className='px-3 py-2 d-flex align-items-center gap-2 position-relative'
          style={{
            background: `
            linear-gradient(135deg, ${statusColor}, ${statusColor}),
            linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.07))
          `,
            color: '#fff',
            borderTopLeftRadius: '22px',
            borderTopRightRadius: '22px',
            border: '1px solid rgba(255,255,255,0.13)',
            borderBottom: '1px solid rgba(255,255,255,0.18)',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-circle position-relative'
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(255,255,255,0.13)',
              border: '2px solid rgba(255,255,255,0.15)',
              fontSize: '1.2rem',
            }}
          >
            <i className={`fas ${icon}`} style={{ fontSize: '1.15rem' }} />
            <div
              className='position-absolute rounded-circle'
              style={{
                top: '-6px',
                left: '-6px',
                right: '-6px',
                bottom: '-6px',
                background: 'rgba(255,255,255,0.09)',
                filter: 'blur(5px)',
                zIndex: -1,
              }}
            />
          </div>

          <div className='flex-grow-1'>
            <h5
              className='fw-bold mb-1 text-white'
              style={{ fontSize: '1.07rem', letterSpacing: '-0.01em' }}
            >
              Final Review &amp; Approval
            </h5>
            <div
              className='px-2 py-1 rounded-pill fw-semibold text-white'
              style={{
                background: 'rgba(255,255,255,0.08)',
                fontSize: '0.8rem',
                border: '1px solid rgba(255,255,255,0.13)',
                display: 'inline-block',
                backdropFilter: 'blur(7px)',
                letterSpacing: '0.01em',
              }}
            >
              Final Stage
            </div>
          </div>

          {/* Status Badge */}
          <span
            className='px-3 py-2 rounded-pill text-white fw-bold d-flex align-items-center gap-2'
            style={{
              background: `linear-gradient(135deg,${statusColor},${statusColor})`,
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(9px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.09)',
              letterSpacing: '0.01em',
              animation:
                !isRejected && !isApproved
                  ? 'statusPulse 2.3s ease-in-out infinite'
                  : 'none',
            }}
          >
            <i className={`fas ${icon}`}></i>
            {statusText}
          </span>
        </div>

        {/* Content Area */}
        <div className='px-3 pb-3'>
          {/* Main Status Card */}
          <div
            className='text-center p-3 mb-3 position-relative'
            style={{
              background: 'rgba(255,255,255,0.78)',
              borderRadius: '14px',
              border: `1px solid ${statusColor}30`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            {/* Status glow */}
            <div
              className='position-absolute'
              style={{
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background: `linear-gradient(135deg,${statusColor}15,${statusColor}06)`,
                borderRadius: '15px',
                filter: 'blur(4px)',
                zIndex: -1,
                animation: 'selectionGlow 3s ease-in-out infinite alternate',
              }}
            />
            {/* Large Status Icon */}
            <div
              className='mx-auto mb-3'
              style={{
                width: '54px',
                height: '54px',
                background: `linear-gradient(135deg,${statusColor},${statusColor})`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 6px 14px ${statusColor}33`,
                animation:
                  !isRejected && !isApproved
                    ? 'statusPulse 4s ease-in-out infinite'
                    : 'iconFloat 3s ease-in-out infinite',
                position: 'relative',
              }}
            >
              <div
                className='position-absolute'
                style={{
                  top: '-3px',
                  left: '-3px',
                  right: '-3px',
                  bottom: '-3px',
                  background: `radial-gradient(circle,${statusColor}16,transparent 70%)`,
                  borderRadius: '50%',
                  filter: 'blur(7px)',
                  zIndex: -1,
                }}
              />
              <i
                className={`fas ${icon}`}
                style={{ color: 'white', fontSize: '1.6rem' }}
              ></i>
            </div>
            <h2
              className='fw-bold mb-2'
              style={{
                fontSize: '1.27rem',
                color: statusColor,
                letterSpacing: '-0.01em',
              }}
            >
              {statusText}
            </h2>
            <p
              className='mb-0'
              style={{
                fontSize: '1.02rem',
                color: '#64748b',
                fontWeight: 500,
                lineHeight: '1.5',
                maxWidth: '420px',
                margin: '0 auto',
              }}
            >
              {detailText}
            </p>
          </div>
          {/* Show action for rejected or committee rejected */}
          {(isRejected ||
            (isApproved &&
              needsCommittee &&
              isCommitteeApproved === false)) && (
            <div
              className='p-3 position-relative'
              style={{
                background: 'rgba(255,255,255,0.82)',
                borderRadius: '13px',
                border: `1px solid ${statusColor}20`,
                boxShadow: `0 4px 12px ${statusColor}06`,
              }}
            >
              <div className='d-flex align-items-center gap-2 mb-2'>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '9px',
                    background: `linear-gradient(135deg,${statusColor},${statusColor})`,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 10px ${statusColor}15`,
                  }}
                >
                  <i className='fas fa-user-tie' style={{ fontSize: '1rem' }} />
                </div>
                <h3
                  className='fw-bold mb-0'
                  style={{
                    color: '#92400e',
                    fontSize: '1rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  What to do next
                </h3>
              </div>
              <div>
                <p
                  className='mb-2'
                  style={{
                    color: '#78350f',
                    fontSize: '0.98rem',
                    lineHeight: '1.5',
                    fontWeight: 500,
                  }}
                >
                  Please contact your assigned legal representative for further
                  information and assistance with your application.
                </p>
              </div>
            </div>
          )}
        </div>
        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg);}
          50% { transform: translateY(-7px) rotate(2deg);}
        }
        @keyframes statusPulse {
          0%,100% {opacity: 1; transform: scale(1);}
          50% {opacity: 0.82; transform: scale(1.045);}
        }
        @keyframes selectionGlow {
          0% {opacity: 0.2;}
          100% {opacity: 0.5;}
        }
        @keyframes iconFloat {
          0%,100% {transform: translateY(0) rotate(0deg) scale(1);}
          50% {transform: translateY(-5px) rotate(3deg) scale(1.012);}
        }
      `}</style>
      </div>
    );
  };

  // Information Verification Component
  const InformationVerificationComponent = () => {
    const isVerified =
      application.processing_status?.application_details_completed_confirmed;
    const hasSolicitor = application.solicitor;
    const solicitorName = application.solicitor?.name || 'Legal Representative';

    return (
      <div
        className='modern-main-card mb-4 position-relative overflow-hidden mt-4'
        style={{
          background: `
          linear-gradient(135deg, rgba(255,255,255,0.1), rgba(248,250,252,0.05)),
          radial-gradient(circle at 30% 10%, rgba(255,255,255,0.6), transparent 50%),
          radial-gradient(circle at 70% 90%, ${
            isVerified ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
          }, transparent 50%)
        `,
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '24px',
          boxShadow: `
          0 20px 40px rgba(0,0,0,0.08),
          0 8px 16px rgba(0,0,0,0.06),
          inset 0 1px 0 rgba(255,255,255,0.4)
        `,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          transform: 'translateZ(0)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Animated Background */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
            radial-gradient(circle at 20% 20%, ${
              isVerified ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)'
            } 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${
              isVerified ? 'rgba(5,150,105,0.06)' : 'rgba(220,38,38,0.06)'
            } 0%, transparent 50%)
          `,
            opacity: 0.3,
            animation: 'float 6s ease-in-out infinite',
          }}
        />

        {/* Header */}
        <div
          className='px-3 py-2 d-flex align-items-center gap-2 position-relative'
          style={{
            background: `
            linear-gradient(135deg, ${
              isVerified ? '#10b981,#059669' : '#ef4444,#dc2626'
            }),
            linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))
          `,
            color: '#fff',
            borderTopLeftRadius: '22px',
            borderTopRightRadius: '22px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            minHeight: 0, // Remove excess height
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-circle position-relative'
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(255,255,255,0.12)',
              border: '2px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            <i
              className={`fas ${
                isVerified ? 'fa-shield-check' : 'fa-shield-exclamation'
              }`}
              style={{ fontSize: '1.1rem' }}
            ></i>
            <div
              className='position-absolute rounded-circle'
              style={{
                top: '-6px',
                left: '-6px',
                right: '-6px',
                bottom: '-6px',
                background: 'rgba(255,255,255,0.1)',
                filter: 'blur(5px)',
                zIndex: -1,
              }}
            />
          </div>

          <div className='flex-grow-1'>
            <h5
              className='fw-bold mb-1 text-white'
              style={{ fontSize: '1.07rem', letterSpacing: '-0.01em' }}
            >
              Information Verification
            </h5>
            <div
              className='px-2 py-1 rounded-pill fw-semibold text-white'
              style={{
                background: 'rgba(255,255,255,0.08)',
                fontSize: '0.8rem',
                border: '1px solid rgba(255,255,255,0.16)',
                display: 'inline-block',
                backdropFilter: 'blur(8px)',
                letterSpacing: '0.01em',
              }}
            >
              Legal Review Status
            </div>
          </div>
          {/* Status Badge */}
          <span
            className='px-3 py-2 rounded-pill text-white fw-bold d-flex align-items-center gap-2'
            style={{
              background: isVerified
                ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                : 'linear-gradient(135deg,#f59e0b,#d97706)',
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.16)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.09)',
              cursor: 'default',
              letterSpacing: '0.01em',
              animation: isVerified
                ? 'none'
                : 'statusPulse 3s ease-in-out infinite',
            }}
          >
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
              {isVerified ? (
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              ) : (
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                  clipRule='evenodd'
                />
              )}
            </svg>
            {isVerified ? 'Verified' : 'Pending'}
          </span>
        </div>

        {/* Content Area */}
        <div className='px-3 pb-3'>
          {/* Main Status Card */}
          <div
            className='text-center p-3 mb-3 position-relative'
            style={{
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '14px',
              border: `1px solid ${
                isVerified ? 'rgba(16,185,129,0.21)' : 'rgba(245,158,11,0.19)'
              }`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              marginTop: '20px',
            }}
          >
            {/* Status glow */}
            <div
              className='position-absolute'
              style={{
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background: `linear-gradient(135deg, ${
                  isVerified ? 'rgba(16,185,129,0.13)' : 'rgba(245,158,11,0.15)'
                }, ${
                  isVerified ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)'
                })`,
                borderRadius: '15px',
                filter: 'blur(4px)',
                zIndex: -1,
                animation: 'selectionGlow 3s ease-in-out infinite alternate',
              }}
            />
            {/* Large Status Icon */}
            <div
              className='mx-auto mb-3'
              style={{
                width: '54px',
                height: '54px',
                background: isVerified
                  ? 'linear-gradient(135deg,#10b981,#059669)'
                  : 'linear-gradient(135deg,#f59e0b,#d97706)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isVerified
                  ? '0 6px 14px rgba(16,185,129,0.23)'
                  : '0 6px 14px rgba(245,158,11,0.24)',
                animation: isVerified
                  ? 'iconFloat 4s ease-in-out infinite'
                  : 'statusPulse 3s ease-in-out infinite',
                position: 'relative',
              }}
            >
              <div
                className='position-absolute'
                style={{
                  top: '-3px',
                  left: '-3px',
                  right: '-3px',
                  bottom: '-3px',
                  background: `radial-gradient(circle,${
                    isVerified
                      ? 'rgba(16,185,129,0.22)'
                      : 'rgba(245,158,11,0.21)'
                  },transparent 70%)`,
                  borderRadius: '50%',
                  filter: 'blur(7px)',
                  zIndex: -1,
                }}
              />
              <i
                className={`fas ${isVerified ? 'fa-shield-check' : 'fa-clock'}`}
                style={{ color: 'white', fontSize: '1.6rem' }}
              ></i>
            </div>
            <h2
              className='fw-bold mb-2'
              style={{
                fontSize: '1.27rem',
                color: isVerified ? '#059669' : '#d97706',
                letterSpacing: '-0.01em',
              }}
            >
              {isVerified ? 'Information Verified' : 'Awaiting Verification'}
            </h2>
            <p
              className='mb-0'
              style={{
                fontSize: '1.02rem',
                color: '#64748b',
                fontWeight: 500,
                lineHeight: '1.5',
                maxWidth: '420px',
                margin: '0 auto',
              }}
            >
              {isVerified
                ? `All application details have been thoroughly reviewed and verified by the agent.`
                : `Your application details are pending verification by your assigned agent.`}
            </p>
          </div>

          {/* Next Steps Card - Only show if not verified */}
          {!isVerified && (
            <div
              className='p-3 position-relative'
              style={{
                background: 'rgba(255,255,255,0.7)',
                borderRadius: '13px',
                border: '1px solid rgba(245,158,11,0.16)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              {/* Info glow */}
              <div
                className='position-absolute'
                style={{
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  background:
                    'linear-gradient(135deg,rgba(245,158,11,0.13),rgba(245,158,11,0.05))',
                  borderRadius: '13px',
                  filter: 'blur(4px)',
                  zIndex: -1,
                  animation: 'selectionGlow 3s ease-in-out infinite alternate',
                }}
              />
              <div className='d-flex align-items-center gap-2 mb-2'>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '9px',
                    background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(245,158,11,0.17)',
                  }}
                >
                  <i
                    className='fas fa-info-circle'
                    style={{ fontSize: '1rem' }}
                  ></i>
                </div>
                <h3
                  className='fw-bold mb-0'
                  style={{
                    color: '#92400e',
                    fontSize: '1rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Next Steps
                </h3>
              </div>
              <div>
                <p
                  className='mb-2'
                  style={{
                    color: '#78350f',
                    fontSize: '0.98rem',
                    lineHeight: '1.5',
                    fontWeight: 500,
                  }}
                >
                  Your assigned agent will contact you to confirm all
                  information provided. To expedite this process, please ensure
                  all required details have been completed accurately. If all
                  information is complete, you are also welcome to contact your
                  assigned agent directly to help move things forward.
                </p>
                <p
                  className='mb-0'
                  style={{
                    color: '#78350f',
                    fontSize: '0.98rem',
                    lineHeight: '1.5',
                    fontWeight: 500,
                  }}
                >
                  Once verification is complete, you will be able to proceed to
                  the documentation stage of your application.
                </p>
              </div>
            </div>
          )}
        </div>
        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg);}
          50% { transform: translateY(-7px) rotate(2deg);}
        }
        @keyframes statusPulse {
          0%,100% {opacity: 1; transform: scale(1);}
          50% {opacity: 0.82; transform: scale(1.045);}
        }
        @keyframes selectionGlow {
          0% {opacity: 0.2;}
          100% {opacity: 0.5;}
        }
        @keyframes iconFloat {
          0%,100% {transform: translateY(0) rotate(0deg) scale(1);}
          50% {transform: translateY(-5px) rotate(3deg) scale(1.012);}
        }
      `}</style>
      </div>
    );
  };

  // Render the appropriate component based on active section
  const renderActiveComponent = () => {
    if (isTransitioning) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            color: currentStage.color,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: `3px solid ${currentStage.color}30`,
                borderTop: `3px solid ${currentStage.color}`,
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              Loading {currentStage.title}...
            </span>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'advancement_details':
        return <AdvancementInfo advancement={advancement} />;

      case 'basic_details':
        return (
          <BasicDetailsSection
            application={application}
            setApplication={setApplication}
            editMode={editMode}
            toggleEditMode={toggleEditMode}
            handleChange={handleChange}
            handleNestedChange={handleChange}
            submitChangesHandler={submitChangesHandler}
            isApplicationLocked={isApplicationLocked}
            triggerHandleChange={triggerHandleChange}
            setTriggerChandleChange={setTriggerChandleChange}
          />
        );

      case 'applicant_registration':
        return (
          <ApplicantsPart
            addItem={addItem}
            application={application}
            handleListChange={handleListChange}
            editMode={editMode}
            submitChangesHandler={submitChangesHandler}
            toggleEditMode={toggleEditMode}
            removeItem={removeItem}
            triggerHandleChange={triggerHandleChange}
            setTriggerChandleChange={setTriggerChandleChange}
            isApplicationLocked={isApplicationLocked}
          />
        );

      case 'legal_representation':
        return (
          <SolicitorPart
            application_id={application.id}
            solicitor_id={application.solicitor}
            refresh={refresh}
            setRefresh={setRefresh}
            highlitedSectionId={highlitedSectionId}
          />
        );

      case 'estate_assessment':
        return (
          <EstatesPart
            application={application}
            refresh={refresh}
            setRefresh={setRefresh}
            isApplicationLocked={isApplicationLocked}
          />
        );

      case 'information_verification':
        return <InformationVerificationComponent />;

      case 'documentation_requirements':
        return (
          <DocumentsUpload
            application={application}
            highlitedSectionId={highlitedSectionId}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        );

      case 'final_review':
        return <FinalReviewComponent />;

      default:
        return (
          <BasicDetailsSection
            application={application}
            setApplication={setApplication}
            editMode={editMode}
            toggleEditMode={toggleEditMode}
            handleChange={handleChange}
            handleNestedChange={handleChange}
            submitChangesHandler={submitChangesHandler}
            isApplicationLocked={isApplicationLocked}
            triggerHandleChange={triggerHandleChange}
            setTriggerChandleChange={setTriggerChandleChange}
          />
        );
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1F2049 !important',
        position: 'relative',
      }}
    >
      <style>
        {`
          @keyframes backgroundShift {
            0%, 100% { 
              transform: translateX(0) translateY(0) scale(1);
              opacity: 0.7;
            }
            33% { 
              transform: translateX(-20px) translateY(10px) scale(1.02);
              opacity: 0.5;
            }
            66% { 
              transform: translateX(20px) translateY(-10px) scale(0.98);
              opacity: 0.8;
            }
          }

          @keyframes statusPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes contentSlideIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes iconFloat {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
            50% { transform: translateY(-8px) rotate(5deg) scale(1.02); }
          }

          @keyframes progressSlide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(250%); }
            100% { transform: translateX(-100%); }
          }

          @keyframes progressShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          .scroll-container::-webkit-scrollbar {
            width: 8px;
          }
          
          .scroll-container::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
border-radius: 4px;
}
.scroll-container::-webkit-scrollbar-thumb {
        background: ${currentStage.color};
        border-radius: 4px;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
      }
    `}
      </style>

      {/* Animated Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
        radial-gradient(circle at 20% 80%, ${currentStage.color}15 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, ${currentStage.color}10 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, ${currentStage.color}08 0%, transparent 50%)
      `,
          animation: 'backgroundShift 20s ease-in-out infinite',
        }}
      />

      {/* Content Container */}
      <div
        className='scroll-container'
        style={{
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        {/* CUTTING-EDGE GLASSMORPHIC HEADER */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            margin: '0 1rem 2rem 1rem',
            borderRadius: '24px',
            background: `
      linear-gradient(135deg, rgba(255,255,255,0.27) 0%, rgba(245,245,245,0.18) 100%),
      linear-gradient(120deg, ${currentStage.color}1A 0%, ${currentStage.color}0F 100%)
    `,
            backdropFilter: 'blur(38px) saturate(170%)',
            borderBottom: '1.5px solid rgba(0,0,0,0.07)',
            boxShadow: `
      0 12px 32px rgba(0,0,0,0.13),
      0 1.5px 0px ${currentStage.color}40,
      inset 0 0.5px 0px rgba(255,255,255,0.15)
    `,
            overflow: 'visible',
            padding: '0',
          }}
        >
          {/* Responsive Flex Layout */}
          <div
            style={{
              display: 'flex',
              flexDirection: window.innerWidth < 700 ? 'column' : 'row',
              alignItems: window.innerWidth < 700 ? 'stretch' : 'center',
              gap: window.innerWidth < 700 ? '1.2rem' : '2.5rem',
              padding:
                window.innerWidth < 700
                  ? '1.2rem 0.7rem 1.5rem 0.7rem'
                  : '2.8rem 3rem 2.5rem 3rem',
              minHeight: window.innerWidth < 700 ? 'auto' : '160px',
              width: '100%',
              position: 'relative',
              transition: 'all .22s cubic-bezier(.46,.03,.52,.96)',
            }}
          >
            {/* Floating Animated Glass Icon */}
            <div
              style={{
                alignSelf: window.innerWidth < 700 ? 'center' : 'flex-start',
                width: window.innerWidth < 700 ? 62 : 86,
                height: window.innerWidth < 700 ? 62 : 86,
                background: `
          linear-gradient(135deg, ${currentStage.color}DD 0%, ${currentStage.color}90 100%)
        `,
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `
          0 9px 32px ${currentStage.color}44,
          0 1.5px 0px #fff2
        `,
                position: 'relative',
                animation: 'iconFloat 3.3s ease-in-out infinite',
                border: `1.5px solid ${currentStage.color}3A`,
                overflow: 'visible',
                transition: 'all .2s',
              }}
            >
              {/* Inner glow and glass light */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16%',
                  left: '-12%',
                  width: '68%',
                  height: '68%',
                  background: `radial-gradient(circle, rgba(255,255,255,0.19) 0%, transparent 90%)`,
                  filter: 'blur(1px)',
                  borderRadius: '50%',
                  zIndex: 0,
                }}
              />
              <i
                className={currentStage.icon}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: window.innerWidth < 700 ? '1.5rem' : '2.3rem',
                  color: '#fff',
                  filter: 'drop-shadow(0 2px 8px #0003)',
                }}
              ></i>
            </div>

            {/* Titles and Status */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: window.innerWidth < 700 ? 'center' : 'flex-start',
                gap: window.innerWidth < 700 ? '0.4rem' : '0.6rem',
                textAlign: window.innerWidth < 700 ? 'center' : 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent:
                    window.innerWidth < 700 ? 'center' : 'flex-start',
                  gap: window.innerWidth < 700 ? '0.5rem' : '0.75rem',
                  marginBottom: window.innerWidth < 700 ? '0.4rem' : '0.75rem',
                }}
              >
                <div
                  style={{
                    padding: '0.38rem 0.9rem',
                    background: 'rgba(15,23,42,0.8)',
                    borderRadius: '19px',
                    color: 'rgba(255,255,255,0.94)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    fontSize: window.innerWidth < 700 ? '0.93rem' : '1.03rem',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Application #{application.id}
                </div>
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'rgba(15,23,42,0.4)',
                  }}
                />
                <div
                  style={{
                    padding: '0.38rem 0.95rem',
                    background: `linear-gradient(135deg, ${currentStage.color}, ${currentStage.color}cc)`,
                    borderRadius: '19px',
                    color: '#fff',
                    fontWeight: 700,
                    backdropFilter: 'blur(9px)',
                    boxShadow: `0 2px 8px ${currentStage.color}30`,
                    border: '1px solid rgba(255,255,255,0.18)',
                    fontSize: window.innerWidth < 700 ? '0.95rem' : '1.06rem',
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentStage.title}
                </div>
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: window.innerWidth < 700 ? '1.37rem' : '2.3rem',
                  fontWeight: 900,
                  color: '#0f172a',
                  letterSpacing: '-0.018em',
                  textShadow: '0 2.5px 9px rgba(0,0,0,0.07)',
                  lineHeight: 1.09,
                  wordBreak: 'break-word',
                  textWrap: 'balance',
                  maxWidth: window.innerWidth < 700 ? '95vw' : 'unset',
                  transition: 'font-size .18s',
                }}
              >
                {currentStage.title}
              </h1>
              <p
                style={{
                  margin: '0.3rem 0 0 0',
                  fontSize: window.innerWidth < 700 ? '0.95rem' : '1.06rem',
                  color: 'rgba(15,23,42,0.74)',
                  fontWeight: 500,
                  textWrap: 'balance',
                }}
              >
                Manage and review your application details
              </p>
            </div>

            {/* Modern Status Indicator - Responsive */}
            <div
              style={{
                alignSelf: window.innerWidth < 700 ? 'center' : 'flex-end',
                marginTop: window.innerWidth < 700 ? '1.1rem' : 0,
                // minWidth: 0,
                padding:
                  window.innerWidth < 700 ? '0.6rem 1.1rem' : '1rem 1.5rem',
                background: `
          linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.76) 100%)
        `,
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.23)',
                color: '#0f172a',
                fontWeight: 700,
                fontSize: window.innerWidth < 700 ? '0.95rem' : '1.07rem',
                boxShadow: `
          0 4px 10px rgba(0,0,0,0.07),
          inset 0 1.5px 0 rgba(255,255,255,0.53)
        `,
                backdropFilter: 'blur(16px)',
                textAlign: 'center',
                minWidth: window.innerWidth < 700 ? 90 : 140,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.22rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                }}
              >
                <div
                  style={{
                    width: window.innerWidth < 700 ? 7 : 9,
                    height: window.innerWidth < 700 ? 7 : 9,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${currentStage.color}, ${currentStage.color}cc)`,
                    boxShadow: `0 0 8px ${currentStage.color}65`,
                    animation: 'statusPulse 1.8s ease-in-out infinite',
                  }}
                />
                <span style={{ fontSize: '0.84em', opacity: 0.78 }}>
                  VIEWING
                </span>
              </div>
              <div
                style={{
                  fontSize: window.innerWidth < 700 ? '0.85em' : '0.95em',
                  color: currentStage.color,
                  fontWeight: 800,
                }}
              >
                Active Section
              </div>
            </div>
          </div>

          {/* Animated Accent Glow Bar */}
          <div
            style={{
              height: window.innerWidth < 700 ? '3.5px' : '5px',
              background: `linear-gradient(90deg, ${currentStage.color}, #fff3, ${currentStage.color}90, #fff3, ${currentStage.color})`,
              boxShadow: `0 1.5px 8px ${currentStage.color}26`,
              borderRadius: 30,
              width: '94%',
              margin:
                window.innerWidth < 700
                  ? '0 auto 0.15rem auto'
                  : '0 auto 0.22rem auto',
              animation: 'progressShimmer 3s linear infinite',
              position: 'relative',
              overflow: 'hidden',
            }}
          ></div>
        </div>

        {/* Content Area */}
        <div
          style={{
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <div
            style={{
              width: '100%',
            }}
          >
            {/* Status Messages */}
            {errorMessage && (
              <div
                className={`alert border-0 text-center mx-auto mb-4 ${
                  isError ? 'alert-danger' : 'alert-success'
                }`}
                style={{
                  maxWidth: '600px',
                  borderRadius: '12px',
                  boxShadow: isError
                    ? '0 4px 6px rgba(239, 68, 68, 0.1)'
                    : '0 4px 6px rgba(34, 197, 94, 0.1)',
                  backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
                  color: isError ? '#dc2626' : '#16a34a',
                  fontWeight: '500',
                }}
                role='alert'
              >
                <div className='d-flex align-items-center justify-content-center'>
                  <i
                    className={`fas ${
                      isError ? 'fa-exclamation-triangle' : 'fa-check-circle'
                    } me-2`}
                  ></i>
                  {renderErrors(errorMessage)}
                </div>
              </div>
            )}

            {isUpdating && <LoadingComponent message='Saving changes ...' />}

            {/* Content Card */}
            <div
              style={{
                // background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.25),
              0 0 0 1px ${currentStage.color}15,
              inset 0 1px 0 rgba(255, 255, 255, 0.9)
            `,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${currentStage.color}20`,
                overflow: 'hidden',
                position: 'relative',
                animation: 'contentSlideIn 0.3s ease-out',
              }}
            >
              {/* Subtle header accent */}
              <div
                style={{
                  height: '4px',
                  background: `linear-gradient(90deg, ${currentStage.color}, ${currentStage.color}80, ${currentStage.color})`,
                  animation: 'progressShimmer 3s infinite',
                }}
              />

              {/* Component Content */}
              <div
                style={{
                  // padding: '1rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {renderActiveComponent()}
              </div>

              {/* Background decoration */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: `radial-gradient(circle, ${currentStage.color}08 0%, transparent 70%)`,
                  transform: 'translate(50%, -50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RequiredDetailsPart;
