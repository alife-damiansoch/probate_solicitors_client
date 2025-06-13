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
  }, [token, refresh]); // Ensure `refresh` is a dependency for re-fetching data

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
        setRefresh(!refresh); // Trigger a refresh to fetch updated data
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
      className={`border-0 my-4 ${
        highlitedSectionId === 'Solicitor Part' && 'highlited_section'
      }`}
      id='Solicitor Part'
      style={{
        borderRadius: '16px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className='d-flex align-items-center border-0 p-4'
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: 'white',
        }}
      >
        <div
          className='rounded-circle d-flex align-items-center justify-content-center me-3'
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <FaUserTie size={18} />
        </div>
        <h4 className='mb-0 fw-semibold'>Assigned Solicitor</h4>
      </div>

      {/* Loading State */}
      {isUpdatingSolicitorAssigned ? (
        <div className='p-4' style={{ backgroundColor: '#ffffff' }}>
          <LoadingComponent message='Updating solicitors...' />
        </div>
      ) : (
        <div className='p-4' style={{ backgroundColor: '#ffffff' }}>
          {/* No Solicitor Warning */}
          {!assignedSolicitor && (
            <div className='mb-4'>
              <div
                className='alert border-0 text-center'
                style={{
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
                }}
              >
                <div className='d-flex align-items-center justify-content-center mb-2'>
                  <i className='fas fa-exclamation-triangle me-2'></i>
                  <span className='fw-semibold'>
                    Solicitor Assignment Required
                  </span>
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
            <LoadingComponent message='Loading solicitors...' />
          ) : (
            <div className='row g-4 align-items-end'>
              {/* Solicitor Selection */}
              <div className='col-md-8'>
                <label
                  htmlFor='solicitor-select'
                  className='form-label fw-semibold text-slate-700 mb-2'
                >
                  <i className='fas fa-user-tie me-2 text-purple-500'></i>
                  Assigned Solicitor
                </label>

                {solicitors.length === 0 ? (
                  <div
                    className='alert border-0'
                    style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      borderRadius: '10px',
                      boxShadow: '0 2px 4px rgba(245, 158, 11, 0.1)',
                    }}
                  >
                    <div className='d-flex align-items-center'>
                      <i className='fas fa-info-circle me-2'></i>
                      <div>
                        <div className='fw-semibold mb-1'>
                          No Solicitors Available
                        </div>
                        <div className='small'>
                          No solicitors have been created for this firm. Please
                          create them by clicking the 'ADD OR EDIT SOLICITORS'
                          button.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className='input-group'
                    style={{
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div
                      className='input-group-text border-0 d-flex align-items-center justify-content-center'
                      style={{
                        backgroundColor: '#f1f5f9',
                        width: '45px',
                      }}
                    >
                      <i className='fas fa-user text-slate-500'></i>
                    </div>
                    <select
                      id='solicitor-select'
                      className={`form-select border-0 fw-medium ${
                        !assignedSolicitor ? 'text-danger' : 'text-slate-700'
                      }`}
                      style={{
                        backgroundColor: !assignedSolicitor
                          ? '#fef2f2'
                          : '#ffffff',
                        fontSize: '1rem',
                        padding: '0.75rem 1rem',
                      }}
                      onChange={(e) => updateSelectedSolicitor(e.target.value)}
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
                    className='mt-3 p-3 rounded-3 d-flex align-items-center'
                    style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    <div
                      className='rounded-circle d-flex align-items-center justify-content-center me-3'
                      style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: '#059669',
                        color: 'white',
                      }}
                    >
                      <i
                        className='fas fa-check'
                        style={{ fontSize: '0.875rem' }}
                      ></i>
                    </div>
                    <div>
                      <div
                        className='fw-semibold text-green-700'
                        style={{ fontSize: '0.95rem' }}
                      >
                        Currently Assigned
                      </div>
                      <div className='text-green-600 small'>
                        {assignedSolicitor.title} {assignedSolicitor.first_name}{' '}
                        {assignedSolicitor.last_name}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add/Edit Button */}
              <div className='col-md-4 text-center text-md-end'>
                <Link
                  className='btn px-4 py-3 fw-medium text-decoration-none'
                  to='/solicitors'
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                    e.target.style.transform = 'translateY(0)';
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
                className={`alert border-0 text-center ${
                  isError ? 'alert-danger' : 'alert-success'
                }`}
                style={{
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SolicitorPart;
