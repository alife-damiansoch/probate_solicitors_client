import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSave, FaTrash, FaUsers } from 'react-icons/fa';
import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
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
  const [editMode, setEditMode] = useState(null); // Changed to null to represent no field in edit mode
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isAddingSolicitor, setIsAddingSolicitor] = useState(false);
  const [solicitorAddedMessage, setSolicitorAddedMessage] = useState('');

  const [newSolicitor, setNewSolicitor] = useState({
    title: '',
    first_name: '',
    last_name: '',
    own_email: '',
    own_phone_number: '',
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
          setIsLoading(false);
        } else {
          setErrors(response.data);
          setIsLoading(false);
        }
      }
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
        own_email: '',
        own_phone_number: '',
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
    // If the field is already in edit mode, disable it; otherwise, enable it and disable others
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
      setEditMode(null); // Exit edit mode after submitting changes
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

  // Update form validation to only require certain fields
  const isSolicitorFormValid =
    newSolicitor.title && newSolicitor.first_name && newSolicitor.last_name;

  const getFieldClassName = (field, isRequired = false) => {
    // Add red border styling only to required fields when empty
    return `form-control border-0 ${
      isRequired &&
      !newSolicitor[field] &&
      Object.values(newSolicitor).some((value) => value !== '')
        ? 'border-2 border-danger'
        : ''
    }`;
  };

  return (
    <div className='min-vh-100' style={{ backgroundColor: '#f8fafc' }}>
      {isLoading ? (
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
          <LoadingComponent />
        </div>
      ) : (
        <div className='container-fluid px-4 py-4'>
          {/* Navigation */}
          <div className='mb-4'>
            <BackToApplicationsIcon backUrl={-1} />
          </div>

          {/* Main Card */}
          <div
            className='card border-0 mb-4'
            style={{
              borderRadius: '16px',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              className='card-header border-0 text-white'
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                padding: '2rem',
              }}
            >
              <div className='d-flex align-items-center'>
                <div
                  className='rounded-circle d-flex align-items-center justify-content-center me-3'
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <FaUsers size={20} />
                </div>
                <div>
                  <h2 className='mb-0 fw-bold'>Solicitors Management</h2>
                  <p className='mb-0 opacity-75'>
                    Manage your firm's solicitor directory
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className='card-body' style={{ padding: '2rem' }}>
              {/* Status Messages */}
              {errors && (
                <div
                  className={`alert border-0 text-center mx-auto mb-4 ${
                    isError ? 'alert-danger' : 'alert-success'
                  }`}
                  style={{
                    maxWidth: '600px',
                    borderRadius: '12px',
                    boxShadow: isError
                      ? '0 4px 6px rgba(239, 68, 68, 0.1)'
                      : '0 4px 6px rgba(34, 197, 94, 0.1)',
                    backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
                    color: isError ? '#dc2626' : '#16a34a',
                    fontWeight: '500',
                  }}
                  role='alert'
                >
                  <div className='d-flex align-items-center justify-content-center'>
                    <i
                      className={`fas ${
                        isError ? 'fa-exclamation-triangle' : 'fa-check-circle'
                      } me-2`}
                    ></i>
                    {renderErrors(errors)}
                  </div>
                </div>
              )}

              {solicitorAddedMessage && (
                <div
                  className='alert alert-success border-0 text-center mx-auto mb-4'
                  style={{
                    maxWidth: '600px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(34, 197, 94, 0.1)',
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    fontWeight: '500',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-center'>
                    <i className='fas fa-check-circle me-2'></i>
                    {renderErrors(solicitorAddedMessage)}
                  </div>
                </div>
              )}

              {/* Solicitors List */}
              {solicitors.map((solicitor, index) => (
                <div
                  key={index}
                  className='mb-3 p-4 rounded-3'
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow =
                      '0 4px 8px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow =
                      '0 2px 4px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className='row g-3 align-items-end'>
                    {/* Title */}
                    <div className='col-md-2'>
                      <label className='form-label fw-semibold text-slate-700 mb-2'>
                        <i className='fas fa-user-tag me-2 text-purple-500'></i>
                        Title
                      </label>
                      <div
                        className='input-group'
                        style={{
                          borderRadius: '10px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <select
                          className={`form-control border-0 ${
                            editMode === `solicitor_${index}_title`
                              ? 'border-end border-danger border-2'
                              : ''
                          }`}
                          style={{
                            backgroundColor:
                              editMode === `solicitor_${index}_title`
                                ? '#fef2f2'
                                : '#ffffff',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            padding: '0.5rem 0.75rem',
                          }}
                          value={solicitor.title}
                          onChange={(e) => handleListChange(e, index, 'title')}
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
                            backgroundColor:
                              editMode === `solicitor_${index}_title`
                                ? '#ef4444'
                                : '#1f2937',
                            color: 'white',
                            border: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() => {
                            if (editMode === `solicitor_${index}_title`)
                              submitChangesHandler(index);
                            toggleEditMode(`solicitor_${index}_title`);
                          }}
                          disabled={isAddingSolicitor}
                          onMouseOver={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseOut={(e) => {
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

                    {/* First Name */}
                    <div className='col-md-3'>
                      <label className='form-label fw-semibold text-slate-700 mb-2'>
                        <i className='fas fa-user me-2 text-blue-500'></i>
                        First Name
                      </label>
                      <div
                        className='input-group'
                        style={{
                          borderRadius: '10px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <input
                          type='text'
                          className={`form-control border-0 ${
                            editMode === `solicitor_${index}_first_name`
                              ? 'border-end border-danger border-2'
                              : ''
                          }`}
                          style={{
                            backgroundColor:
                              editMode === `solicitor_${index}_first_name`
                                ? '#fef2f2'
                                : '#ffffff',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            padding: '0.5rem 0.75rem',
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
                            backgroundColor:
                              editMode === `solicitor_${index}_first_name`
                                ? '#ef4444'
                                : '#1f2937',
                            color: 'white',
                            border: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() => {
                            if (editMode === `solicitor_${index}_first_name`)
                              submitChangesHandler(index);
                            toggleEditMode(`solicitor_${index}_first_name`);
                          }}
                          onMouseOver={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseOut={(e) => {
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

                    {/* Last Name */}
                    <div className='col-md-3'>
                      <label className='form-label fw-semibold text-slate-700 mb-2'>
                        <i className='fas fa-user me-2 text-blue-500'></i>
                        Last Name
                      </label>
                      <div
                        className='input-group'
                        style={{
                          borderRadius: '10px',
                          overflow: 'hidden',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <input
                          type='text'
                          className={`form-control border-0 ${
                            editMode === `solicitor_${index}_last_name`
                              ? 'border-end border-danger border-2'
                              : ''
                          }`}
                          style={{
                            backgroundColor:
                              editMode === `solicitor_${index}_last_name`
                                ? '#fef2f2'
                                : '#ffffff',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            padding: '0.5rem 0.75rem',
                          }}
                          value={solicitor.last_name}
                          onChange={(e) =>
                            handleListChange(e, index, 'last_name')
                          }
                          readOnly={editMode !== `solicitor_${index}_last_name`}
                        />
                        <button
                          type='button'
                          className='btn px-3'
                          style={{
                            backgroundColor:
                              editMode === `solicitor_${index}_last_name`
                                ? '#ef4444'
                                : '#1f2937',
                            color: 'white',
                            border: 'none',
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() => {
                            if (editMode === `solicitor_${index}_last_name`)
                              submitChangesHandler(index);
                            toggleEditMode(`solicitor_${index}_last_name`);
                          }}
                          onMouseOver={(e) => {
                            if (!e.target.disabled) {
                              e.target.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseOut={(e) => {
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

                    {/* Delete Button */}
                    <div className='col-md-1 text-center'>
                      <button
                        type='button'
                        className='btn btn-outline-danger border-0 p-2'
                        style={{
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          backgroundColor: 'transparent',
                        }}
                        onClick={() => removeItem(index)}
                        disabled={isAddingSolicitor}
                        onMouseOver={(e) => {
                          if (!e.target.disabled) {
                            e.target.style.backgroundColor = '#fef2f2';
                            e.target.style.transform = 'scale(1.1)';
                          }
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <FaTrash size={14} color='#ef4444' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {isAddingSolicitor && (
                <div className='text-center py-3'>
                  <LoadingComponent message='Updating...' />
                </div>
              )}
            </div>
          </div>

          {/* Add New Solicitor Form */}
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <div
                className='card border-0'
                style={{
                  background:
                    'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '2px solid #f59e0b',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px rgba(245, 158, 11, 0.1)',
                }}
              >
                <div className='card-body p-4'>
                  {/* Add Form Header */}
                  <div className='d-flex align-items-center mb-4'>
                    <div
                      className='rounded-circle d-flex align-items-center justify-content-center me-3'
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                      }}
                    >
                      <FaPlus size={16} />
                    </div>
                    <h4
                      className='mb-0 fw-semibold'
                      style={{ color: '#92400e' }}
                    >
                      Add New Solicitor
                    </h4>
                  </div>

                  <div className='row g-3'>
                    {/* Title */}
                    <div className='col-12'>
                      <label
                        className='form-label fw-semibold mb-2'
                        style={{ color: '#92400e' }}
                      >
                        Title <span className='text-danger'>*</span>
                      </label>
                      <select
                        className={getFieldClassName('title', true)}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        }}
                        value={newSolicitor.title}
                        onChange={(e) => handleNewSolicitorChange(e, 'title')}
                      >
                        <option value=''>Select Title</option>
                        {TITLE_CHOICES.map((choice) => (
                          <option key={choice.value} value={choice.value}>
                            {choice.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* First Name */}
                    <div className='col-12'>
                      <label
                        className='form-label fw-semibold mb-2'
                        style={{ color: '#92400e' }}
                      >
                        First Name <span className='text-danger'>*</span>
                      </label>
                      <input
                        type='text'
                        className={getFieldClassName('first_name', true)}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        }}
                        value={newSolicitor.first_name}
                        onChange={(e) =>
                          handleNewSolicitorChange(e, 'first_name')
                        }
                        placeholder='Enter first name'
                      />
                    </div>

                    {/* Last Name */}
                    <div className='col-12'>
                      <label
                        className='form-label fw-semibold mb-2'
                        style={{ color: '#92400e' }}
                      >
                        Last Name <span className='text-danger'>*</span>
                      </label>
                      <input
                        type='text'
                        className={getFieldClassName('last_name', true)}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          padding: '0.75rem',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        }}
                        value={newSolicitor.last_name}
                        onChange={(e) =>
                          handleNewSolicitorChange(e, 'last_name')
                        }
                        placeholder='Enter last name'
                      />
                    </div>

                    {/* Add Button */}
                    <div className='col-12 text-center mt-4'>
                      {!isAddingSolicitor ? (
                        <button
                          type='button'
                          className='btn px-4 py-3 fw-medium'
                          style={{
                            backgroundColor: isSolicitorFormValid
                              ? '#059669'
                              : '#94a3b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            transition: 'all 0.2s ease',
                            cursor: isSolicitorFormValid
                              ? 'pointer'
                              : 'not-allowed',
                          }}
                          onClick={addSolicitor}
                          disabled={!isSolicitorFormValid}
                          onMouseOver={(e) => {
                            if (isSolicitorFormValid) {
                              e.target.style.backgroundColor = '#047857';
                              e.target.style.transform = 'translateY(-1px)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (isSolicitorFormValid) {
                              e.target.style.backgroundColor = '#059669';
                              e.target.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          <FaSave className='me-2' size={16} />
                          Add Solicitor
                        </button>
                      ) : (
                        <LoadingComponent message='Adding solicitor...' />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solicitors;
