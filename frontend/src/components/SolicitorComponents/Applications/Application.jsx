import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaSpinner,
  FaStar,
  FaTimesCircle,
  FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ApplicationMaturity from '../../GenericComponents/StageBadges.jsx/ApplicationMaturity';
import StatusBadge from '../../GenericComponents/StageBadges.jsx/StatusBadge';
import { formatMoney } from '../../GenericFunctions/HelperGenericFunctions';
import Stage from './Stage';

const Application = ({ application }) => {
  const [rejectedInAnyStage, setRejectedInAnyStage] = useState(false);
  const [approvedInAnyStage, setApprovedInAnyStage] = useState(false);
  const [formData] = useState({ ...application });
  const currency_sign = Cookies.get('currency_sign');
  const navigate = useNavigate();

  const applicationClickHandler = () => {
    navigate(`/applications/${formData.id}`);
  };

  // Enhanced status colors with original great colors restored
  const getStatusTheme = () => {
    // REJECTED - Deep crimson with sophisticated depth (original)
    if (rejectedInAnyStage) {
      return {
        primary: '#dc2626',
        secondary: '#991b1b',
        gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        lightGradient:
          'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(153, 27, 27, 0.08) 100%)',
        accent: '#ef4444',
        bg: 'rgba(220, 38, 38, 0.12)',
        border: 'rgba(220, 38, 38, 0.3)',
        text: '#991b1b',
        glow: 'rgba(220, 38, 38, 0.4)',
        statusLabel: 'Rejected',
        statusIcon: <FaTimesCircle />,
      };
    }

    // APPROVED - Different states with distinct themes (original)
    if (approvedInAnyStage) {
      // SETTLED - Deep ocean blue for completion (original)
      if (application?.loan?.is_settled) {
        return {
          primary: '#1d4ed8',
          secondary: '#1e40af',
          gradient:
            'linear-gradient(135deg, rgba(29, 78, 216, 0.9) 0%, rgba(30, 64, 175, 0.8) 50%, rgba(30, 58, 138, 0.9) 100%)',
          lightGradient:
            'linear-gradient(135deg, rgba(29, 78, 216, 0.15) 0%, rgba(30, 64, 175, 0.08) 100%)',
          accent: '#3b82f6',
          bg: 'rgba(29, 78, 216, 0.12)',
          border: 'rgba(29, 78, 216, 0.3)',
          text: '#1e40af',
          glow: 'rgba(29, 78, 216, 0.4)',
          statusLabel: 'Settled',
          statusIcon: <FaCheckCircle />,
        };
      }

      // PAID OUT - Rich gold-amber (original)
      if (application?.loan?.is_paid_out) {
        return {
          primary: '#ca8a04',
          secondary: '#a16207',
          gradient:
            'linear-gradient(135deg, rgba(202, 138, 4, 0.9) 0%, rgba(161, 98, 7, 0.8) 50%, rgba(133, 77, 14, 0.9) 100%)',
          lightGradient:
            'linear-gradient(135deg, rgba(202, 138, 4, 0.15) 0%, rgba(161, 98, 7, 0.08) 100%)',
          accent: '#fbbf24',
          bg: 'rgba(202, 138, 4, 0.12)',
          border: 'rgba(202, 138, 4, 0.3)',
          text: '#a16207',
          glow: 'rgba(202, 138, 4, 0.4)',
          statusLabel: 'Paid Out',
          statusIcon: <FaStar />,
        };
      }

      // APPROVED (default) - Fresh emerald green (original)
      return {
        primary: '#16a34a',
        secondary: '#15803d',
        gradient:
          'linear-gradient(135deg, rgba(22, 163, 74, 0.9) 0%, rgba(21, 128, 61, 0.8) 50%, rgba(20, 83, 45, 0.9) 100%)',
        lightGradient:
          'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(21, 128, 61, 0.08) 100%)',
        accent: '#4ade80',
        bg: 'rgba(22, 163, 74, 0.12)',
        border: 'rgba(22, 163, 74, 0.3)',
        text: '#15803d',
        glow: 'rgba(22, 163, 74, 0.4)',
        statusLabel: 'Approved',
        statusIcon: <FaCheckCircle />,
      };
    }

    // DEFAULT - IN PROGRESS - Vibrant purple (original)
    return {
      primary: '#7e22ce',
      secondary: '#6b21a8',
      gradient:
        'linear-gradient(135deg, rgba(126, 34, 206, 0.9) 0%, rgba(107, 33, 168, 0.8) 50%, rgba(88, 28, 135, 0.9) 100%)',
      lightGradient:
        'linear-gradient(135deg, rgba(126, 34, 206, 0.15) 0%, rgba(107, 33, 168, 0.08) 100%)',
      accent: '#a855f7',
      bg: 'rgba(126, 34, 206, 0.12)',
      border: 'rgba(126, 34, 206, 0.3)',
      text: '#6b21a8',
      glow: 'rgba(126, 34, 206, 0.4)',
      statusLabel: 'In Progress',
      statusIcon: <FaSpinner className='fa-spin' />,
    };
  };

  const theme = getStatusTheme();

  return (
    <>
      {formData && (
        <div className='my-3 my-md-4 mx-1 mx-md-0'>
          <div
            className='position-relative overflow-hidden'
            style={{
              background: `
                linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(248, 250, 252, 0.1)),
                radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.2), transparent 50%),
                ${theme.lightGradient}
              `,
              border: `1px solid ${theme.border}`,
              borderRadius: '16px',
              boxShadow: `
                0 8px 20px rgba(0, 0, 0, 0.08),
                0 4px 8px rgba(0, 0, 0, 0.04),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `,
              backdropFilter: 'blur(20px)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
            }}
            onClick={applicationClickHandler}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
              e.currentTarget.style.boxShadow = `
                0 16px 32px rgba(0, 0, 0, 0.12),
                0 8px 16px rgba(0, 0, 0, 0.08),
                0 0 30px ${theme.glow},
                inset 0 1px 0 rgba(255, 255, 255, 0.4)
              `;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `
                0 8px 20px rgba(0, 0, 0, 0.08),
                0 4px 8px rgba(0, 0, 0, 0.04),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `;
            }}
          >
            {/* Background Pattern */}
            <div
              className='position-absolute w-100 h-100'
              style={{
                background: `
                  radial-gradient(circle at 20% 20%, ${theme.accent}08 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, ${theme.accent}05 0%, transparent 50%)
                `,
                opacity: 0.6,
              }}
            />

            {/* Status Strip */}
            <div
              className='position-relative'
              style={{
                height: '6px',
                background: theme.gradient,
                width: '100%',
                boxShadow: `0 2px 8px ${theme.glow}`,
              }}
            >
              <div
                className='position-absolute w-100 h-100'
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.accent}40, transparent)`,
                  animation: 'slideGlow 3s ease-in-out infinite',
                }}
              />
            </div>

            {/* Status Badges - Using Only StatusBadge Component */}
            <div
              className='position-absolute d-flex flex-wrap gap-1 gap-md-2 justify-content-end'
              style={{
                top: '16px',
                right: '12px',
                zIndex: 3,
                maxWidth: '50%',
              }}
            >
              {rejectedInAnyStage && <StatusBadge type='danger' />}
              {approvedInAnyStage &&
                application.loan !== null &&
                application.loan.is_paid_out &&
                !application.loan.paid_out_date &&
                !application.loan.is_settled && <StatusBadge type='purple' />}
              {approvedInAnyStage &&
                application.loan !== null &&
                application.loan.is_paid_out &&
                application.loan.paid_out_date &&
                !application.loan.is_settled && <StatusBadge type='gold' />}
              {approvedInAnyStage &&
                application.loan !== null &&
                application.loan.is_paid_out &&
                application.loan.is_settled && <StatusBadge type='blue' />}
              {approvedInAnyStage &&
                application.loan !== null &&
                !application.loan.is_paid_out && <StatusBadge type='success' />}
              {!approvedInAnyStage && !rejectedInAnyStage && (
                <StatusBadge type='warning' />
              )}
            </div>

            {/* Main Content with proper spacing */}
            <div
              className='p-3 p-md-4 position-relative'
              style={{ paddingTop: '50px' }}
            >
              {/* Header Row */}
              <div className='row align-items-center mb-3 mb-md-4 g-2 g-md-3 pt-5'>
                {/* Applicant Info */}
                <div className='col-12 col-lg-5'>
                  <div className='d-flex align-items-center gap-3'>
                    <div
                      className='rounded-circle d-flex align-items-center justify-content-center position-relative flex-shrink-0'
                      style={{
                        width: '48px',
                        height: '48px',
                        background: theme.gradient,
                        color: 'white',
                        boxShadow: `0 6px 12px ${theme.glow}`,
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          'scale(1.1) rotate(5deg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          'scale(1) rotate(0deg)';
                      }}
                    >
                      <FaUser size={18} />

                      {/* ID Badge */}
                      <div
                        className='position-absolute rounded-circle d-flex align-items-center justify-content-center'
                        style={{
                          width: '20px',
                          height: '20px',
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: theme.accent,
                          fontSize: '9px',
                          fontWeight: 'bold',
                          bottom: '-2px',
                          right: '-2px',
                          border: '2px solid white',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {formData.id}
                      </div>
                    </div>

                    <div className='flex-grow-1 min-w-0'>
                      <h6
                        className='mb-1 fw-bold text-truncate'
                        style={{
                          fontSize: '1.1rem',
                          color: 'rgba(255, 255, 255, 0.95)',
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {application.applicants.length > 0
                          ? `${application.applicants[0].title} ${application.applicants[0].first_name} ${application.applicants[0].last_name}`
                          : 'No applicants added'}
                      </h6>
                      <div
                        className='px-2 py-1 rounded-pill d-inline-flex align-items-center gap-1'
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '0.7rem',
                          fontWeight: '500',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <FaCalendarAlt size={8} />
                        <span className='d-none d-sm-inline'>
                          Application #{formData.id}
                        </span>
                        <span className='d-inline d-sm-none'>
                          #{formData.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className='col-12 col-md-6 col-lg-4'>
                  <div className='row g-2'>
                    <div className='col-6'>
                      <div
                        className='text-center p-2 p-md-3 position-relative'
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: `1px solid ${theme.border}`,
                          borderRadius: '12px',
                          backdropFilter: 'blur(15px)',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.15)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div className='d-flex align-items-center justify-content-center mb-1 mb-md-2'>
                          <div
                            className='rounded-circle d-flex align-items-center justify-content-center me-1 me-md-2 flex-shrink-0'
                            style={{
                              width: '18px',
                              height: '18px',
                              background: theme.gradient,
                              color: 'white',
                            }}
                          >
                            <FaMoneyBillWave size={8} />
                          </div>
                          <span
                            className='small fw-semibold'
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.65rem',
                              letterSpacing: '0.05em',
                            }}
                          >
                            AMOUNT
                          </span>
                        </div>
                        <div
                          className='fw-bold'
                          style={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontSize: '0.85rem',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          {formatMoney(formData.amount, currency_sign)}
                        </div>
                      </div>
                    </div>

                    <div className='col-6'>
                      <div
                        className='text-center p-2 p-md-3 position-relative'
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: `1px solid ${theme.border}`,
                          borderRadius: '12px',
                          backdropFilter: 'blur(15px)',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.15)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div className='d-flex align-items-center justify-content-center mb-1 mb-md-2'>
                          <div
                            className='rounded-circle d-flex align-items-center justify-content-center me-1 me-md-2 flex-shrink-0'
                            style={{
                              width: '18px',
                              height: '18px',
                              background: theme.gradient,
                              color: 'white',
                            }}
                          >
                            <FaClock size={8} />
                          </div>
                          <span
                            className='small fw-semibold'
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.65rem',
                              letterSpacing: '0.05em',
                            }}
                          >
                            TERM
                          </span>
                        </div>
                        <div
                          className='fw-bold'
                          style={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontSize: '0.85rem',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          {formData.term}m
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions & Maturity */}
                <div className='col-12 col-md-6 col-lg-3 text-center text-lg-end'>
                  <div className='d-flex flex-column align-items-center align-lg-end gap-2'>
                    {approvedInAnyStage &&
                      application.loan !== null &&
                      application.loan.is_paid_out &&
                      !application.loan.is_settled && (
                        <div className='mb-1 mb-md-2'>
                          <ApplicationMaturity
                            maturityDate={application.loan.maturity_date}
                          />
                        </div>
                      )}

                    <div
                      className='d-flex align-items-center px-3 px-md-4 py-2 position-relative'
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.transform = 'translateX(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <span className='me-2 d-none d-sm-inline'>
                        View Details
                      </span>
                      <span className='me-2 d-inline d-sm-none'>View</span>
                      <FaArrowRight size={10} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Label - Mobile Only */}
              <div className='d-block d-lg-none mb-3'>
                <div
                  className='d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill'
                  style={{
                    background: theme.gradient,
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    boxShadow: `0 4px 8px ${theme.glow}`,
                  }}
                >
                  {theme.statusIcon}
                  <span>{theme.statusLabel}</span>
                </div>
              </div>

              {/* Stages Section */}
              <div
                className='position-relative p-3 p-md-4'
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: `1px solid ${theme.border}`,
                  borderRadius: '16px',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className='d-flex flex-wrap justify-content-center gap-1 gap-md-2'>
                  {/* Show initial stages if not approved/rejected */}
                  {!rejectedInAnyStage && !approvedInAnyStage && (
                    <>
                      <div
                        style={{ transform: 'scale(0.8)' }}
                        className='d-block d-md-none'
                      >
                        <Stage
                          stage='Applied'
                          completed={true}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>
                      <div
                        style={{ transform: 'scale(0.85)' }}
                        className='d-none d-md-block'
                      >
                        <Stage
                          stage='Applied'
                          completed={true}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>

                      <div
                        style={{ transform: 'scale(0.8)' }}
                        className='d-block d-md-none'
                      >
                        <Stage
                          stage='Undertaking Ready'
                          completed={formData.undertaking_ready}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>
                      <div
                        style={{ transform: 'scale(0.85)' }}
                        className='d-none d-md-block'
                      >
                        <Stage
                          stage='Undertaking Ready'
                          completed={formData.undertaking_ready}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>

                      <div
                        style={{ transform: 'scale(0.8)' }}
                        className='d-block d-md-none'
                      >
                        <Stage
                          stage='Agreement Ready'
                          completed={formData.loan_agreement_ready}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>
                      <div
                        style={{ transform: 'scale(0.85)' }}
                        className='d-none d-md-block'
                      >
                        <Stage
                          stage='Agreement Ready'
                          completed={formData.loan_agreement_ready}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>
                    </>
                  )}

                  {/* Show Approved stage based on conditions */}
                  {formData.approved === false &&
                  formData.is_rejected === false ? (
                    <>
                      <div
                        style={{ transform: 'scale(0.8)' }}
                        className='d-block d-md-none'
                      >
                        <Stage
                          key={`${formData.id}-${formData.loan?.is_committee_approved}`}
                          stage='Approved'
                          completed={formData.approved}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>
                      <div
                        style={{ transform: 'scale(0.85)' }}
                        className='d-none d-md-block'
                      >
                        <Stage
                          key={`${formData.id}-${formData.loan?.is_committee_approved}`}
                          stage='Approved'
                          completed={formData.approved}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* CSS Animations */}
            <style>{`
              @keyframes slideGlow {
                0% {
                  transform: translateX(-100%);
                }
                50% {
                  transform: translateX(100%);
                }
                100% {
                  transform: translateX(100%);
                }
              }

              @keyframes pulse {
                0%, 100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.8;
                }
              }

              .text-truncate {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .min-w-0 {
                min-width: 0;
              }

              .fa-spin {
                animation: fa-spin 2s infinite linear;
              }

              @keyframes fa-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(359deg); }
              }

              @media (max-width: 768px) {
                .stage-wrapper {
                  transform: scale(0.75) !important;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
};

export default Application;
