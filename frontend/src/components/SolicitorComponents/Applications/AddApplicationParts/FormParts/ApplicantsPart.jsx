import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
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

// --- FIELD COMPONENT ---
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

  // Glassy input style (theme-driven)
  const inputStyle = {
    height: '48px',
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    background:
      hasError || validationError
        ? 'var(--error-20)'
        : 'var(--surface-secondary)',
    border:
      hasError || validationError
        ? '1.5px solid var(--error-30)'
        : '1.5px solid var(--border-primary)',
    borderRadius: '14px',
    boxShadow:
      hasError || validationError
        ? '0 4px 16px var(--error-20), inset 0 1px 0 rgba(255,255,255,0.09)'
        : '0 4px 24px var(--primary-10), inset 0 1px 0 rgba(255,255,255,0.08)',
    backdropFilter: 'blur(15px)',
    padding: '0 18px',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    textShadow: '0 1px 2px rgba(0,0,0,0.22)',
  };

  return (
    <motion.div
      className={`col-${mobileCol} col-md-${tabletCol} col-lg-${desktopCol} mb-3`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.02 * index }}
    >
      <label
        className='form-label fw-bold mb-2'
        style={{
          fontSize: '0.84rem',
          color: 'var(--text-secondary)',
          letterSpacing: '0.3px',
          textShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      >
        {label} {isRequired && <span className='status-warning'>*</span>}
      </label>
      {options ? (
        <select
          className='form-control border-0'
          style={inputStyle}
          value={applicant[field] || ''}
          onChange={(e) => handleListChange(e, index, field)}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              style={{
                background: 'var(--surface-primary)',
                color: 'var(--text-primary)',
              }}
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
        />
      )}

      {validationError && (
        <motion.div
          className='mt-2 p-2 rounded-2 d-flex align-items-center'
          style={{
            fontSize: '0.75rem',
            color: 'var(--warning-primary)',
            background: 'var(--warning-20)',
            border: '1px solid var(--warning-30)',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationCircle className='me-2' size={13} />
          <span>{validationError}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// --- MAIN APPLICANT PART ---
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

  // --- FORM FIELD LOGIC (unchanged) ---
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
      const valid = validatePPS(value);
      if (!valid)
        setValidationErrors((prev) => ({
          ...prev,
          [field]: 'Invalid PPS number format',
        }));
    }
    if (field === 'phone_number' && value.trim() !== '') {
      const result = formatPhoneToInternational(value, countrySolicitors);
      if (!result.success)
        setValidationErrors((prev) => ({ ...prev, [field]: result.error }));
      else value = result.formattedNumber;
    }
    setFormData((prev) => {
      const newApplicants = [...prev.applicants];
      newApplicants[index][field] = value;
      return { ...prev, applicants: newApplicants };
    });
  };

  // Init applicant if none
  useEffect(() => {
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
    }
    // eslint-disable-next-line
  }, []);

  if (!applicants || applicants.length === 0) return null;
  const applicant = applicants[0];
  const hasValidationErrors = Object.keys(validationErrors).length > 0;
  const allRequiredFieldsFilled = requiredFields.every(
    (f) => !isEmpty(applicant[f])
  );
  const isFormComplete = allRequiredFieldsFilled && !hasValidationErrors;

  // Notify parent on validation change
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange({
        isValid: isFormComplete,
        hasErrors: hasValidationErrors,
        missingFields: !allRequiredFieldsFilled,
        validationErrors,
      });
    }
    // eslint-disable-next-line
  }, [
    isFormComplete,
    hasValidationErrors,
    allRequiredFieldsFilled,
    validationErrors,
  ]);

  // --- MAIN RETURN ---
  return (
    <motion.div
      className='mb-5'
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring' }}
    >
      {/* Card Glass BG and Animated Overlay */}
      <motion.div
        className='position-relative overflow-hidden'
        style={{
          background: 'var(--gradient-surface)',
          border: '2px solid var(--border-primary)',
          borderRadius: '28px',
          boxShadow: `
            0 16px 32px rgba(0,0,0,0.16),
            0 8px 16px var(--primary-10),
            inset 0 1px 0 var(--white-10)
          `,
          backdropFilter: 'blur(32px)',
        }}
        initial={{ scale: 0.98, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{
          scale: 1.01,
          boxShadow: `
            0 24px 48px var(--primary-20),
            0 12px 24px var(--primary-30),
            0 8px 16px var(--success-20),
            inset 0 1px 0 var(--white-20)
          `,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 25 }}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            opacity: 0.5,
            background: `
            radial-gradient(circle at 18% 18%, var(--primary-30) 0%, transparent 45%),
            radial-gradient(circle at 88% 80%, var(--success-20) 0%, transparent 50%),
            radial-gradient(circle at 50% 12%, var(--primary-20) 0%, transparent 35%)
          `,
            animation: 'backgroundFloat 20s linear infinite',
          }}
        />

        {/* Header Section */}
        <div
          className='d-flex flex-column flex-md-row align-items-center justify-content-between p-4 pb-0 gap-3 position-relative'
          style={{ zIndex: 2 }}
        >
          <motion.div
            className='d-flex align-items-center gap-3'
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className='rounded-circle d-flex align-items-center justify-content-center'
              style={{
                width: 50,
                height: 50,
                background:
                  'linear-gradient(145deg, var(--primary-blue), var(--success-primary))',
                border: '2px solid rgba(255,255,255,0.21)',
                boxShadow: '0 6px 16px var(--primary-20)',
              }}
              whileHover={{ scale: 1.08 }}
            >
              <FaUsers size={20} style={{ color: 'var(--text-primary)' }} />
            </motion.div>
            <span
              className='fw-bold'
              style={{
                fontSize: 'clamp(1.06rem, 2.2vw, 1.18rem)',
                letterSpacing: '0.03em',
                background:
                  'linear-gradient(135deg, var(--text-primary), var(--primary-blue-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Applicant Information
            </span>
          </motion.div>
          <div
            className='px-3 py-1 rounded-pill fw-semibold'
            style={{
              background: 'var(--success-20)',
              border: '1px solid var(--success-30)',
              color: 'var(--success-primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              backdropFilter: 'blur(8px)',
            }}
          >
            Single Applicant Required
          </div>
        </div>

        {/* Fields Section */}
        <div className='p-4 pt-2 position-relative' style={{ zIndex: 2 }}>
          {/* Basic Info */}
          <motion.div
            className='mb-5'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className='d-flex align-items-center gap-2 mb-3'>
              <div
                className='rounded-circle d-flex align-items-center justify-content-center'
                style={{
                  width: 32,
                  height: 32,
                  background: 'var(--primary-20)',
                  color: 'var(--primary-blue)',
                  border: '2px solid var(--primary-blue-dark)',
                  boxShadow: '0 4px 12px var(--primary-20)',
                }}
              >
                <FaUsers size={13} />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                }}
              >
                Basic Information
              </span>
            </div>
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
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className='mb-5'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            <div className='d-flex align-items-center gap-2 mb-3'>
              <div
                className='rounded-circle d-flex align-items-center justify-content-center'
                style={{
                  width: 32,
                  height: 32,
                  background: 'var(--success-20)',
                  color: 'var(--success-primary)',
                  border: '2px solid var(--success-dark)',
                  boxShadow: '0 4px 12px var(--success-30)',
                }}
              >
                <FaPhone size={13} />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                }}
              >
                Contact Information
              </span>
            </div>
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
                label={`Phone (${countrySolicitors === 'IE' ? '+353' : '+44'})`}
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
          </motion.div>

          {/* Address Info */}
          <motion.div
            className='mb-5'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className='d-flex align-items-center gap-2 mb-3'>
              <div
                className='rounded-circle d-flex align-items-center justify-content-center'
                style={{
                  width: 32,
                  height: 32,
                  background: 'var(--warning-20)',
                  color: 'var(--warning-dark)',
                  border: '2px solid var(--warning-dark)',
                  boxShadow: '0 4px 12px var(--warning-30)',
                }}
              >
                <FaHome size={13} />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                }}
              >
                Address Information
              </span>
            </div>
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
                isOptional
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
              {/* Country field (readonly) */}
              <div className='col-6 col-md-4 col-lg-3 mb-3'>
                <label
                  className='form-label fw-bold mb-2'
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Country <span className='status-warning'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control border-0'
                  style={{
                    height: 48,
                    fontSize: '0.95rem',
                    background: 'var(--success-20)',
                    border: '1.5px solid var(--success-30)',
                    borderRadius: '14px',
                    color: 'var(--success-primary)',
                    fontWeight: 700,
                    textShadow: '0 2px 4px rgba(0,0,0,0.23)',
                    padding: '0 18px',
                    backdropFilter: 'blur(10px)',
                  }}
                  value={countryName}
                  readOnly
                />
              </div>
            </div>
          </motion.div>

          {/* Completion Status */}
          <motion.div
            className='text-center mb-2'
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.21 }}
          >
            <motion.div
              className='px-4 py-3 rounded-3 d-inline-flex align-items-center gap-3'
              style={{
                background: isFormComplete
                  ? 'var(--success-20)'
                  : hasValidationErrors
                  ? 'var(--error-20)'
                  : 'var(--warning-20)',
                color: isFormComplete
                  ? 'var(--success-primary)'
                  : hasValidationErrors
                  ? 'var(--error-primary)'
                  : 'var(--warning-dark)',
                fontSize: '0.93rem',
                fontWeight: 700,
                border: isFormComplete
                  ? '1.5px solid var(--success-30)'
                  : hasValidationErrors
                  ? '1.5px solid var(--error-30)'
                  : '1.5px solid var(--warning-30)',
                backdropFilter: 'blur(20px)',
                boxShadow: isFormComplete
                  ? '0 6px 22px var(--success-20)'
                  : hasValidationErrors
                  ? '0 6px 22px var(--error-20)'
                  : '0 6px 22px var(--warning-20)',
                textShadow: '0 2px 4px rgba(0,0,0,0.19)',
                letterSpacing: '0.2px',
                maxWidth: '100%',
              }}
            >
              {isFormComplete ? (
                <>
                  <FaCheckCircle size={16} />
                  <span className='d-none d-sm-inline'>
                    Applicant information completed and validated!
                  </span>
                  <span className='d-inline d-sm-none'>Complete!</span>
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
            </motion.div>
          </motion.div>
        </div>

        {/* Extra glass effect with blur on hover */}
        <style>{`
          @keyframes backgroundFloat {
            0%,100%{transform:translateY(0) rotate(0deg);opacity:.5;}
            40%{transform:translateY(-18px) rotate(90deg);opacity:.7;}
            80%{transform:translateY(10px) rotate(180deg);opacity:.7;}
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}
