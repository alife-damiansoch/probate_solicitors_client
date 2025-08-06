import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaGem,
  FaMoneyBillWave,
  FaSpinner,
  FaTimesCircle,
  FaTrophy,
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

  // Enhanced status themes using CSS variables with distinct colors
  const getStatusTheme = () => {
    // REJECTED - Deep red using error theme
    if (rejectedInAnyStage) {
      return {
        gradient: `
          linear-gradient(135deg, var(--error-primary) 0%, var(--error-dark) 100%),
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent)
        `,
        lightGradient: `
          linear-gradient(135deg, var(--error-20) 0%, var(--error-10) 100%)
        `,
        cardBackground: `
          var(--gradient-surface),
          linear-gradient(135deg, var(--error-20) 0%, var(--error-10) 50%, var(--error-20) 100%)
        `,
        accent: 'var(--error-primary)',
        bg: 'var(--error-20)',
        border: 'var(--error-30)',
        text: 'var(--error-primary)',
        glow: 'var(--error-50)',
        statusLabel: 'Rejected',
        statusIcon: <FaTimesCircle />,
        iconColor: '#ffffff',
      };
    }

    // APPROVED STATES - Different themes for each sub-status
    if (approvedInAnyStage) {
      // SETTLED - Royal blue theme
      if (application?.loan?.is_settled) {
        return {
          gradient: `
            linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%),
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent)
          `,
          lightGradient: `
            linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(30, 64, 175, 0.1) 100%)
          `,
          cardBackground: `
            var(--gradient-surface),
            linear-gradient(135deg, rgba(30, 58, 138, 0.15) 0%, rgba(30, 64, 175, 0.1) 50%, rgba(30, 58, 138, 0.15) 100%)
          `,
          accent: '#3b82f6',
          bg: 'rgba(30, 58, 138, 0.15)',
          border: 'rgba(30, 58, 138, 0.3)',
          text: '#1e40af',
          glow: 'rgba(30, 58, 138, 0.5)',
          statusLabel: 'Settled',
          statusIcon: <FaTrophy />,
          iconColor: '#ffffff',
        };
      }

      // PAID OUT - Rich amber theme
      if (application?.loan?.is_paid_out) {
        return {
          gradient: `
            linear-gradient(135deg, #d97706 0%, #b45309 100%),
            radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent)
          `,
          lightGradient: `
            linear-gradient(135deg, rgba(217, 119, 6, 0.2) 0%, rgba(180, 83, 9, 0.1) 100%)
          `,
          cardBackground: `
            var(--gradient-surface),
            linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(180, 83, 9, 0.1) 50%, rgba(217, 119, 6, 0.15) 100%)
          `,
          accent: '#f59e0b',
          bg: 'rgba(217, 119, 6, 0.15)',
          border: 'rgba(217, 119, 6, 0.3)',
          text: '#b45309',
          glow: 'rgba(217, 119, 6, 0.5)',
          statusLabel: 'Paid Out',
          statusIcon: <FaGem />,
          iconColor: '#ffffff',
        };
      }

      // APPROVED (default) - Success green theme
      return {
        gradient: `
          linear-gradient(135deg, var(--success-primary) 0%, var(--success-dark) 100%),
          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent)
        `,
        lightGradient: `
          linear-gradient(135deg, var(--success-20) 0%, var(--success-10) 100%)
        `,
        cardBackground: `
          var(--gradient-surface),
          linear-gradient(135deg, var(--success-20) 0%, var(--success-10) 50%, var(--success-20) 100%)
        `,
        accent: 'var(--success-primary)',
        bg: 'var(--success-20)',
        border: 'var(--success-30)',
        text: 'var(--success-primary)',
        glow: 'var(--success-50)',
        statusLabel: 'Approved',
        statusIcon: <FaCheckCircle />,
        iconColor: '#ffffff',
      };
    }

    // DEFAULT - IN PROGRESS - Primary blue theme
    return {
      gradient: `
        linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%),
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent)
      `,
      lightGradient: `
        linear-gradient(135deg, var(--primary-20) 0%, var(--primary-10) 100%)
      `,
      cardBackground: `
        var(--gradient-surface),
        linear-gradient(135deg, var(--primary-20) 0%, var(--primary-10) 50%, var(--primary-20) 100%)
      `,
      accent: 'var(--primary-blue)',
      bg: 'var(--primary-20)',
      border: 'var(--primary-30)',
      text: 'var(--primary-blue)',
      glow: 'var(--primary-50)',
      statusLabel: 'In Progress',
      statusIcon: <FaSpinner className='fa-spin' />,
      iconColor: '#ffffff',
    };
  };

  const theme = getStatusTheme();

  return (
    <>
      {formData && (
        <motion.div
          className='my-3 my-md-4 mx-1 mx-md-0'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className='position-relative overflow-hidden'
            style={{
              background: theme.cardBackground,
              backgroundBlendMode: 'overlay',
              border: `2px solid ${theme.border}`,
              borderRadius: '24px',
              boxShadow: `
                0 16px 32px rgba(0, 0, 0, 0.15),
                0 8px 16px ${theme.bg},
                0 4px 8px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 var(--white-10),
                inset 0 -1px 0 rgba(0, 0, 0, 0.05)
              `,
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              cursor: 'pointer',
            }}
            onClick={applicationClickHandler}
            whileHover={{
              scale: 1.02,
              y: -8,
              boxShadow: `
                0 24px 48px rgba(0, 0, 0, 0.2),
                0 12px 24px ${theme.glow},
                0 6px 12px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 var(--white-15),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Animated Background Elements */}
            <div
              className='position-absolute w-100 h-100'
              style={{
                background: `
                  radial-gradient(circle at 20% 20%, ${theme.accent}15 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, ${theme.accent}10 0%, transparent 50%),
                  radial-gradient(circle at 50% 10%, ${theme.accent}08 0%, transparent 40%)
                `,
                animation: 'backgroundFloat 15s ease-in-out infinite',
                opacity: 0.7,
              }}
            />

            {/* Enhanced Status Strip */}
            <div
              className='position-relative'
              style={{
                height: '8px',
                background: theme.gradient,
                backgroundBlendMode: 'overlay',
                width: '100%',
                boxShadow: `
                  0 4px 12px ${theme.glow},
                  inset 0 1px 2px rgba(255, 255, 255, 0.3),
                  inset 0 -1px 2px rgba(0, 0, 0, 0.2)
                `,
                borderTopLeftRadius: '22px',
                borderTopRightRadius: '22px',
              }}
            >
              <div
                className='position-absolute w-100 h-100'
                style={{
                  background: `linear-gradient(90deg, transparent, ${theme.accent}60, transparent)`,
                  animation: 'slideGlow 4s ease-in-out infinite',
                  borderTopLeftRadius: '22px',
                  borderTopRightRadius: '22px',
                }}
              />
            </div>

            {/* Status Badges - Enhanced positioning */}
            <div
              className='position-absolute d-flex flex-wrap gap-1 gap-md-2 justify-content-end'
              style={{
                top: '0px',
                right: '16px',
                zIndex: 10,
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

            {/* Main Content */}
            <div
              className='p-4 p-md-5 position-relative'
              style={{ paddingTop: '60px' }}
            >
              {/* Header Row */}
              <div className='row align-items-center mb-4 g-3'>
                {/* Enhanced Applicant Info */}
                <div className='col-12 col-lg-5'>
                  <div className='d-flex align-items-center gap-3'>
                    <motion.div
                      className='rounded-circle d-flex align-items-center justify-content-center position-relative flex-shrink-0'
                      style={{
                        width: '64px',
                        height: '64px',
                        background: theme.gradient,
                        backgroundBlendMode: 'overlay',
                        color: theme.iconColor,
                        boxShadow: `
                          0 12px 24px ${theme.glow},
                          0 6px 12px rgba(0, 0, 0, 0.15),
                          inset 0 2px 4px rgba(255, 255, 255, 0.3),
                          inset 0 -2px 4px rgba(0, 0, 0, 0.1)
                        `,
                        border: '3px solid rgba(255, 255, 255, 0.3)',
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                        boxShadow: `
                          0 16px 32px ${theme.glow},
                          0 8px 16px rgba(0, 0, 0, 0.2),
                          inset 0 2px 4px rgba(255, 255, 255, 0.4)
                        `,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <FaUser size={24} />

                      {/* Enhanced ID Badge */}
                      <motion.div
                        className='position-absolute rounded-circle d-flex align-items-center justify-content-center'
                        style={{
                          width: '28px',
                          height: '28px',
                          background: 'var(--surface-primary)',
                          color: theme.accent,
                          fontSize: '11px',
                          fontWeight: 'bold',
                          bottom: '-4px',
                          right: '-4px',
                          border: '3px solid var(--surface-primary)',
                          boxShadow: `
                            0 4px 8px rgba(0, 0, 0, 0.15),
                            0 2px 4px ${theme.bg}
                          `,
                          backdropFilter: 'blur(10px)',
                        }}
                        whileHover={{ scale: 1.2 }}
                      >
                        {formData.id}
                      </motion.div>
                    </motion.div>

                    <div className='flex-grow-1 min-w-0'>
                      <h5
                        className='mb-2 fw-bold text-truncate'
                        style={{
                          fontSize: '1.3rem',
                          color: 'var(--text-primary)',
                          letterSpacing: '-0.02em',
                          lineHeight: '1.2',
                        }}
                      >
                        {application.applicants.length > 0
                          ? `${application.applicants[0].title} ${application.applicants[0].first_name} ${application.applicants[0].last_name}`
                          : 'No applicants added'}
                      </h5>

                      <motion.div
                        className='px-3 py-1 rounded-pill d-inline-flex align-items-center gap-2'
                        style={{
                          background: theme.bg,
                          color: theme.text,
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          border: `1px solid ${theme.border}`,
                          backdropFilter: 'blur(15px)',
                          WebkitBackdropFilter: 'blur(15px)',
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <FaCalendarAlt size={10} />
                        <span>Application #{formData.id}</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Financial Info */}
                <div className='col-12 col-md-6 col-lg-4'>
                  <div className='row g-3'>
                    <div className='col-6'>
                      <motion.div
                        className='text-center p-3 position-relative'
                        style={{
                          background: 'var(--surface-secondary)',
                          border: `2px solid ${theme.border}`,
                          borderRadius: '16px',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          boxShadow: `
                            0 8px 16px ${theme.bg},
                            inset 0 1px 0 var(--white-10)
                          `,
                        }}
                        whileHover={{
                          scale: 1.05,
                          y: -2,
                          boxShadow: `
                            0 12px 24px ${theme.glow},
                            inset 0 1px 0 var(--white-15)
                          `,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 15,
                        }}
                      >
                        <div className='d-flex align-items-center justify-content-center mb-2'>
                          <div
                            className='rounded-circle d-flex align-items-center justify-content-center me-2'
                            style={{
                              width: '24px',
                              height: '24px',
                              background: theme.gradient,
                              color: theme.iconColor,
                              boxShadow: `0 4px 8px ${theme.glow}`,
                            }}
                          >
                            <FaMoneyBillWave size={10} />
                          </div>
                          <span
                            className='small fw-bold'
                            style={{
                              color: 'var(--text-muted)',
                              fontSize: '0.7rem',
                              letterSpacing: '0.1em',
                            }}
                          >
                            AMOUNT
                          </span>
                        </div>
                        <div
                          className='fw-bold'
                          style={{
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                          }}
                        >
                          {formatMoney(formData.amount, currency_sign)}
                        </div>
                      </motion.div>
                    </div>

                    <div className='col-6'>
                      <motion.div
                        className='text-center p-3 position-relative'
                        style={{
                          background: 'var(--surface-secondary)',
                          border: `2px solid ${theme.border}`,
                          borderRadius: '16px',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          boxShadow: `
                            0 8px 16px ${theme.bg},
                            inset 0 1px 0 var(--white-10)
                          `,
                        }}
                        whileHover={{
                          scale: 1.05,
                          y: -2,
                          boxShadow: `
                            0 12px 24px ${theme.glow},
                            inset 0 1px 0 var(--white-15)
                          `,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 15,
                        }}
                      >
                        <div className='d-flex align-items-center justify-content-center mb-2'>
                          <div
                            className='rounded-circle d-flex align-items-center justify-content-center me-2'
                            style={{
                              width: '24px',
                              height: '24px',
                              background: theme.gradient,
                              color: theme.iconColor,
                              boxShadow: `0 4px 8px ${theme.glow}`,
                            }}
                          >
                            <FaClock size={10} />
                          </div>
                          <span
                            className='small fw-bold'
                            style={{
                              color: 'var(--text-muted)',
                              fontSize: '0.7rem',
                              letterSpacing: '0.1em',
                            }}
                          >
                            TERM
                          </span>
                        </div>
                        <div
                          className='fw-bold'
                          style={{
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                          }}
                        >
                          {formData.term}m
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Actions & Status */}
                <div className='col-12 col-md-6 col-lg-3 text-center text-lg-end'>
                  <div className='d-flex flex-column align-items-center align-lg-end gap-3'>
                    {/* Status Indicator */}
                    <motion.div
                      className='d-flex align-items-center gap-2 px-4 py-2 rounded-pill'
                      style={{
                        background: theme.gradient,
                        backgroundBlendMode: 'overlay',
                        color: theme.iconColor,
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        boxShadow: `
                          0 8px 16px ${theme.glow},
                          inset 0 1px 0 rgba(255, 255, 255, 0.3)
                        `,
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {theme.statusIcon}
                      <span>{theme.statusLabel}</span>
                    </motion.div>

                    {/* Maturity Badge */}
                    {approvedInAnyStage &&
                      application.loan !== null &&
                      application.loan.is_paid_out &&
                      !application.loan.is_settled && (
                        <ApplicationMaturity
                          maturityDate={application.loan.maturity_date}
                        />
                      )}

                    {/* Action Button */}
                    <motion.div
                      className='d-flex align-items-center px-4 py-2'
                      style={{
                        background: 'var(--surface-tertiary)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        borderRadius: '14px',
                        border: '2px solid var(--border-muted)',
                        backdropFilter: 'blur(15px)',
                        WebkitBackdropFilter: 'blur(15px)',
                        cursor: 'pointer',
                        boxShadow: `
                          0 4px 8px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 var(--white-10)
                        `,
                      }}
                      whileHover={{
                        scale: 1.05,
                        x: -4,
                        borderColor: theme.border,
                        color: theme.text,
                        boxShadow: `
                          0 8px 16px ${theme.bg},
                          inset 0 1px 0 var(--white-15)
                        `,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className='me-2'>View Details</span>
                      <FaArrowRight size={12} />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stages Section */}
              <motion.div
                className='position-relative p-4'
                style={{
                  background: 'var(--surface-secondary)',
                  border: `2px solid ${theme.border}`,
                  borderRadius: '20px',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  boxShadow: `
                    0 12px 24px ${theme.bg},
                    inset 0 1px 0 var(--white-10),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                  `,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className='d-flex flex-wrap justify-content-center gap-2 gap-md-3'>
                  {/* Show initial stages if not approved/rejected */}
                  {!rejectedInAnyStage && !approvedInAnyStage && (
                    <>
                      <motion.div
                        style={{ transform: 'scale(0.85)' }}
                        className='d-block d-md-none'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 0.85 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <Stage
                          stage='Applied'
                          completed={true}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </motion.div>
                      <motion.div
                        style={{ transform: 'scale(0.9)' }}
                        className='d-none d-md-block'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 0.9 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        <Stage
                          stage='Applied'
                          completed={true}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </motion.div>

                      <motion.div
                        style={{ transform: 'scale(0.85)' }}
                        className='d-block d-md-none'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 0.85 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                      >
                        <Stage
                          stage='Undertaking Ready'
                          completed={formData.undertaking_ready}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </motion.div>
                      <motion.div
                        style={{ transform: 'scale(0.9)' }}
                        className='d-none d-md-block'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 0.9 }}
                        transition={{ delay: 0.6, duration: 0.3 }}
                      >
                        <Stage
                          stage='Undertaking Ready'
                          completed={formData.undertaking_ready}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </motion.div>

                      <motion.div
                        style={{ transform: 'scale(0.85)' }}
                        className='d-block d-md-none'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 0.85 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                      >
                        <Stage
                          stage='Agreement Ready'
                          completed={formData.loan_agreement_ready}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </motion.div>
                      <motion.div
                        style={{ transform: 'scale(0.9)' }}
                        className='d-none d-md-block'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 0.9 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                      >
                        <Stage
                          stage='Agreement Ready'
                          completed={formData.loan_agreement_ready}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </motion.div>
                    </>
                  )}

                  {/* Show Approved stage based on conditions */}
                  {formData.approved === false &&
                  formData.is_rejected === false ? (
                    <>
                      <motion.div
                        style={{ transform: 'scale(0.85)' }}
                        className='d-block d-md-none'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 0.85 }}
                        transition={{ delay: 0.8, duration: 0.3 }}
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
                      </motion.div>
                      <motion.div
                        style={{ transform: 'scale(0.9)' }}
                        className='d-none d-md-block'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 0.9 }}
                        transition={{ delay: 0.8, duration: 0.3 }}
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
                      </motion.div>
                    </>
                  ) : null}
                </div>
              </motion.div>
            </div>

            {/* Enhanced CSS Animations */}
            <style>{`
             @keyframes slideGlow {
               0% {
                 transform: translateX(-100%);
                 opacity: 0.5;
               }
               50% {
                 transform: translateX(100%);
                 opacity: 1;
               }
               100% {
                 transform: translateX(100%);
                 opacity: 0.5;
               }
             }

             @keyframes backgroundFloat {
               0%, 100% { 
                 transform: translateY(0px) rotate(0deg);
                 opacity: 0.6;
               }
               33% { 
                 transform: translateY(-15px) rotate(120deg);
                 opacity: 0.8;
               }
               66% { 
                 transform: translateY(8px) rotate(240deg);
                 opacity: 0.7;
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

             /* Enhanced hover effects */
             .application-card:hover {
               transform: translateY(-8px) scale(1.02);
             }

             /* Responsive optimizations */
             @media (max-width: 768px) {
               .stage-wrapper {
                 transform: scale(0.8) !important;
               }
               
               .financial-info {
                 gap: 0.5rem !important;
               }
             }

             @media (max-width: 576px) {
               .application-card {
                 margin: 0.5rem !important;
               }
             }

             /* Smooth glassmorphism effects */
             .card-hover-effect {
               transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
             }
             
             .card-hover-effect:hover {
               backdrop-filter: blur(40px);
               -webkit-backdrop-filter: blur(40px);
             }

             /* Enhanced focus states */
             .interactive-element:focus {
               outline: none;
               box-shadow: 
                 0 0 0 4px var(--primary-20),
                 0 8px 16px var(--primary-30) !important;
             }

             /* Status-specific glow animations */
             .status-rejected {
               animation: criticalPulse 3s ease-in-out infinite;
             }

             .status-approved {
               animation: successPulse 4s ease-in-out infinite;
             }

             .status-in-progress {
               animation: progressPulse 2s ease-in-out infinite;
             }

             @keyframes criticalPulse {
               0%, 100% { 
                 box-shadow: 0 0 20px var(--error-50), 0 0 40px var(--error-30); 
               }
               50% { 
                 box-shadow: 0 0 35px var(--error-primary), 0 0 70px var(--error-50); 
               }
             }

             @keyframes successPulse {
               0%, 100% { 
                 box-shadow: 0 0 20px var(--success-50), 0 0 40px var(--success-30); 
               }
               50% { 
                 box-shadow: 0 0 35px var(--success-primary), 0 0 70px var(--success-50); 
               }
             }

             @keyframes progressPulse {
               0%, 100% { 
                 box-shadow: 0 0 20px var(--primary-50), 0 0 40px var(--primary-30); 
               }
               50% { 
                 box-shadow: 0 0 35px var(--primary-blue), 0 0 70px var(--primary-50); 
               }
             }
           `}</style>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Application;
