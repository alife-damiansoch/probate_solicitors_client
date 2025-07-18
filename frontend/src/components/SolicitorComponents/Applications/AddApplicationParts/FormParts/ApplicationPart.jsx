import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import {
  FaCheckCircle,
  FaEuroSign,
  FaExclamationTriangle,
  FaFileAlt,
  FaGavel,
  FaTimesCircle,
  FaUser,
} from 'react-icons/fa';

// Helper function - MOVED OUTSIDE
const isEmpty = (val) => val === '' || val === null || val === undefined;

// Glassmorphic, theme-driven Field component
const Field = ({
  field,
  label,
  type = 'text',
  cols = 6,
  nested = null,
  icon = null,
  disabled = false,
  placeholder = '',
  required = true,
  formData,
  setFormData,
  index = 0,
}) => {
  const value = nested ? formData[nested][field] : formData[field];
  const hasError = required && isEmpty(value);

  const handleChange = (e) => {
    let newValue = e.target.value;
    if (type === 'number' && field === 'amount') {
      newValue = newValue.replace(/[^0-9.]/g, '');
    }
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [nested]: { ...prev[nested], [field]: newValue },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: newValue }));
    }
  };

  const inputStyle = {
    height: type === 'textarea' ? undefined : '48px',
    minHeight: type === 'textarea' ? '100px' : undefined,
    fontSize: '0.97rem',
    color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
    background: hasError
      ? 'var(--error-20)'
      : disabled
      ? 'var(--surface-tertiary)'
      : 'var(--surface-secondary)',
    border: hasError
      ? '1.5px solid var(--error-30)'
      : disabled
      ? '1.5px solid var(--border-muted)'
      : '1.5px solid var(--border-primary)',
    borderRadius: '14px',
    boxShadow: hasError
      ? '0 4px 14px var(--error-20),inset 0 1px 0 rgba(255,255,255,0.10)'
      : disabled
      ? '0 2px 8px var(--border-muted),inset 0 1px 0 rgba(255,255,255,0.03)'
      : '0 4px 20px var(--primary-10),inset 0 1px 0 rgba(255,255,255,0.08)',
    backdropFilter: 'blur(15px)',
    resize: type === 'textarea' ? 'vertical' : undefined,
    padding: type === 'textarea' ? '13px 16px' : '0 18px',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    textShadow: '0 1px 2px rgba(0,0,0,0.22)',
  };

  return (
    <motion.div
      className={`col-md-${cols} mb-3`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * index }}
    >
      <label
        className='form-label fw-bold mb-2'
        style={{
          fontSize: '0.84rem',
          color: 'var(--text-secondary)',
          letterSpacing: '0.3px',
          textShadow: '0 1px 2px rgba(0,0,0,0.15)',
        }}
      >
        {icon && <i className={`${icon} me-2`}></i>}
        {label} {required && <span className='status-warning'>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          className='form-control border-0'
          style={inputStyle}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          className='form-control border-0'
          style={inputStyle}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={type === 'number' ? '0' : undefined}
          step={type === 'number' && field === 'amount' ? '0.01' : undefined}
        />
      )}
      {hasError && (
        <motion.small
          className='mt-2 d-flex align-items-center'
          style={{
            color: 'var(--warning-primary)',
            textShadow: '0 1px 2px rgba(0,0,0,0.14)',
            fontSize: '0.76rem',
            fontWeight: 600,
          }}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <FaExclamationTriangle className='me-2' size={13} />
          {label} is required
        </motion.small>
      )}
    </motion.div>
  );
};

