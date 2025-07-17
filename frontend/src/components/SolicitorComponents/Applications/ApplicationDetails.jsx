// Updated ApplicationDetails.js - Fully Responsive with Bootstrap
import { useEffect, useState } from 'react';
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
      return true; // Default to showing tooltip
    } catch {
      return true; // Default to showing tooltip if localStorage is not available
    }
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);

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
      setIsSidebarOpen(false);
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

  // Simple click handler cleanup
  useEffect(() => {
    return () => {
      // Cleanup any event listeners
      document.removeEventListener('click', () => {});
    };
  }, []);

  if (!application) {
    return (
      <div className='min-vh-100 d-flex justify-content-center align-items-center modern-loading-container'>
        <LoadingComponent />
      </div>
    );
  }

  console.log('Application Details:', application);

  return (
    <div className='min-vh-100 bg-primary position-relative'>
      {/* Background Pattern */}
      <div
        className='position-fixed w-100 h-100 top-0 start-0'
        style={{
          background: `
               radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05), transparent 40%), 
               radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05), transparent 40%)
             `,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Bootstrap Container with Responsive Layout */}
      <div className='container-fluid p-0'>
        <div className='row g-0'>
          {/* Progress Sidebar - Hidden on mobile, shown on desktop */}
          <div className='col-lg-5 col-xl-4 d-none d-lg-block'>
            <div
              className='position-fixed top-0 bottom-0 overflow-auto'
              style={{
                width: '400px',
                background:
                  'linear-gradient(180deg, #0a0f1c 0%, #111827 30%, #1f2937 70%, #0a0f1c 100%)',
                borderRight: '1px solid rgba(59, 130, 246, 0.3)',
                zIndex: 1040,
                backdropFilter: 'blur(20px)',
                boxShadow:
                  '8px 0 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(59, 130, 246, 0.1)',
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

          {/* Main Content Area */}
          <div className='col-12 col-lg-7 col-xl-8 p-0 m-0'>
            {/* Mobile Toggle Button - Only visible on mobile */}
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
                      background:
                        'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
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
                  </div>
                </div>
              )}

              {/* Toggle Button */}
              <button
                className='btn stages-toggle-btn d-flex align-items-center justify-content-center'
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSidebar();
                }}
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
                  padding: '0',
                  fontSize: '20px',
                  lineHeight: '1',
                  fontWeight: 'bold',
                }}
              >
                {isSidebarOpen ? (
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M18 6L6 18'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M6 6L18 18'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                ) : (
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M3 12H21'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M3 6H21'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M3 18H21'
                      stroke='white'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div
                className='position-fixed w-100 h-100 top-0 start-0 d-lg-none'
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 1035,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  closeSidebar();
                }}
              />
            )}

            {/* Mobile Sidebar */}
            <div
              className={`position-fixed top-0 bottom-0 d-lg-none ${
                isSidebarOpen ? 'mobile-sidebar-show' : ''
              }`}
              style={{
                left: isSidebarOpen ? '0' : '-400px',
                width: '400px',
                height: '100vh',
                background:
                  'linear-gradient(180deg, #0a0f1c 0%, #111827 30%, #1f2937 70%, #0a0f1c 100%)',
                borderRight: '1px solid rgba(59, 130, 246, 0.3)',
                zIndex: 1041,
                overflowY: 'auto',
                overflowX: 'hidden',
                backdropFilter: 'blur(20px)',
                boxShadow:
                  '8px 0 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(59, 130, 246, 0.1)',
                transition: 'left 0.3s ease-in-out',
                WebkitOverflowScrolling: 'touch',
                transform: 'translateZ(0)', // Force hardware acceleration
              }}
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
            </div>

            {/* Main Content */}
            <div className='p-2 p-md-3'>
              {/* Navigation */}
              <BackToApplicationsIcon backUrl={-1} />

              {/* Content Container */}
              <div className='mt-3'>
                <div
                  className='position-relative overflow-hidden rounded-3'
                  style={{
                    backgroundColor: '#1F2049',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    boxShadow:
                      '0 10px 25px rgba(0, 0, 0, 0.08), 0 0 30px rgba(59, 130, 246, 0.05)',
                    zIndex: 1,
                  }}
                >
                  {/* Compact Status Alert */}
                  {(application.is_rejected ||
                    application.approved ||
                    isApplicationLocked) && (
                    <div
                      className={`d-flex flex-row align-items-center gap-2 gap-md-3 p-3 p-md-4 rounded-2 rounded-md-3 border-start border-3 border-md-4 m-2 m-md-3`}
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
                    <div
                      className='position-relative overflow-hidden rounded-3'
                      style={{
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(59, 130, 246, 0.08)',
                      }}
                    >
                      {/* Top border accent */}
                      <div
                        className='position-absolute w-100 top-0 start-0'
                        style={{
                          height: '2px',
                          background:
                            'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                        }}
                      />

                      <div
                        className='p-0 p-md-3'
                        style={{ backgroundColor: '#1F2049' }}
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
          0%, 100% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.6);
          }
        }

        /* Custom scrollbar for progress sidebar */
        .col-lg-5::-webkit-scrollbar,
        .position-fixed::-webkit-scrollbar {
          width: 6px;
        }

        .col-lg-5::-webkit-scrollbar-track,
        .position-fixed::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }

        .col-lg-5::-webkit-scrollbar-thumb,
        .position-fixed::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 3px;
        }

        .col-lg-5::-webkit-scrollbar-thumb:hover,
        .position-fixed::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.6);
        }

        /* Mobile sidebar styling */
        .mobile-sidebar-show {
          left: 0 !important;
        }

        /* Debug helper */
        .debug-sidebar {
          border: 2px solid red !important;
        }
      `}</style>
    </div>
  );
};

export default ApplicationDetails;
