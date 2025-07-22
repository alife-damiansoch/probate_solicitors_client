import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaExclamationTriangle,
  FaPlus,
  FaSave,
  FaSpinner,
  FaTrash,
  FaUser,
  FaUsers,
  FaUserTag,
  FaUserTie,
} from 'react-icons/fa';
import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import {
  deleteData,
  fetchData,
  patchData,
  postData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const Solicitors = () => {
  const token = Cookies.get('auth_token');
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitors, setSolicitors] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isAddingSolicitor, setIsAddingSolicitor] = useState(false);
  const [solicitorAddedMessage, setSolicitorAddedMessage] = useState('');

  const [newSolicitor, setNewSolicitor] = useState({
    title: '',
    first_name: '',
    last_name: '',
  });

  const TITLE_CHOICES = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
  ];

  useEffect(() => {
    const fetchSolicitors = async () => {
      setIsLoading(true);
      if (token) {
        const endpoint = `/api/applications/solicitors/`;
        const response = await fetchData(token, endpoint);
        if (response.status === 200) {
          setSolicitors(response.data);
        } else {
          setErrors(response.data);
        }
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };

    fetchSolicitors();
  }, [token, refresh]);

  const handleNewSolicitorChange = (e, field) => {
    const value = e.target.value;
    setNewSolicitor({
      ...newSolicitor,
      [field]: value,
    });
  };

  const addSolicitor = async () => {
    setErrors(null);
    setIsError(false);
    if (!isSolicitorFormValid) return;

    const endpoint = `/api/applications/solicitors/`;
    setIsAddingSolicitor(true);
    const response = await postData(token, endpoint, newSolicitor);
    if (response.status === 201) {
      setSolicitors([...solicitors, response.data]);
      setNewSolicitor({
        title: '',
        first_name: '',
        last_name: '',
      });
      setIsError(false);
      setIsAddingSolicitor(false);
      setSolicitorAddedMessage([
        'Solicitor has been successfully added.',
        ' To continue with the application, click the back icon above.',
        'If you need to add more solicitors, you may do so before proceeding.',
      ]);
      setTimeout(() => {
        setSolicitorAddedMessage('');
      }, 8000);
      window.scrollTo(0, 0);
    } else {
      setErrors(response.data);
      setIsError(true);
      setIsAddingSolicitor(false);
      window.scrollTo(0, 0);
    }
  };

  const handleListChange = (e, index, field) => {
    const updatedSolicitors = [...solicitors];
    updatedSolicitors[index][field] = e.target.value;
    setSolicitors(updatedSolicitors);
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => (prev === field ? null : field));
  };

  const submitChangesHandler = async (index) => {
    setIsAddingSolicitor(true);
    setErrors(null);
    setIsError(false);
    const solicitor = solicitors[index];
    const endpoint = `/api/applications/solicitors/${solicitor.id}/`;
    const response = await patchData(endpoint, solicitor);
    if (response.status === 200) {
      setRefresh(!refresh);
      setEditMode(null);
      setErrors(null);
      setIsError(false);
      setIsAddingSolicitor(false);
    } else {
      setRefresh(!refresh);
      setErrors(response.data);
      setIsError(true);
      setIsAddingSolicitor(false);
    }
  };

  const removeItem = async (index) => {
    setIsAddingSolicitor(true);
    const solicitor = solicitors[index];
    const endpoint = `/api/applications/solicitors/${solicitor.id}/`;
    const response = await deleteData(endpoint);
    if (response.status === 204) {
      setRefresh(!refresh);
      setErrors(null);
      setIsError(false);
      setIsAddingSolicitor(false);
    } else {
      setErrors(response.data);
      setIsError(true);
      setIsAddingSolicitor(false);
    }
  };

  const isSolicitorFormValid =
    newSolicitor.title && newSolicitor.first_name && newSolicitor.last_name;

  const getFieldClassName = (field, isRequired = false) => {
    return `form-control border-0 ${
      isRequired &&
      !newSolicitor[field] &&
      Object.values(newSolicitor).some((value) => value !== '')
        ? 'border-2 border-danger'
        : ''
    }`;
  };

  // Calculate stats
  const totalSolicitors = solicitors.length;
  const completedProfiles = solicitors.filter(
    (s) => s.title && s.first_name && s.last_name
  ).length;

  const stats = [
    {
      label: 'Total Solicitors',
      value: totalSolicitors,
      icon: FaUsers,
      color: 'var(--primary-blue)',
      bgColor: 'var(--primary-20)',
    },
    {
      label: 'Complete Profiles',
      value: completedProfiles,
      icon: FaCheckCircle,
      color: 'var(--success-primary)',
      bgColor: 'var(--success-20)',
    },
    {
      label: 'Active Status',
      value: totalSolicitors > 0 ? 'Ready' : 'Setup',
      icon: totalSolicitors > 0 ? FaCheckCircle : FaClock,
      color:
        totalSolicitors > 0
          ? 'var(--success-primary)'
          : 'var(--warning-primary)',
      bgColor: totalSolicitors > 0 ? 'var(--success-20)' : 'var(--warning-20)',
    },
  ];

  if (isLoading) {
    return (
      <div
        className='min-vh-100 d-flex justify-content-center align-items-center px-3'
        style={{ background: 'var(--gradient-main-bg)' }}
      >
        <div className='text-center'>
          <div
            className='d-inline-flex align-items-center justify-content-center rounded-circle mb-3'
            style={{
              width: '60px',
              height: '60px',
              background:
                'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
              animation: 'float 2s ease-in-out infinite',
              boxShadow: '0 20px 40px var(--primary-30)',
            }}
          >
            <FaSpinner className='fa-spin' size={24} color='white' />
          </div>
          <h4
            className='h5 h-md-4'
            style={{ color: 'var(--text-primary)', fontWeight: '600' }}
          >
            Loading Solicitors...
          </h4>
          <p className='small' style={{ color: 'var(--text-muted)' }}>
            Fetching your firm's directory
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className='min-vh-100 pt-5 pt-md-0'
      style={{ background: 'var(--gradient-main-bg)', marginTop: '100px' }}
    >
      <div className='container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-4'>
        {/* Navigation */}
        <div className='mb-3 mb-md-4'>
          <BackToApplicationsIcon backUrl={-1} />
        </div>

        {/* Main Content Card */}
        <div
          className='position-relative overflow-hidden mb-3 mb-md-4'
          style={{
            background: 'var(--gradient-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '16px',
            boxShadow: `
              0 20px 40px var(--primary-10),
              0 8px 16px var(--primary-20),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateZ(0)',
          }}
          onMouseEnter={(e) => {
            if (window.innerWidth >= 768) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.005)';
              e.currentTarget.style.boxShadow = `
                0 32px 64px var(--primary-20),
                0 16px 32px var(--primary-30),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `;
            }
          }}
          onMouseLeave={(e) => {
            if (window.innerWidth >= 768) {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = `
                0 20px 40px var(--primary-10),
                0 8px 16px var(--primary-20),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `;
            }
          }}
        >
          {/* Animated Background Pattern */}
          <div
            className='position-absolute w-100 h-100 d-none d-md-block'
            style={{
              background: `
                radial-gradient(circle at 20% 20%, var(--primary-20) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, var(--primary-30) 0%, transparent 50%)
              `,
              opacity: 0.3,
              animation: 'float 6s ease-in-out infinite',
            }}
          />

          {/* Premium Header - Responsive */}
          <div
            className='px-3 px-md-4 py-3 py-md-4 d-flex flex-column flex-sm-row align-items-start align-sm-center gap-2 gap-sm-3 position-relative'
            style={{
              background:
                'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
              color: 'var(--text-primary)',
              borderTopLeftRadius: '14px',
              borderTopRightRadius: '14px',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-muted)',
              borderBottom: '1px solid var(--border-primary)',
            }}
          >
            {/* Icon with Micro-animation - Responsive sizing */}
            <div
              className='d-flex align-items-center justify-content-center rounded-circle position-relative flex-shrink-0'
              style={{
                width: '48px',
                height: '48px',
                background: 'var(--surface-tertiary)',
                border: '2px solid var(--border-muted)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                  e.currentTarget.style.background = 'var(--surface-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.background = 'var(--surface-tertiary)';
                }
              }}
            >
              <FaUsers size={18} style={{ color: 'var(--primary-blue)' }} />
              {/* Subtle glow effect - Hidden on mobile */}
              <div
                className='position-absolute rounded-circle d-none d-md-block'
                style={{
                  top: '-10px',
                  left: '-10px',
                  right: '-10px',
                  bottom: '-10px',
                  background: 'var(--primary-20)',
                  filter: 'blur(8px)',
                  zIndex: -1,
                }}
              />
            </div>

            <div className='flex-grow-1 min-w-0'>
              <h2
                className='fw-bold mb-1 mb-sm-2'
                style={{
                  fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                <span className='d-none d-sm-inline'>
                  Solicitors Management
                </span>
                <span className='d-inline d-sm-none'>Solicitors</span>
              </h2>
              <div
                className='px-2 px-sm-3 py-1 py-sm-2 rounded-pill fw-semibold'
                style={{
                  background: 'var(--primary-20)',
                  fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
                  border: '1px solid var(--border-muted)',
                  display: 'inline-block',
                  backdropFilter: 'blur(10px)',
                  letterSpacing: '0.02em',
                  color: '#ffffff',
                }}
              >
                <span className='d-none d-sm-inline'>
                  Manage your firm's directory
                </span>
                <span className='d-inline d-sm-none'>Firm directory</span>
              </div>
            </div>

            {/* Status Badge - Responsive */}
            <div className='flex-shrink-0 align-self-end align-self-sm-center'>
              <span
                className='px-2 px-sm-4 py-2 py-sm-3 rounded-pill text-white fw-bold d-flex align-items-center gap-1 gap-sm-2'
                style={{
                  background:
                    totalSolicitors > 0
                      ? 'linear-gradient(135deg, var(--success-primary), var(--success-dark))'
                      : 'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))',
                  fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
                  border: '1px solid var(--border-muted)',
                  backdropFilter: 'blur(10px)',
                  boxShadow:
                    totalSolicitors > 0
                      ? '0 8px 16px var(--success-20)'
                      : '0 8px 16px var(--warning-20)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  letterSpacing: '0.02em',
                }}
              >
                {totalSolicitors > 0 ? (
                  <FaCheckCircle size={14} />
                ) : (
                  <FaClock size={14} />
                )}
                <span className='d-none d-sm-inline'>
                  {totalSolicitors > 0 ? 'Active' : 'Setup Required'}
                </span>
                <span className='d-inline d-sm-none'>
                  {totalSolicitors > 0 ? 'OK' : 'Setup'}
                </span>
              </span>
            </div>
          </div>

          {/* Stats Section - Responsive Grid */}
          <div className='px-2 px-sm-3 px-md-4 py-3 py-md-4'>
            <div className='row g-2 g-sm-3 g-md-4 mb-3 mb-md-4'>
              {stats.map((stat, index) => (
                <div key={index} className='col-12 col-sm-6 col-lg-4'>
                  <div
                    className='h-100 p-3 p-md-4 rounded-3 position-relative overflow-hidden'
                    style={{
                      background: 'var(--surface-secondary)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 4px 16px var(--primary-10)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      minHeight: '80px',
                    }}
                    onMouseEnter={(e) => {
                      if (window.innerWidth >= 768) {
                        e.currentTarget.style.transform =
                          'translateY(-4px) scale(1.02)';
                        e.currentTarget.style.boxShadow =
                          '0 12px 32px var(--primary-20)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (window.innerWidth >= 768) {
                        e.currentTarget.style.transform =
                          'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 16px var(--primary-10)';
                      }
                    }}
                  >
                    <div className='d-flex align-items-center gap-2 gap-sm-3'>
                      <div
                        className='rounded-circle d-flex align-items-center justify-content-center flex-shrink-0'
                        style={{
                          width: '40px',
                          height: '40px',
                          background: stat.bgColor,
                          color: stat.color,
                          boxShadow: `0 8px 16px ${stat.bgColor}`,
                        }}
                      >
                        <stat.icon size={16} />
                      </div>
                      <div className='min-w-0'>
                        <div
                          className='fw-bold'
                          style={{
                            fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
                            color: 'var(--text-primary)',
                            lineHeight: 1,
                            marginBottom: '0.25rem',
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          className='small text-truncate'
                          style={{
                            color: 'var(--text-muted)',
                            fontWeight: '500',
                            fontSize: 'clamp(0.75rem, 3vw, 0.85rem)',
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Messages - Responsive */}
            {errors && (
              <div
                className={`alert border-0 text-center mx-auto mb-3 mb-md-4 ${
                  isError ? 'alert-danger' : 'alert-success'
                }`}
                style={{
                  maxWidth: '600px',
                  borderRadius: '12px',
                  background: isError ? 'var(--error-20)' : 'var(--success-20)',
                  border: `1px solid ${
                    isError ? 'var(--error-30)' : 'var(--success-30)'
                  }`,
                  color: isError
                    ? 'var(--error-primary)'
                    : 'var(--success-primary)',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  boxShadow: isError
                    ? '0 8px 24px var(--error-20)'
                    : '0 8px 24px var(--success-20)',
                }}
                role='alert'
              >
                <div className='d-flex align-items-center justify-content-center gap-2'>
                  {isError ? (
                    <FaExclamationTriangle size={16} />
                  ) : (
                    <FaCheckCircle size={16} />
                  )}
                  <div className='small'>{renderErrors(errors)}</div>
                </div>
              </div>
            )}

            {solicitorAddedMessage && (
              <div
                className='alert border-0 text-center mx-auto mb-3 mb-md-4'
                style={{
                  maxWidth: '600px',
                  borderRadius: '12px',
                  background: 'var(--success-20)',
                  border: '1px solid var(--success-30)',
                  color: 'var(--success-primary)',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 24px var(--success-20)',
                }}
              >
                <div className='d-flex align-items-center justify-content-center gap-2'>
                  <FaCheckCircle size={16} />
                  <div className='small'>
                    {renderErrors(solicitorAddedMessage)}
                  </div>
                </div>
              </div>
            )}

            {/* Solicitors Grid - Responsive */}
            <div className='row g-2 g-sm-3 g-md-4'>
              {solicitors.map((solicitor, index) => (
                <div key={index} className='col-12 col-lg-6'>
                  <div
                    className='p-3 p-md-4 rounded-3 position-relative'
                    style={{
                      background: 'var(--surface-secondary)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 4px 16px var(--primary-10)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (window.innerWidth >= 768) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 32px var(--primary-20)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (window.innerWidth >= 768) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 16px var(--primary-10)';
                      }
                    }}
                  >
                    {/* Solicitor Header - Responsive */}
                    <div className='d-flex align-items-start align-sm-center justify-content-between mb-3 mb-md-4 gap-2'>
                      <div className='d-flex align-items-center gap-2 gap-sm-3 min-w-0'>
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center flex-shrink-0'
                          style={{
                            width: '36px',
                            height: '36px',
                            background:
                              'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                            color: 'white',
                            boxShadow: '0 8px 16px var(--primary-30)',
                          }}
                        >
                          <FaUserTie size={14} />
                        </div>
                        <div className='min-w-0'>
                          <h6
                            className='mb-0 fw-bold text-truncate'
                            style={{
                              color: 'var(--text-primary)',
                              fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
                            }}
                          >
                            {solicitor.title} {solicitor.first_name}{' '}
                            {solicitor.last_name}
                          </h6>
                          <small
                            className='text-truncate d-block'
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Solicitor #{index + 1}
                          </small>
                        </div>
                      </div>
                      <button
                        className='btn btn-sm p-2 flex-shrink-0'
                        style={{
                          background: 'var(--error-20)',
                          border: '1px solid var(--error-30)',
                          color: 'var(--error-primary)',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          width: '32px',
                          height: '32px',
                        }}
                        onClick={() => removeItem(index)}
                        disabled={isAddingSolicitor}
                        onMouseEnter={(e) => {
                          if (!e.target.disabled && window.innerWidth >= 768) {
                            e.target.style.background = 'var(--error-primary)';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'scale(1.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (window.innerWidth >= 768) {
                            e.target.style.background = 'var(--error-20)';
                            e.target.style.color = 'var(--error-primary)';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>

                    {/* Fields Grid - Responsive */}
                    <div className='row g-2 g-sm-3'>
                      {/* Title Field - Responsive */}
                      <div className='col-12 col-sm-6'>
                        <label
                          className='form-label fw-semibold mb-2 d-flex align-items-center gap-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                          }}
                        >
                          <FaUserTag
                            size={10}
                            style={{ color: 'var(--primary-blue)' }}
                          />
                          Title
                        </label>
                        <div className='input-group input-group-sm'>
                          <select
                            className='form-control border-0'
                            style={{
                              background:
                                editMode === `solicitor_${index}_title`
                                  ? 'var(--warning-20)'
                                  : 'var(--surface-primary)',
                              color: 'var(--text-primary)',
                              fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                              fontWeight: '500',
                              borderRadius: '6px 0 0 6px',
                              boxShadow: '0 2px 8px var(--primary-10)',
                              padding: '0.5rem',
                            }}
                            value={solicitor.title}
                            onChange={(e) =>
                              handleListChange(e, index, 'title')
                            }
                            disabled={editMode !== `solicitor_${index}_title`}
                          >
                            {TITLE_CHOICES.map((choice) => (
                              <option key={choice.value} value={choice.value}>
                                {choice.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type='button'
                            className='btn px-2'
                            style={{
                              background:
                                editMode === `solicitor_${index}_title`
                                  ? 'var(--success-primary)'
                                  : 'var(--primary-blue)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0 6px 6px 0',
                              transition: 'all 0.2s ease',
                              fontSize: '0.8rem',
                            }}
                            onClick={() => {
                              if (editMode === `solicitor_${index}_title`) {
                                submitChangesHandler(index);
                              }
                              toggleEditMode(`solicitor_${index}_title`);
                            }}
                            disabled={isAddingSolicitor}
                            onMouseEnter={(e) => {
                              if (
                                !e.target.disabled &&
                                window.innerWidth >= 768
                              ) {
                                e.target.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (window.innerWidth >= 768) {
                                e.target.style.transform = 'scale(1)';
                              }
                            }}
                          >
                            {editMode === `solicitor_${index}_title` ? (
                              <FaSave size={12} />
                            ) : (
                              <FaEdit size={12} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* First Name Field - Responsive */}
                      <div className='col-12 col-sm-6'>
                        <label
                          className='form-label fw-semibold mb-2 d-flex align-items-center gap-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                          }}
                        >
                          <FaUser
                            size={10}
                            style={{ color: 'var(--success-primary)' }}
                          />
                          First Name
                        </label>
                        <div className='input-group input-group-sm'>
                          <input
                            type='text'
                            className='form-control border-0'
                            style={{
                              background:
                                editMode === `solicitor_${index}_first_name`
                                  ? 'var(--warning-20)'
                                  : 'var(--surface-primary)',
                              color: 'var(--text-primary)',
                              fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                              fontWeight: '500',
                              borderRadius: '6px 0 0 6px',
                              boxShadow: '0 2px 8px var(--primary-10)',
                              padding: '0.5rem',
                            }}
                            value={solicitor.first_name}
                            onChange={(e) =>
                              handleListChange(e, index, 'first_name')
                            }
                            readOnly={
                              editMode !== `solicitor_${index}_first_name`
                            }
                          />
                          <button
                            type='button'
                            className='btn px-2'
                            style={{
                              background:
                                editMode === `solicitor_${index}_first_name`
                                  ? 'var(--success-primary)'
                                  : 'var(--primary-blue)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0 6px 6px 0',
                              transition: 'all 0.2s ease',
                              fontSize: '0.8rem',
                            }}
                            onClick={() => {
                              if (
                                editMode === `solicitor_${index}_first_name`
                              ) {
                                submitChangesHandler(index);
                              }
                              toggleEditMode(`solicitor_${index}_first_name`);
                            }}
                            onMouseEnter={(e) => {
                              if (
                                !e.target.disabled &&
                                window.innerWidth >= 768
                              ) {
                                e.target.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (window.innerWidth >= 768) {
                                e.target.style.transform = 'scale(1)';
                              }
                            }}
                          >
                            {editMode === `solicitor_${index}_first_name` ? (
                              <FaSave size={12} />
                            ) : (
                              <FaEdit size={12} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Last Name Field - Responsive */}
                      <div className='col-12'>
                        <label
                          className='form-label fw-semibold mb-2 d-flex align-items-center gap-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'clamp(0.8rem, 3vw, 0.9rem)',
                          }}
                        >
                          <FaUser
                            size={10}
                            style={{ color: 'var(--success-primary)' }}
                          />
                          Last Name
                        </label>
                        <div className='input-group input-group-sm'>
                          <input
                            type='text'
                            className='form-control border-0'
                            style={{
                              background:
                                editMode === `solicitor_${index}_last_name`
                                  ? 'var(--warning-20)'
                                  : 'var(--surface-primary)',
                              color: 'var(--text-primary)',
                              fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                              fontWeight: '500',
                              borderRadius: '6px 0 0 6px',
                              boxShadow: '0 2px 8px var(--primary-10)',
                              padding: '0.5rem',
                            }}
                            value={solicitor.last_name}
                            onChange={(e) =>
                              handleListChange(e, index, 'last_name')
                            }
                            readOnly={
                              editMode !== `solicitor_${index}_last_name`
                            }
                          />
                          <button
                            type='button'
                            className='btn px-2'
                            style={{
                              background:
                                editMode === `solicitor_${index}_last_name`
                                  ? 'var(--success-primary)'
                                  : 'var(--primary-blue)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0 6px 6px 0',
                              transition: 'all 0.2s ease',
                              fontSize: '0.8rem',
                            }}
                            onClick={() => {
                              if (editMode === `solicitor_${index}_last_name`) {
                                submitChangesHandler(index);
                              }
                              toggleEditMode(`solicitor_${index}_last_name`);
                            }}
                            onMouseEnter={(e) => {
                              if (
                                !e.target.disabled &&
                                window.innerWidth >= 768
                              ) {
                                e.target.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (window.innerWidth >= 768) {
                                e.target.style.transform = 'scale(1)';
                              }
                            }}
                          >
                            {editMode === `solicitor_${index}_last_name` ? (
                              <FaSave size={12} />
                            ) : (
                              <FaEdit size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading State for Updates - Responsive */}
            {isAddingSolicitor && (
              <div className='text-center py-3 py-md-4'>
                <div
                  className='d-inline-flex align-items-center justify-content-center rounded-circle'
                  style={{
                    width: '50px',
                    height: '50px',
                    background:
                      'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                    boxShadow: '0 8px 24px var(--primary-30)',
                    animation: 'float 2s ease-in-out infinite',
                  }}
                >
                  <FaSpinner className='fa-spin' size={18} color='white' />
                </div>
                <p
                  className='mt-2 mb-0 small'
                  style={{ color: 'var(--text-muted)', fontWeight: '500' }}
                >
                  Updating solicitor information...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Futuristic Add New Solicitor Section - Mobile Optimized */}
        <div className='row justify-content-center'>
          <div className='col-12 col-lg-10'>
            <div
              className='position-relative overflow-hidden'
              style={{
                background: `
                linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.03) 0%, 
                  rgba(139, 92, 246, 0.05) 25%,
                  rgba(236, 72, 153, 0.03) 50%,
                  rgba(59, 130, 246, 0.05) 75%,
                  rgba(139, 92, 246, 0.03) 100%
                )
              `,
                border: '1px solid var(--border-primary)',
                borderRadius: '16px',
                boxShadow: `
                0 20px 60px var(--primary-10),
                0 8px 32px var(--primary-20),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
                backdropFilter: 'blur(40px)',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                marginBottom: '2rem',
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.transform =
                    'translateY(-4px) scale(1.01)';
                  e.currentTarget.style.boxShadow = `
                  0 40px 100px var(--primary-20),
                  0 16px 64px var(--primary-30),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `;
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `
                  0 20px 60px var(--primary-10),
                  0 8px 32px var(--primary-20),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `;
                }
              }}
            >
              {/* Animated Background Elements - Hidden on small screens */}
              <div
                className='position-absolute d-none d-md-block'
                style={{
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `
                  radial-gradient(circle at 20% 30%, var(--primary-20) 0%, transparent 40%),
                  radial-gradient(circle at 80% 70%, var(--success-20) 0%, transparent 40%),
                  radial-gradient(circle at 40% 80%, var(--warning-20) 0%, transparent 40%)
                `,
                  opacity: 0.6,
                  animation: 'rotateBackground 20s linear infinite',
                  pointerEvents: 'none',
                }}
              />

              {/* Floating Orbs - Hidden on small screens */}
              <div
                className='position-absolute d-none d-lg-block'
                style={{
                  top: '20px',
                  right: '30px',
                  width: '40px',
                  height: '40px',
                  background:
                    'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                  borderRadius: '50%',
                  filter: 'blur(1px)',
                  opacity: 0.3,
                  animation: 'floatOrb 8s ease-in-out infinite',
                }}
              />
              <div
                className='position-absolute d-none d-lg-block'
                style={{
                  bottom: '30px',
                  left: '40px',
                  width: '60px',
                  height: '60px',
                  background:
                    'linear-gradient(135deg, var(--success-primary), var(--success-dark))',
                  borderRadius: '50%',
                  filter: 'blur(2px)',
                  opacity: 0.2,
                  animation: 'floatOrb 12s ease-in-out infinite reverse',
                }}
              />

              <div className='p-3 p-sm-4 p-md-5 position-relative'>
                {/* Holographic Header - Mobile Optimized */}
                <div className='text-center mb-4 mb-md-5'>
                  <div
                    className='d-inline-flex align-items-center justify-content-center rounded-circle position-relative mb-3 mb-md-4'
                    style={{
                      width: 'clamp(60px, 15vw, 100px)',
                      height: 'clamp(60px, 15vw, 100px)',
                      background: `
                      linear-gradient(135deg, 
                        var(--primary-blue) 0%, 
                        var(--success-primary) 50%, 
                        var(--warning-primary) 100%
                      )
                    `,
                      boxShadow: `
                      0 20px 60px var(--primary-30),
                      inset 0 2px 0 rgba(255, 255, 255, 0.3)
                    `,
                      animation: 'hologramPulse 4s ease-in-out infinite',
                    }}
                  >
                    <FaPlus
                      size={window.innerWidth < 768 ? 20 : 32}
                      color='white'
                    />

                    {/* Holographic Rings - Hidden on mobile */}
                    <div
                      className='position-absolute rounded-circle d-none d-sm-block'
                      style={{
                        top: '-15px',
                        left: '-15px',
                        right: '-15px',
                        bottom: '-15px',
                        border: '2px solid var(--primary-blue)',
                        opacity: 0.3,
                        animation: 'ringPulse 3s ease-in-out infinite',
                      }}
                    />
                    <div
                      className='position-absolute rounded-circle d-none d-md-block'
                      style={{
                        top: '-30px',
                        left: '-30px',
                        right: '-30px',
                        bottom: '-30px',
                        border: '1px solid var(--success-primary)',
                        opacity: 0.2,
                        animation: 'ringPulse 3s ease-in-out infinite 0.5s',
                      }}
                    />
                  </div>

                  <h3
                    className='fw-bold mb-2 mb-sm-3'
                    style={{
                      background:
                        'linear-gradient(135deg, var(--primary-blue), var(--success-primary), var(--warning-primary))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
                      letterSpacing: '-0.02em',
                      textShadow: '0 4px 12px var(--primary-20)',
                    }}
                  >
                    <span className='d-none d-sm-inline'>
                      Add New Solicitor
                    </span>
                    <span className='d-inline d-sm-none'>Add Solicitor</span>
                  </h3>
                  <p
                    className='mb-0 small'
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
                      fontWeight: '400',
                    }}
                  >
                    <span className='d-none d-sm-inline'>
                      Expand your legal team with advanced solicitor management
                    </span>
                    <span className='d-inline d-sm-none'>
                      Expand your legal team
                    </span>
                  </p>
                </div>

                {/* Futuristic Form Grid - Mobile Optimized */}
                <div className='row g-3 g-md-4 justify-content-center'>
                  <div className='col-12 col-md-4'>
                    {/* Title Field - Mobile Responsive */}
                    <div
                      className='position-relative p-3 p-md-4 rounded-3'
                      style={{
                        background: 'var(--surface-secondary)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 8px 32px var(--primary-10)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        if (window.innerWidth >= 768) {
                          e.currentTarget.style.transform =
                            'translateY(-8px) rotateX(5deg)';
                          e.currentTarget.style.boxShadow =
                            '0 20px 60px var(--primary-20)';
                          e.currentTarget.style.borderColor =
                            'var(--primary-blue)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth >= 768) {
                          e.currentTarget.style.transform =
                            'translateY(0) rotateX(0)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 32px var(--primary-10)';
                          e.currentTarget.style.borderColor =
                            'var(--border-subtle)';
                        }
                      }}
                    >
                      {/* Floating Label - Mobile Optimized */}
                      <div
                        className='position-absolute d-flex align-items-center gap-1 gap-sm-2'
                        style={{
                          top: '-8px',
                          left: '15px',
                          background: 'var(--surface-primary)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '15px',
                          border: '1px solid var(--border-primary)',
                          color: 'var(--text-primary)',
                          fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
                          fontWeight: '600',
                          boxShadow: '0 4px 16px var(--primary-10)',
                        }}
                      >
                        <FaUserTag
                          size={10}
                          style={{ color: 'var(--primary-blue)' }}
                        />
                        Title *
                      </div>

                      <select
                        className='form-control border-0 mt-2'
                        style={{
                          background: 'transparent',
                          color: 'var(--text-primary)',
                          fontSize: 'clamp(1rem, 4vw, 1.1rem)',
                          fontWeight: '600',
                          padding: 'clamp(0.5rem, 3vw, 1rem) 0',
                          boxShadow: 'none',
                          borderBottom: '2px solid var(--border-primary)',
                          borderRadius: '0',
                          transition: 'all 0.3s ease',
                        }}
                        value={newSolicitor.title}
                        onChange={(e) => handleNewSolicitorChange(e, 'title')}
                        onFocus={(e) => {
                          e.target.style.borderBottomColor =
                            'var(--primary-blue)';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderBottomColor =
                            'var(--border-primary)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <option
                          value=''
                          style={{
                            background: 'var(--surface-primary)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          Select Title
                        </option>
                        {TITLE_CHOICES.map((choice) => (
                          <option
                            key={choice.value}
                            value={choice.value}
                            style={{
                              background: 'var(--surface-primary)',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {choice.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='col-12 col-md-4'>
                    {/* First Name Field - Mobile Responsive */}
                    <div
                      className='position-relative p-3 p-md-4 rounded-3'
                      style={{
                        background: 'var(--surface-secondary)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 8px 32px var(--primary-10)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        if (window.innerWidth >= 768) {
                          e.currentTarget.style.transform =
                            'translateY(-8px) rotateX(5deg)';
                          e.currentTarget.style.boxShadow =
                            '0 20px 60px var(--success-20)';
                          e.currentTarget.style.borderColor =
                            'var(--success-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth >= 768) {
                          e.currentTarget.style.transform =
                            'translateY(0) rotateX(0)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 32px var(--primary-10)';
                          e.currentTarget.style.borderColor =
                            'var(--border-subtle)';
                        }
                      }}
                    >
                      {/* Floating Label - Mobile Optimized */}
                      <div
                        className='position-absolute d-flex align-items-center gap-1 gap-sm-2'
                        style={{
                          top: '-8px',
                          left: '15px',
                          background: 'var(--surface-primary)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '15px',
                          border: '1px solid var(--border-primary)',
                          color: 'var(--text-primary)',
                          fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
                          fontWeight: '600',
                          boxShadow: '0 4px 16px var(--primary-10)',
                        }}
                      >
                        <FaUser
                          size={10}
                          style={{ color: 'var(--success-primary)' }}
                        />
                        First Name *
                      </div>

                      <input
                        type='text'
                        className='form-control border-0 mt-2'
                        style={{
                          background: 'transparent',
                          color: 'var(--text-primary)',
                          fontSize: 'clamp(1rem, 4vw, 1.1rem)',
                          fontWeight: '600',
                          padding: 'clamp(0.5rem, 3vw, 1rem) 0',
                          boxShadow: 'none',
                          borderBottom: '2px solid var(--border-primary)',
                          borderRadius: '0',
                          transition: 'all 0.3s ease',
                        }}
                        value={newSolicitor.first_name}
                        onChange={(e) =>
                          handleNewSolicitorChange(e, 'first_name')
                        }
                        placeholder='Enter first name'
                        onFocus={(e) => {
                          e.target.style.borderBottomColor =
                            'var(--success-primary)';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderBottomColor =
                            'var(--border-primary)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  </div>

                  <div className='col-12 col-md-4'>
                    {/* Last Name Field - Mobile Responsive */}
                    <div
                      className='position-relative p-3 p-md-4 rounded-3'
                      style={{
                        background: 'var(--surface-secondary)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 8px 32px var(--primary-10)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        if (window.innerWidth >= 768) {
                          e.currentTarget.style.transform =
                            'translateY(-8px) rotateX(5deg)';
                          e.currentTarget.style.boxShadow =
                            '0 20px 60px var(--warning-20)';
                          e.currentTarget.style.borderColor =
                            'var(--warning-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth >= 768) {
                          e.currentTarget.style.transform =
                            'translateY(0) rotateX(0)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 32px var(--primary-10)';
                          e.currentTarget.style.borderColor =
                            'var(--border-subtle)';
                        }
                      }}
                    >
                      {/* Floating Label - Mobile Optimized */}
                      <div
                        className='position-absolute d-flex align-items-center gap-1 gap-sm-2'
                        style={{
                          top: '-8px',
                          left: '15px',
                          background: 'var(--surface-primary)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '15px',
                          border: '1px solid var(--border-primary)',
                          color: 'var(--text-primary)',
                          fontSize: 'clamp(0.75rem, 3vw, 0.9rem)',
                          fontWeight: '600',
                          boxShadow: '0 4px 16px var(--primary-10)',
                        }}
                      >
                        <FaUser
                          size={10}
                          style={{ color: 'var(--warning-primary)' }}
                        />
                        Last Name *
                      </div>

                      <input
                        type='text'
                        className='form-control border-0 mt-2'
                        style={{
                          background: 'transparent',
                          color: 'var(--text-primary)',
                          fontSize: 'clamp(1rem, 4vw, 1.1rem)',
                          fontWeight: '600',
                          padding: 'clamp(0.5rem, 3vw, 1rem) 0',
                          boxShadow: 'none',
                          borderBottom: '2px solid var(--border-primary)',
                          borderRadius: '0',
                          transition: 'all 0.3s ease',
                        }}
                        value={newSolicitor.last_name}
                        onChange={(e) =>
                          handleNewSolicitorChange(e, 'last_name')
                        }
                        placeholder='Enter last name'
                        onFocus={(e) => {
                          e.target.style.borderBottomColor =
                            'var(--warning-primary)';
                          e.target.style.transform = 'scale(1.02)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderBottomColor =
                            'var(--border-primary)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quantum Submit Button - Mobile Optimized */}
                <div className='text-center mt-4 mt-md-5 pt-3 pt-md-4'>
                  {!isAddingSolicitor ? (
                    <button
                      type='button'
                      className='btn position-relative overflow-hidden w-100 w-sm-auto'
                      style={{
                        background: isSolicitorFormValid
                          ? `linear-gradient(135deg, 
                            var(--success-primary) 0%, 
                            var(--primary-blue) 50%, 
                            var(--warning-primary) 100%
                          )`
                          : 'linear-gradient(135deg, var(--text-disabled), var(--text-muted))',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50px',
                        padding:
                          'clamp(0.8rem, 3vw, 1.2rem) clamp(2rem, 6vw, 3rem)',
                        fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        minWidth: '200px',
                        maxWidth: '280px',
                        cursor: isSolicitorFormValid
                          ? 'pointer'
                          : 'not-allowed',
                        boxShadow: isSolicitorFormValid
                          ? `0 20px 60px var(--primary-30), 
                           inset 0 2px 0 rgba(255, 255, 255, 0.2)`
                          : '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: 'perspective(1000px)',
                      }}
                      onClick={addSolicitor}
                      disabled={!isSolicitorFormValid}
                      onMouseEnter={(e) => {
                        if (isSolicitorFormValid && window.innerWidth >= 768) {
                          e.target.style.transform =
                            'perspective(1000px) translateY(-8px) rotateX(10deg) scale(1.05)';
                          e.target.style.boxShadow = `
                          0 40px 100px var(--primary-40), 
                          inset 0 2px 0 rgba(255, 255, 255, 0.3),
                          0 0 80px var(--primary-20)
                        `;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isSolicitorFormValid && window.innerWidth >= 768) {
                          e.target.style.transform =
                            'perspective(1000px) translateY(0) rotateX(0) scale(1)';
                          e.target.style.boxShadow = `
                          0 20px 60px var(--primary-30), 
                          inset 0 2px 0 rgba(255, 255, 255, 0.2)
                        `;
                        }
                      }}
                    >
                      {/* Shimmer Effect - Reduced on mobile */}
                      <div
                        className='position-absolute d-none d-sm-block'
                        style={{
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: isSolicitorFormValid
                            ? `linear-gradient(90deg, 
                              transparent 0%, 
                              rgba(255, 255, 255, 0.4) 50%, 
                              transparent 100%
                              )`
                            : 'none',
                          animation: isSolicitorFormValid
                            ? 'shimmer 2s infinite'
                            : 'none',
                          pointerEvents: 'none',
                        }}
                      />

                      <div className='d-flex align-items-center justify-content-center gap-2 gap-sm-3 position-relative z-index-2'>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-circle'
                          style={{
                            width: '20px',
                            height: '20px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            animation: isSolicitorFormValid
                              ? 'iconPulse 2s infinite'
                              : 'none',
                          }}
                        >
                          <FaPlus size={10} />
                        </div>
                        <span className='d-none d-sm-inline'>
                          Create Solicitor
                        </span>
                        <span className='d-inline d-sm-none'>Create</span>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-circle'
                          style={{
                            width: '20px',
                            height: '20px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            animation: isSolicitorFormValid
                              ? 'iconPulse 2s infinite 0.5s'
                              : 'none',
                          }}
                        >
                          <FaUsers size={10} />
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className='d-inline-flex flex-column align-items-center gap-2 gap-sm-3'>
                      {/* Quantum Loading Animation - Mobile Optimized */}
                      <div className='position-relative'>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-circle'
                          style={{
                            width: 'clamp(60px, 15vw, 80px)',
                            height: 'clamp(60px, 15vw, 80px)',
                            background: `
                            linear-gradient(135deg, 
                              var(--primary-blue) 0%, 
                              var(--success-primary) 50%, 
                              var(--warning-primary) 100%
                            )
                          `,
                            boxShadow: '0 20px 60px var(--primary-30)',
                            animation: 'quantumSpin 2s linear infinite',
                          }}
                        >
                          <FaSpinner
                            size={window.innerWidth < 768 ? 18 : 24}
                            color='white'
                          />
                        </div>

                        {/* Orbiting Elements - Reduced on mobile */}
                        <div
                          className='position-absolute rounded-circle'
                          style={{
                            top: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '6px',
                            height: '6px',
                            background: 'var(--primary-blue)',
                            animation: 'orbit 3s linear infinite',
                          }}
                        />
                        <div
                          className='position-absolute rounded-circle d-none d-sm-block'
                          style={{
                            bottom: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '4px',
                            height: '4px',
                            background: 'var(--success-primary)',
                            animation: 'orbit 3s linear infinite 1s',
                          }}
                        />
                        <div
                          className='position-absolute rounded-circle d-none d-sm-block'
                          style={{
                            top: '50%',
                            right: '-8px',
                            transform: 'translateY(-50%)',
                            width: '3px',
                            height: '3px',
                            background: 'var(--warning-primary)',
                            animation: 'orbit 3s linear infinite 2s',
                          }}
                        />
                      </div>

                      <div className='text-center'>
                        <h5
                          className='mb-1'
                          style={{
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                            fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                          }}
                        >
                          Processing Request
                        </h5>
                        <p
                          className='mb-0 small'
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: 'clamp(0.8rem, 3vw, 0.95rem)',
                          }}
                        >
                          <span className='d-none d-sm-inline'>
                            Adding solicitor to your legal team...
                          </span>
                          <span className='d-inline d-sm-none'>
                            Adding solicitor...
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations - Optimized */}
      <style>{`
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-8px) rotate(2deg);
        }
      }

      @keyframes fa-spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(359deg);
        }
      }

      @keyframes rotateBackground {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes floatOrb {
        0%, 100% {
          transform: translateY(0px) translateX(0px);
        }
        33% {
          transform: translateY(-20px) translateX(10px);
        }
        66% {
          transform: translateY(10px) translateX(-15px);
        }
      }

      @keyframes hologramPulse {
        0%, 100% {
          box-shadow: 0 20px 60px var(--primary-30), inset 0 2px 0 rgba(255, 255, 255, 0.3);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 30px 80px var(--primary-40), inset 0 2px 0 rgba(255, 255, 255, 0.5);
          transform: scale(1.05);
        }
      }

      @keyframes ringPulse {
        0% {
          transform: scale(1);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.6;
        }
        100% {
          transform: scale(1);
          opacity: 0.3;
        }
      }

      @keyframes shimmer {
        0% {
          left: -100%;
        }
        100% {
          left: 100%;
        }
      }

      @keyframes iconPulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
      }

      @keyframes quantumSpin {
        0% {
          transform: rotate(0deg) scale(1);
        }
        50% {
          transform: rotate(180deg) scale(1.1);
        }
        100% {
          transform: rotate(360deg) scale(1);
        }
      }

      @keyframes orbit {
        0% {
          transform: rotate(0deg) translateX(30px) rotate(0deg);
        }
        100% {
          transform: rotate(360deg) translateX(30px) rotate(-360deg);
        }
      }

      .fa-spin {
        animation: fa-spin 1s infinite linear;
      }

      /* Enhanced focus states */
      .form-control:focus {
        outline: none !important;
      }

      /* Smooth transitions for all interactive elements */
      .btn, .form-control, .input-group {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }

      /* Custom scrollbar for the page */
      body::-webkit-scrollbar {
        width: 8px;
      }

      body::-webkit-scrollbar-track {
        background: var(--scrollbar-track);
      }

      body::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: 4px;
      }

      body::-webkit-scrollbar-thumb:hover {
        background: var(--scrollbar-thumb-hover);
      }

      /* Remove webkit autofill styles */
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      select:-webkit-autofill,
      select:-webkit-autofill:hover,
      select:-webkit-autofill:focus {
        -webkit-text-fill-color: var(--text-primary) !important;
        -webkit-box-shadow: 0 0 0px 1000px var(--surface-primary) inset !important;
        transition: background-color 5000s ease-in-out 0s !important;
      }

      /* Modern selection styling */
      ::selection {
        background: var(--primary-30);
        color: var(--text-primary);
      }

      ::-moz-selection {
        background: var(--primary-30);
        color: var(--text-primary);
      }

      /* Mobile-specific optimizations */
      @media (max-width: 767.98px) {
        .fa-spin {
          animation-duration: 1.5s;
        }
        
        .hologramPulse {
          animation-duration: 6s;
        }
        
        .rotateBackground {
          animation: none;
        }
        
        .floatOrb {
          animation: none;
        }
      }

      /* Reduce motion for users who prefer it */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Touch device optimizations */
      @media (hover: none) and (pointer: coarse) {
        .btn:hover,
        .card:hover,
        [onMouseEnter]:hover {
          transform: none !important;
          box-shadow: inherit !important;
        }
      }
    `}</style>
    </div>
  );
};

export default Solicitors;
