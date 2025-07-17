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

// Enhanced compact form field component - MOVED OUTSIDE
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

  return (
    <div className={`col-md-${cols} mb-3`}>
      <label
        className='form-label fw-bold mb-2'
        style={{
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.3px',
        }}
      >
        {icon && <i className={`${icon} me-2`}></i>}
        {label} {required && <span className='text-warning'>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          className='form-control border-0'
          style={{
            fontSize: '0.9rem',
            background: hasError
              ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(185, 28, 28, 0.1) 100%)'
              : 'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(29, 78, 216, 0.08) 100%)',
            border: hasError
              ? '1px solid rgba(239, 68, 68, 0.4)'
              : '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            minHeight: '100px',
            resize: 'vertical',
            backdropFilter: 'blur(20px)',
            color: 'rgba(255, 255, 255, 0.9)',
            boxShadow: hasError
              ? '0 4px 15px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 4px 15px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: '12px 16px',
          }}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={(e) => {
            e.target.style.background =
              'linear-gradient(145deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 50%, rgba(29, 78, 216, 0.1) 100%)';
            e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow =
              '0 8px 25px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.background = hasError
              ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(185, 28, 28, 0.1) 100%)'
              : 'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(29, 78, 216, 0.08) 100%)';
            e.target.style.borderColor = hasError
              ? 'rgba(239, 68, 68, 0.4)'
              : 'rgba(59, 130, 246, 0.3)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = hasError
              ? '0 4px 15px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 4px 15px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
          }}
        />
      ) : (
        <input
          type={type}
          className='form-control border-0'
          style={{
            height: '48px',
            fontSize: '0.9rem',
            background: hasError
              ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(185, 28, 28, 0.1) 100%)'
              : disabled
              ? 'linear-gradient(145deg, rgba(107, 114, 128, 0.15) 0%, rgba(75, 85, 99, 0.1) 50%, rgba(55, 65, 81, 0.08) 100%)'
              : 'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(29, 78, 216, 0.08) 100%)',
            border: hasError
              ? '1px solid rgba(239, 68, 68, 0.4)'
              : disabled
              ? '1px solid rgba(107, 114, 128, 0.3)'
              : '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
            color: disabled
              ? 'rgba(255, 255, 255, 0.6)'
              : 'rgba(255, 255, 255, 0.9)',
            boxShadow: hasError
              ? '0 4px 15px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : disabled
              ? '0 4px 15px rgba(107, 114, 128, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 4px 15px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: '0 16px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={type === 'number' ? '0' : undefined}
          step={type === 'number' && field === 'amount' ? '0.01' : undefined}
          onFocus={(e) => {
            if (!disabled) {
              e.target.style.background =
                'linear-gradient(145deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 50%, rgba(29, 78, 216, 0.1) 100%)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow =
                '0 8px 25px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
            }
          }}
          onBlur={(e) => {
            e.target.style.background = hasError
              ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(185, 28, 28, 0.1) 100%)'
              : disabled
              ? 'linear-gradient(145deg, rgba(107, 114, 128, 0.15) 0%, rgba(75, 85, 99, 0.1) 50%, rgba(55, 65, 81, 0.08) 100%)'
              : 'linear-gradient(145deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 50%, rgba(29, 78, 216, 0.08) 100%)';
            e.target.style.borderColor = hasError
              ? 'rgba(239, 68, 68, 0.4)'
              : disabled
              ? 'rgba(107, 114, 128, 0.3)'
              : 'rgba(59, 130, 246, 0.3)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = hasError
              ? '0 4px 15px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : disabled
              ? '0 4px 15px rgba(107, 114, 128, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 4px 15px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
          }}
        />
      )}
      {hasError && (
        <small
          className='mt-2 d-flex align-items-center'
          style={{
            color: '#fbbf24',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}
        >
          <FaExclamationTriangle className='me-2' size={12} />
          {label} is required
        </small>
      )}
    </div>
  );
};

