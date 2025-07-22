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
        className='min-vh-100 d-flex justify-content-center align-items-center'
        style={{ background: 'var(--gradient-main-bg)' }}
      >
        <div className='text-center'>
          <div
            className='d-inline-flex align-items-center justify-content-center rounded-circle mb-3'
            style={{
              width: '80px',
              height: '80px',
              background:
                'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
              animation: 'float 2s ease-in-out infinite',
              boxShadow: '0 20px 40px var(--primary-30)',
            }}
          >
            <FaSpinner className='fa-spin' size={32} color='white' />
          </div>
          <h4 style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
            Loading Solicitors...
          </h4>
          <p style={{ color: 'var(--text-muted)' }}>
            Fetching your firm's directory
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className='min-vh-100'
      style={{ background: 'var(--gradient-main-bg)', marginTop: '150px' }}
    >
      <div className='container-fluid px-4 py-4'>
        {/* Navigation */}
        <div className='mb-4'>
          <BackToApplicationsIcon backUrl={-1} />
        </div>

        {/* Main Content Card */}
        <div
          className='position-relative overflow-hidden mb-4'
          style={{
            background: 'var(--gradient-surface)',
            border: '1px solid var(--border-primary)',
            borderRadius: '24px',
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
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.005)';
            e.currentTarget.style.boxShadow = `
              0 32px 64px var(--primary-20),
              0 16px 32px var(--primary-30),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = `
              0 20px 40px var(--primary-10),
              0 8px 16px var(--primary-20),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `;
          }}
        >
          {/* Animated Background Pattern */}
          <div
            className='position-absolute w-100 h-100'
            style={{
              background: `
                radial-gradient(circle at 20% 20%, var(--primary-20) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, var(--primary-30) 0%, transparent 50%)
              `,
              opacity: 0.3,
              animation: 'float 6s ease-in-out infinite',
            }}
          />

          {/* Premium Header */}
          <div
            className='px-4 py-4 d-flex align-items-center gap-3 position-relative'
            style={{
              background:
                'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
              color: 'var(--text-primary)',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-muted)',
              borderBottom: '1px solid var(--border-primary)',
            }}
          >
            {/* Icon with Micro-animation */}
            <div
              className='d-flex align-items-center justify-content-center rounded-circle position-relative'
              style={{
                width: '56px',
                height: '56px',
                background: 'var(--surface-tertiary)',
                border: '2px solid var(--border-muted)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                e.currentTarget.style.background = 'var(--surface-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.background = 'var(--surface-tertiary)';
              }}
            >
              <FaUsers size={20} style={{ color: 'var(--primary-blue)' }} />
              {/* Subtle glow effect */}
              <div
                className='position-absolute rounded-circle'
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

            <div className='flex-grow-1'>
              <h2
                className='fw-bold mb-2'
                style={{
                  fontSize: '1.6rem',
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Solicitors Management
              </h2>
              <div
                className='px-3 py-2 rounded-pill fw-semibold'
                style={{
                  background: 'var(--primary-20)',
                  fontSize: '0.9rem',
                  border: '1px solid var(--border-muted)',
                  display: 'inline-block',
                  backdropFilter: 'blur(10px)',
                  letterSpacing: '0.02em',
                  color: '#ffffff',
                }}
              >
                Manage your firm's directory
              </div>
            </div>

            {/* Status Badge */}
            <span
              className='px-4 py-3 rounded-pill text-white fw-bold d-flex align-items-center gap-2'
              style={{
                background:
                  totalSolicitors > 0
                    ? 'linear-gradient(135deg, var(--success-primary), var(--success-dark))'
                    : 'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))',
                fontSize: '0.9rem',
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
                <FaCheckCircle size={18} />
              ) : (
                <FaClock size={18} />
              )}
              {totalSolicitors > 0 ? 'Active' : 'Setup Required'}
            </span>
          </div>

          {/* Stats Section */}
          <div className='px-4 py-4'>
            <div className='row g-4 mb-4'>
              {stats.map((stat, index) => (
                <div key={index} className='col-md-4'>
                  <div
                    className='h-100 p-4 rounded-3 position-relative overflow-hidden'
                    style={{
                      background: 'var(--surface-secondary)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 4px 16px var(--primary-10)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-4px) scale(1.02)';
                      e.currentTarget.style.boxShadow =
                        '0 12px 32px var(--primary-20)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 16px var(--primary-10)';
                    }}
                  >
                    <div className='d-flex align-items-center gap-3'>
                      <div
                        className='rounded-circle d-flex align-items-center justify-content-center'
                        style={{
                          width: '48px',
                          height: '48px',
                          background: stat.bgColor,
                          color: stat.color,
                          boxShadow: `0 8px 16px ${stat.bgColor}`,
                        }}
                      >
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <div
                          className='fw-bold'
                          style={{
                            fontSize: '1.8rem',
                            color: 'var(--text-primary)',
                            lineHeight: 1,
                            marginBottom: '0.25rem',
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          className='small'
                          style={{
                            color: 'var(--text-muted)',
                            fontWeight: '500',
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

            {/* Status Messages */}
            {errors && (
              <div
                className={`alert border-0 text-center mx-auto mb-4 ${
                  isError ? 'alert-danger' : 'alert-success'
                }`}
                style={{
                  maxWidth: '600px',
                  borderRadius: '16px',
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
                    <FaExclamationTriangle size={18} />
                  ) : (
                    <FaCheckCircle size={18} />
                  )}
                  {renderErrors(errors)}
                </div>
              </div>
            )}

            {solicitorAddedMessage && (
              <div
                className='alert border-0 text-center mx-auto mb-4'
                style={{
                  maxWidth: '600px',
                  borderRadius: '16px',
                  background: 'var(--success-20)',
                  border: '1px solid var(--success-30)',
                  color: 'var(--success-primary)',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 24px var(--success-20)',
                }}
              >
                <div className='d-flex align-items-center justify-content-center gap-2'>
                  <FaCheckCircle size={18} />
                  {renderErrors(solicitorAddedMessage)}
                </div>
              </div>
            )}

            {/* Solicitors Grid */}
            <div className='row g-4'>
              {solicitors.map((solicitor, index) => (
                <div key={index} className='col-lg-6'>
                  <div
                    className='p-4 rounded-3 position-relative'
                    style={{
                      background: 'var(--surface-secondary)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 4px 16px var(--primary-10)',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 32px var(--primary-20)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 16px var(--primary-10)';
                    }}
                  >
                    {/* Solicitor Header */}
                    <div className='d-flex align-items-center justify-content-between mb-4'>
                      <div className='d-flex align-items-center gap-3'>
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center'
                          style={{
                            width: '40px',
                            height: '40px',
                            background:
                              'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                            color: 'white',
                            boxShadow: '0 8px 16px var(--primary-30)',
                          }}
                        >
                          <FaUserTie size={16} />
                        </div>
                        <div>
                          <h6
                            className='mb-0 fw-bold'
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {solicitor.title} {solicitor.first_name}{' '}
                            {solicitor.last_name}
                          </h6>
                          <small style={{ color: 'var(--text-muted)' }}>
                            Solicitor #{index + 1}
                          </small>
                        </div>
                      </div>
                      <button
                        className='btn btn-sm p-2'
                        style={{
                          background: 'var(--error-20)',
                          border: '1px solid var(--error-30)',
                          color: 'var(--error-primary)',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => removeItem(index)}
                        disabled={isAddingSolicitor}
                        onMouseEnter={(e) => {
                          if (!e.target.disabled) {
                            e.target.style.background = 'var(--error-primary)';
                            e.target.style.color = 'white';
                            e.target.style.transform = 'scale(1.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--error-20)';
                          e.target.style.color = 'var(--error-primary)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    {/* Fields Grid */}
                    <div className='row g-3'>
                      {/* Title Field */}
                      <div className='col-6'>
                        <label
                          className='form-label fw-semibold mb-2 d-flex align-items-center gap-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                          }}
                        >
                          <FaUserTag
                            size={12}
                            style={{ color: 'var(--primary-blue)' }}
                          />
                          Title
                        </label>
                        <div className='input-group'>
                          <select
                            className='form-control border-0'
                            style={{
                              background:
                                editMode === `solicitor_${index}_title`
                                  ? 'var(--warning-20)'
                                  : 'var(--surface-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.95rem',
                              fontWeight: '500',
                              borderRadius: '8px 0 0 8px',
                              boxShadow: '0 2px 8px var(--primary-10)',
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
                            className='btn px-3'
                            style={{
                              background:
                                editMode === `solicitor_${index}_title`
                                  ? 'var(--success-primary)'
                                  : 'var(--primary-blue)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0 8px 8px 0',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={() => {
                              if (editMode === `solicitor_${index}_title`) {
                                submitChangesHandler(index);
                              }
                              toggleEditMode(`solicitor_${index}_title`);
                            }}
                            disabled={isAddingSolicitor}
                            onMouseEnter={(e) => {
                              if (!e.target.disabled) {
                                e.target.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            {editMode === `solicitor_${index}_title` ? (
                              <FaSave size={14} />
                            ) : (
                              <FaEdit size={14} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* First Name Field */}
                      <div className='col-6'>
                        <label
                          className='form-label fw-semibold mb-2 d-flex align-items-center gap-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                          }}
                        >
                          <FaUser
                            size={12}
                            style={{ color: 'var(--success-primary)' }}
                          />
                          First Name
                        </label>
                        <div className='input-group'>
                          <input
                            type='text'
                            className='form-control border-0'
                            style={{
                              background:
                                editMode === `solicitor_${index}_first_name`
                                  ? 'var(--warning-20)'
                                  : 'var(--surface-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.95rem',
                              fontWeight: '500',
                              borderRadius: '8px 0 0 8px',
                              boxShadow: '0 2px 8px var(--primary-10)',
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
                            className='btn px-3'
                            style={{
                              background:
                                editMode === `solicitor_${index}_first_name`
                                  ? 'var(--success-primary)'
                                  : 'var(--primary-blue)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0 8px 8px 0',
                              transition: 'all 0.2s ease',
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
                              if (!e.target.disabled) {
                                e.target.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            {editMode === `solicitor_${index}_first_name` ? (
                              <FaSave size={14} />
                            ) : (
                              <FaEdit size={14} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Last Name Field */}
                      <div className='col-12'>
                        <label
                          className='form-label fw-semibold mb-2 d-flex align-items-center gap-2'
                          style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                          }}
                        >
                          <FaUser
                            size={12}
                            style={{ color: 'var(--success-primary)' }}
                          />
                          Last Name
                        </label>
                        <div className='input-group'>
                          <input
                            type='text'
                            className='form-control border-0'
                            style={{
                              background:
                                editMode === `solicitor_${index}_last_name`
                                  ? 'var(--warning-20)'
                                  : 'var(--surface-primary)',
                              color: 'var(--text-primary)',
                              fontSize: '0.95rem',
                              fontWeight: '500',
                              borderRadius: '8px 0 0 8px',
                              boxShadow: '0 2px 8px var(--primary-10)',
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
                            className='btn px-3'
                            style={{
                              background:
                                editMode === `solicitor_${index}_last_name`
                                  ? 'var(--success-primary)'
                                  : 'var(--primary-blue)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0 8px 8px 0',
                              transition: 'all 0.2s ease',
                            }}
                            onClick={() => {
                              if (editMode === `solicitor_${index}_last_name`) {
                                submitChangesHandler(index);
                              }
                              toggleEditMode(`solicitor_${index}_last_name`);
                            }}
                            onMouseEnter={(e) => {
                              if (!e.target.disabled) {
                                e.target.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            {editMode === `solicitor_${index}_last_name` ? (
                              <FaSave size={14} />
                            ) : (
                              <FaEdit size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading State for Updates */}
            {isAddingSolicitor && (
              <div className='text-center py-4'>
                <div
                  className='d-inline-flex align-items-center justify-content-center rounded-circle'
                  style={{
                    width: '60px',
                    height: '60px',
                    background:
                      'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                    boxShadow: '0 8px 24px var(--primary-30)',
                    animation: 'float 2s ease-in-out infinite',
                  }}
                >
                  <FaSpinner className='fa-spin' size={20} color='white' />
                </div>
                <p
                  className='mt-3 mb-0'
                  style={{ color: 'var(--text-muted)', fontWeight: '500' }}
                >
                  Updating solicitor information...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Futuristic Add New Solicitor Section */}
        <div className='row justify-content-center'>
          <div className='col-lg-10'>
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
                borderRadius: '24px',
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
                e.currentTarget.style.transform =
                  'translateY(-4px) scale(1.01)';
                e.currentTarget.style.boxShadow = `
                 0 40px 100px var(--primary-20),
                 0 16px 64px var(--primary-30),
                 inset 0 1px 0 rgba(255, 255, 255, 0.2)
               `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = `
                 0 20px 60px var(--primary-10),
                 0 8px 32px var(--primary-20),
                 inset 0 1px 0 rgba(255, 255, 255, 0.1)
               `;
              }}
            >
              {/* Animated Background Elements */}
              <div
                className='position-absolute'
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

              {/* Floating Orbs */}
              <div
                className='position-absolute'
                style={{
                  top: '20px',
                  right: '30px',
                  width: '60px',
                  height: '60px',
                  background:
                    'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                  borderRadius: '50%',
                  filter: 'blur(1px)',
                  opacity: 0.3,
                  animation: 'floatOrb 8s ease-in-out infinite',
                }}
              />
              <div
                className='position-absolute'
                style={{
                  bottom: '30px',
                  left: '40px',
                  width: '80px',
                  height: '80px',
                  background:
                    'linear-gradient(135deg, var(--success-primary), var(--success-dark))',
                  borderRadius: '50%',
                  filter: 'blur(2px)',
                  opacity: 0.2,
                  animation: 'floatOrb 12s ease-in-out infinite reverse',
                }}
              />

              <div className='p-5 position-relative'>
                {/* Holographic Header */}
                <div className='text-center mb-5'>
                  <div
                    className='d-inline-flex align-items-center justify-content-center rounded-circle position-relative mb-4'
                    style={{
                      width: '100px',
                      height: '100px',
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
                    <FaPlus size={32} color='white' />

                    {/* Holographic Rings */}
                    <div
                      className='position-absolute rounded-circle'
                      style={{
                        top: '-20px',
                        left: '-20px',
                        right: '-20px',
                        bottom: '-20px',
                        border: '2px solid var(--primary-blue)',
                        opacity: 0.3,
                        animation: 'ringPulse 3s ease-in-out infinite',
                      }}
                    />
                    <div
                      className='position-absolute rounded-circle'
                      style={{
                        top: '-40px',
                        left: '-40px',
                        right: '-40px',
                        bottom: '-40px',
                        border: '1px solid var(--success-primary)',
                        opacity: 0.2,
                        animation: 'ringPulse 3s ease-in-out infinite 0.5s',
                      }}
                    />
                  </div>

                  <h3
                    className='fw-bold mb-3'
                    style={{
                      background:
                        'linear-gradient(135deg, var(--primary-blue), var(--success-primary), var(--warning-primary))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontSize: '2.2rem',
                      letterSpacing: '-0.02em',
                      textShadow: '0 4px 12px var(--primary-20)',
                    }}
                  >
                    Add New Solicitor
                  </h3>
                  <p
                    className='mb-0'
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '1.1rem',
                      fontWeight: '400',
                    }}
                  >
                    Expand your legal team with advanced solicitor management
                  </p>
                </div>

                {/* Futuristic Form Grid */}
                <div className='row g-4 justify-content-center'>
                  <div className='col-md-4'>
                    {/* Title Field */}
                    <div
                      className='position-relative p-4 rounded-3'
                      style={{
                        background: 'var(--surface-secondary)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 8px 32px var(--primary-10)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(-8px) rotateX(5deg)';
                        e.currentTarget.style.boxShadow =
                          '0 20px 60px var(--primary-20)';
                        e.currentTarget.style.borderColor =
                          'var(--primary-blue)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(0) rotateX(0)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 32px var(--primary-10)';
                        e.currentTarget.style.borderColor =
                          'var(--border-subtle)';
                      }}
                    >
                      {/* Floating Label */}
                      <div
                        className='position-absolute d-flex align-items-center gap-2'
                        style={{
                          top: '-12px',
                          left: '20px',
                          background: 'var(--surface-primary)',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: '1px solid var(--border-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          boxShadow: '0 4px 16px var(--primary-10)',
                        }}
                      >
                        <FaUserTag
                          size={12}
                          style={{ color: 'var(--primary-blue)' }}
                        />
                        Title *
                      </div>

                      <select
                        className='form-control border-0 mt-2'
                        style={{
                          background: 'transparent',
                          color: 'var(--text-primary)',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          padding: '1rem 0',
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

                  <div className='col-md-4'>
                    {/* First Name Field */}
                    <div
                      className='position-relative p-4 rounded-3'
                      style={{
                        background: 'var(--surface-secondary)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 8px 32px var(--primary-10)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(-8px) rotateX(5deg)';
                        e.currentTarget.style.boxShadow =
                          '0 20px 60px var(--success-20)';
                        e.currentTarget.style.borderColor =
                          'var(--success-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(0) rotateX(0)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 32px var(--primary-10)';
                        e.currentTarget.style.borderColor =
                          'var(--border-subtle)';
                      }}
                    >
                      {/* Floating Label */}
                      <div
                        className='position-absolute d-flex align-items-center gap-2'
                        style={{
                          top: '-12px',
                          left: '20px',
                          background: 'var(--surface-primary)',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: '1px solid var(--border-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          boxShadow: '0 4px 16px var(--primary-10)',
                        }}
                      >
                        <FaUser
                          size={12}
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
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          padding: '1rem 0',
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

                  <div className='col-md-4'>
                    {/* Last Name Field */}
                    <div
                      className='position-relative p-4 rounded-3'
                      style={{
                        background: 'var(--surface-secondary)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 8px 32px var(--primary-10)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(-8px) rotateX(5deg)';
                        e.currentTarget.style.boxShadow =
                          '0 20px 60px var(--warning-20)';
                        e.currentTarget.style.borderColor =
                          'var(--warning-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(0) rotateX(0)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 32px var(--primary-10)';
                        e.currentTarget.style.borderColor =
                          'var(--border-subtle)';
                      }}
                    >
                      {/* Floating Label */}
                      <div
                        className='position-absolute d-flex align-items-center gap-2'
                        style={{
                          top: '-12px',
                          left: '20px',
                          background: 'var(--surface-primary)',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          border: '1px solid var(--border-primary)',
                          color: 'var(--text-primary)',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          boxShadow: '0 4px 16px var(--primary-10)',
                        }}
                      >
                        <FaUser
                          size={12}
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
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          padding: '1rem 0',
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

                {/* Quantum Submit Button */}
                <div className='text-center mt-5 pt-4'>
                  {!isAddingSolicitor ? (
                    <button
                      type='button'
                      className='btn position-relative overflow-hidden'
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
                        padding: '1.2rem 3rem',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        minWidth: '280px',
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
                        if (isSolicitorFormValid) {
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
                        if (isSolicitorFormValid) {
                          e.target.style.transform =
                            'perspective(1000px) translateY(0) rotateX(0) scale(1)';
                          e.target.style.boxShadow = `
                           0 20px 60px var(--primary-30), 
                           inset 0 2px 0 rgba(255, 255, 255, 0.2)
                         `;
                        }
                      }}
                    >
                      {/* Shimmer Effect */}
                      <div
                        className='position-absolute'
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

                      <div className='d-flex align-items-center gap-3 position-relative z-index-2'>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-circle'
                          style={{
                            width: '24px',
                            height: '24px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            animation: isSolicitorFormValid
                              ? 'iconPulse 2s infinite'
                              : 'none',
                          }}
                        >
                          <FaPlus size={12} />
                        </div>
                        <span>Create Solicitor</span>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-circle'
                          style={{
                            width: '24px',
                            height: '24px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            animation: isSolicitorFormValid
                              ? 'iconPulse 2s infinite 0.5s'
                              : 'none',
                          }}
                        >
                          <FaUsers size={12} />
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className='d-inline-flex flex-column align-items-center gap-3'>
                      {/* Quantum Loading Animation */}
                      <div className='position-relative'>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-circle'
                          style={{
                            width: '80px',
                            height: '80px',
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
                          <FaSpinner size={24} color='white' />
                        </div>

                        {/* Orbiting Elements */}
                        <div
                          className='position-absolute rounded-circle'
                          style={{
                            top: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '8px',
                            height: '8px',
                            background: 'var(--primary-blue)',
                            animation: 'orbit 3s linear infinite',
                          }}
                        />
                        <div
                          className='position-absolute rounded-circle'
                          style={{
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '6px',
                            height: '6px',
                            background: 'var(--success-primary)',
                            animation: 'orbit 3s linear infinite 1s',
                          }}
                        />
                        <div
                          className='position-absolute rounded-circle'
                          style={{
                            top: '50%',
                            right: '-10px',
                            transform: 'translateY(-50%)',
                            width: '4px',
                            height: '4px',
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
                            fontSize: '1.2rem',
                          }}
                        >
                          Processing Request
                        </h5>
                        <p
                          className='mb-0'
                          style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.95rem',
                          }}
                        >
                          Adding solicitor to your legal team...
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

      {/* CSS Animations */}
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
           transform: rotate(0deg) translateX(50px) rotate(0deg);
         }
         100% {
           transform: rotate(360deg) translateX(50px) rotate(-360deg);
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

       /* Futuristic glow effects */
       @keyframes neonGlow {
         0%, 100% {
           filter: drop-shadow(0 0 10px var(--primary-blue)) drop-shadow(0 0 20px var(--primary-blue)) drop-shadow(0 0 30px var(--primary-blue));
         }
         50% {
           filter: drop-shadow(0 0 20px var(--primary-blue)) drop-shadow(0 0 40px var(--primary-blue)) drop-shadow(0 0 60px var(--primary-blue));
         }
       }
     `}</style>
    </div>
  );
};

export default Solicitors;
