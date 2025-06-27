import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import DeleteApplication from './DeleteApplication';

import Cookies from 'js-cookie';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import RequiredDetailsPart from '../ApplicationDetailsParts/RequiredDetailsPart';
import AdvancementInfo from './AdvancementInfo';

// Import the new modern progress component
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

  //checking if application si locked
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

  if (!application) {
    return (
      <div
        className='min-vh-100 d-flex justify-content-center align-items-center'
        style={{ backgroundColor: '#f8fafc' }}
      >
        <LoadingComponent />
      </div>
    );
  }

  console.log('Application Details:', application);

  return (
    <div className='min-vh-100' style={{ backgroundColor: '#f8fafc' }}>
      {/* Modern Progress Header - Always visible at top */}
      <ModernApplicationProgress
        application={application}
        setHighlightedSectionId={setHighlightedSectionId}
        estates={estates}
        advancement={advancement}
        refresh={refresh}
      />

      {/* Navigation */}
      <div className='container-fluid px-4 pt-4'>
        <BackToApplicationsIcon backUrl={-1} />
      </div>

      {/* Main Content Container - Full Width Now */}
      <div className='container-fluid px-4 pb-5'>
        <div className='row justify-content-center'>
          {/* Single Full-Width Content Panel */}
          <div className='col-12 col-xl-10'>
            <div
              className='card border-0 overflow-hidden'
              style={{
                boxShadow:
                  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                borderRadius: '16px',
                backgroundColor: '#f8fafc',
              }}
            >
              {/* Modern Header with Gradient */}
              <div
                className='card-header border-0 text-white position-relative'
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px 16px 0 0',
                  padding: '2rem',
                }}
              >
                {/* Subtle pattern overlay */}
                <div
                  className='position-absolute top-0 start-0 w-100 h-100'
                  style={{
                    background:
                      'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    borderRadius: '16px 16px 0 0',
                  }}
                ></div>

                <div className='row align-items-center position-relative'>
                  <div className='col-md-10'>
                    <div className='d-flex align-items-center mb-2'>
                      <div
                        className='rounded-circle d-flex align-items-center justify-content-center me-3'
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <i className='fas fa-file-alt text-white'></i>
                      </div>
                      <div>
                        <h2
                          className='mb-0 fw-bold'
                          style={{ fontSize: '1.75rem' }}
                        >
                          Application #{application.id}
                        </h2>
                        <p
                          className='mb-0 opacity-75'
                          style={{ fontSize: '0.95rem' }}
                        >
                          Detailed overview and management
                        </p>
                      </div>
                    </div>
                    {advancement && (
                      <div
                        className='badge text-white px-3 py-2 mt-2'
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          fontSize: '0.85rem',
                        }}
                      >
                        <i className='fas fa-link me-2'></i>
                        Advancement ID: {advancement.id}
                      </div>
                    )}
                  </div>
                  <div className='col-md-2 text-end'>
                    <button
                      className='btn btn-danger shadow-sm px-4 py-2 fw-medium'
                      style={{
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#ef4444',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => setDeleteAppId(id)}
                      disabled={application.approved || application.is_rejected}
                      onMouseOver={(e) => {
                        if (!e.target.disabled) {
                          e.target.style.backgroundColor = '#dc2626';
                          e.target.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#ef4444';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <i className='fas fa-trash-alt me-2'></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Advancement Section */}
              {advancement && (
                <div className='border-bottom'>
                  <div
                    className='card-header border-0'
                    style={{
                      backgroundColor: '#f1f5f9',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    <div className='d-flex align-items-center'>
                      <div
                        className='rounded-circle d-flex align-items-center justify-content-center me-3'
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                        }}
                      >
                        <i
                          className='fas fa-chart-line'
                          style={{ fontSize: '1rem' }}
                        ></i>
                      </div>
                      <h3 className='mb-0 fw-semibold text-slate-700'>
                        Advancement Details
                      </h3>
                    </div>
                  </div>
                  <div className='card-body' style={{ padding: '2rem' }}>
                    <AdvancementInfo advancement={advancement} />
                  </div>
                </div>
              )}

              {/* Status Alert */}
              {(application.is_rejected ||
                application.approved ||
                isApplicationLocked) && (
                <div
                  className='mx-4 mb-4 p-3 rounded-3 d-flex align-items-center gap-3'
                  style={{
                    backgroundColor: application.is_rejected
                      ? '#fef2f2'
                      : application.approved
                      ? '#f0fdf4'
                      : '#fef3c7', // Yellow background for locked
                    border: `1px solid ${
                      application.is_rejected
                        ? '#fecaca'
                        : application.approved
                        ? '#bbf7d0'
                        : '#fde68a' // Yellow border for locked
                    }`,
                    marginTop: '16px',
                  }}
                >
                  <div
                    className='d-flex align-items-center justify-content-center rounded-2'
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: application.is_rejected
                        ? '#dc2626'
                        : application.approved
                        ? '#059669'
                        : '#d97706', // Orange/amber for locked
                      color: 'white',
                    }}
                  >
                    {application.is_rejected ? (
                      <svg
                        width='20'
                        height='20'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    ) : application.approved ? (
                      <svg
                        width='20'
                        height='20'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    ) : (
                      // Lock icon for locked state
                      <svg
                        width='20'
                        height='20'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h6
                      className='mb-1 fw-bold'
                      style={{
                        color: application.is_rejected
                          ? '#dc2626'
                          : application.approved
                          ? '#059669'
                          : '#d97706', // Orange/amber for locked
                      }}
                    >
                      Application{' '}
                      {application.is_rejected
                        ? 'Rejected'
                        : application.approved
                        ? 'Approved'
                        : 'Locked'}
                    </h6>
                    <p
                      className='mb-0'
                      style={{ fontSize: '0.875rem', color: '#6b7280' }}
                    >
                      Options and editing are not available because application
                      is{' '}
                      {application.is_rejected
                        ? 'rejected'
                        : application.approved
                        ? 'approved'
                        : 'locked'}
                    </p>
                  </div>
                </div>
              )}

              {/* Application Details Section */}
              <div className='border-bottom'>
                <div className='p-0'>
                  {/* Required Details Card */}
                  <div className='m-0'>
                    <div
                      className='card border-0'
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        boxShadow:
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      <div className='card-body'>
                        {/* Delete Application Modal */}
                        {deleteAppId !== '' && (
                          <div className='mb-4'>
                            <DeleteApplication
                              applicationId={deleteAppId}
                              setDeleteAppId={setDeleteAppId}
                            />
                          </div>
                        )}

                        {/* Status Alert */}
                        {(application.approved || application.is_rejected) && (
                          <div
                            className='alert border-0 text-center mb-4'
                            style={{
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              borderRadius: '10px',
                              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)',
                            }}
                          >
                            <div className='d-flex align-items-center justify-content-center'>
                              <i className='fas fa-info-circle me-2'></i>
                              <span className='fw-medium'>
                                Editing is disabled for{' '}
                                {application.approved ? 'approved' : 'rejected'}{' '}
                                applications
                              </span>
                            </div>
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