export default function ApplicationPart({ formData, setFormData }) {
  const currencySign = Cookies.get('currency_sign') || '€';

  // Form completion status logic
  const requiredFields = [
    formData.amount,
    formData.deceased?.first_name,
    formData.deceased?.last_name,
    formData.was_will_prepared_by_solicitor,
  ];
  const isFormComplete = requiredFields.every((f) => !isEmpty(f));

  return (
    <motion.div
      className='mb-4'
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {/* Glassy, Animated Header */}
      <motion.div
        className='d-flex align-items-center justify-content-between mb-4 p-3 p-md-4 position-relative'
        style={{
          background: `
            var(--gradient-header),
            linear-gradient(135deg, var(--primary-20) 0%, var(--primary-blue-dark) 100%)
          `,
          borderRadius: '20px',
          boxShadow: `
            0 8px 24px var(--primary-30),
            0 2px 7px var(--primary-10),
            inset 0 2px 4px rgba(255,255,255,0.09)
          `,
          border: '1.5px solid var(--border-primary)',
          backdropFilter: 'blur(18px)',
          overflow: 'hidden',
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Animated shimmer */}
        <div
          className='position-absolute'
          style={{
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.13), transparent)',
            animation: 'shimmerMove 2.6s infinite',
            zIndex: 0,
          }}
        />
        <div
          className='d-flex align-items-center text-white position-relative'
          style={{ zIndex: 1 }}
        >
          <div
            className='rounded-circle d-flex align-items-center justify-content-center me-3'
            style={{
              width: '40px',
              height: '40px',
              background:
                'linear-gradient(145deg, var(--primary-blue-light), var(--primary-blue))',
              border: '2px solid var(--border-primary)',
              boxShadow:
                '0 4px 13px var(--primary-30),inset 0 2px 4px rgba(255,255,255,0.16)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <FaFileAlt
              size={18}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.14))' }}
            />
          </div>
          <span
            className='fw-bold'
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.14)',
              fontSize: 'clamp(1rem, 2.5vw, 1.19rem)',
              background:
                'linear-gradient(135deg, var(--text-primary), var(--text-tertiary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Application Details
          </span>
        </div>
        <div
          className='px-3 py-2 rounded-pill fw-bold text-white position-relative'
          style={{
            background: 'var(--primary-20)',
            fontSize: '0.80rem',
            border: '1px solid var(--primary-30)',
            backdropFilter: 'blur(10px)',
            textShadow: '0 1px 2px rgba(0,0,0,0.22)',
            letterSpacing: '0.32px',
            zIndex: 1,
          }}
        >
          Basic Information Required
        </div>
      </motion.div>

      {/* Glassy, animated card */}
      <motion.div
        className='position-relative overflow-hidden'
        style={{
          background: 'var(--gradient-surface)',
          border: '1.5px solid var(--border-primary)',
          borderRadius: '26px',
          boxShadow: `
            0 14px 28px rgba(0,0,0,0.18),
            0 8px 16px var(--primary-10),
            inset 0 1px 0 var(--white-10)
          `,
          backdropFilter: 'blur(27px)',
        }}
        initial={{ scale: 0.98, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{
          scale: 1.012,
          boxShadow: `
            0 22px 48px var(--primary-20),
            0 12px 24px var(--primary-30),
            0 8px 16px var(--success-20),
            inset 0 1px 0 var(--white-20)
          `,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Animated overlay pattern */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
              radial-gradient(circle at 18% 18%, var(--primary-30) 0%, transparent 48%),
              radial-gradient(circle at 88% 80%, var(--success-20) 0%, transparent 52%),
              radial-gradient(circle at 50% 12%, var(--primary-20) 0%, transparent 30%)
            `,
            opacity: 0.63,
            animation: 'floatPattern 12s linear infinite',
          }}
        />

        <div className='p-4 position-relative' style={{ zIndex: 2 }}>
          {/* Financial */}
          <motion.div
            className='mb-5'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                <FaEuroSign size={13} />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                }}
              >
                Financial Information
              </span>
            </div>
            <div className='row g-3'>
              <Field
                field='amount'
                label={`Advance Amount (${currencySign})`}
                type='number'
                cols={6}
                icon='fas fa-money-bill-wave text-success'
                placeholder='Enter amount'
                formData={formData}
                setFormData={setFormData}
                index={0}
              />
              <Field
                field='term'
                label='Initial Term (months)'
                type='number'
                cols={6}
                icon='fas fa-calendar-alt text-blue-500'
                disabled={true}
                placeholder='12 months (fixed)'
                formData={formData}
                setFormData={setFormData}
                index={1}
              />
            </div>
          </motion.div>

          {/* Deceased */}
          <motion.div
            className='mb-5'
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
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
                <FaUser size={13} />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                }}
              >
                Deceased Information
              </span>
            </div>
            <div className='row g-3'>
              <Field
                field='first_name'
                label='Deceased First Name'
                cols={6}
                nested='deceased'
                icon='fas fa-user text-purple-500'
                placeholder='Enter first name'
                formData={formData}
                setFormData={setFormData}
                index={2}
              />
              <Field
                field='last_name'
                label='Deceased Last Name'
                cols={6}
                nested='deceased'
                icon='fas fa-user text-purple-500'
                placeholder='Enter last name'
                formData={formData}
                setFormData={setFormData}
                index={3}
              />
            </div>
          </motion.div>

          {/* Legal */}
          <motion.div
            className='mb-5'
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
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
                <FaGavel size={13} />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                }}
              >
                Legal Information
              </span>
            </div>

            {/* Will Preparation */}
            <motion.div
              className='mb-4'
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18 }}
            >
              <label
                className='form-label fw-bold mb-3'
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-primary)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  letterSpacing: '0.3px',
                }}
              >
                <FaGavel className='me-2' />
                Was this will professionally prepared by a solicitor?{' '}
                <span className='status-warning'>*</span>
              </label>
              <div
                className='d-flex gap-4 p-4 rounded-3'
                style={{
                  background: isEmpty(formData.was_will_prepared_by_solicitor)
                    ? 'var(--error-20)'
                    : 'var(--primary-20)',
                  border: isEmpty(formData.was_will_prepared_by_solicitor)
                    ? '1.5px solid var(--error-30)'
                    : '1.5px solid var(--primary-30)',
                  backdropFilter: 'blur(14px)',
                  boxShadow: isEmpty(formData.was_will_prepared_by_solicitor)
                    ? '0 4px 15px var(--error-20),inset 0 1px 0 rgba(255,255,255,0.09)'
                    : '0 4px 15px var(--primary-10),inset 0 1px 0 rgba(255,255,255,0.07)',
                }}
              >
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='was_will_prepared_by_solicitor'
                    id='will_prepared_yes'
                    checked={formData.was_will_prepared_by_solicitor === true}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        was_will_prepared_by_solicitor: true,
                      }))
                    }
                    style={{
                      transform: 'scale(1.18)',
                      accentColor: 'var(--success-primary)',
                    }}
                  />
                  <label
                    className='form-check-label fw-bold ms-3'
                    htmlFor='will_prepared_yes'
                    style={{
                      color: 'var(--success-primary)',
                      fontSize: '0.95rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.13)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    <FaCheckCircle className='me-2' size={14} />
                    Yes
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='was_will_prepared_by_solicitor'
                    id='will_prepared_no'
                    checked={formData.was_will_prepared_by_solicitor === false}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        was_will_prepared_by_solicitor: false,
                      }))
                    }
                    style={{
                      transform: 'scale(1.18)',
                      accentColor: 'var(--error-primary)',
                    }}
                  />
                  <label
                    className='form-check-label fw-bold ms-3'
                    htmlFor='will_prepared_no'
                    style={{
                      color: 'var(--error-primary)',
                      fontSize: '0.95rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.13)',
                      letterSpacing: '0.3px',
                    }}
                  >
                    <FaTimesCircle className='me-2' size={14} />
                    No
                  </label>
                </div>
              </div>
              {isEmpty(formData.was_will_prepared_by_solicitor) && (
                <motion.small
                  className='mt-2 d-flex align-items-center'
                  style={{
                    color: 'var(--warning-primary)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.12)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                  }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FaExclamationTriangle className='me-2' size={13} />
                  Please select an answer
                </motion.small>
              )}
            </motion.div>
            {/* Dispute Details */}
            <div className='row g-3'>
              <Field
                field='details'
                label='Dispute Details (Optional)'
                type='textarea'
                cols={12}
                nested='dispute'
                icon='fas fa-exclamation-triangle text-orange-500'
                placeholder='Optional: Add details about any disputes. Leave empty if no disputes exist.'
                required={false}
                formData={formData}
                setFormData={setFormData}
                index={4}
              />
            </div>
          </motion.div>

          {/* Completion Status */}
          <motion.div
            className='text-center'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.21 }}
          >
            <motion.div
              className='px-4 py-3 rounded-3 d-inline-flex align-items-center gap-3'
              style={{
                background: isFormComplete
                  ? 'var(--primary-20)'
                  : 'var(--warning-20)',
                color: isFormComplete
                  ? 'var(--primary-blue)'
                  : 'var(--warning-dark)',
                fontSize: '0.93rem',
                fontWeight: 700,
                border: isFormComplete
                  ? '1.5px solid var(--primary-30)'
                  : '1.5px solid var(--warning-30)',
                backdropFilter: 'blur(19px)',
                boxShadow: isFormComplete
                  ? '0 6px 20px var(--primary-10)'
                  : '0 6px 20px var(--warning-20)',
                textShadow: '0 2px 4px rgba(0,0,0,0.12)',
                letterSpacing: '0.22px',
                maxWidth: '100%',
              }}
            >
              {isFormComplete ? (
                <>
                  <FaCheckCircle size={16} />
                  <span>Application details completed!</span>
                </>
              ) : (
                <>
                  <FaExclamationTriangle size={16} />
                  <span>Please complete all required fields marked with *</span>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
        <style>{`
          @keyframes floatPattern {
            0%,100%{transform:translateY(0) rotate(0deg);opacity:.65;}
            38%{transform:translateY(-14px) rotate(60deg);opacity:.79;}
            82%{transform:translateY(11px) rotate(140deg);opacity:.71;}
          }
          @keyframes shimmerMove {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
}
