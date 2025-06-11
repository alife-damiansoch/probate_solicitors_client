import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  FaEdit,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
  FaUsers,
} from 'react-icons/fa';
import LoadingComponent from '../../GenericComponents/LoadingComponent';

const ApplicantsPart = ({
  addItem,
  application,
  handleListChange,
  editMode,
  submitChangesHandler,
  toggleEditMode,
  removeItem,
  triggerHandleChange,
  setTriggerChandleChange,
}) => {
  const [newApplicant, setNewApplicant] = useState({
    title: '',
    first_name: '',
    last_name: '',
    pps_number: '',
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const TITLE_CHOICES = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
  ];

  const idNumberArray = JSON.parse(Cookies.get('id_number'));

  const handleNewApplicantChange = (e, field) => {
    const value = e.target.value;
    setNewApplicant({
      ...newApplicant,
      [field]: value,
    });
  };

  const addApplicant = () => {
    addItem('applicants', newApplicant);
    setNewApplicant({
      title: '',
      first_name: '',
      last_name: '',
      pps_number: '',
    });
    setTriggerChandleChange(!triggerHandleChange);
    setShowAddForm(false); // Hide form after adding
  };

  const isAnyFieldFilled = Object.values(newApplicant).some(
    (value) => value !== ''
  );

  // Validate forms
  const isApplicantFormValid =
    newApplicant.title &&
    newApplicant.first_name &&
    newApplicant.last_name &&
    newApplicant.pps_number;

  const getFieldClassName = (field) => {
    return `form-control border-0 ${
      !newApplicant[field] && isAnyFieldFilled ? 'border-2 border-danger' : ''
    }`;
  };

  return (
    <>
      {application ? (
        <div
          className='border-0 mt-4'
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            className='d-flex align-items-center border-0 p-4'
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
              <FaUsers size={18} />
            </div>
            <h4 className='mb-0 fw-semibold'>Applicants</h4>
          </div>

          {/* No Applicants Warning */}
          {(!application.applicants || application.applicants.length === 0) && (
            <div className='p-4'>
              <div
                className='alert border-0 text-center'
                style={{
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
                }}
              >
                <div className='d-flex align-items-center justify-content-center'>
                  <i className='fas fa-exclamation-triangle me-2'></i>
                  <span className='fw-medium'>
                    Please provide details for at least one applicant.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Applicants List */}
          <div className='p-4' style={{ backgroundColor: '#ffffff' }}>
            {application.applicants.map((applicant, index) => (
              <div
                key={index}
                className='mb-4 p-4 rounded-3'
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
                      <i className='fas fa-user-tag me-2 text-blue-500'></i>
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
                          editMode[`applicant_${index}_title`]
                            ? 'border-end border-danger border-2'
                            : ''
                        }`}
                        style={{
                          backgroundColor: editMode[`applicant_${index}_title`]
                            ? '#fef2f2'
                            : '#ffffff',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          padding: '0.5rem 0.75rem',
                        }}
                        value={applicant.title}
                        onChange={(e) =>
                          handleListChange(e, index, 'applicants', 'title')
                        }
                        disabled={!editMode[`applicant_${index}_title`]}
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
                          backgroundColor: editMode[`applicant_${index}_title`]
                            ? '#ef4444'
                            : '#1f2937',
                          color: 'white',
                          border: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => {
                          if (editMode[`applicant_${index}_title`])
                            submitChangesHandler();
                          toggleEditMode(`applicant_${index}_title`);
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                        onMouseOver={(e) => {
                          if (!e.target.disabled) {
                            e.target.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        {editMode[`applicant_${index}_title`] ? (
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
                      <i className='fas fa-user me-2 text-green-500'></i>
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
                          editMode[`applicant_${index}_first_name`]
                            ? 'border-end border-danger border-2'
                            : ''
                        }`}
                        style={{
                          backgroundColor: editMode[
                            `applicant_${index}_first_name`
                          ]
                            ? '#fef2f2'
                            : '#ffffff',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          padding: '0.5rem 0.75rem',
                        }}
                        value={applicant.first_name}
                        onChange={(e) =>
                          handleListChange(e, index, 'applicants', 'first_name')
                        }
                        readOnly={!editMode[`applicant_${index}_first_name`]}
                      />
                      <button
                        type='button'
                        className='btn px-3'
                        style={{
                          backgroundColor: editMode[
                            `applicant_${index}_first_name`
                          ]
                            ? '#ef4444'
                            : '#1f2937',
                          color: 'white',
                          border: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => {
                          if (editMode[`applicant_${index}_first_name`])
                            submitChangesHandler();
                          toggleEditMode(`applicant_${index}_first_name`);
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                        onMouseOver={(e) => {
                          if (!e.target.disabled) {
                            e.target.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        {editMode[`applicant_${index}_first_name`] ? (
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
                      <i className='fas fa-user me-2 text-green-500'></i>
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
                          editMode[`applicant_${index}_last_name`]
                            ? 'border-end border-danger border-2'
                            : ''
                        }`}
                        style={{
                          backgroundColor: editMode[
                            `applicant_${index}_last_name`
                          ]
                            ? '#fef2f2'
                            : '#ffffff',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          padding: '0.5rem 0.75rem',
                        }}
                        value={applicant.last_name}
                        onChange={(e) =>
                          handleListChange(e, index, 'applicants', 'last_name')
                        }
                        readOnly={!editMode[`applicant_${index}_last_name`]}
                      />
                      <button
                        type='button'
                        className='btn px-3'
                        style={{
                          backgroundColor: editMode[
                            `applicant_${index}_last_name`
                          ]
                            ? '#ef4444'
                            : '#1f2937',
                          color: 'white',
                          border: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => {
                          if (editMode[`applicant_${index}_last_name`])
                            submitChangesHandler();
                          toggleEditMode(`applicant_${index}_last_name`);
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                        onMouseOver={(e) => {
                          if (!e.target.disabled) {
                            e.target.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        {editMode[`applicant_${index}_last_name`] ? (
                          <FaSave size={14} />
                        ) : (
                          <FaEdit size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ID Number */}
                  <div className='col-md-3'>
                    <label className='form-label fw-semibold text-slate-700 mb-2'>
                      <i className='fas fa-id-card me-2 text-purple-500'></i>
                      {idNumberArray[0]} Number
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
                          editMode[`applicant_${index}_pps_number`]
                            ? 'border-end border-danger border-2'
                            : ''
                        }`}
                        style={{
                          backgroundColor: editMode[
                            `applicant_${index}_pps_number`
                          ]
                            ? '#fef2f2'
                            : '#ffffff',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          padding: '0.5rem 0.75rem',
                        }}
                        value={applicant.pps_number}
                        onChange={(e) =>
                          handleListChange(e, index, 'applicants', 'pps_number')
                        }
                        readOnly={!editMode[`applicant_${index}_pps_number`]}
                      />
                      <button
                        type='button'
                        className='btn px-3'
                        style={{
                          backgroundColor: editMode[
                            `applicant_${index}_pps_number`
                          ]
                            ? '#ef4444'
                            : '#1f2937',
                          color: 'white',
                          border: 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => {
                          if (editMode[`applicant_${index}_pps_number`])
                            submitChangesHandler();
                          toggleEditMode(`applicant_${index}_pps_number`);
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                        onMouseOver={(e) => {
                          if (!e.target.disabled) {
                            e.target.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        {editMode[`applicant_${index}_pps_number`] ? (
                          <FaSave size={14} />
                        ) : (
                          <FaEdit size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className='col-md-1 text-end'>
                    <button
                      type='button'
                      className='btn btn-outline-danger border-0 p-2'
                      style={{
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        backgroundColor: 'transparent',
                      }}
                      onClick={() => removeItem('applicants', index)}
                      disabled={application.approved || application.is_rejected}
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

            {/* Add New Applicant Form - Only show when showAddForm is true */}
            {!application.approved &&
              !application.is_rejected &&
              showAddForm && (
                <>
                  {/* Divider */}
                  <div
                    className='my-4'
                    style={{
                      height: '1px',
                      background:
                        'linear-gradient(90deg, transparent, #e2e8f0, transparent)',
                    }}
                  ></div>

                  <div
                    className='p-4 rounded-3'
                    style={{
                      background:
                        'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      border: '2px solid #f59e0b',
                      boxShadow: '0 4px 6px rgba(245, 158, 11, 0.1)',
                    }}
                  >
                    {/* Add Form Header */}
                    <div className='d-flex align-items-center justify-content-between mb-4'>
                      <div className='d-flex align-items-center'>
                        <div
                          className='rounded-circle d-flex align-items-center justify-content-center me-3'
                          style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                          }}
                        >
                          <FaPlus size={14} />
                        </div>
                        <h5
                          className='mb-0 fw-semibold'
                          style={{ color: '#92400e' }}
                        >
                          Add New Applicant
                        </h5>
                      </div>

                      {/* Close Button */}
                      <button
                        type='button'
                        className='btn btn-sm'
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#92400e',
                          padding: '0.25rem',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => {
                          setShowAddForm(false);
                          setNewApplicant({
                            title: '',
                            first_name: '',
                            last_name: '',
                            pps_number: '',
                          });
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor =
                            'rgba(146, 64, 14, 0.1)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <FaTimes size={16} />
                      </button>
                    </div>

                    <div className='row g-3'>
                      {/* Title */}
                      <div className='col-md-2'>
                        <label
                          className='form-label fw-semibold mb-2'
                          style={{ color: '#92400e' }}
                        >
                          Title
                        </label>
                        <select
                          className={getFieldClassName('title')}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                          }}
                          value={newApplicant.title}
                          onChange={(e) => handleNewApplicantChange(e, 'title')}
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
                      <div className='col-md-3'>
                        <label
                          className='form-label fw-semibold mb-2'
                          style={{ color: '#92400e' }}
                        >
                          First Name
                        </label>
                        <input
                          type='text'
                          className={getFieldClassName('first_name')}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                          }}
                          value={newApplicant.first_name}
                          onChange={(e) =>
                            handleNewApplicantChange(e, 'first_name')
                          }
                          placeholder='Enter first name'
                        />
                      </div>

                      {/* Last Name */}
                      <div className='col-md-3'>
                        <label
                          className='form-label fw-semibold mb-2'
                          style={{ color: '#92400e' }}
                        >
                          Last Name
                        </label>
                        <input
                          type='text'
                          className={getFieldClassName('last_name')}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                          }}
                          value={newApplicant.last_name}
                          onChange={(e) =>
                            handleNewApplicantChange(e, 'last_name')
                          }
                          placeholder='Enter last name'
                        />
                      </div>

                      {/* ID Number */}
                      <div className='col-md-3'>
                        <label
                          className='form-label fw-semibold mb-2'
                          style={{ color: '#92400e' }}
                        >
                          {idNumberArray[0]} Number
                        </label>
                        <input
                          type='text'
                          className={getFieldClassName('pps_number')}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                          }}
                          value={newApplicant.pps_number}
                          onChange={(e) =>
                            handleNewApplicantChange(e, 'pps_number')
                          }
                          placeholder={idNumberArray[1]}
                        />
                      </div>

                      {/* Add Button */}
                      <div className='col-md-1 d-flex align-items-end'>
                        <button
                          type='button'
                          className='btn w-100'
                          style={{
                            backgroundColor: isApplicantFormValid
                              ? '#059669'
                              : '#94a3b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.5rem',
                            transition: 'all 0.2s ease',
                            cursor: isApplicantFormValid
                              ? 'pointer'
                              : 'not-allowed',
                          }}
                          onClick={addApplicant}
                          disabled={!isApplicantFormValid}
                          onMouseOver={(e) => {
                            if (isApplicantFormValid) {
                              e.target.style.backgroundColor = '#047857';
                              e.target.style.transform = 'scale(1.05)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (isApplicantFormValid) {
                              e.target.style.backgroundColor = '#059669';
                              e.target.style.transform = 'scale(1)';
                            }
                          }}
                        >
                          <FaSave size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>

          {/* Add New Applicant Section - Styled like Manage Estates */}
          {!application.approved &&
            !application.is_rejected &&
            !showAddForm && (
              <div className='text-end mb-3'>
                <div className='mb-2'>
                  <small
                    className='text-muted fw-medium'
                    style={{ fontSize: '0.8rem' }}
                  >
                    Need to add more applicants?
                  </small>
                </div>
                <button
                  className='btn px-4 py-2 fw-medium'
                  style={{
                    backgroundColor: 'transparent',
                    color: '#059669',
                    border: '2px solid #059669',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setShowAddForm(true)}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#059669';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <FaPlus className='me-2' size={14} />
                  Add New Applicant
                </button>
              </div>
            )}
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default ApplicantsPart;
