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

// Enhanced responsive field component
const Field = ({
  field,
  label,
  type = 'text',
  mobileCol = 12,
  tabletCol = 6,
  desktopCol = 4,
  applicant,
  index,
  options = null,
  handleListChange,
  phoneNrPlaceholder,
  countrySolicitors,
  validationErrors,
  isOptional = false,
}) => {
  const isRequired = !isOptional && requiredFields.includes(field);
  const hasError = isEmpty(applicant[field]) && isRequired;
  const validationError = validationErrors[field];

  const inputStyle = {
    height: '48px',
    fontSize: '0.9rem',
    background:
      hasError || validationError
        ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(185, 28, 28, 0.1) 100%)'
        : 'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(29, 78, 216, 0.08) 100%)',
    border:
      hasError || validationError
        ? '1px solid rgba(239, 68, 68, 0.4)'
        : '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '12px',
    backdropFilter: 'blur(20px)',
    color: 'rgba(255, 255, 255, 0.9)',
    boxShadow:
      hasError || validationError
        ? '0 4px 15px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        : '0 4px 15px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: '0 16px',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
  };

  const handleFocus = (e) => {
    e.target.style.background =
      'linear-gradient(145deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 50%, rgba(29, 78, 216, 0.1) 100%)';
    e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow =
      '0 8px 25px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
  };

  const handleBlur = (e) => {
    e.target.style.background =
      hasError || validationError
        ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(185, 28, 28, 0.1) 100%)'
        : 'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(29, 78, 216, 0.08) 100%)';
    e.target.style.borderColor =
      hasError || validationError
        ? 'rgba(239, 68, 68, 0.4)'
        : 'rgba(59, 130, 246, 0.3)';
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow =
      hasError || validationError
        ? '0 4px 15px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        : '0 4px 15px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
  };

  return (
    <div
      className={`col-${mobileCol} col-md-${tabletCol} col-lg-${desktopCol} mb-3`}
    >
      <label
        className='form-label fw-bold mb-2'
        style={{
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.3px',
        }}
      >
        {label} {isRequired && <span className='text-warning'>*</span>}
      </label>

      {options ? (
        <select
          className='form-control border-0'
          style={inputStyle}
          value={applicant[field] || ''}
          onChange={(e) => handleListChange(e, index, field)}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          className='form-control border-0'
          style={inputStyle}
          value={applicant[field] || ''}
          onChange={(e) => handleListChange(e, index, field)}
          placeholder={
            field === 'phone_number'
              ? phoneNrPlaceholder
              : `Enter ${label.toLowerCase()}`
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      )}

      {validationError && (
        <div
          className='mt-2 p-2 rounded-2 d-flex align-items-center'
          style={{
            fontSize: '0.75rem',
            color: '#fbbf24',
            background:
              'linear-gradient(145deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
          }}
        >
          <FaExclamationCircle className='me-2 flex-shrink-0' size={12} />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};

export default function ApplicantsPart({
  applicants,
  setFormData,
  idNumberArray,
  onValidationChange,
}) {
  const [validationErrors, setValidationErrors] = useState({});

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

    // Validate special fields
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
      const validation = validatePhoneField(value, countrySolicitors);
      if (!validation.valid) {
        setValidationErrors((prev) => ({
          ...prev,
          [field]: validation.message,
        }));
      } else {
        const result = formatPhoneToInternational(value, countrySolicitors);
        if (result.success) {
          value = result.formattedNumber;
        }
      }
    }

    // Legacy phone formatting fallback
    if (field === 'phone_number' && !validationErrors[field]) {
      const cleanValue = value.replace(/[^\d]/g, '');
      if (countrySolicitors === 'IE') {
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
    return null;
  }

  const applicant = applicants[0];
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
      <style jsx>{`
        input::placeholder,
        textarea::placeholder,
        select::placeholder {
          color: rgba(203, 213, 225, 0.8) !important;
          opacity: 1 !important;
          font-weight: 500 !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
        }

        input:focus::placeholder,
        textarea:focus::placeholder,
        select:focus::placeholder {
          color: rgba(148, 163, 184, 0.9) !important;
          opacity: 1 !important;
        }
      `}</style>

      {/* Enhanced Header */}
      <div
        className='d-flex flex-column flex-sm-row align-items-center justify-content-between mb-4 p-3 p-md-4 position-relative gap-3 text-center text-sm-start'
        style={{
          background: `
            linear-gradient(145deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 50%, rgba(109, 40, 217, 0.9) 100%),
            linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
          boxShadow:
            '0 8px 25px rgba(139, 92, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        <div className='d-flex align-items-center text-white position-relative'>
          <div
            className='rounded-circle d-flex align-items-center justify-content-center me-3'
            style={{
              width: '40px',
              height: '40px',
              background:
                'linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
              backdropFilter: 'blur(15px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow:
                '0 4px 15px rgba(139, 92, 246, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            }}
          >
            <FaUsers
              size={16}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
            />
          </div>
          <span
            className='fw-bold'
            style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              background: 'linear-gradient(145deg, #ffffff, #e2e8f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <span className='d-none d-sm-inline'>Applicant Information</span>
            <span className='d-inline d-sm-none'>Applicant Info</span>
          </span>
        </div>
        <div
          className='px-3 py-2 rounded-pill fw-bold text-white position-relative'
          style={{
            background:
              'linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
            fontSize: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(15px)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            letterSpacing: '0.3px',
          }}
        >
          <span className='d-none d-sm-inline'>Single Applicant Required</span>
          <span className='d-inline d-sm-none'>Required</span>
        </div>
      </div>

      {/* Enhanced applicant card */}
      <div
        className='position-relative overflow-hidden'
        style={{
          background: `
            linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 25%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.95) 75%, rgba(30, 41, 59, 0.95) 100%),
            radial-gradient(circle at 30% 10%, rgba(139, 92, 246, 0.15), transparent 50%),
            radial-gradient(circle at 70% 90%, rgba(124, 58, 237, 0.12), transparent 50%)
          `,
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '24px',
          boxShadow: `
            0 12px 30px rgba(0, 0, 0, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className='p-3 p-md-4 position-relative'>
          {/* Basic Info Section */}
          <div className='mb-5'>
            <h6
              className='fw-bold mb-3 d-flex align-items-center'
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.3px',
              }}
            >
              <div
                className='rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0'
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow:
                    '0 4px 15px rgba(139, 92, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                }}
              >
                <FaUsers
                  size={12}
                  style={{
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                  }}
                />
              </div>
              Basic Information
            </h6>
            <div
              className='p-4 rounded-3'
              style={{
                background:
                  'linear-gradient(145deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.08))',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                backdropFilter: 'blur(15px)',
                boxShadow:
                  '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className='row g-3'>
                <Field
                  field='title'
                  label='Title'
                  mobileCol={6}
                  tabletCol={3}
                  desktopCol={2}
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
                  mobileCol={6}
                  tabletCol={4}
                  desktopCol={3}
                  applicant={applicant}
                  index={0}
                  handleListChange={handleListChange}
                  countrySolicitors={countrySolicitors}
                  validationErrors={validationErrors}
                />
                <Field
                  field='last_name'
                  label='Last Name'
                  mobileCol={12}
                  tabletCol={5}
                  desktopCol={3}
                  applicant={applicant}
                  index={0}
                  handleListChange={handleListChange}
                  countrySolicitors={countrySolicitors}
                  validationErrors={validationErrors}
                />
                <Field
                  field='pps_number'
                  label={idNumberArray[0]}
                  mobileCol={6}
                  tabletCol={6}
                  desktopCol={2}
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
                  mobileCol={6}
                  tabletCol={6}
                  desktopCol={2}
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
          <div className='mb-5'>
            <h6
              className='fw-bold mb-3 d-flex align-items-center'
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.3px',
              }}
            >
              <div
                className='rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0'
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow:
                    '0 4px 15px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                }}
              >
                <FaPhone
                  size={12}
                  style={{
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                  }}
                />
              </div>
              Contact Information
            </h6>
            <div
              className='p-4 rounded-3'
              style={{
                background:
                  'linear-gradient(145deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.08))',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                backdropFilter: 'blur(15px)',
                boxShadow:
                  '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className='row g-3'>
                <Field
                  field='email'
                  label='Email Address'
                  type='email'
                  mobileCol={12}
                  tabletCol={6}
                  desktopCol={6}
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
                  mobileCol={12}
                  tabletCol={6}
                  desktopCol={6}
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
          <div className='mb-5'>
            <h6
              className='fw-bold mb-3 d-flex align-items-center'
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.3px',
              }}
            >
              <div
                className='rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0'
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(145deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow:
                    '0 4px 15px rgba(245, 158, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                }}
              >
                <FaHome
                  size={12}
                  style={{
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                  }}
                />
              </div>
              Address Information
            </h6>
            <div
              className='p-4 rounded-3'
              style={{
                background:
                  'linear-gradient(145deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.08))',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                backdropFilter: 'blur(15px)',
                boxShadow:
                  '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className='row g-3'>
                <Field
                  field='address_line_1'
                  label='Address Line 1'
                  mobileCol={12}
                  tabletCol={6}
                  desktopCol={6}
                  applicant={applicant}
                  index={0}
                  handleListChange={handleListChange}
                  countrySolicitors={countrySolicitors}
                  validationErrors={validationErrors}
                />
                <Field
                  field='address_line_2'
                  label='Address Line 2 (Optional)'
                  mobileCol={12}
                  tabletCol={6}
                  desktopCol={6}
                  applicant={applicant}
                  index={0}
                  handleListChange={handleListChange}
                  countrySolicitors={countrySolicitors}
                  validationErrors={validationErrors}
                  isOptional={true}
                />
                <Field
                  field='city'
                  label='City/Town'
                  mobileCol={6}
                  tabletCol={4}
                  desktopCol={3}
                  applicant={applicant}
                  index={0}
                  handleListChange={handleListChange}
                  countrySolicitors={countrySolicitors}
                  validationErrors={validationErrors}
                />
                <Field
                  field='county'
                  label='County'
                  mobileCol={6}
                  tabletCol={4}
                  desktopCol={3}
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
                  mobileCol={6}
                  tabletCol={4}
                  desktopCol={3}
                  applicant={applicant}
                  index={0}
                  handleListChange={handleListChange}
                  countrySolicitors={countrySolicitors}
                  validationErrors={validationErrors}
                />

                {/* Country field - readonly with enhanced styling */}
                <div className='col-6 col-md-4 col-lg-3 mb-3'>
                  <label
                    className='form-label fw-bold mb-2'
                    style={{
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Country <span className='text-warning'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control border-0'
                    style={{
                      height: '48px',
                      fontSize: '0.9rem',
                      background:
                        'linear-gradient(145deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.15) 50%, rgba(16, 185, 129, 0.1) 100%)',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      borderRadius: '12px',
                      color: '#22c55e',
                      backdropFilter: 'blur(20px)',
                      fontWeight: '700',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      padding: '0 16px',
                      boxShadow:
                        '0 4px 15px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      letterSpacing: '0.3px',
                    }}
                    value={countryName}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Completion Status */}
          <div className='text-center'>
            <div
              className='px-4 py-3 rounded-3 d-inline-flex align-items-center gap-3'
              style={{
                background: isFormComplete
                  ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 50%, rgba(29, 78, 216, 0.1) 100%)'
                  : hasValidationErrors
                  ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(185, 28, 28, 0.1) 100%)'
                  : 'linear-gradient(145deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.15) 50%, rgba(180, 83, 9, 0.1) 100%)',
                color: isFormComplete
                  ? '#60a5fa'
                  : hasValidationErrors
                  ? '#fca5a5'
                  : '#fbbf24',
                fontSize: '0.9rem',
                fontWeight: '700',
                border: isFormComplete
                  ? '1px solid rgba(59, 130, 246, 0.4)'
                  : hasValidationErrors
                  ? '1px solid rgba(239, 68, 68, 0.4)'
                  : '1px solid rgba(245, 158, 11, 0.4)',
                backdropFilter: 'blur(20px)',
                boxShadow: isFormComplete
                  ? '0 6px 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : hasValidationErrors
                  ? '0 6px 20px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 6px 20px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.3px',
                maxWidth: '100%',
              }}
            >
              {isFormComplete ? (
                <>
                  <FaCheckCircle size={16} />
                  <span className='d-none d-sm-inline'>
                    Applicant information completed and validated!
                  </span>
                  <span className='d-inline d-sm-none'>
                    Information completed!
                  </span>
                </>
              ) : hasValidationErrors ? (
                <>
                  <FaExclamationCircle size={16} />
                  <span className='d-none d-sm-inline'>
                    Please fix validation errors above
                  </span>
                  <span className='d-inline d-sm-none'>Fix errors above</span>
                </>
              ) : (
                <>
                  <FaExclamationCircle size={16} />
                  <span className='d-none d-sm-inline'>
                    Please complete all required fields marked with *
                  </span>
                  <span className='d-inline d-sm-none'>
                    Complete required fields
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
