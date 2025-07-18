import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import RequiredDetailsPart from '../ApplicationDetailsParts/RequiredDetailsPart';
import DeleteApplication from './DeleteApplication';

// Progress sidebar component
import ModernApplicationProgress from './ApplicationDetailStages/ApplicationDetailStages';

const ApplicationDetails = () => {
  const { id } = useParams();
  const token = Cookies.get('auth_token');
  const [application, setApplication] = useState(null);
  const [advancement, setAdvancement] = useState(null);
  const [estates, setEstates] = useState([]);

  const [deleteAppId, setDeleteAppId] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [highlitedSectionId, setHighlightedSectionId] = useState('');
  const [isApplicationLocked, setIsApplicationLocked] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tooltip state - show once per session
  const [showTooltip, setShowTooltip] = useState(() => {
    try {
      return !localStorage.getItem('mobile-stages-tooltip-dismissed');
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (showTooltip) {
      setShowTooltip(false);
      try {
        localStorage.setItem('mobile-stages-tooltip-dismissed', 'true');
      } catch {}
    }
  };
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (
      application?.processing_status?.application_details_completed_confirmed
    ) {
      setIsApplicationLocked(true);
    }
  }, [application]);

  useEffect(() => {
    const getEstates = async () => {
      if (!application?.estate_summary) return;
      try {
        const response = await fetchData(
          token?.access || token,
          application.estate_summary,
          true
        );
        // Flatten all estate categories into a single array
        const allEstates = Object.values(response.data)
          .filter(Array.isArray)
          .flat();
        setEstates(allEstates);
      } catch (e) {
        setEstates([]);
      }
    };
    if (application) getEstates();
  }, [application?.estate_summary, refresh, token]);

  useEffect(() => {
    if (highlitedSectionId !== '') {
      setIsSidebarOpen(false);
      const targetElement = document.getElementById(highlitedSectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [highlitedSectionId]);

  useEffect(() => {
    const fetchApplication = async () => {
      if (token) {
        const accessToken = typeof token === 'string' ? token : token.access;
        const endpoint = `/api/applications/solicitor_applications/${id}/`;
        try {
          const response = await fetchData(accessToken, endpoint);
          setApplication(response.data);
        } catch {}
      }
    };
    fetchApplication();
  }, [token, id, refresh]);

  useEffect(() => {
    const fetchAdvancementForApplication = async () => {
      if (token) {
        const accessToken = typeof token === 'string' ? token : token.access;
        const endpoint = `/api/loans/loans/by-application/${id}/`;
        try {
          const response = await fetchData(accessToken, endpoint);
          if (response.status && response.status === 200) {
            setAdvancement(response.data);
          }
        } catch {}
      }
    };
    fetchAdvancementForApplication();
  }, [token, id, refresh]);

  if (!application) {
    return (
      <div className='min-vh-100 d-flex justify-content-center align-items-center modern-loading-container'>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <motion.div
      className='position-relative'
      style={{
        paddingTop: '120px',
        minHeight: '100vh',
        background: 'var(--gradient-main-bg)',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
    >
      {/* Glassy, animated background */}
      <div
        className='position-absolute w-100 h-100 top-0 start-0'
        style={{
          zIndex: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 20% 30%, var(--primary-10) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, var(--success-20) 0%, transparent 55%),
            radial-gradient(circle at 60% 10%, var(--primary-20) 0%, transparent 40%)
          `,
          animation: 'backgroundFloat 20s ease-in-out infinite',
        }}
      />

      <div
        className='container-fluid p-0'
        style={{ zIndex: 2, position: 'relative' }}
      >
        <div className='row g-0'>
          {/* Progress Sidebar */}
          <div className='col-12 col-xl-4 d-none d-xl-block'>
            <motion.div
              className='position-fixed top-0 bottom-0 overflow-auto'
              style={{
                maxWidth: '400px',
                background: 'var(--gradient-main-bg)',
                borderRight: '1px solid var(--border-primary)',
                zIndex: 1040,
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                boxShadow:
                  '8px 0 32px rgba(0,0,0,0.45), 0 0 60px var(--primary-20)',
              }}
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <ModernApplicationProgress
                application={application}
                setHighlightedSectionId={setHighlightedSectionId}
                estates={estates}
                advancement={advancement}
                refresh={refresh}
                highlitedSectionId={highlitedSectionId}
                isSidebarOpen={isSidebarOpen}
              />
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className='col-12 col-xl-8 p-0 m-0'>
            {/* Mobile Sidebar Toggle */}
            <div
              className='d-xl-none position-fixed'
              style={{
                top: '50%',
                left: '-10px',
                transform: 'translateY(-50%)',
                zIndex: 1050,
              }}
            >
              {showTooltip && (
                <div
                  className='position-absolute'
                  style={{
                    left: '60px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1051,
                    animation: 'tooltipFadeIn 0.4s ease-out',
                  }}
                >
                  <div
                    className='px-3 py-2 text-white rounded-2 shadow-lg'
                    style={{
                      background: 'var(--gradient-header)',
                      border: '1px solid var(--border-primary)',
                      backdropFilter: 'blur(12px)',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      minWidth: '200px',
                      maxWidth: '280px',
                      boxShadow:
                        '0 8px 32px rgba(0,0,0,0.3), 0 0 20px var(--primary-20)',
                      position: 'relative',
                    }}
                  >
                    Click here to view application progress and next steps
                    {/* Tooltip Arrow */}
                    <div
                      className='position-absolute'
                      style={{
                        left: '-6px',
                        top: '50%',
                        transform: 'translateY(-50%) rotate(45deg)',
                        width: '12px',
                        height: '12px',
                        background: 'var(--gradient-header)',
                        border: '1px solid var(--border-primary)',
                        borderRight: 'none',
                        borderBottom: 'none',
                      }}
                    />
                  </div>
                </div>
              )}
              <button
                className='btn d-flex align-items-center justify-content-center'
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSidebar();
                }}
                aria-label='Toggle stages sidebar'
                style={{
                  background: 'var(--gradient-header)',
                  border: '2px solid var(--border-primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  boxShadow: showTooltip
                    ? '0 6px 20px var(--primary-40), 0 0 30px var(--primary-20)'
                    : '0 4px 15px var(--primary-20)',
                  transition: 'all 0.3s ease',
                  transform: showTooltip ? 'scale(1.05)' : 'scale(1)',
                  animation: showTooltip
                    ? 'buttonPulse 2s ease-in-out infinite'
                    : 'none',
                  padding: '0',
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
              >
                {isSidebarOpen ? (
                  <svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
                    <path
                      d='M18 6L6 18'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                    <path
                      d='M6 6L18 18'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                ) : (
                  <svg width='24' height='24' fill='none' viewBox='0 0 24 24'>
                    <path
                      d='M3 12H21'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                    <path
                      d='M3 6H21'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                    <path
                      d='M3 18H21'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div
                className='position-fixed w-100 h-100 top-0 start-0 d-xl-none'
                style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1035 }}
                onClick={(e) => {
                  e.stopPropagation();
                  closeSidebar();
                }}
              />
            )}

            {/* Mobile Sidebar */}
            <motion.div
              className={`position-fixed top-0 bottom-0 d-xl-none ${
                isSidebarOpen ? 'mobile-sidebar-show' : ''
              }`}
              style={{
                left: isSidebarOpen ? '0' : '-400px',
                width: '400px',
                height: '100vh',
                background: 'var(--gradient-main-bg)',
                borderRight: '1px solid var(--border-primary)',
                zIndex: 1041,
                overflowY: 'auto',
                overflowX: 'hidden',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                boxShadow:
                  '8px 0 32px rgba(0,0,0,0.45), 0 0 60px var(--primary-20)',
                transition: 'left 0.3s cubic-bezier(.4,0,.2,1)',
                WebkitOverflowScrolling: 'touch',
                transform: 'translateZ(0)',
              }}
              initial={false}
              animate={{ left: isSidebarOpen ? 0 : -400 }}
              transition={{ duration: 0.32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ minHeight: '100%' }}>
                <ModernApplicationProgress
                  application={application}
                  setHighlightedSectionId={setHighlightedSectionId}
                  estates={estates}
                  advancement={advancement}
                  refresh={refresh}
                  highlitedSectionId={highlitedSectionId}
                />
              </div>
            </motion.div>

            {/* Main Content */}
            <div className='p-2 p-md-3'>
              <BackToApplicationsIcon backUrl={-1} />
              {/* GLASSMORPHIC CARD */}
              <motion.div
                className='glassmorphic-card position-relative overflow-hidden rounded-3 mt-3'
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.13 }}
              >
                {/* Status Alert */}
                {(application.is_rejected ||
                  application.approved ||
                  isApplicationLocked) && (
                  <div
                    className={`d-flex flex-row align-items-center gap-2 gap-md-3 p-3 p-md-4 rounded-2 border-start border-3 m-2 m-md-3`}
                    style={{
                      background: application.is_rejected
                        ? 'var(--error-20)'
                        : application.approved
                        ? 'var(--success-20)'
                        : 'var(--warning-20)',
                      borderLeftColor: application.is_rejected
                        ? 'var(--error-primary)'
                        : application.approved
                        ? 'var(--success-primary)'
                        : 'var(--warning-primary)',
                      backdropFilter: 'blur(15px)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div
                      className='d-flex align-items-center justify-content-center rounded-2 text-white fw-bold flex-shrink-0'
                      style={{
                        width: '32px',
                        height: '32px',
                        background: application.is_rejected
                          ? 'var(--error-primary)'
                          : application.approved
                          ? 'var(--success-primary)'
                          : 'var(--warning-primary)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      {/* Status SVG */}
                      <svg
                        width='18'
                        height='18'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        {application.is_rejected ? (
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                            clipRule='evenodd'
                          />
                        ) : application.approved ? (
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                            clipRule='evenodd'
                          />
                        ) : (
                          <path
                            fillRule='evenodd'
                            d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                            clipRule='evenodd'
                          />
                        )}
                      </svg>
                    </div>
                    <div className='flex-grow-1 min-w-0'>
                      <div
                        className='fw-semibold lh-1 mb-1'
                        style={{
                          color: application.is_rejected
                            ? 'var(--error-primary)'
                            : application.approved
                            ? 'var(--success-primary)'
                            : 'var(--warning-primary)',
                          fontSize: '0.92rem',
                        }}
                      >
                        {application.is_rejected
                          ? 'Rejected'
                          : application.approved
                          ? 'Approved'
                          : 'Locked'}
                        <span className='d-none d-md-inline ms-1'>
                          Application
                        </span>
                      </div>
                      <small
                        className='text-muted d-block lh-1'
                        style={{ fontSize: '0.75rem' }}
                      >
                        <span className='d-none d-sm-inline'>
                          Editing is disabled. Contact agent if you need help.
                        </span>
                        <span className='d-inline d-sm-none'>
                          Editing disabled
                        </span>
                      </small>
                    </div>
                  </div>
                )}

                {/* Application Details Section */}
                <div className='p-0 p-md-3'>
                  <motion.div
                    className='glassmorphic-card position-relative overflow-hidden rounded-3'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.65 }}
                  >
                    {/* Top border accent */}
                    <div
                      className='position-absolute w-100 top-0 start-0'
                      style={{
                        height: '2px',
                        background:
                          'linear-gradient(90deg, transparent, var(--primary-30), transparent)',
                      }}
                    />
                    <div className='p-0 p-md-3'>
                      {deleteAppId !== '' && (
                        <div className='mb-4'>
                          <DeleteApplication
                            applicationId={deleteAppId}
                            setDeleteAppId={setDeleteAppId}
                          />
                        </div>
                      )}
                      <RequiredDetailsPart
                        application={application}
                        setApplication={setApplication}
                        id={id}
                        refresh={refresh}
                        setRefresh={setRefresh}
                        highlitedSectionId={highlitedSectionId}
                        setHighlightedSectionId={setHighlightedSectionId}
                        isApplicationLocked={isApplicationLocked}
                        advancement={advancement}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* GLASS + ANIMATION STYLES */}
      <style>{`
        @keyframes backgroundFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          33% { transform: translateY(-20px) rotate(120deg); opacity: 0.8; }
          66% { transform: translateY(10px) rotate(240deg); opacity: 0.7; }
        }
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateY(-50%) translateX(-10px);}
          to { opacity: 1; transform: translateY(-50%) translateX(0);}
        }
        @keyframes buttonPulse {
          0%, 100% { transform: scale(1.05); box-shadow: 0 6px 20px var(--primary-40), 0 0 30px var(--primary-20);}
          50% { transform: scale(1.12); box-shadow: 0 10px 30px var(--primary-blue);}
        }
        .glassmorphic-card {
          background: var(--gradient-surface);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border-radius: 24px;
          border: 1.5px solid var(--border-primary);
          box-shadow:
            0 16px 32px rgba(0,0,0,0.15),
            0 8px 16px var(--primary-20),
            0 4px 8px rgba(0,0,0,0.07),
            inset 0 1px 0 var(--white-10),
            inset 0 -1px 0 rgba(0,0,0,0.05);
          color: var(--text-primary);
          transition: box-shadow 0.3s cubic-bezier(.4,0,.2,1), border 0.3s cubic-bezier(.4,0,.2,1);
        }
        .glassmorphic-card:hover {
          box-shadow:
            0 28px 64px rgba(0,0,0,0.2),
            0 14px 28px var(--primary-30),
            0 8px 16px rgba(0,0,0,0.15),
            inset 0 2px 4px var(--white-15);
        }
        .mobile-sidebar-show { left: 0 !important; }
      `}</style>
    </motion.div>
  );
};

export default ApplicationDetails;
