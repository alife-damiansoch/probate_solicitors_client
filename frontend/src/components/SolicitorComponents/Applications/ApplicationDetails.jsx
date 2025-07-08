// Updated ApplicationDetails.js - Mobile Responsive
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
import './ApplicationDetails.css'; // Import external CSS

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!application) {
    return (
      <div className='modern-loading-container min-vh-100 d-flex justify-content-center align-items-center'>
        <LoadingComponent />
      </div>
    );
  }

  console.log('Application Details:', application);

  return (
    <div className='modern-application-container min-vh-100'>
      {/* Mobile Stages Toggle Button */}
      <button
        className='stages-toggle-btn d-lg-none'
        onClick={toggleSidebar}
        aria-label='Toggle stages sidebar'
      >
        {isSidebarOpen ? <HiX size={24} /> : <HiOutlineMenuAlt2 size={24} />}
      </button>

      {/* Overlay for mobile */}
      <div
        className={`stages-overlay d-lg-none ${isSidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      />

      {/* Fixed Progress Sidebar */}
      <div className={`modern-stages-sidebar ${isSidebarOpen ? 'show' : ''}`}>
        <ModernApplicationProgress
          application={application}
          setHighlightedSectionId={setHighlightedSectionId}
          estates={estates}
          advancement={advancement}
          refresh={refresh}
          highlitedSectionId={highlitedSectionId}
        />
      </div>

      {/* Navigation */}
      <div>
        <BackToApplicationsIcon backUrl={-1} />
      </div>

      {/* Main Content Container */}
      <div className='container-fluid pb-5'>
        <div className='row justify-content-center'>
          <div className='col-12 col-xl-12'>
            <div className='modern-main-card'>
              {/* Compact Status Alert */}
              {(application.is_rejected ||
                application.approved ||
                isApplicationLocked) && (
                <div
                  className={`modern-status-alert d-flex align-items-start gap-3 py-2 px-3 rounded ${
                    application.is_rejected
                      ? 'status-rejected'
                      : application.approved
                      ? 'status-approved'
                      : 'status-locked'
                  }`}
                  style={{
                    background: application.is_rejected
                      ? 'rgba(220, 38, 38, 0.1)'
                      : application.approved
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(234, 179, 8, 0.1)',
                    borderLeft: `4px solid ${
                      application.is_rejected
                        ? '#dc2626'
                        : application.approved
                        ? '#059669'
                        : '#d97706'
                    }`,
                  }}
                >
                  <div className='pt-1'>
                    <svg
                      width='20'
                      height='20'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      style={{
                        color: application.is_rejected
                          ? '#dc2626'
                          : application.approved
                          ? '#059669'
                          : '#d97706',
                      }}
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
                  <div className='flex-grow-1'>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: application.is_rejected
                          ? '#dc2626'
                          : application.approved
                          ? '#059669'
                          : '#d97706',
                      }}
                    >
                      {application.is_rejected
                        ? 'Application Rejected'
                        : application.approved
                        ? 'Application Approved'
                        : 'Application Locked'}
                    </div>
                    <small className='text-muted'>
                      Editing is disabled. Contact agent if you need help.
                    </small>
                  </div>
                </div>
              )}

              {/* Application Details Section */}
              <div className='border-bottom-0'>
                <div className='p-0'>
                  <div className='m-0'>
                    <div className='modern-details-card'>
                      <div
                        className='card-body p-1'
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
    </div>
  );
};

export default ApplicationDetails;
