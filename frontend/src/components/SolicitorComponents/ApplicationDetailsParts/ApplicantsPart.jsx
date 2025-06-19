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

  // Simple validation functions
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

    console.log('Validating phone:', value, 'Country:', countrySolicitors); // Debug log
    const result = formatPhoneToInternational(value, countrySolicitors);
    console.log('Phone validation result:', result); // Debug log

    return {
      valid: result.success,
      message: result.success ? '' : result.error,
    };
  };

  // EditableField component
  const EditableField = ({
    applicant,
    index,
    field,
    label,
    type = 'text',
    options = null,
    cols = 6,
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
      // Clear any existing error when starting to edit
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
      // Validate special fields
      if (field === 'pps_number') {
        const validation = validatePPSField(localValue);
        if (!validation.valid) {
          setFieldErrors((prev) => ({
            ...prev,
            [errorKey]: validation.message,
          }));
          setLocalValue(applicant[field] || ''); // Revert to original
          toggleEditMode(editKey); // Exit edit mode
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
          setLocalValue(applicant[field] || ''); // Revert to original
          toggleEditMode(editKey); // Exit edit mode
          return;
        }
        // Format phone number if valid
        const phoneResult = formatPhoneToInternational(
          localValue,
          countrySolicitors
        );
        if (phoneResult.success) {
          const formattedValue = phoneResult.formattedNumber;
          setLocalValue(formattedValue);
          // Update the event to save the formatted value
          const fakeEvent = { target: { value: formattedValue } };
          handleListChange(fakeEvent, index, 'applicants', field);
          submitChangesHandler();
          toggleEditMode(editKey);
          return;
        }
      }

      // Save the value (for non-phone fields or if phone formatting didn't happen above)
      if (field !== 'phone_number') {
        const fakeEvent = { target: { value: localValue } };
        handleListChange(fakeEvent, index, 'applicants', field);
        submitChangesHandler();
        toggleEditMode(editKey);
      }
    };

    const displayValue = isEditing ? localValue : applicant[field] || '';

    return (
      <div className={`col-md-${cols} mb-3`}>
        <label className='form-label fw-semibold mb-2 text-slate-600'>
          {label}
        </label>
        <div className='input-group rounded-3 overflow-hidden shadow-sm'>
          {options ? (
            <select
              className='form-control border-0'
              style={{
                backgroundColor: isEditing ? '#f0f9ff' : '#fff',
                fontSize: '0.95rem',
                padding: '0.75rem',
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
                backgroundColor: isEditing ? '#f0f9ff' : '#fff',
                fontSize: '0.95rem',
                padding: '0.75rem',
              }}
              value={displayValue}
              onChange={(e) => setLocalValue(e.target.value)}
              readOnly={!isEditing}
            />
          )}
          <button
            type='button'
            className='btn px-3'
            style={{
              backgroundColor: isEditing ? '#3b82f6' : '#64748b',
              color: 'white',
              border: 'none',
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
        </div>

        {hasError && (
          <div className='text-danger mt-2 small'>
            <i className='fas fa-exclamation-circle me-1'></i>
            {hasError}
          </div>
        )}
      </div>
    );
  };

  // FormField component
  const FormField = ({
    field,
    label,
    type = 'text',
    cols = 6,
    options = null,
  }) => {
    const isRequired = requiredFields.includes(field);
    const hasError = !newApplicant[field] && isRequired;
    const hasValue = Object.values(newApplicant).some((val) => val !== '');

    return (
      <div className={`col-md-${cols}`}>
        <label className='form-label fw-semibold mb-2 text-slate-700'>
          {label} {isRequired && <span className='text-danger'>*</span>}
        </label>
        {options ? (
          <select
            className='form-control rounded-3 border-0 shadow-sm'
            style={{
              padding: '0.75rem',
              fontSize: '0.95rem',
              borderLeft: hasError && hasValue ? '3px solid #ef4444' : '',
              backgroundColor: hasError && hasValue ? '#fef2f2' : '#fff',
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
            className='form-control rounded-3 border-0 shadow-sm'
            style={{
              padding: '0.75rem',
              fontSize: '0.95rem',
              borderLeft: hasError && hasValue ? '3px solid #ef4444' : '',
              backgroundColor: hasError && hasValue ? '#fef2f2' : '#fff',
            }}
            value={newApplicant[field]}
            onChange={(e) => handleNewApplicantChange(e, field)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
        {hasError && hasValue && (
          <small className='text-danger mt-1 d-block'>
            <i className='fas fa-exclamation-circle me-1'></i>
            {label} is required
          </small>
        )}
      </div>
    );
  };

  if (!application) return <LoadingComponent />;

  return (
    <div className='mt-4 rounded-4 overflow-hidden shadow-lg'>
      {/* Header */}
      <div
        className='d-flex align-items-center justify-content-between p-4 text-white'
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className='d-flex align-items-center'>
          <div
            className='rounded-circle d-flex align-items-center justify-content-center me-3'
            style={{
              width: '45px',
              height: '45px',
              backgroundColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <FaUsers size={20} />
          </div>
          <div>
            <h4 className='mb-0 fw-bold'>Applicant Information</h4>
            <small className='opacity-75'>Single applicant required</small>
          </div>
        </div>
        <div
          className='px-3 py-1 rounded-pill fw-semibold'
          style={{
            backgroundColor:
              application.applicants?.length > 0
                ? 'rgba(34,197,94,0.3)'
                : 'rgba(239,68,68,0.3)',
            color: application.applicants?.length > 0 ? '#22c55e' : '#ef4444',
            border: `1px solid ${
              application.applicants?.length > 0 ? '#22c55e' : '#ef4444'
            }`,
          }}
        >
          {application.applicants?.length > 0 ? '✓ Complete' : '! Required'}
        </div>
      </div>

      <div className='p-4 bg-white'>
        {/* No Applicant Warning */}
        {(!application.applicants || application.applicants.length === 0) && (
          <div className='alert alert-warning border-0 rounded-3 text-center mb-4'>
            <i className='fas fa-exclamation-triangle me-2'></i>
            Please provide applicant details to continue.
          </div>
        )}

        {/* Existing Applicants */}
        {application.applicants?.map((applicant, index) => (
          <div key={applicant.id || index} className='mb-4'>
            {/* Basic Info */}
            <div className='card border-0 shadow-sm rounded-3 mb-3'>
              <div className='card-header bg-light d-flex justify-content-between align-items-center'>
                <h6 className='mb-0 fw-bold text-primary'>
                  <i className='fas fa-user me-2'></i>Basic Information
                </h6>
              </div>
              <div className='card-body'>
                <div className='row g-3'>
                  <EditableField
                    applicant={applicant}
                    index={index}
                    field='title'
                    label='Title'
                    options={TITLE_CHOICES}
                    cols={3}
                  />
                  <EditableField
                    applicant={applicant}
                    index={index}
                    field='first_name'
                    label='First Name'
                    cols={3}
                  />
                  <EditableField
                    applicant={applicant}
                    index={index}
                    field='last_name'
                    label='Last Name'
                    cols={3}
                  />
                  <EditableField
                    applicant={applicant}
                    index={index}
                    field='pps_number'
                    label={`${idNumberArray[0]} Number`}
                    cols={3}
                  />
                  <EditableField
                    applicant={applicant}
                    index={index}
                    field='date_of_birth'
                    label='Date of Birth'
                    type='date'
                  />
                </div>
              </div>
            </div>

            {/* Contact & Address */}
            <div className='row g-3'>
              <div className='col-md-6'>
                <div className='card border-0 shadow-sm rounded-3'>
                  <div className='card-header bg-success bg-opacity-10'>
                    <h6 className='mb-0 fw-bold text-success'>
                      <i className='fas fa-phone me-2'></i>Contact
                    </h6>
                  </div>
                  <div className='card-body'>
                    <div className='row g-3'>
                      <EditableField
                        applicant={applicant}
                        index={index}
                        field='email'
                        label='Email'
                        type='email'
                        cols={12}
                      />
                      <EditableField
                        applicant={applicant}
                        index={index}
                        field='phone_number'
                        label='Phone'
                        type='tel'
                        cols={12}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-md-6'>
                <div className='card border-0 shadow-sm rounded-3'>
                  <div className='card-header bg-warning bg-opacity-10'>
                    <h6 className='mb-0 fw-bold text-warning'>
                      <i className='fas fa-home me-2'></i>Address
                    </h6>
                  </div>
                  <div className='card-body'>
                    <div className='row g-2'>
                      <EditableField
                        applicant={applicant}
                        index={index}
                        field='address_line_1'
                        label='Address 1'
                        cols={12}
                      />
                      <EditableField
                        applicant={applicant}
                        index={index}
                        field='address_line_2'
                        label='Address 2 (Optional)'
                        cols={12}
                      />
                      <EditableField
                        applicant={applicant}
                        index={index}
                        field='city'
                        label='City'
                        cols={6}
                      />
                      <EditableField
                        applicant={applicant}
                        index={index}
                        field='county'
                        label='County'
                        cols={6}
                      />
                      <EditableField
                        applicant={applicant}
                        index={index}
                        field='postal_code'
                        label='Postal Code'
                        cols={6}
                      />
                      <EditableField
                        applicant={applicant}
                        index={index}
                        field='country'
                        label='Country'
                        cols={6}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Applicant Form */}
        {!application.approved &&
          !application.is_rejected &&
          (!application.applicants || application.applicants.length === 0) && (
            <>
              {showAddForm ? (
                <div className='card border-warning shadow-lg rounded-3'>
                  <div className='card-header d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0 fw-bold text-warning-emphasis'>
                      <FaPlus className='me-2' />
                      Add Applicant
                    </h5>
                    <button
                      className='btn btn-sm btn-outline-secondary rounded-pill'
                      onClick={() => {
                        setShowAddForm(false);
                        resetForm();
                      }}
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                  <div className='card-body'>
                    {!isFormValid &&
                      Object.values(newApplicant).some((val) => val !== '') && (
                        <div className='alert alert-info border-0 rounded-3 mb-4'>
                          <i className='fas fa-info-circle me-2'></i>
                          <strong>
                            Please complete all required fields marked with *
                          </strong>
                        </div>
                      )}

                    <div className='mb-4'>
                      <h6 className='fw-bold mb-3 text-primary'>
                        Basic Information
                      </h6>
                      <div className='row g-3'>
                        <FormField
                          field='title'
                          label='Title'
                          cols={3}
                          options={TITLE_CHOICES}
                        />
                        <FormField
                          field='first_name'
                          label='First Name'
                          cols={3}
                        />
                        <FormField
                          field='last_name'
                          label='Last Name'
                          cols={3}
                        />
                        <FormField
                          field='pps_number'
                          label={`${idNumberArray[0]} Number`}
                          cols={3}
                        />
                        <FormField
                          field='date_of_birth'
                          label='Date of Birth'
                          type='date'
                          cols={6}
                        />
                      </div>
                    </div>

                    <div className='row g-3 mb-4'>
                      <div className='col-md-6'>
                        <h6 className='fw-bold mb-3 text-success'>
                          Contact Information
                        </h6>
                        <div className='row g-3'>
                          <FormField
                            field='email'
                            label='Email'
                            type='email'
                            cols={12}
                          />
                          <FormField
                            field='phone_number'
                            label='Phone'
                            type='tel'
                            cols={12}
                          />
                        </div>
                      </div>

                      <div className='col-md-6'>
                        <h6 className='fw-bold mb-3 text-warning'>
                          Address Information
                        </h6>
                        <div className='row g-3'>
                          <FormField
                            field='address_line_1'
                            label='Address Line 1'
                            cols={12}
                          />
                          <FormField
                            field='address_line_2'
                            label='Address Line 2 (Optional)'
                            cols={12}
                          />
                          <FormField field='city' label='City' cols={6} />
                          <FormField field='county' label='County' cols={6} />
                          <FormField
                            field='postal_code'
                            label='Postal Code'
                            cols={6}
                          />
                          <FormField field='country' label='Country' cols={6} />
                        </div>
                      </div>
                    </div>

                    <div className='d-flex gap-2 justify-content-end'>
                      <button
                        className='btn btn-secondary rounded-pill px-4'
                        onClick={() => {
                          setShowAddForm(false);
                          resetForm();
                        }}
                      >
                        <FaTimes className='me-2' size={14} />
                        Cancel
                      </button>
                      <button
                        className='btn rounded-pill px-4'
                        onClick={addApplicant}
                        disabled={!isFormValid}
                        style={{
                          backgroundColor: isFormValid ? '#22c55e' : '#94a3b8',
                          color: 'white',
                          border: 'none',
                          opacity: isFormValid ? 1 : 0.7,
                          cursor: isFormValid ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <FaSave className='me-2' size={14} />
                        Save Applicant
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='text-center py-5'>
                  <div className='mb-4'>
                    <div
                      className='mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3'
                      style={{
                        width: '80px',
                        height: '80px',
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                      }}
                    >
                      <FaPlus size={30} />
                    </div>
                    <h5 className='fw-bold mb-2'>Add Applicant Information</h5>
                    <p className='text-muted'>
                      Provide applicant details to continue
                    </p>
                  </div>
                  <button
                    className='btn btn-primary btn-lg rounded-pill px-5'
                    style={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                    }}
                    onClick={() => setShowAddForm(true)}
                  >
                    <FaPlus className='me-2' />
                    Add Applicant
                  </button>
                </div>
              )}
            </>
          )}

        {/* Success Message */}
        {!application.approved &&
          !application.is_rejected &&
          application.applicants?.length > 0 && (
            <div className='alert alert-success border-0 rounded-3 text-center'>
              <i className='fas fa-check-circle me-2'></i>
              <strong>Applicant information completed!</strong> Only one
              applicant allowed per application.
            </div>
          )}
      </div>
    </div>
  );
};

export default ApplicantsPart;
