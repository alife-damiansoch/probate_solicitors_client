import ApprovedBadge from '../../GenericComponents/StageBadges.jsx/ApprovedBadge';
import InProgressBadge from '../../GenericComponents/StageBadges.jsx/InProgressBadge';
import RejectedBadge from '../../GenericComponents/StageBadges.jsx/RejectedBadge';
import Stage from './Stage';

import { useNavigate } from 'react-router-dom';
import ApplicationMaturity from '../../GenericComponents/StageBadges.jsx/ApplicationMaturity';
import PaidOutBadge from '../../GenericComponents/StageBadges.jsx/PaidOutBadge';
import SettledBadge from '../../GenericComponents/StageBadges.jsx/SettledBadge';

import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaUser,
} from 'react-icons/fa';
import ProcessingBadge from '../../GenericComponents/StageBadges.jsx/ProcessingBadge';
import { formatMoney } from '../../GenericFunctions/HelperGenericFunctions';

const Application = ({ application }) => {
  const [rejectedInAnyStage, setRejectedInAnyStage] = useState(false);
  const [approvedInAnyStage, setApprovedInAnyStage] = useState(false);

  const [formData] = useState({ ...application });

  const currency_sign = Cookies.get('currency_sign');

  const navigate = useNavigate();

  const applicationClickHandler = () => {
    navigate(`/applications/${formData.id}`);
  };

  console.log('AIILICATION', application);

  // Get enhanced status colors and themes
  const getStatusTheme = () => {
    // REJECTED - Deep crimson with sophisticated depth
    if (rejectedInAnyStage) {
      return {
        primary: '#dc2626',
        secondary: '#991b1b',
        gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        lightGradient:
          'linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, rgba(153, 27, 27, 0.06) 100%)',
        accent: '#ef4444',
        bg: 'rgba(220, 38, 38, 0.1)',
        border: 'rgba(220, 38, 38, 0.25)',
        text: '#991b1b',
        glow: 'rgba(220, 38, 38, 0.35)',
        meshGradient:
          'radial-gradient(circle at 30% 20%, rgba(220, 38, 38, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(153, 27, 27, 0.12) 0%, transparent 60%)',
        shadow: '0 8px 32px rgba(220, 38, 38, 0.2)',
        hoverShadow: '0 16px 48px rgba(220, 38, 38, 0.3)',
      };
    }

    // APPROVED - Sophisticated emerald with multiple states
    if (approvedInAnyStage) {
      // Check for different loan states and return appropriate green variants
      if (application?.loan?.is_settled) {
        // SETTLED - Deep teal-blue for completion
        return {
          primary: '#0891b2',
          secondary: '#0e7490',
          gradient: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
          lightGradient:
            'linear-gradient(135deg, rgba(8, 145, 178, 0.12) 0%, rgba(14, 116, 144, 0.06) 100%)',
          accent: '#06b6d4',
          bg: 'rgba(8, 145, 178, 0.1)',
          border: 'rgba(8, 145, 178, 0.25)',
          text: '#155e75',
          glow: 'rgba(8, 145, 178, 0.35)',
          meshGradient:
            'radial-gradient(circle at 30% 20%, rgba(8, 145, 178, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(14, 116, 144, 0.12) 0%, transparent 60%)',
          shadow: '0 8px 32px rgba(8, 145, 178, 0.2)',
          hoverShadow: '0 16px 48px rgba(8, 145, 178, 0.3)',
        };
      }

      if (application?.loan?.is_paid_out) {
        // PAID OUT - Rich amber-gold
        return {
          primary: '#d97706',
          secondary: '#b45309',
          gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
          lightGradient:
            'linear-gradient(135deg, rgba(217, 119, 6, 0.12) 0%, rgba(180, 83, 9, 0.06) 100%)',
          accent: '#f59e0b',
          bg: 'rgba(217, 119, 6, 0.1)',
          border: 'rgba(217, 119, 6, 0.25)',
          text: '#92400e',
          glow: 'rgba(217, 119, 6, 0.35)',
          meshGradient:
            'radial-gradient(circle at 30% 20%, rgba(217, 119, 6, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(180, 83, 9, 0.12) 0%, transparent 60%)',
          shadow: '0 8px 32px rgba(217, 119, 6, 0.2)',
          hoverShadow: '0 16px 48px rgba(217, 119, 6, 0.3)',
        };
      }

      // APPROVED (default) - Fresh forest green
      return {
        primary: '#16a34a',
        secondary: '#15803d',
        gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        lightGradient:
          'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(21, 128, 61, 0.06) 100%)',
        accent: '#22c55e',
        bg: 'rgba(22, 163, 74, 0.1)',
        border: 'rgba(22, 163, 74, 0.25)',
        text: '#166534',
        glow: 'rgba(22, 163, 74, 0.35)',
        meshGradient:
          'radial-gradient(circle at 30% 20%, rgba(22, 163, 74, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(21, 128, 61, 0.12) 0%, transparent 60%)',
        shadow: '0 8px 32px rgba(22, 163, 74, 0.2)',
        hoverShadow: '0 16px 48px rgba(22, 163, 74, 0.3)',
      };
    }

    // DEFAULT - IN PROGRESS - Warm terra cotta orange
    return {
      primary: '#ea580c',
      secondary: '#c2410c',
      gradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
      lightGradient:
        'linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(194, 65, 12, 0.06) 100%)',
      accent: '#f97316',
      bg: 'rgba(234, 88, 12, 0.1)',
      border: 'rgba(234, 88, 12, 0.25)',
      text: '#9a3412',
      glow: 'rgba(234, 88, 12, 0.35)',
      meshGradient:
        'radial-gradient(circle at 30% 20%, rgba(234, 88, 12, 0.15) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(194, 65, 12, 0.12) 0%, transparent 60%)',
      shadow: '0 8px 32px rgba(234, 88, 12, 0.2)',
      hoverShadow: '0 16px 48px rgba(234, 88, 12, 0.3)',
    };
  };

  // Your usage stays exactly the same:
  const theme = getStatusTheme();

  return (
    <>
      {formData && (
        <div
          className='position-relative my-4'
          style={{
            background: `
              linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(248, 250, 252, 0.1)),
              radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.2), transparent 50%),
              ${theme.lightGradient}
            `,
            border: `1px solid ${theme.border}`,
            borderRadius: '24px',
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.1),
              0 8px 16px rgba(0, 0, 0, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `,
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            transform: 'translateZ(0)',
          }}
          onClick={applicationClickHandler}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
            e.currentTarget.style.boxShadow = `
              0 32px 64px rgba(0, 0, 0, 0.15),
              0 16px 32px rgba(0, 0, 0, 0.1),
              0 0 40px ${theme.glow},
              inset 0 1px 0 rgba(255, 255, 255, 0.4)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `
              0 20px 40px rgba(0, 0, 0, 0.1),
              0 8px 16px rgba(0, 0, 0, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `;
          }}
        >
          {/* Animated Background Pattern */}
          <div
            className='position-absolute w-100 h-100'
            style={{
              background: `
                radial-gradient(circle at 20% 20%, ${theme.accent}08 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, ${theme.accent}05 0%, transparent 50%)
              `,
              opacity: 0.6,
              animation: 'float 6s ease-in-out infinite',
            }}
          />

          {/* Enhanced Status Strip */}
          <div
            className='position-relative'
            style={{
              height: '8px',
              background: theme.gradient,
              width: '100%',
              boxShadow: `0 4px 12px ${theme.glow}`,
            }}
          >
            {/* Animated glow effect */}
            <div
              className='position-absolute w-100 h-100'
              style={{
                background: `linear-gradient(90deg, transparent, ${theme.accent}40, transparent)`,
                animation: 'slideGlow 3s ease-in-out infinite',
              }}
            />
          </div>

          {/* Enhanced Status Badges */}
          <div
            className='position-absolute'
            style={{ top: '5px', right: '0px', zIndex: 3 }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
              }}
            >
              {rejectedInAnyStage && <RejectedBadge />}
              {approvedInAnyStage &&
                application.loan !== null &&
                application.loan.is_paid_out &&
                !application.loan.paid_out_date &&
                !application.loan.is_settled && <ProcessingBadge />}
              {approvedInAnyStage &&
                application.loan !== null &&
                application.loan.is_paid_out &&
                application.loan.paid_out_date &&
                !application.loan.is_settled && <PaidOutBadge />}
              {approvedInAnyStage &&
                application.loan !== null &&
                application.loan.is_paid_out &&
                application.loan.is_settled && <SettledBadge />}
              {approvedInAnyStage &&
                application.loan !== null &&
                !application.loan.is_paid_out && <ApprovedBadge />}
              {!approvedInAnyStage && !rejectedInAnyStage && (
                <InProgressBadge />
              )}
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className='p-4 position-relative'>
            {/* Header Row */}
            <div className='row align-items-center mb-4'>
              {/* Enhanced Applicant Info */}
              <div className='col-lg-5 col-md-6'>
                <div className='d-flex align-items-center'>
                  <div
                    className='rounded-circle d-flex align-items-center justify-content-center me-4 position-relative'
                    style={{
                      width: '64px',
                      height: '64px',
                      background: theme.gradient,
                      color: 'white',
                      boxShadow: `0 12px 24px ${theme.glow}`,
                      border: '3px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'scale(1.1) rotate(5deg)';
                      e.currentTarget.style.boxShadow = `0 16px 32px ${theme.glow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                      e.currentTarget.style.boxShadow = `0 12px 24px ${theme.glow}`;
                    }}
                  >
                    <FaUser size={24} />

                    {/* Enhanced ID Badge */}
                    <div
                      className='position-absolute rounded-circle d-flex align-items-center justify-content-center'
                      style={{
                        width: '28px',
                        height: '28px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: theme.accent,
                        fontSize: '11px',
                        fontWeight: 'bold',
                        bottom: '-4px',
                        right: '-4px',
                        border: '3px solid white',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {formData.id}
                    </div>

                    {/* Subtle glow effect */}
                    <div
                      className='position-absolute rounded-circle'
                      style={{
                        top: '-8px',
                        left: '-8px',
                        right: '-8px',
                        bottom: '-8px',
                        background: theme.glow,
                        filter: 'blur(12px)',
                        zIndex: -1,
                      }}
                    />
                  </div>

                  <div>
                    <h6
                      className='mb-1 fw-bold'
                      style={{
                        fontSize: '1.3rem',
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
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <FaCalendarAlt size={10} />
                      Application #{formData.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Financial Info */}
              <div className='col-lg-4 col-md-4'>
                <div className='row g-3'>
                  <div className='col-6'>
                    <div
                      className='text-center p-3 position-relative'
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '16px',
                        backdropFilter: 'blur(15px)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className='d-flex align-items-center justify-content-center mb-2'>
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center me-2'
                          style={{
                            width: '24px',
                            height: '24px',
                            background: theme.gradient,
                            color: 'white',
                          }}
                        >
                          <FaMoneyBillWave size={10} />
                        </div>
                        <span
                          className='small fw-semibold'
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.7rem',
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
                          fontSize: '1rem',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {formatMoney(formData.amount, currency_sign)}
                      </div>
                    </div>
                  </div>

                  <div className='col-6'>
                    <div
                      className='text-center p-3 position-relative'
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '16px',
                        backdropFilter: 'blur(15px)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div className='d-flex align-items-center justify-content-center mb-2'>
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center me-2'
                          style={{
                            width: '24px',
                            height: '24px',
                            background: theme.gradient,
                            color: 'white',
                          }}
                        >
                          <FaClock size={10} />
                        </div>
                        <span
                          className='small fw-semibold'
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.7rem',
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
                          fontSize: '1rem',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {formData.term}m
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Actions & Maturity */}
              <div className='col-lg-3 col-md-2 text-end'>
                <div className='d-flex flex-column align-items-end gap-2'>
                  {approvedInAnyStage &&
                    application.loan !== null &&
                    application.loan.is_paid_out &&
                    !application.loan.is_settled && (
                      <div className='mb-2'>
                        <ApplicationMaturity
                          maturityDate={application.loan.maturity_date}
                        />
                      </div>
                    )}

                  <div
                    className='d-flex align-items-center px-4 py-2 position-relative'
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.25)';
                      e.currentTarget.style.transform = 'translateX(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span className='me-2'>View Details</span>
                    <FaArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Compact Stages */}
            <div
              className='position-relative'
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                border: `1px solid ${theme.border}`,
                padding: '1.5rem',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Subtle glow effect */}
              <div
                className='position-absolute'
                style={{
                  top: '-1px',
                  left: '-1px',
                  right: '-1px',
                  bottom: '-1px',
                  background: `linear-gradient(135deg, ${theme.accent}20, transparent)`,
                  borderRadius: '20px',
                  filter: 'blur(4px)',
                  zIndex: -1,
                }}
              />

              <div
                className='d-flex flex-wrap justify-content-center'
                style={{ gap: '8px' }}
              >
                {!rejectedInAnyStage && !approvedInAnyStage && (
                  <>
                    <div style={{ transform: 'scale(0.85)' }}>
                      <Stage
                        stage='Applied'
                        completed={true}
                        rejected={formData.is_rejected}
                        advancement={formData.loan}
                        setRejectedInAnyStage={setRejectedInAnyStage}
                        setApprovedInAnyStage={setApprovedInAnyStage}
                      />
                    </div>
                    <div style={{ transform: 'scale(0.85)' }}>
                      <Stage
                        stage='Undertaking Ready'
                        completed={formData.undertaking_ready}
                        rejected={formData.is_rejected}
                        advancement={formData.loan}
                        setRejectedInAnyStage={setRejectedInAnyStage}
                        setApprovedInAnyStage={setApprovedInAnyStage}
                      />
                    </div>
                    <div style={{ transform: 'scale(0.85)' }}>
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

                {formData.approved === false &&
                formData.is_rejected === false ? (
                  <div style={{ transform: 'scale(0.85)' }}>
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
                ) : formData.is_rejected === true ? (
                  <div style={{ transform: 'scale(0.85)', width: '100%' }}>
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
                ) : formData.approved === true && formData.loan !== null ? (
                  <div style={{ transform: 'scale(0.85)' }}>
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
                ) : null}
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
                transform: translateY(-8px) rotate(1deg);
              }
            }

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
          `}</style>
        </div>
      )}
    </>
  );
};

export default Application;
