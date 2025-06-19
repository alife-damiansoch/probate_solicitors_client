import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { FaHome, FaPhone, FaUsers } from 'react-icons/fa';
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

// Enhanced field component with validation
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
        className='form-label fw-medium text-slate-600 mb-1'
        style={{ fontSize: '0.8rem' }}
      >
        {label} {isRequired && <span className='text-danger'>*</span>}
      </label>
      {options ? (
        <select
          className='form-control form-control-sm rounded-3 border-0 shadow-sm'
          style={{
            height: '32px',
            fontSize: '0.85rem',
            background:
              hasError || validationError
                ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
                : 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border:
              hasError || validationError
                ? '1px solid #ef4444'
                : '1px solid #e2e8f0',
          }}
          value={applicant[field] || ''}
          onChange={(e) => handleListChange(e, index, field)}
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
          className='form-control form-control-sm rounded-3 border-0 shadow-sm'
          style={{
            height: '32px',
            fontSize: '0.85rem',
            background:
              hasError || validationError
                ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
                : 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border:
              hasError || validationError
                ? '1px solid #ef4444'
                : '1px solid #e2e8f0',
          }}
          value={applicant[field] || ''}
          onChange={(e) => handleListChange(e, index, field)}
          placeholder={
            field === 'phone_number' ? phoneNrPlaceholder : `${label}`
          }
        />
      )}

      {/* Validation error message */}
      {validationError && (
        <div className='text-danger mt-1' style={{ fontSize: '0.75rem' }}>
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
      {/* Compact header */}
      <div
        className='d-flex align-items-center justify-content-between mb-3 p-3 rounded-4'
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className='d-flex align-items-center text-white'>
          <FaUsers size={18} className='me-2' />
          <span className='fw-bold'>Applicant Information</span>
        </div>
        <div
          className='px-3 py-1 rounded-pill fw-semibold text-white'
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            fontSize: '0.8rem',
          }}
        >
          Single Applicant Required
        </div>
      </div>

      {/* Single applicant card */}
      <div
        className='card border-0 shadow-lg rounded-4'
        style={{
          background: 'linear-gradient(135deg, #fafbff 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div className='card-body p-4'>
          {/* Ultra-compact form */}
          <div className='row g-2'>
            {/* Basic Info Row */}
            <div className='col-12 mb-3'>
              <h6
                className='fw-bold text-primary mb-2 d-flex align-items-center'
                style={{ fontSize: '0.9rem' }}
              >
                <FaUsers size={14} className='me-2' />
                Basic Information
              </h6>
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

            {/* Contact Info Row */}
            <div className='col-12 mb-3'>
              <h6
                className='fw-bold text-success mb-2 d-flex align-items-center'
                style={{ fontSize: '0.9rem' }}
              >
                <FaPhone size={14} className='me-2' />
                Contact Information
              </h6>
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

            {/* Address Info Row */}
            <div className='col-12'>
              <h6
                className='fw-bold text-warning mb-2 d-flex align-items-center'
                style={{ fontSize: '0.9rem' }}
              >
                <FaHome size={14} className='me-2' />
                Address Information
              </h6>
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

                {/* Country field - readonly based on cookies */}
                <div className='col-3 mb-2'>
                  <label
                    className='form-label fw-medium text-slate-600 mb-1'
                    style={{ fontSize: '0.8rem' }}
                  >
                    Country <span className='text-danger'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-sm rounded-3 border-0 shadow-sm'
                    style={{
                      height: '32px',
                      fontSize: '0.85rem',
                      background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                      border: '1px solid #bbf7d0',
                      color: '#166534',
                    }}
                    value={countryName}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Completion Status */}
          <div className='mt-3 text-center'>
            <div
              className='px-3 py-2 rounded-3'
              style={{
                backgroundColor: isFormComplete
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(239,68,68,0.1)',
                color: isFormComplete ? '#22c55e' : '#ef4444',
                fontSize: '0.85rem',
              }}
            >
              <i
                className={`fas ${
                  isFormComplete ? 'fa-check-circle' : 'fa-exclamation-circle'
                } me-2`}
              ></i>
              {isFormComplete
                ? 'Applicant information completed and validated!'
                : hasValidationErrors
                ? 'Please fix validation errors above'
                : 'Please complete all required fields marked with *'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
