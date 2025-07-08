import Cookies from 'js-cookie';
import React, { useState } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaHome,
  FaPhone,
  FaUsers,
} from 'react-icons/fa';
import {
  formatPhoneToInternational,
  validatePPS,
} from '../../../../GenericFunctions/HelperGenericFunctions';
import {
  COUNTY_OPTIONS_IE,
  COUNTY_OPTIONS_UK,
} from '../../../ApplicationDetailsParts/EstatesManagerModalParts/estateFieldConfig';

const TITLE_CHOICES = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Ms', label: 'Ms' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Dr', label: 'Dr' },
  { value: 'Prof', label: 'Prof' },
];

const isEmpty = (val) => val === '' || val === null || val === undefined;

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

// Validation functions
const validatePPSField = (value) => {
  if (!value || value.trim() === '')
    return { valid: false, message: 'PPS number is required' };
  const isValid = validatePPS(value);
  return {
    valid: isValid,
    message: isValid ? '' : 'Invalid PPS number format',
  };
};

const validatePhoneField = (value, country) => {
  if (!value || value.trim() === '')
    return { valid: false, message: 'Phone number is required' };
  const result = formatPhoneToInternational(value, country);
  return { valid: result.success, message: result.success ? '' : result.error };
};

// Enhanced field component with glassmorphism styling
const Field = ({
  field,
  label,
  type = 'text',
  cols = 4,
  applicant,
  index,
  options = null,
  handleListChange,
  phoneNrPlaceholder,
  countrySolicitors,
  validationErrors,
}) => {
  const isRequired = requiredFields.includes(field);
  const hasError = isEmpty(applicant[field]) && isRequired;
  const validationError = validationErrors[field];

  return (
    <div className={`col-${cols} mb-2`}>
      <label
        className='form-label fw-medium mb-1'
        style={{
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        }}
      >
        {label} {isRequired && <span className='text-warning'>*</span>}
      </label>
      {options ? (
        <select
          className='form-control form-control-sm border-0'
          style={{
            height: '32px',
            fontSize: '0.85rem',
            background:
              hasError || validationError
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                : 'rgba(255, 255, 255, 0.15)',
            border:
              hasError || validationError
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
          value={applicant[field] || ''}
          onChange={(e) => handleListChange(e, index, field)}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.background =
              hasError || validationError
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                : 'rgba(255, 255, 255, 0.15)';
            e.target.style.borderColor =
              hasError || validationError
                ? 'rgba(239, 68, 68, 0.4)'
                : 'rgba(255, 255, 255, 0.2)';
          }}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{ background: '#1F2049', color: '#ffffff' }}
            >
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className='form-control form-control-sm border-0'
          style={{
            height: '32px',
            fontSize: '0.85rem',
            background:
              hasError || validationError
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                : 'rgba(255, 255, 255, 0.15)',
            border:
              hasError || validationError
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
          value={applicant[field] || ''}
          onChange={(e) => handleListChange(e, index, field)}
          placeholder={
            field === 'phone_number' ? phoneNrPlaceholder : `${label}`
          }
          onFocus={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.background =
              hasError || validationError
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                : 'rgba(255, 255, 255, 0.15)';
            e.target.style.borderColor =
              hasError || validationError
                ? 'rgba(239, 68, 68, 0.4)'
                : 'rgba(255, 255, 255, 0.2)';
          }}
        />
      )}

      {/* Validation error message */}
      {validationError && (
        <div
          className='mt-1'
          style={{
            fontSize: '0.75rem',
            color: '#fbbf24',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          <i className='fas fa-exclamation-circle me-1'></i>
          {validationError}
        </div>
      )}
    </div>
  );
};

export default function ApplicantsPart({
  applicants,
  setFormData,
  idNumberArray,
  onValidationChange, // Add this prop to notify parent about validation state
}) {
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // Get country and phone placeholder from cookies
  const countrySolicitors = Cookies.get('country_solicitors') || 'IE';
  const phoneNrPlaceholder =
    Cookies.get('phone_nr_placeholder') || '+353871234567';
  const countryName = countrySolicitors === 'IE' ? 'Ireland' : 'United Kingdom';
  const countyOptions =
    countrySolicitors === 'IE' ? COUNTY_OPTIONS_IE : COUNTY_OPTIONS_UK;

  const handleListChange = (e, index, field) => {
    let value = e.target.value;

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Validate special fields on blur/change
    if (field === 'pps_number' && value.trim() !== '') {
      const validation = validatePPSField(value);
      if (!validation.valid) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: validation.message,
        }));
      }
    }

    if (field === 'phone_number' && value.trim() !== '') {
      // First validate the original input
      const validation = validatePhoneField(value, countrySolicitors);
      if (!validation.valid) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: validation.message,
        }));
      } else {
        // If valid, format the phone number
        const result = formatPhoneToInternational(value, countrySolicitors);
        if (result.success) {
          value = result.formattedNumber;
        }
      }
    }

    // Legacy phone formatting (fallback if validation doesn't handle it)
    if (field === 'phone_number' && !validationErrors[field]) {
      // Remove any existing formatting
      const cleanValue = value.replace(/[^\d]/g, '');

      if (countrySolicitors === 'IE') {
        // Irish phone formatting
        if (cleanValue.startsWith('0')) {
          value = '353' + cleanValue.substring(1);
        }
        if (cleanValue.length > 0 && !cleanValue.startsWith('353')) {
          value = '353' + cleanValue;
        }
        if (value.startsWith('353') && value.length >= 4) {
          value = '+353 ' + value.substring(3);
        }
      } else if (countrySolicitors === 'UK') {
        // UK phone formatting
        if (cleanValue.startsWith('0')) {
          value = '44' + cleanValue.substring(1);
        }
        if (cleanValue.length > 0 && !cleanValue.startsWith('44')) {
          value = '44' + cleanValue;
        }
        if (value.startsWith('44') && value.length >= 3) {
          value = '+44 ' + value.substring(2);
        }
      }
    }

    setFormData((prev) => {
      const newApplicants = [...prev.applicants];
      newApplicants[index][field] = value;
      return { ...prev, applicants: newApplicants };
    });
  };

  // Initialize applicant if doesn't exist
  if (!applicants || applicants.length === 0) {
    setFormData((prev) => ({
      ...prev,
      applicants: [
        {
          title: 'Mr',
          first_name: '',
          last_name: '',
          pps_number: '',
          address_line_1: '',
          address_line_2: '',
          city: '',
          county: '',
          postal_code: '',
          country: countryName,
          date_of_birth: '',
          email: '',
          phone_number: '',
        },
      ],
    }));
    return null; // Return null while initializing
  }

  const applicant = applicants[0];

  // Check if form is valid (no validation errors and all required fields filled)
  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const allRequiredFieldsFilled = requiredFields.every(
    (field) => !isEmpty(applicant[field])
  );
  const isFormComplete = allRequiredFieldsFilled && !hasValidationErrors;

  // Notify parent component about validation state changes
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange({
        isValid: isFormComplete,
        hasErrors: hasValidationErrors,
        missingFields: !allRequiredFieldsFilled,
        validationErrors: validationErrors,
      });
    }
  }, [
    isFormComplete,
    hasValidationErrors,
    allRequiredFieldsFilled,
    validationErrors,
    onValidationChange,
  ]);

  return (
    <div className='mb-4'>
      {/* Enhanced Header */}
      <div
        className='d-flex align-items-center justify-content-between mb-3 p-3 position-relative'
        style={{
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className='d-flex align-items-center text-white'>
          <div
            className='rounded-circle d-flex align-items-center justify-content-center me-3'
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <FaUsers size={14} />
          </div>
          <span
            className='fw-bold'
            style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            Applicant Information
          </span>
        </div>
        <div
          className='px-3 py-1 rounded-pill fw-semibold text-white'
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            fontSize: '0.8rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          Single Applicant Required
        </div>
      </div>

      {/* Enhanced Single applicant card */}
      <div
        className='position-relative overflow-hidden'
        style={{
          background: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(248, 250, 252, 0.08)),
            radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.15), transparent 50%),
            radial-gradient(circle at 70% 90%, rgba(139, 92, 246, 0.1), transparent 50%)
          `,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          boxShadow: `
            0 12px 24px rgba(0, 0, 0, 0.2),
            0 4px 8px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Animated Background Pattern */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.03) 0%, transparent 50%)
            `,
            opacity: 0.6,
            animation: 'float 6s ease-in-out infinite',
          }}
        />

        <div className='p-4 position-relative'>
          {/* Ultra-compact form */}
          <div className='row g-2'>
            {/* Basic Info Section */}
            <div className='col-12 mb-3'>
              <h6
                className='fw-bold mb-3 d-flex align-items-center'
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  className='rounded-circle d-flex align-items-center justify-content-center me-2'
                  style={{
                    width: '24px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                  }}
                >
                  <FaUsers size={10} />
                </div>
                Basic Information
              </h6>
              <div
                className='p-3 rounded-3'
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className='row g-1'>
                  <Field
                    field='title'
                    label='Title'
                    cols={2}
                    applicant={applicant}
                    index={0}
                    options={TITLE_CHOICES}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                  <Field
                    field='first_name'
                    label='First Name'
                    cols={3}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                  <Field
                    field='last_name'
                    label='Last Name'
                    cols={3}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                  <Field
                    field='pps_number'
                    label={idNumberArray[0]}
                    cols={2}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                  <Field
                    field='date_of_birth'
                    label='Date of Birth'
                    type='date'
                    cols={2}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info Section */}
            <div className='col-12 mb-3'>
              <h6
                className='fw-bold mb-3 d-flex align-items-center'
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  className='rounded-circle d-flex align-items-center justify-content-center me-2'
                  style={{
                    width: '24px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                  }}
                >
                  <FaPhone size={10} />
                </div>
                Contact Information
              </h6>
              <div
                className='p-3 rounded-3'
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className='row g-1'>
                  <Field
                    field='email'
                    label='Email Address'
                    type='email'
                    cols={6}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                  <Field
                    field='phone_number'
                    label={`Phone (${
                      countrySolicitors === 'IE' ? '+353' : '+44'
                    })`}
                    type='tel'
                    cols={6}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    phoneNrPlaceholder={phoneNrPlaceholder}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                </div>
              </div>
            </div>

            {/* Address Info Section */}
            <div className='col-12'>
              <h6
                className='fw-bold mb-3 d-flex align-items-center'
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  className='rounded-circle d-flex align-items-center justify-content-center me-2'
                  style={{
                    width: '24px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                  }}
                >
                  <FaHome size={10} />
                </div>
                Address Information
              </h6>
              <div
                className='p-3 rounded-3'
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className='row g-1'>
                  <Field
                    field='address_line_1'
                    label='Address Line 1'
                    cols={6}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                  <Field
                    field='address_line_2'
                    label='Address Line 2 (Optional)'
                    cols={6}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                  <Field
                    field='city'
                    label='City/Town'
                    cols={3}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                  <Field
                    field='county'
                    label='County'
                    cols={3}
                    applicant={applicant}
                    index={0}
                    options={countyOptions}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />
                  <Field
                    field='postal_code'
                    label={countrySolicitors === 'IE' ? 'Eircode' : 'Postcode'}
                    cols={3}
                    applicant={applicant}
                    index={0}
                    handleListChange={handleListChange}
                    countrySolicitors={countrySolicitors}
                    validationErrors={validationErrors}
                  />

                  {/* Enhanced Country field - readonly */}
                  <div className='col-3 mb-2'>
                    <label
                      className='form-label fw-medium mb-1'
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      Country <span className='text-warning'>*</span>
                    </label>
                    <input
                      type='text'
                      className='form-control form-control-sm border-0'
                      style={{
                        height: '32px',
                        fontSize: '0.85rem',
                        background:
                          'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.15))',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '12px',
                        color: '#22c55e',
                        backdropFilter: 'blur(10px)',
                        fontWeight: '600',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                      }}
                      value={countryName}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Completion Status */}
          <div className='mt-4 text-center'>
            <div
              className='px-4 py-3 rounded-3 d-inline-flex align-items-center gap-2'
              style={{
                background: isFormComplete
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.15))'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.15))',
                color: isFormComplete ? '#22c55e' : '#f59e0b',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: isFormComplete
                  ? '1px solid rgba(34, 197, 94, 0.3)'
                  : '1px solid rgba(245, 158, 11, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: isFormComplete
                  ? '0 4px 12px rgba(34, 197, 94, 0.2)'
                  : '0 4px 12px rgba(245, 158, 11, 0.2)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {isFormComplete ? (
                <>
                  <FaCheckCircle size={14} />
                  Applicant information completed and validated!
                </>
              ) : hasValidationErrors ? (
                <>
                  <FaExclamationCircle size={14} />
                  Please fix validation errors above
                </>
              ) : (
                <>
                  <FaExclamationCircle size={14} />
                  Please complete all required fields marked with *
                </>
              )}
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-4px) rotate(1deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
