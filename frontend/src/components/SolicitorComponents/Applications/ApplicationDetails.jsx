// Updated ApplicationDetails.js - Bootstrap Responsive with Professional Tooltip
import { useEffect, useState } from 'react';
import { HiOutlineMenuAlt2, HiX } from 'react-icons/hi';
import { useParams } from 'react-router-dom';

import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import DeleteApplication from './DeleteApplication';

import Cookies from 'js-cookie';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import RequiredDetailsPart from '../ApplicationDetailsParts/RequiredDetailsPart';

// Import the new modern progress component
import ModernApplicationProgress from './ApplicationDetailStages/ApplicationDetailStages';
import './ApplicationDetails.css'; // Import minimal CSS for animations only

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

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tooltip state - check localStorage for tooltip visibility
  const [showTooltip, setShowTooltip] = useState(() => {
    try {
      // const tooltipDismissed = localStorage.getItem(
      //   'mobile-stages-tooltip-dismissed'
      // );
      // return !tooltipDismissed;
      return true; // Default to showing tooltip
    } catch {
      return true; // Default to showing tooltip if localStorage is not available
    }
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);

    // Prevent body scroll when sidebar is open on mobile
    if (window.innerWidth < 1024) {
      if (!isSidebarOpen) {
        document.body.classList.add('sidebar-open');
        document.body.style.top = `-${window.scrollY}px`;
      } else {
        const scrollY = document.body.style.top;
        document.body.classList.remove('sidebar-open');
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Hide tooltip when button is pressed and save to localStorage
    if (showTooltip) {
      setShowTooltip(false);
      try {
        localStorage.setItem('mobile-stages-tooltip-dismissed', 'true');
      } catch {
        // Handle localStorage errors gracefully
        console.warn('Could not save tooltip state to localStorage');
      }
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);

    // Remove body scroll lock on mobile
    if (window.innerWidth < 1024) {
      const scrollY = document.body.style.top;
      document.body.classList.remove('sidebar-open');
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  //checking if application is locked
  useEffect(() => {
    if (
      application?.processing_status?.application_details_completed_confirmed
    ) {
      setIsApplicationLocked(true);
    }
  }, [application]);

  // Fetch estates for the progress component
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
        console.error('Error fetching estates:', e);
        setEstates([]);
      }
    };

    if (application) {
      getEstates();
    }
  }, [application?.estate_summary, refresh, token]);

  useEffect(() => {
    if (highlitedSectionId !== '') {
      console.log('H_S_id: ', highlitedSectionId);
      // Close sidebar when navigating to section on mobile
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
      // Scroll to the section with the given ID
      const targetElement = document.getElementById(highlitedSectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Scroll to the top of the page
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
        } catch (error) {
          console.error('Error fetching application details:', error);
        }
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
        } catch (error) {
          console.error('Error fetching advancement details:', error);
        }
      }
    };

    fetchAdvancementForApplication();
  }, [token, id, refresh]);

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
        // Remove body scroll lock when switching to desktop
        document.body.classList.remove('sidebar-open');
        document.body.style.top = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Clean up body scroll lock when component unmounts or sidebar state changes
  useEffect(() => {
    if (!isSidebarOpen && window.innerWidth < 1024) {
      // Ensure body scroll is restored when sidebar is closed
      const scrollY = document.body.style.top;
      document.body.classList.remove('sidebar-open');
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [isSidebarOpen]);

  if (!application) {
    return (
      <div className='min-vh-100 d-flex justify-content-center align-items-center modern-loading-container'>
        <LoadingComponent />
      </div>
    );
  }

  console.log('Application Details:', application);

  return (
    <div
      className='min-vh-100 position-relative modern-application-container'
      style={{
        backgroundColor: '#1F2049',
        marginLeft: window.innerWidth >= 1024 ? '340px' : '0',
        paddingLeft: window.innerWidth < 1024 ? '8px' : '0',
        paddingRight: window.innerWidth < 1024 ? '8px' : '0',
      }}
    >
      {/* Background Pattern */}
      <div
        className='position-fixed w-100 h-100'
        style={{
          top: 0,
          left: window.innerWidth >= 1024 ? '340px' : '0',
          right: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05), transparent 40%), 
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05), transparent 40%)
          `,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Mobile Stages Toggle Button with Tooltip */}
      <div
        className='d-lg-none position-fixed'
        style={{
          top: '50%',
          left: '16px',
          transform: 'translateY(-50%)',
          zIndex: 1050,
        }}
      >
        {/* Professional Tooltip */}
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
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backdropFilter: 'blur(10px)',
                fontSize: '0.85rem',
                fontWeight: '500',
                letterSpacing: '0.02em',
                minWidth: '200px',
                maxWidth: '280px',
                boxShadow:
                  '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)',
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
                  transform: 'translateY(-50%)',
                  width: '12px',
                  height: '12px',
                  background:
                    'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRight: 'none',
                  borderBottom: 'none',
                  transform: 'translateY(-50%) rotate(45deg)',
                }}
              />
              {/* Subtle glow effect */}
              <div
                className='position-absolute top-0 start-0 w-100 h-100 rounded-2'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          className='btn stages-toggle-btn'
          onClick={toggleSidebar}
          aria-label='Toggle stages sidebar'
          style={{
            background:
              'linear-gradient(145deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            color: 'white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            boxShadow: showTooltip
              ? '0 6px 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'
              : '0 4px 15px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease',
            transform: showTooltip ? 'scale(1.05)' : 'scale(1)',
            animation: showTooltip
              ? 'buttonPulse 2s ease-in-out infinite'
              : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow =
              '0 6px 20px rgba(59, 130, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = showTooltip
              ? 'scale(1.05)'
              : 'scale(1)';
            e.currentTarget.style.boxShadow = showTooltip
              ? '0 6px 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'
              : '0 4px 15px rgba(59, 130, 246, 0.4)';
          }}
        >
          {isSidebarOpen ? <HiX size={24} /> : <HiOutlineMenuAlt2 size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      <div
        className={`d-lg-none position-fixed w-100 h-100 ${
          isSidebarOpen ? 'stages-overlay show' : 'stages-overlay'
        }`}
        onClick={closeSidebar}
        style={{
          top: 0,
          left: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1035,
          opacity: isSidebarOpen ? 1 : 0,
          visibility: isSidebarOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease',
        }}
      />

      {/* Fixed Progress Sidebar */}
      <div
        className={`modern-stages-sidebar ${isSidebarOpen ? 'show' : ''}`}
        style={{
          position: window.innerWidth >= 1024 ? 'fixed' : 'fixed',
          left:
            window.innerWidth >= 1024 ? '0' : isSidebarOpen ? '0' : '-400px',
          top: 0,
          bottom: 0,
          height: window.innerWidth >= 1024 ? '100vh' : '100%',
          maxHeight: '100vh',
          width: '400px',
          background:
            'linear-gradient(180deg, #0a0f1c 0%, #111827 30%, #1f2937 70%, #0a0f1c 100%)',
          borderRight: '1px solid rgba(59, 130, 246, 0.3)',
          zIndex: 1040,
          overflowY: 'scroll',
          overflowX: 'hidden',
          backdropFilter: 'blur(20px)',
          boxShadow:
            '8px 0 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(59, 130, 246, 0.1)',
          transition: 'left 0.3s ease-in-out',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(59, 130, 246, 0.3) transparent',
          // Mobile-specific fixes
          transform: 'translateZ(0)', // Force hardware acceleration
          willChange: 'transform', // Optimize for animations
          touchAction: 'pan-y', // Allow vertical scrolling only
        }}
      >
        <div
          style={{
            minHeight: '100%',
            paddingBottom: window.innerWidth < 1024 ? '20px' : '0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ModernApplicationProgress
            application={application}
            setHighlightedSectionId={setHighlightedSectionId}
            estates={estates}
            advancement={advancement}
            refresh={refresh}
            highlitedSectionId={highlitedSectionId}
          />
        </div>
      </div>

      {/* Navigation */}
      <div
        className='p-2 p-md-3'
        style={{ margin: window.innerWidth < 1024 ? '0' : 'initial' }}
      >
        <BackToApplicationsIcon backUrl={-1} />
      </div>

      {/* Main Content Container */}
      <div
        className='container-fluid'
        style={{
          padding: window.innerWidth < 1024 ? '0' : 'initial',
          paddingBottom: '2rem',
        }}
      >
        <div className='row justify-content-center g-0'>
          <div className='col-12'>
            <div
              className='position-relative overflow-hidden'
              style={{
                backgroundColor: '#1F2049',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                boxShadow:
                  '0 10px 25px rgba(0, 0, 0, 0.08), 0 0 30px rgba(59, 130, 246, 0.05)',
                zIndex: 1,
                margin: window.innerWidth < 1024 ? '0' : 'initial',
              }}
            >
              {/* Compact Status Alert */}
              {(application.is_rejected ||
                application.approved ||
                isApplicationLocked) && (
                <div
                  className={`d-flex flex-row align-items-center gap-2 gap-md-3 p-2 p-md-4 rounded-2 rounded-md-3 border-start border-3 border-md-4`}
                  style={{
                    background: application.is_rejected
                      ? 'linear-gradient(145deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 202, 202, 0.95) 50%, rgba(254, 242, 242, 0.95) 100%)'
                      : application.approved
                      ? 'linear-gradient(145deg, rgba(240, 253, 244, 0.95) 0%, rgba(187, 247, 208, 0.95) 50%, rgba(240, 253, 244, 0.95) 100%)'
                      : 'linear-gradient(145deg, rgba(254, 243, 199, 0.95) 0%, rgba(253, 230, 138, 0.95) 50%, rgba(254, 243, 199, 0.95) 100%)',
                    borderLeftColor: application.is_rejected
                      ? '#dc2626'
                      : application.approved
                      ? '#059669'
                      : '#d97706',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                    margin: window.innerWidth < 1024 ? '8px' : '16px 24px',
                  }}
                >
                  <div
                    className='d-flex align-items-center justify-content-center rounded-2 text-white fw-bold flex-shrink-0'
                    style={{
                      width: '32px',
                      height: '32px',
                      background: application.is_rejected
                        ? 'linear-gradient(145deg, #ef4444, #dc2626, #b91c1c)'
                        : application.approved
                        ? 'linear-gradient(145deg, #10b981, #059669, #047857)'
                        : 'linear-gradient(145deg, #f59e0b, #d97706, #b45309)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      className='d-block d-md-none'
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
                    <svg
                      width='20'
                      height='20'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      className='d-none d-md-block'
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
                          ? '#dc2626'
                          : application.approved
                          ? '#059669'
                          : '#d97706',
                        fontSize: '0.9rem',
                      }}
                    >
                      {application.is_rejected
                        ? 'Rejected'
                        : application.approved
                        ? 'Approved'
                        : 'Locked'}
                      <span className='d-none d-md-inline ms-1'>
                        {application.is_rejected
                          ? 'Application'
                          : application.approved
                          ? 'Application'
                          : 'Application'}
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
              <div className='border-bottom-0'>
                <div
                  style={{
                    padding: window.innerWidth < 1024 ? '0' : 'initial',
                  }}
                >
                  <div
                    style={{
                      margin: window.innerWidth < 1024 ? '0' : 'initial',
                    }}
                  >
                    <div
                      className='position-relative overflow-hidden'
                      style={{
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(59, 130, 246, 0.08)',
                        borderRadius: '12px',
                      }}
                    >
                      {/* Top border accent */}
                      <div
                        className='position-absolute w-100'
                        style={{
                          top: 0,
                          left: 0,
                          height: '2px',
                          background:
                            'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                        }}
                      />

                      <div
                        style={{
                          backgroundColor: '#1F2049',
                          padding: window.innerWidth < 1024 ? '4px' : '8px',
                        }}
                      >
                        {/* Delete Application Modal */}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        @keyframes buttonPulse {
          0%,
          100% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6),
              0 0 30px rgba(59, 130, 246, 0.4);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.8),
              0 0 40px rgba(59, 130, 246, 0.6);
          }
        }

        /* Custom scrollbar for progress sidebar */
        .modern-stages-sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .modern-stages-sidebar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }

        .modern-stages-sidebar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 3px;
        }

        .modern-stages-sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.6);
        }

        /* Mobile scrolling fixes */
        @media (max-width: 1023px) {
          .modern-stages-sidebar {
            position: fixed !important;
            overflow-y: scroll !important;
            overflow-x: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            overscroll-behavior: contain !important;
            transform: translateZ(0) !important;
            will-change: transform !important;
            /* Prevent scroll chaining */
            overscroll-behavior-y: contain !important;
          }

          /* Fix for iOS Safari viewport issues */
          .modern-stages-sidebar {
            height: 100vh !important;
            height: -webkit-fill-available !important;
          }

          /* Prevent body scroll when sidebar is open */
          body.sidebar-open {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ApplicationDetails;