export default function ApplicationPart({ formData, setFormData }) {
  // Get currency from cookies
  const currencySign = Cookies.get('currency_sign') || '€';

  return (
    <div className='mb-4'>
      {/* Enhanced Header */}
      <div
        className='d-flex align-items-center justify-content-between mb-4 p-3 p-md-4 position-relative'
        style={{
          background: `
            linear-gradient(145deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 50%, rgba(29, 78, 216, 0.9) 100%),
            linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
          borderRadius: '20px',
          boxShadow:
            '0 8px 25px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
        }}
      >
        {/* Animated background shimmer */}
        <div
          className='position-absolute'
          style={{
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            animation: 'shimmerMove 3s infinite',
          }}
        />

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
                '0 4px 15px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            }}
          >
            <FaFileAlt
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
            Application Details
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
          Basic Information Required
        </div>
      </div>

      {/* Enhanced Application card */}
      <div
        className='position-relative overflow-hidden'
        style={{
          background: `
            linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 25%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.95) 75%, rgba(30, 41, 59, 0.95) 100%),
            radial-gradient(circle at 30% 10%, rgba(59, 130, 246, 0.15), transparent 50%),
            radial-gradient(circle at 70% 90%, rgba(139, 92, 246, 0.12), transparent 50%)
          `,
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '24px',
          boxShadow: `
            0 12px 30px rgba(0, 0, 0, 0.3),
            0 4px 12px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Enhanced Animated Background Pattern */}
        <div
          className='position-absolute w-100 h-100'
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)
            `,
            opacity: 0.8,
            animation: 'floatPattern 8s ease-in-out infinite',
          }}
        />

        <div className='p-4 position-relative'>
          {/* Financial Information */}
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
                className='rounded-circle d-flex align-items-center justify-content-center me-3'
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
                <FaEuroSign
                  size={12}
                  style={{
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                  }}
                />
              </div>
              Financial Information
            </h6>
            <div
              className='p-4 rounded-3'
              style={{
                background:
                  'linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.08))',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                backdropFilter: 'blur(15px)',
                boxShadow:
                  '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
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
                />
              </div>
            </div>
          </div>

          {/* Deceased Information */}
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
                className='rounded-circle d-flex align-items-center justify-content-center me-3'
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
                <FaUser
                  size={12}
                  style={{
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                  }}
                />
              </div>
              Deceased Information
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
                  field='first_name'
                  label='Deceased First Name'
                  cols={6}
                  nested='deceased'
                  icon='fas fa-user text-purple-500'
                  placeholder='Enter first name'
                  formData={formData}
                  setFormData={setFormData}
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
                />
              </div>
            </div>
          </div>

          {/* Legal Information */}
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
                className='rounded-circle d-flex align-items-center justify-content-center me-3'
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
                <FaGavel
                  size={12}
                  style={{
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
                  }}
                />
              </div>
              Legal Information
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
              {/* Will Preparation Question */}
              <div className='mb-4'>
                <label
                  className='form-label fw-bold mb-3'
                  style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    letterSpacing: '0.3px',
                  }}
                >
                  <FaGavel className='me-2' />
                  Was this will professionally prepared by a solicitor?{' '}
                  <span className='text-warning'>*</span>
                </label>
                <div
                  className='d-flex gap-4 p-4 rounded-3'
                  style={{
                    background: isEmpty(formData.was_will_prepared_by_solicitor)
                      ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(185, 28, 28, 0.1) 100%)'
                      : 'linear-gradient(145deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 50%, rgba(29, 78, 216, 0.1) 100%)',
                    border: isEmpty(formData.was_will_prepared_by_solicitor)
                      ? '1px solid rgba(239, 68, 68, 0.4)'
                      : '1px solid rgba(59, 130, 246, 0.4)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: isEmpty(formData.was_will_prepared_by_solicitor)
                      ? '0 4px 15px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      : '0 4px 15px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                        transform: 'scale(1.2)',
                        accentColor: '#22c55e',
                      }}
                    />
                    <label
                      className='form-check-label fw-bold ms-3'
                      htmlFor='will_prepared_yes'
                      style={{
                        color: '#22c55e',
                        fontSize: '0.95rem',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
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
                      checked={
                        formData.was_will_prepared_by_solicitor === false
                      }
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          was_will_prepared_by_solicitor: false,
                        }))
                      }
                      style={{
                        transform: 'scale(1.2)',
                        accentColor: '#ef4444',
                      }}
                    />
                    <label
                      className='form-check-label fw-bold ms-3'
                      htmlFor='will_prepared_no'
                      style={{
                        color: '#ef4444',
                        fontSize: '0.95rem',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        letterSpacing: '0.3px',
                      }}
                    >
                      <FaTimesCircle className='me-2' size={14} />
                      No
                    </label>
                  </div>
                </div>
                {isEmpty(formData.was_will_prepared_by_solicitor) && (
                  <small
                    className='mt-2 d-flex align-items-center'
                    style={{
                      color: '#fbbf24',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    <FaExclamationTriangle className='me-2' size={12} />
                    Please select an answer
                  </small>
                )}
              </div>

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
                />
              </div>
            </div>
          </div>

          {/* Enhanced Completion Status */}
          <div className='text-center'>
            <div
              className='px-4 py-3 rounded-3 d-inline-flex align-items-center gap-3'
              style={{
                background: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? 'linear-gradient(145deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.15) 50%, rgba(29, 78, 216, 0.1) 100%)'
                  : 'linear-gradient(145deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.15) 50%, rgba(180, 83, 9, 0.1) 100%)',
                color: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? '#60a5fa'
                  : '#fbbf24',
                fontSize: '0.9rem',
                fontWeight: '700',
                border: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? '1px solid rgba(59, 130, 246, 0.4)'
                  : '1px solid rgba(245, 158, 11, 0.4)',
                backdropFilter: 'blur(20px)',
                boxShadow: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? '0 6px 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 6px 20px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.3px',
              }}
            >
              {[
                formData.amount,
                formData.deceased.first_name,
                formData.deceased.last_name,
                formData.was_will_prepared_by_solicitor,
              ].every((field) => !isEmpty(field)) ? (
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
            </div>
          </div>
        </div>

        {/* Enhanced CSS Animations */}
        <style>{`
          @keyframes floatPattern {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.8;
            }
            50% {
              transform: translateY(-8px) rotate(2deg);
              opacity: 1;
            }
          }

          @keyframes shimmerMove {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
