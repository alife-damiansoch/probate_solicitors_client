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
    const data = {
      solicitor: solicitor_id,
    };

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
          linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(248, 250, 252, 0.05)),
          radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.6), transparent 50%),
          radial-gradient(circle at 70% 90%, rgba(139, 92, 246, 0.1), transparent 50%)
        `,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        boxShadow: `
          0 20px 40px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.4)
        `,
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateZ(0)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
        e.currentTarget.style.boxShadow = `
          0 32px 64px rgba(0, 0, 0, 0.12),
          0 16px 32px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.6)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = `
          0 20px 40px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.4)
        `;
      }}
    >
      {/* Animated Background Pattern */}
      <div
        className='position-absolute w-100 h-100'
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.06) 0%, transparent 50%)
          `,
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      {/* Premium Header */}
      <div
        className='px-2 px-md-4 py-3 py-md-4 d-flex align-items-center gap-2 gap-md-3 position-relative'
        style={{
          background: `
      linear-gradient(135deg, #8b5cf6, #7c3aed),
      linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))
    `,
          color: '#ffffff',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          minHeight: window.innerWidth < 768 ? '80px' : 'auto',
        }}
      >
        {/* Icon with Micro-animation - Responsive sizing */}
        <div
          className='d-flex align-items-center justify-content-center rounded-circle position-relative flex-shrink-0'
          style={{
            width: window.innerWidth < 768 ? '40px' : '56px',
            height: window.innerWidth < 768 ? '40px' : '56px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <FaUserTie size={window.innerWidth < 768 ? 16 : 20} />

          {/* Subtle glow effect */}
          <div
            className='position-absolute rounded-circle d-none d-md-block'
            style={{
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(8px)',
              zIndex: -1,
            }}
          />
        </div>

        {/* Content area - Responsive layout */}
        <div className='flex-grow-1 min-w-0'>
          <h5
            className='fw-bold mb-1 mb-md-2 text-white'
            style={{
              fontSize: window.innerWidth < 768 ? '1.1rem' : '1.4rem',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}
          >
            <span className='d-none d-sm-inline'>Legal Representation</span>
            <span className='d-inline d-sm-none'>Legal Rep</span>
          </h5>
          <div
            className='px-2 px-md-3 py-1 py-md-2 rounded-pill fw-semibold text-white'
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: window.innerWidth < 768 ? '0.75rem' : '0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.02em',
            }}
          >
            <span className='d-none d-sm-inline'>Assigned Solicitor</span>
            <span className='d-inline d-sm-none'>Solicitor</span>
          </div>
        </div>

        {/* Responsive Status Badge */}
        <div className='flex-shrink-0'>
          <span
            className='px-2 px-md-4 py-2 py-md-3 rounded-pill text-white fw-bold d-flex align-items-center gap-1 gap-md-2'
            style={{
              background: assignedSolicitor
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
              fontSize: window.innerWidth < 768 ? '0.75rem' : '0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow:
                window.innerWidth < 768
                  ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                  : '0 8px 16px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'default',
              letterSpacing: '0.02em',
              minWidth: window.innerWidth < 768 ? '70px' : 'auto',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
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
              'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
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
        {/* Loading State */}
        {isUpdatingSolicitorAssigned ? (
          <div className='p-4'>
            <LoadingComponent message='Updating solicitor...' />
          </div>
        ) : (
          <>
            {/* No Solicitor Warning */}
            {!assignedSolicitor && (
              <div
                className='alert border-0 mb-4'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                  borderRadius: '16px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: '#dc2626',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: '0 8px 16px rgba(239, 68, 68, 0.3)',
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

            {/* Main Content */}
            {isLoading ? (
              <div className='p-4'>
                <LoadingComponent message='Loading solicitors...' />
              </div>
            ) : (
              <div className='row g-4 align-items-end'>
                {/* Solicitor Selection */}
                <div className='col-md-8'>
                  <label className='form-label fw-semibold text-slate-700 mb-2'>
                    <i className='fas fa-user-tie me-2 text-purple-500'></i>
                    Assigned Solicitor
                  </label>

                  {solicitors.length === 0 ? (
                    <div
                      className='alert border-0'
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                        borderRadius: '16px',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        backdropFilter: 'blur(10px)',
                        color: '#92400e',
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
                              'linear-gradient(135deg, #f59e0b, #d97706)',
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
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: !assignedSolicitor
                          ? '2px solid #ef4444'
                          : '1px solid rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: !assignedSolicitor
                          ? '0 15px 35px rgba(239, 68, 68, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)'
                          : '0 8px 24px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (assignedSolicitor) {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow =
                            '0 16px 40px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (assignedSolicitor) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 24px rgba(0, 0, 0, 0.06)';
                        }
                      }}
                    >
                      {/* Glow effect for error state */}
                      {!assignedSolicitor && (
                        <div
                          className='position-absolute'
                          style={{
                            top: '-2px',
                            left: '-2px',
                            right: '-2px',
                            bottom: '-2px',
                            background:
                              'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))',
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
                        <i className='fas fa-user text-slate-500'></i>
                      </div>
                      <select
                        className='form-select border-0 fw-medium'
                        style={{
                          backgroundColor: 'transparent',
                          fontSize: '1rem',
                          fontWeight: '500',
                          padding: '0.75rem 1rem',
                          color: !assignedSolicitor ? '#ef4444' : '#1e293b',
                        }}
                        onChange={(e) =>
                          updateSelectedSolicitor(e.target.value)
                        }
                        value={assignedSolicitor ? assignedSolicitor.id : ''}
                      >
                        <option value='' disabled>
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
                                  ? '#dbeafe'
                                  : 'transparent',
                              fontWeight:
                                solicitor.id === solicitor_id ? '600' : '400',
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
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '16px',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
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
                            'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))',
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
                            'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white',
                          boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)',
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
                          style={{ fontSize: '1rem' }}
                        >
                          Currently Assigned
                        </div>
                        <div className='text-success small'>
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
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                      backdropFilter: 'blur(10px)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-2px) scale(1.05)';
                      e.currentTarget.style.boxShadow =
                        '0 15px 35px rgba(59, 130, 246, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 20px rgba(59, 130, 246, 0.3)';
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
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))'
                      : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))',
                    borderRadius: '16px',
                    border: isError
                      ? '1px solid rgba(239, 68, 68, 0.2)'
                      : '1px solid rgba(34, 197, 94, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: isError ? '#dc2626' : '#059669',
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
                          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                          : 'linear-gradient(135deg, #22c55e, #16a34a)',
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

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
          }
          50% { 
            transform: translateY(-10px) rotate(2deg);
          }
        }
        
        @keyframes selectionGlow {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default SolicitorPart;
