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
    <div className={`col-md-${cols} mb-2`}>
      <label
        className='form-label fw-medium mb-1'
        style={{
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.9)',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        }}
      >
        {icon && <i className={`${icon} me-2`}></i>}
        {label} {required && <span className='text-warning'>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          className='form-control form-control-sm border-0'
          style={{
            fontSize: '0.85rem',
            background: hasError
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
              : 'rgba(255, 255, 255, 0.15)',
            border: hasError
              ? '1px solid rgba(239, 68, 68, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            minHeight: '80px',
            resize: 'vertical',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.background = hasError
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
              : 'rgba(255, 255, 255, 0.15)';
            e.target.style.borderColor = hasError
              ? 'rgba(239, 68, 68, 0.4)'
              : 'rgba(255, 255, 255, 0.2)';
          }}
        />
      ) : (
        <input
          type={type}
          className='form-control form-control-sm border-0'
          style={{
            height: '32px',
            fontSize: '0.85rem',
            background: hasError
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
              : disabled
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(255, 255, 255, 0.15)',
            border: hasError
              ? '1px solid rgba(239, 68, 68, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            color: disabled
              ? 'rgba(255, 255, 255, 0.6)'
              : 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={type === 'number' ? '0' : undefined}
          step={type === 'number' && field === 'amount' ? '0.01' : undefined}
          onFocus={(e) => {
            if (!disabled) {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }
          }}
          onBlur={(e) => {
            e.target.style.background = hasError
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
              : disabled
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(255, 255, 255, 0.15)';
            e.target.style.borderColor = hasError
              ? 'rgba(239, 68, 68, 0.4)'
              : 'rgba(255, 255, 255, 0.2)';
          }}
        />
      )}
      {hasError && (
        <small
          className='mt-1 d-block'
          style={{
            color: '#fbbf24',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          <i className='fas fa-exclamation-circle me-1'></i>
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
        className='d-flex align-items-center justify-content-between mb-3 p-3 position-relative'
        style={{
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)',
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
            <FaFileAlt size={14} />
          </div>
          <span
            className='fw-bold'
            style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
          >
            Application Details
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
          Basic Information Required
        </div>
      </div>

      {/* Enhanced Application card */}
      <div
        className='position-relative overflow-hidden'
        style={{
          background: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(248, 250, 252, 0.08)),
            radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.15), transparent 50%),
            radial-gradient(circle at 70% 90%, rgba(34, 197, 94, 0.1), transparent 50%)
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
              radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(22, 163, 74, 0.03) 0%, transparent 50%)
            `,
            opacity: 0.6,
            animation: 'float 6s ease-in-out infinite',
          }}
        />

        <div className='p-4 position-relative'>
          {/* Financial Information */}
          <div className='mb-4'>
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
                <FaEuroSign size={10} />
              </div>
              Financial Information
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
          <div className='mb-4'>
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
                <FaUser size={10} />
              </div>
              Deceased Information
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
          <div className='mb-4'>
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
                <FaGavel size={10} />
              </div>
              Legal Information
            </h6>

            <div
              className='p-3 rounded-3 mb-3'
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Will Preparation Question */}
              <div className='mb-3'>
                <label
                  className='form-label fw-medium mb-2'
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <i className='fas fa-gavel me-2'></i>
                  Was this will professionally prepared by a solicitor?{' '}
                  <span className='text-warning'>*</span>
                </label>
                <div
                  className='d-flex gap-4 p-3 rounded-3'
                  style={{
                    background: isEmpty(formData.was_will_prepared_by_solicitor)
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                      : 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))',
                    border: isEmpty(formData.was_will_prepared_by_solicitor)
                      ? '1px solid rgba(239, 68, 68, 0.3)'
                      : '1px solid rgba(34, 197, 94, 0.3)',
                    backdropFilter: 'blur(10px)',
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
                      style={{ transform: 'scale(1.1)' }}
                    />
                    <label
                      className='form-check-label fw-medium ms-2'
                      htmlFor='will_prepared_yes'
                      style={{
                        color: '#22c55e',
                        fontSize: '0.9rem',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <FaCheckCircle className='me-1' size={12} />
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
                      style={{ transform: 'scale(1.1)' }}
                    />
                    <label
                      className='form-check-label fw-medium ms-2'
                      htmlFor='will_prepared_no'
                      style={{
                        color: '#ef4444',
                        fontSize: '0.9rem',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <FaTimesCircle className='me-1' size={12} />
                      No
                    </label>
                  </div>
                </div>
                {isEmpty(formData.was_will_prepared_by_solicitor) && (
                  <small
                    className='mt-1 d-block'
                    style={{
                      color: '#fbbf24',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <i className='fas fa-exclamation-circle me-1'></i>
                    Please select an answer
                  </small>
                )}
              </div>

              {/* Dispute Details */}
              <div className='row g-1'>
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
              className='px-4 py-3 rounded-3 d-inline-flex align-items-center gap-2'
              style={{
                background: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.15))'
                  : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.15))',
                color: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? '#22c55e'
                  : '#f59e0b',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? '1px solid rgba(34, 197, 94, 0.3)'
                  : '1px solid rgba(245, 158, 11, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? '0 4px 12px rgba(34, 197, 94, 0.2)'
                  : '0 4px 12px rgba(245, 158, 11, 0.2)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              }}
            >
              {[
                formData.amount,
                formData.deceased.first_name,
                formData.deceased.last_name,
                formData.was_will_prepared_by_solicitor,
              ].every((field) => !isEmpty(field)) ? (
                <>
                  <FaCheckCircle size={14} />
                  Application details completed!
                </>
              ) : (
                <>
                  <FaExclamationTriangle size={14} />
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
