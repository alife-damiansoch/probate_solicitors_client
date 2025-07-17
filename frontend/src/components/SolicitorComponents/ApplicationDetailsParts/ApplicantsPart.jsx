import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaSave, FaTimes, FaUsers } from 'react-icons/fa';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import {
  formatPhoneToInternational,
  validatePPS,
} from '../../GenericFunctions/HelperGenericFunctions';

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
  isApplicationLocked,
}) => {
  const [newApplicant, setNewApplicant] = useState({
    title: '',
    first_name: '',
    last_name: '',
    pps_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    county: '',
    postal_code: '',
    country: 'Ireland',
    date_of_birth: '',
    email: '',
    phone_number: '',
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const TITLE_CHOICES = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
  ];

  const idNumberArray = JSON.parse(Cookies.get('id_number'));
  const countrySolicitors = Cookies.get('country_solicitors') || 'IE';

  const requiredFields = [
    'title',
    'first_name',
    'last_name',
    'pps_number',
    'address_line_1',
    'city',
    'county',
    'postal_code',
    'date_of_birth',
    'email',
    'phone_number',
    'country',
  ];

  const isFormValid = requiredFields.every(
    (field) =>
      newApplicant[field] && newApplicant[field].toString().trim() !== ''
  );

  const handleNewApplicantChange = (e, field) => {
    setNewApplicant({ ...newApplicant, [field]: e.target.value });
  };

  const addApplicant = () => {
    addItem('applicants', newApplicant);
    resetForm();
    setTriggerChandleChange(!triggerHandleChange);
    setShowAddForm(false);
  };

  const resetForm = () => {
    setNewApplicant({
      title: '',
      first_name: '',
      last_name: '',
      pps_number: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      county: '',
      postal_code: '',
      country: 'Ireland',
      date_of_birth: '',
      email: '',
      phone_number: '',
    });
    setFieldErrors({});
  };

  const validatePPSField = (value) => {
    if (!value || value.trim() === '')
      return { valid: false, message: 'PPS number is required' };
    const isValid = validatePPS(value);
    return {
      valid: isValid,
      message: isValid ? '' : 'Invalid PPS number format',
    };
  };

  const validatePhoneField = (value) => {
    if (!value || value.trim() === '')
      return { valid: false, message: 'Phone number is required' };
    const result = formatPhoneToInternational(value, countrySolicitors);
    return {
      valid: result.success,
      message: result.success ? '' : result.error,
    };
  };

  // ---- EditableField ----
  const EditableField = ({
    applicant,
    index,
    field,
    label,
    type = 'text',
    options = null,
    cols = 'col-12 col-xxl-6',
  }) => {
    const [localValue, setLocalValue] = useState(applicant[field] || '');
    const editKey = `applicant_${index}_${field}`;
    const errorKey = `${index}_${field}`;
    const isEditing = editMode[editKey];
    const hasError = fieldErrors[errorKey];

    useEffect(() => {
      setLocalValue(applicant[field] || '');
    }, [applicant[field]]);

    const handleEdit = () => {
      if (hasError) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
      toggleEditMode(editKey);
    };

    const handleSave = () => {
      if (field === 'pps_number') {
        const validation = validatePPSField(localValue);
        if (!validation.valid) {
          setFieldErrors((prev) => ({
            ...prev,
            [errorKey]: validation.message,
          }));
          setLocalValue(applicant[field] || '');
          toggleEditMode(editKey);
          return;
        }
      }
      if (field === 'phone_number') {
        const validation = validatePhoneField(localValue);
        if (!validation.valid) {
          setFieldErrors((prev) => ({
            ...prev,
            [errorKey]: validation.message,
          }));
          setLocalValue(applicant[field] || '');
          toggleEditMode(editKey);
          return;
        }
        const phoneResult = formatPhoneToInternational(
          localValue,
          countrySolicitors
        );
        if (phoneResult.success) {
          const formattedValue = phoneResult.formattedNumber;
          setLocalValue(formattedValue);
          const fakeEvent = { target: { value: formattedValue } };
          handleListChange(fakeEvent, index, 'applicants', field);
          submitChangesHandler();
          toggleEditMode(editKey);
          return;
        }
      }
      if (field !== 'phone_number') {
        const fakeEvent = { target: { value: localValue } };
        handleListChange(fakeEvent, index, 'applicants', field);
        submitChangesHandler();
        toggleEditMode(editKey);
      }
    };

    const displayValue = isEditing ? localValue : applicant[field] || '';

    return (
      <div className={cols + ' mb-3'}>
        <label className='form-label fw-semibold text-slate-700 mb-2'>
          {label}
        </label>
        <div
          className='input-group input-group-sm position-relative'
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.7)',
            border: isEditing
              ? '2px solid #667eea'
              : '1px solid rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(20px)',
            boxShadow: isEditing
              ? '0 15px 35px rgba(102, 126, 234, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)'
              : '0 8px 24px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
          }}
        >
          {isEditing && (
            <div
              className='position-absolute'
              style={{
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                background:
                  'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(102, 126, 234, 0.1))',
                borderRadius: '18px',
                filter: 'blur(8px)',
                zIndex: -1,
                animation: 'selectionGlow 3s ease-in-out infinite alternate',
              }}
            />
          )}
          {options ? (
            <select
              className='form-control border-0'
              style={{
                backgroundColor: 'transparent',
                fontSize: '1rem',
                fontWeight: '500',
                padding: '0.75rem 1rem',
                color: '#1e293b',
              }}
              value={displayValue}
              onChange={(e) => setLocalValue(e.target.value)}
              disabled={!isEditing}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              className='form-control border-0'
              style={{
                backgroundColor: 'transparent',
                fontSize: '1rem',
                fontWeight: '500',
                padding: '0.75rem 1rem',
                color: '#1e293b',
              }}
              value={displayValue}
              onChange={(e) => setLocalValue(e.target.value)}
              readOnly={!isEditing}
            />
          )}
          <button
            type='button'
            className='btn'
            style={{
              backgroundColor: isEditing ? '#ef4444' : '#667eea',
              color: 'white',
              border: 'none',
              padding: '0 1rem',
              transition: 'all 0.2s ease',
            }}
            onClick={isEditing ? handleSave : handleEdit}
            disabled={
              application.approved ||
              application.is_rejected ||
              isApplicationLocked
            }
          >
            {isEditing ? <FaSave size={14} /> : <FaEdit size={14} />}
          </button>
          {isEditing && (
            <div
              className='position-absolute'
              style={{
                top: '-8px',
                right: '70px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '600',
                boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)',
                animation: 'editingPulse 2s ease-in-out infinite',
              }}
            >
              EDITING
            </div>
          )}
        </div>
        {hasError && (
          <div
            className='text-danger mt-2 small d-flex align-items-center gap-2'
            style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <i className='fas fa-exclamation-circle'></i>
            {hasError}
          </div>
        )}
      </div>
    );
  };

  // ---- FormField ----
  const FormField = ({
    field,
    label,
    type = 'text',
    cols = 'col-12 col-xxl-6',
    options = null,
  }) => {
    const isRequired = requiredFields.includes(field);
    const hasError = !newApplicant[field] && isRequired;
    const hasValue = Object.values(newApplicant).some((val) => val !== '');

    return (
      <div className={cols}>
        <label className='form-label fw-semibold mb-2 text-slate-700'>
          {label} {isRequired && <span className='text-danger'>*</span>}
        </label>
        <div
          className='position-relative'
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.7)',
            border:
              hasError && hasValue
                ? '2px solid #ef4444'
                : '1px solid rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(20px)',
            boxShadow:
              hasError && hasValue
                ? '0 15px 35px rgba(239, 68, 68, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)'
                : '0 8px 24px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
          }}
        >
          {hasError && hasValue && (
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
                animation: 'selectionGlow 3s ease-in-out infinite alternate',
              }}
            />
          )}
          {options ? (
            <select
              className='form-control border-0'
              style={{
                backgroundColor: 'transparent',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontWeight: '500',
                color: '#1e293b',
              }}
              value={newApplicant[field]}
              onChange={(e) => handleNewApplicantChange(e, field)}
            >
              <option value=''>Select {label}</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              className='form-control border-0'
              style={{
                backgroundColor: 'transparent',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontWeight: '500',
                color: '#1e293b',
              }}
              value={newApplicant[field]}
              onChange={(e) => handleNewApplicantChange(e, field)}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          )}
        </div>
        {hasError && hasValue && (
          <small
            className='text-danger mt-1 d-block d-flex align-items-center gap-2'
            style={{
              padding: '0.5rem 0.75rem',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <i className='fas fa-exclamation-circle'></i>
            {label} is required
          </small>
        )}
      </div>
    );
  };

  if (!application) return <LoadingComponent />;

  return (
    <div
      className='modern-main-card mb-4 position-relative overflow-hidden'
      style={{
        background: `
          linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(248, 250, 252, 0.05)),
          radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.6), transparent 50%),
          radial-gradient(circle at 70% 90%, rgba(102, 126, 234, 0.1), transparent 50%)
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
      <div
        className='position-absolute w-100 h-100'
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.06) 0%, transparent 50%)
          `,
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        className='px-4 py-4 d-flex align-items-center gap-3 position-relative'
        style={{
          background: `
            linear-gradient(135deg, #667eea, #764ba2),
            linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))
          `,
          color: '#ffffff',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          className='d-flex align-items-center justify-content-center rounded-circle position-relative'
          style={{
            width: '56px',
            height: '56px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
        >
          <FaUsers size={20} />
          <div
            className='position-absolute rounded-circle'
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
        <div className='flex-grow-1'>
          <h5
            className='fw-bold mb-2 text-white'
            style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}
          >
            Applicant Information
          </h5>
          <div
            className='px-3 py-2 rounded-pill fw-semibold text-white'
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: '0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.02em',
            }}
          >
            Single applicant required
          </div>
        </div>
        <span
          className='px-4 py-3 rounded-pill text-white fw-bold d-flex align-items-center gap-2'
          style={{
            background:
              application.applicants?.length > 0
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
            fontSize: '0.9rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'default',
            letterSpacing: '0.02em',
          }}
        >
          <svg width='18' height='18' fill='currentColor' viewBox='0 0 20 20'>
            {application.applicants?.length > 0 ? (
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
          {application.applicants?.length > 0 ? 'Complete' : 'Required'}
        </span>
      </div>
      <div className='px-4 pb-4'>
        {(!application.applicants || application.applicants.length === 0) && (
          <div
            className='alert border-0 text-center mb-4'
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
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)',
              }}
            >
              <i className='fas fa-exclamation-triangle'></i>
            </div>
            <strong>Please provide applicant details to continue.</strong>
          </div>
        )}

        {application.applicants?.map((applicant, index) => (
          <div key={applicant.id || index} className='mb-4'>
            <div
              className='p-4 mb-4 position-relative'
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
              }}
            >
              <div className='d-flex align-items-center gap-3 mb-3'>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <i className='fas fa-user'></i>
                </div>
                <h6
                  className='fw-bold text-primary mb-0'
                  style={{ fontSize: '1.2rem' }}
                >
                  Basic Information
                </h6>
              </div>
              <div className='row g-3'>
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='title'
                  label='Title'
                  options={TITLE_CHOICES}
                  cols='col-12 col-xxl-3'
                />
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='first_name'
                  label='First Name'
                  cols='col-12 col-xxl-3'
                />
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='last_name'
                  label='Last Name'
                  cols='col-12 col-xxl-3'
                />
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='pps_number'
                  label={`${idNumberArray[0]} Number`}
                  cols='col-12 col-xxl-3'
                />
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='date_of_birth'
                  label='Date of Birth'
                  type='date'
                  cols='col-12 col-xxl-6'
                />
              </div>
            </div>
            <div className='row g-4'>
              <div className='col-12 col-xxl-6'>
                <div
                  className='p-4 h-100 position-relative'
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div className='d-flex align-items-center gap-3 mb-3'>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <i className='fas fa-phone'></i>
                    </div>
                    <h6
                      className='fw-bold text-success mb-0'
                      style={{ fontSize: '1.1rem' }}
                    >
                      Contact
                    </h6>
                  </div>
                  <div className='row g-3'>
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='email'
                      label='Email'
                      type='email'
                      cols='col-12'
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='phone_number'
                      label='Phone'
                      type='tel'
                      cols='col-12'
                    />
                  </div>
                </div>
              </div>
              <div className='col-12 col-xxl-6'>
                <div
                  className='p-4 h-100 position-relative'
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div className='d-flex align-items-center gap-3 mb-3'>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <i className='fas fa-home'></i>
                    </div>
                    <h6
                      className='fw-bold mb-0'
                      style={{ fontSize: '1.1rem', color: '#d97706' }}
                    >
                      Address
                    </h6>
                  </div>
                  <div className='row g-3'>
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='address_line_1'
                      label='Address 1'
                      cols='col-12'
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='address_line_2'
                      label='Address 2 (Optional)'
                      cols='col-12'
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='city'
                      label='City'
                      cols='col-12 '
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='county'
                      label='County'
                      cols='col-12 '
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='postal_code'
                      label='Postal Code'
                      cols='col-12 '
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='country'
                      label='Country'
                      cols='col-12 '
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ---- Add New Applicant Form ---- */}
        {!application.approved &&
          !application.is_rejected &&
          (!application.applicants || application.applicants.length === 0) && (
            <>
              {showAddForm ? (
                <div
                  className='position-relative'
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '18px',
                    border: '2px solid #f59e0b',
                    backdropFilter: 'blur(20px)',
                    boxShadow:
                      '0 15px 35px rgba(245, 158, 11, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className='position-absolute'
                    style={{
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      background:
                        'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.1))',
                      borderRadius: '20px',
                      filter: 'blur(8px)',
                      zIndex: -1,
                      animation:
                        'selectionGlow 3s ease-in-out infinite alternate',
                    }}
                  />
                  <div
                    className='d-flex justify-content-between align-items-center p-4'
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                      borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <div className='d-flex align-items-center gap-3'>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          background:
                            'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        <FaPlus />
                      </div>
                      <h5 className='mb-0 fw-bold' style={{ color: '#92400e' }}>
                        Add Applicant
                      </h5>
                    </div>
                    <button
                      className='btn btn-sm rounded-pill d-flex align-items-center gap-2'
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#64748b',
                        padding: '0.5rem 1rem',
                      }}
                      onClick={() => {
                        setShowAddForm(false);
                        resetForm();
                      }}
                    >
                      <FaTimes size={12} />
                      Cancel
                    </button>
                  </div>
                  <div className='p-4'>
                    {!isFormValid &&
                      Object.values(newApplicant).some((val) => val !== '') && (
                        <div
                          className='alert border-0 mb-4'
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                            borderRadius: '16px',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            backdropFilter: 'blur(10px)',
                            color: '#1e40af',
                            padding: '1rem 1.5rem',
                          }}
                        >
                          <div className='d-flex align-items-center gap-3'>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background:
                                  'linear-gradient(135deg, #3b82f6, #2563eb)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                              }}
                            >
                              <i className='fas fa-info-circle'></i>
                            </div>
                            <strong>
                              Please complete all required fields marked with *
                            </strong>
                          </div>
                        </div>
                      )}
                    {/* Basic Information */}
                    <div className='mb-4'>
                      <div className='d-flex align-items-center gap-3 mb-3'>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background:
                              'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.9rem',
                          }}
                        >
                          <i className='fas fa-user'></i>
                        </div>
                        <h6 className='fw-bold mb-0 text-primary'>
                          Basic Information
                        </h6>
                      </div>
                      <div className='row g-3'>
                        <FormField
                          field='title'
                          label='Title'
                          cols='col-12 col-xxl-3'
                          options={TITLE_CHOICES}
                        />
                        <FormField
                          field='first_name'
                          label='First Name'
                          cols='col-12 col-xxl-3'
                        />
                        <FormField
                          field='last_name'
                          label='Last Name'
                          cols='col-12 col-xxl-3'
                        />
                        <FormField
                          field='pps_number'
                          label={`${idNumberArray[0]} Number`}
                          cols='col-12 col-xxl-3'
                        />
                        <FormField
                          field='date_of_birth'
                          label='Date of Birth'
                          type='date'
                          cols='col-12 col-xxl-6'
                        />
                      </div>
                    </div>
                    {/* Contact & Address */}
                    <div className='row g-4 mb-4'>
                      <div className='col-md-6'>
                        <div className='d-flex align-items-center gap-3 mb-3'>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background:
                                'linear-gradient(135deg, #22c55e, #16a34a)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                            }}
                          >
                            <i className='fas fa-phone'></i>
                          </div>
                          <h6 className='fw-bold mb-0 text-success'>
                            Contact Information
                          </h6>
                        </div>
                        <div className='row g-3'>
                          <FormField
                            field='email'
                            label='Email'
                            type='email'
                            cols='col-12'
                          />
                          <FormField
                            field='phone_number'
                            label='Phone'
                            type='tel'
                            cols='col-12'
                          />
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='d-flex align-items-center gap-3 mb-3'>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background:
                                'linear-gradient(135deg, #f59e0b, #d97706)',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.9rem',
                            }}
                          >
                            <i className='fas fa-home'></i>
                          </div>
                          <h6
                            className='fw-bold mb-0'
                            style={{ color: '#d97706' }}
                          >
                            Address Information
                          </h6>
                        </div>
                        <div className='row g-3'>
                          <FormField
                            field='address_line_1'
                            label='Address Line 1'
                            cols='col-12'
                          />
                          <FormField
                            field='address_line_2'
                            label='Address Line 2 (Optional)'
                            cols='col-12'
                          />
                          <FormField
                            field='city'
                            label='City'
                            cols='col-12 col-xxl-6'
                          />
                          <FormField
                            field='county'
                            label='County'
                            cols='col-12 col-xxl-6'
                          />
                          <FormField
                            field='postal_code'
                            label='Postal Code'
                            cols='col-12 col-xxl-6'
                          />
                          <FormField
                            field='country'
                            label='Country'
                            cols='col-12 col-xxl-6'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='d-flex gap-3 justify-content-end'>
                      <button
                        className='btn rounded-pill px-4 d-flex align-items-center gap-2'
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: '#64748b',
                          backdropFilter: 'blur(10px)',
                        }}
                        onClick={() => {
                          setShowAddForm(false);
                          resetForm();
                        }}
                      >
                        <FaTimes size={14} />
                        Cancel
                      </button>
                      <button
                        className='btn rounded-pill px-4 d-flex align-items-center gap-2'
                        onClick={addApplicant}
                        disabled={!isFormValid}
                        style={{
                          background: isFormValid
                            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                            : 'rgba(148, 163, 184, 0.7)',
                          color: 'white',
                          border: 'none',
                          opacity: isFormValid ? 1 : 0.7,
                          cursor: isFormValid ? 'pointer' : 'not-allowed',
                          boxShadow: isFormValid
                            ? '0 8px 16px rgba(34, 197, 94, 0.3)'
                            : 'none',
                        }}
                      >
                        <FaSave size={14} />
                        Save Applicant
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className='text-center py-5'
                  style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className='mb-4'>
                    <div
                      className='mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3'
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: 'white',
                        boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                        animation: 'iconFloat 4s ease-in-out infinite',
                      }}
                    >
                      <FaPlus size={30} />
                    </div>
                    <h5 className='fw-bold mb-2' style={{ color: '#1e293b' }}>
                      Add Applicant Information
                    </h5>
                    <p className='text-muted'>
                      Provide applicant details to continue
                    </p>
                  </div>
                  <button
                    className='btn btn-lg rounded-pill px-5 d-flex align-items-center gap-3 mx-auto'
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      color: 'white',
                      boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => setShowAddForm(true)}
                  >
                    <FaPlus />
                    Add Applicant
                  </button>
                </div>
              )}
            </>
          )}
        {!application.approved &&
          !application.is_rejected &&
          application.applicants?.length > 0 && (
            <div
              className='alert border-0 text-center'
              style={{
                background:
                  'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))',
                borderRadius: '16px',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#059669',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)',
                }}
              >
                <i className='fas fa-check-circle'></i>
              </div>
              <strong>Applicant information completed!</strong> Only one
              applicant allowed per application.
            </div>
          )}
      </div>
      <style>{`
        @keyframes float {
          0%,100% {transform:translateY(0px) rotate(0deg);}
          50% {transform:translateY(-10px) rotate(2deg);}
        }
        @keyframes editingPulse {
          0%,100% {opacity:1;transform:scale(1);}
          50% {opacity:0.8;transform:scale(1.05);}
        }
        @keyframes selectionGlow {
          0% {opacity:0.3;}
          100% {opacity:0.6;}
        }
        @keyframes iconFloat {
          0%,100% {transform:translateY(0) rotate(0deg) scale(1);}
          50% {transform:translateY(-8px) rotate(5deg) scale(1.02);}
        }
      `}</style>
    </div>
  );
};

export default ApplicantsPart;
