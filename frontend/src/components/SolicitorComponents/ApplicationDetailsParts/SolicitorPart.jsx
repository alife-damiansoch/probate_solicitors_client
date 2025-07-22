import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { FaExternalLinkAlt, FaPlus, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import {
  fetchData,
  patchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const SolicitorPart = ({
  solicitor_id,
  application_id,
  refresh,
  setRefresh,
  highlitedSectionId,
}) => {
  const token = Cookies.get('auth_token');
  const [errors, setErrors] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitors, setSolicitors] = useState([]);
  const [assignedSolicitor, setAssignedSolicitor] = useState(null);
  const [isUpdatingSolicitorAssigned, setIsUpdatingSolicitorAssigned] =
    useState(false);

  // Fetch all solicitors for the logged-in user
  useEffect(() => {
    const fetchSolicitors = async () => {
      setIsLoading(true);
      if (token) {
        const endpoint = `/api/applications/solicitors/`;
        try {
          const response = await fetchData(token, endpoint);

          if (response.status === 200) {
            setSolicitors(response.data);
            setIsError(false);
          } else {
            setErrors(response.data);
            setIsError(true);
          }
        } catch (error) {
          console.error('Error fetching solicitors:', error);
          setErrors('An error occurred while fetching solicitors.');
          setIsError(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSolicitors();
  }, [token, refresh]);

  // Setup selected Solicitor if any is selected
  useEffect(() => {
    if (solicitor_id && solicitors.length > 0) {
      setIsLoading(true);
      const selectedSolicitor = solicitors.find(
        (solicitor) => solicitor.id === solicitor_id
      );

      setAssignedSolicitor(selectedSolicitor || null);
      setIsLoading(false);
    }
  }, [solicitor_id, solicitors]);

  const updateSelectedSolicitor = async (solicitor_id) => {
    const data = { solicitor: solicitor_id };

    try {
      setIsUpdatingSolicitorAssigned(true);
      const endpoint = `/api/applications/solicitor_applications/${application_id}/`;
      const response = await patchData(endpoint, data);
      if (response.status !== 200) {
        setIsError(true);
        setErrors(response.data);
        setIsUpdatingSolicitorAssigned(false);
      } else {
        setIsError(false);
        setRefresh(!refresh);
        setErrors({ Solicitor: 'updated' });
        setIsUpdatingSolicitorAssigned(false);
        setTimeout(() => {
          setErrors('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      setIsError(true);
      setIsUpdatingSolicitorAssigned(false);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors(error.message);
      }
    }
  };

  return (
    <div
      className='modern-main-card mb-4 position-relative overflow-hidden'
      style={{
        background: `
          var(--gradient-surface),
          linear-gradient(135deg, var(--primary-10), var(--primary-20)),
          radial-gradient(circle at 30% 10%, var(--primary-20), transparent 50%),
          radial-gradient(circle at 70% 90%, var(--primary-blue), transparent 50%)
        `,
        border: '1px solid var(--border-primary)',
        borderRadius: '24px',
        boxShadow: `
          0 20px 40px var(--primary-10),
          0 8px 16px var(--primary-20),
          inset 0 1px 0 var(--white-10)
        `,
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateZ(0)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
        e.currentTarget.style.boxShadow = `
          0 32px 64px var(--primary-20),
          0 16px 32px var(--primary-30),
          inset 0 1px 0 var(--white-10)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = `
          0 20px 40px var(--primary-10),
          0 8px 16px var(--primary-20),
          inset 0 1px 0 var(--white-10)
        `;
      }}
    >
      {/* Animated Background Pattern */}
      <div
        className='position-absolute w-100 h-100'
        style={{
          background: `
            radial-gradient(circle at 20% 20%, var(--primary-blue) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--primary-blue-dark) 0%, transparent 50%)
          `,
          opacity: 0.2,
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      {/* Premium Header */}
      <div
        className='px-2 px-md-4 py-3 py-md-4 d-flex align-items-center gap-2 gap-md-3 position-relative'
        style={{
          background: `
            linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark)),
            var(--gradient-header)
          `,
          color: 'var(--text-primary)',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-muted)',
          borderBottom: '1px solid var(--border-primary)',
          minHeight: window.innerWidth < 768 ? '80px' : 'auto',
        }}
      >
        {/* Icon with Micro-animation - Responsive sizing */}
        <div
          className='d-flex align-items-center justify-content-center rounded-circle position-relative flex-shrink-0'
          style={{
            width: window.innerWidth < 768 ? '40px' : '56px',
            height: window.innerWidth < 768 ? '40px' : '56px',
            background: 'var(--surface-tertiary)',
            border: '2px solid var(--border-muted)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
            e.currentTarget.style.background = 'var(--primary-20)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.background = 'var(--surface-tertiary)';
          }}
        >
          <FaUserTie size={window.innerWidth < 768 ? 16 : 20} />
          <div
            className='position-absolute rounded-circle d-none d-md-block'
            style={{
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: 'var(--primary-10)',
              filter: 'blur(8px)',
              zIndex: -1,
            }}
          />
        </div>

        {/* Content area - Responsive layout */}
        <div className='flex-grow-1 min-w-0'>
          <h5
            className='fw-bold mb-1 mb-md-2'
            style={{
              fontSize: window.innerWidth < 768 ? '1.1rem' : '1.4rem',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: '1.2',
            }}
          >
            <span className='d-none d-sm-inline'>Legal Representation</span>
            <span className='d-inline d-sm-none'>Legal Rep</span>
          </h5>
          <div
            className='px-2 px-md-3 py-1 py-md-2 rounded-pill fw-semibold'
            style={{
              background: 'var(--primary-20)',
              fontSize: window.innerWidth < 768 ? '0.75rem' : '0.9rem',
              border: '1px solid var(--border-primary)',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.02em',
              color: 'var(--text-primary)',
            }}
          >
            <span className='d-none d-sm-inline'>Assigned Solicitor</span>
            <span className='d-inline d-sm-none'>Solicitor</span>
          </div>
        </div>

        {/* Responsive Status Badge */}
        <div className='flex-shrink-0'>
          <span
            className='px-2 px-md-4 py-2 py-md-3 rounded-pill fw-bold d-flex align-items-center gap-1 gap-md-2'
            style={{
              background: assignedSolicitor
                ? 'linear-gradient(135deg, var(--success-primary), var(--success-dark))'
                : 'linear-gradient(135deg, var(--error-primary), var(--error-dark))',
              fontSize: window.innerWidth < 768 ? '0.75rem' : '0.9rem',
              border: '1px solid var(--border-primary)',
              backdropFilter: 'blur(10px)',
              boxShadow:
                window.innerWidth < 768
                  ? '0 4px 12px var(--primary-10)'
                  : '0 8px 16px var(--primary-20)',
              transition: 'all 0.3s',
              cursor: 'default',
              letterSpacing: '0.02em',
              minWidth: window.innerWidth < 768 ? '70px' : 'auto',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              color: '#fff',
            }}
          >
            <svg
              width={window.innerWidth < 768 ? '14' : '18'}
              height={window.innerWidth < 768 ? '14' : '18'}
              fill='currentColor'
              viewBox='0 0 20 20'
              className='flex-shrink-0'
            >
              {assignedSolicitor ? (
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              ) : (
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              )}
            </svg>
            <span className='d-none d-sm-inline'>
              {assignedSolicitor ? 'Assigned' : 'Required'}
            </span>
            <span className='d-inline d-sm-none'>
              {assignedSolicitor ? 'OK' : '!'}
            </span>
          </span>
        </div>
        {/* Mobile-specific gradient overlay for better text contrast */}
        <div
          className='position-absolute top-0 start-0 w-100 h-100 d-block d-md-none'
          style={{
            background:
              'linear-gradient(135deg, var(--primary-blue-10) 0%, var(--primary-blue-dark-10) 100%)',
            borderTopLeftRadius: '22px',
            borderTopRightRadius: '22px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Ensure content is above overlay */}
        <style>{`
          .position-relative > * {
            position: relative;
            z-index: 1;
          }
        `}</style>
      </div>

      {/* Content Area */}
      <div className='px-4 pb-4'>
        {isUpdatingSolicitorAssigned ? (
          <div className='p-4'>
            <LoadingComponent message='Updating solicitor...' />
          </div>
        ) : (
          <>
            {!assignedSolicitor && (
              <div
                className='alert border-0 mb-4'
                style={{
                  background:
                    'linear-gradient(135deg, var(--error-20), var(--error-10))',
                  borderRadius: '16px',
                  border: '1px solid var(--error-30)',
                  backdropFilter: 'blur(10px)',
                  color: 'var(--error-dark)',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, var(--error-primary), var(--error-dark))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 8px 16px var(--error-30)',
                  }}
                >
                  <i className='fas fa-exclamation-triangle'></i>
                </div>
                <div className='text-center'>
                  <div className='fw-bold mb-2'>
                    Solicitor Assignment Required
                  </div>
                  <div className='small'>
                    <p className='mb-1'>
                      Please select a solicitor from the list.
                    </p>
                    <p className='mb-0'>
                      If the desired solicitor is not listed, click 'Add or Edit
                      Solicitor' to add a new solicitor.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isLoading ? (
              <div className='p-4'>
                <LoadingComponent message='Loading solicitors...' />
              </div>
            ) : (
              <div className='row g-4 align-items-end'>
                <div className='col-md-8'>
                  <label className='form-label fw-semibold mb-2 theme-text-secondary'>
                    <i
                      className='fas fa-user-tie me-2'
                      style={{ color: 'var(--primary-blue)' }}
                    ></i>
                    Assigned Solicitor
                  </label>

                  {solicitors.length === 0 ? (
                    <div
                      className='alert border-0'
                      style={{
                        background:
                          'linear-gradient(135deg, var(--warning-20), var(--warning-30))',
                        borderRadius: '16px',
                        border: '1px solid var(--warning-30)',
                        backdropFilter: 'blur(10px)',
                        color: 'var(--warning-dark)',
                        padding: '1.5rem',
                      }}
                    >
                      <div className='d-flex align-items-center gap-3'>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background:
                              'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                          }}
                        >
                          <i className='fas fa-info-circle'></i>
                        </div>
                        <div>
                          <div className='fw-bold mb-1'>
                            No Solicitors Available
                          </div>
                          <div className='small'>
                            No solicitors have been created for this firm.
                            Please create them by clicking the 'ADD OR EDIT
                            SOLICITORS' button.
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className='input-group input-group-sm position-relative'
                      style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'var(--surface-secondary)',
                        border: !assignedSolicitor
                          ? '2px solid var(--error-primary)'
                          : '1px solid var(--border-muted)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: !assignedSolicitor
                          ? '0 15px 35px var(--error-20), 0 5px 15px var(--primary-10)'
                          : '0 8px 24px var(--primary-10)',
                        transition: 'all 0.3s',
                      }}
                    >
                      {!assignedSolicitor && (
                        <div
                          className='position-absolute'
                          style={{
                            top: '-2px',
                            left: '-2px',
                            right: '-2px',
                            bottom: '-2px',
                            background:
                              'linear-gradient(135deg, var(--error-30), var(--error-20))',
                            borderRadius: '18px',
                            filter: 'blur(8px)',
                            zIndex: -1,
                            animation:
                              'selectionGlow 3s ease-in-out infinite alternate',
                          }}
                        />
                      )}
                      <div
                        className='input-group-text border-0 d-flex align-items-center justify-content-center'
                        style={{
                          backgroundColor: 'transparent',
                          width: '45px',
                        }}
                      >
                        <i
                          className='fas fa-user'
                          style={{ color: 'var(--text-muted)' }}
                        ></i>
                      </div>

                      <select
                        className='form-select border-0 fw-medium'
                        style={{
                          backgroundColor: 'transparent',
                          fontSize: '1rem',
                          fontWeight: '500',
                          padding: '0.75rem 1rem',
                          color: !assignedSolicitor
                            ? 'var(--error-primary)'
                            : 'var(--text-primary)',
                          // Add these properties to fix dark theme dropdown
                          colorScheme: 'dark', // This helps with system dark mode
                        }}
                        onChange={(e) =>
                          updateSelectedSolicitor(e.target.value)
                        }
                        value={assignedSolicitor ? assignedSolicitor.id : ''}
                      >
                        <option
                          value=''
                          disabled
                          style={{
                            backgroundColor: 'var(--surface-primary)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {assignedSolicitor
                            ? `${assignedSolicitor.title} ${assignedSolicitor.first_name} ${assignedSolicitor.last_name}`
                            : 'Select assigned solicitor'}
                        </option>
                        {solicitors.map((solicitor) => (
                          <option
                            key={solicitor.id}
                            value={solicitor.id}
                            style={{
                              backgroundColor:
                                solicitor.id === solicitor_id
                                  ? 'var(--primary-20)'
                                  : 'var(--surface-primary)',
                              color: 'var(--text-primary)',
                              fontWeight:
                                solicitor.id === solicitor_id ? '600' : '400',
                              padding: '0.5rem',
                            }}
                          >
                            {solicitor.title} {solicitor.first_name}{' '}
                            {solicitor.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Current Solicitor Display */}
                  {assignedSolicitor && (
                    <div
                      className='mt-3 p-4 d-flex align-items-center position-relative'
                      style={{
                        background: 'var(--surface-secondary)',
                        borderRadius: '16px',
                        border: '1px solid var(--success-30)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 24px var(--primary-10)',
                      }}
                    >
                      {/* Success glow */}
                      <div
                        className='position-absolute'
                        style={{
                          top: '-2px',
                          left: '-2px',
                          right: '-2px',
                          bottom: '-2px',
                          background:
                            'linear-gradient(135deg, var(--success-20), var(--success-10))',
                          borderRadius: '18px',
                          filter: 'blur(6px)',
                          zIndex: -1,
                          animation:
                            'selectionGlow 3s ease-in-out infinite alternate',
                        }}
                      />

                      <div
                        className='rounded-circle d-flex align-items-center justify-content-center me-3'
                        style={{
                          width: '40px',
                          height: '40px',
                          background:
                            'linear-gradient(135deg, var(--success-primary), var(--success-dark))',
                          color: 'white',
                          boxShadow: '0 8px 16px var(--success-30)',
                        }}
                      >
                        <i
                          className='fas fa-check'
                          style={{ fontSize: '1rem' }}
                        ></i>
                      </div>
                      <div>
                        <div
                          className='fw-bold text-success'
                          style={{
                            fontSize: '1rem',
                            color: 'var(--success-dark)',
                          }}
                        >
                          Currently Assigned
                        </div>
                        <div
                          className='text-success small'
                          style={{ color: 'var(--success-dark)' }}
                        >
                          {assignedSolicitor.title}{' '}
                          {assignedSolicitor.first_name}{' '}
                          {assignedSolicitor.last_name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Add/Edit Button */}
                <div className='col-md-4 text-center text-md-end'>
                  <Link
                    className='btn px-4 py-3 fw-medium text-decoration-none d-inline-flex align-items-center gap-2'
                    to='/solicitors'
                    style={{
                      background:
                        'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      transition: 'all 0.3s',
                      boxShadow: '0 8px 20px var(--primary-30)',
                      backdropFilter: 'blur(10px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-2px) scale(1.05)';
                      e.currentTarget.style.boxShadow =
                        '0 15px 35px var(--primary-30)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 20px var(--primary-30)';
                    }}
                  >
                    <FaPlus size={14} />
                    Add or Edit Solicitors
                    <FaExternalLinkAlt size={12} />
                  </Link>
                </div>
              </div>
            )}

            {/* Error Messages */}
            {errors && (
              <div className='mt-4'>
                <div
                  className={`alert border-0 text-center`}
                  style={{
                    background: isError
                      ? 'linear-gradient(135deg, var(--error-20), var(--error-10))'
                      : 'linear-gradient(135deg, var(--success-20), var(--success-10))',
                    borderRadius: '16px',
                    border: isError
                      ? '1px solid var(--error-30)'
                      : '1px solid var(--success-30)',
                    backdropFilter: 'blur(10px)',
                    color: isError
                      ? 'var(--error-dark)'
                      : 'var(--success-dark)',
                    padding: '1.5rem',
                  }}
                  role='alert'
                >
                  <div className='d-flex align-items-center justify-content-center gap-3'>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isError
                          ? 'linear-gradient(135deg, var(--error-primary), var(--error-dark))'
                          : 'linear-gradient(135deg, var(--success-primary), var(--success-dark))',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                      }}
                    >
                      <i
                        className={`fas ${
                          isError
                            ? 'fa-exclamation-triangle'
                            : 'fa-check-circle'
                        }`}
                      ></i>
                    </div>
                    <div className='fw-semibold'>{renderErrors(errors)}</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes selectionGlow {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        
        select option {
          background-color: var(--surface-primary) !important;
          color: var(--text-primary) !important;
          padding: 0.5rem !important;
        }

        select option:hover {
          background-color: var(--primary-20) !important;
          color: var(--text-primary) !important;
        }

        select option:checked {
          background-color: var(--primary-blue) !important;
          color: white !important;
        }

        /* For webkit browsers */
        select::-webkit-scrollbar {
          width: 8px;
        }

        select::-webkit-scrollbar-track {
          background: var(--surface-secondary);
        }

        select::-webkit-scrollbar-thumb {
          background: var(--primary-blue);
          border-radius: 4px;
        }

        /* Dark theme specific fixes */
        [data-theme="dark"] select {
          color-scheme: dark;
        }

        [data-theme="dark"] select option {
          background: var(--surface-primary) !important;
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default SolicitorPart;
