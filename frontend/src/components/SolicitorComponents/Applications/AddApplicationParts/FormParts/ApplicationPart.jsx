import Cookies from 'js-cookie';
import { FaEuroSign, FaFileAlt, FaGavel, FaUser } from 'react-icons/fa';

// Helper function - MOVED OUTSIDE
const isEmpty = (val) => val === '' || val === null || val === undefined;

// Compact form field component - MOVED OUTSIDE
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
        className='form-label fw-medium text-slate-600 mb-1'
        style={{ fontSize: '0.8rem' }}
      >
        {icon && <i className={`${icon} me-2`}></i>}
        {label} {required && <span className='text-danger'>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          className='form-control form-control-sm rounded-3 border-0 shadow-sm'
          style={{
            fontSize: '0.85rem',
            background: hasError
              ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
              : 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border: hasError ? '1px solid #ef4444' : '1px solid #e2e8f0',
            minHeight: '80px',
            resize: 'vertical',
          }}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          className='form-control form-control-sm rounded-3 border-0 shadow-sm'
          style={{
            height: '32px',
            fontSize: '0.85rem',
            background: hasError
              ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
              : disabled
              ? 'linear-gradient(135deg, #f1f5f9, #e2e8f0)'
              : 'linear-gradient(135deg, #ffffff, #f8fafc)',
            border: hasError ? '1px solid #ef4444' : '1px solid #e2e8f0',
          }}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          min={type === 'number' ? '0' : undefined}
          step={type === 'number' && field === 'amount' ? '0.01' : undefined}
        />
      )}
      {hasError && (
        <small className='text-danger mt-1 d-block'>
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
      {/* Modern Header */}
      <div
        className='d-flex align-items-center justify-content-between mb-3 p-3 rounded-4'
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        }}
      >
        <div className='d-flex align-items-center text-white'>
          <FaFileAlt size={18} className='me-2' />
          <span className='fw-bold'>Application Details</span>
        </div>
        <div
          className='px-3 py-1 rounded-pill fw-semibold text-white'
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            fontSize: '0.8rem',
          }}
        >
          Basic Information Required
        </div>
      </div>

      {/* Application card */}
      <div
        className='card border-0 shadow-lg rounded-4'
        style={{
          background: 'linear-gradient(135deg, #fafbff 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div className='card-body p-4'>
          {/* Financial Information */}
          <div className='mb-4'>
            <h6
              className='fw-bold text-primary mb-2 d-flex align-items-center'
              style={{ fontSize: '0.9rem' }}
            >
              <FaEuroSign size={14} className='me-2' />
              Financial Information
            </h6>
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

          {/* Deceased Information */}
          <div className='mb-4'>
            <h6
              className='fw-bold text-purple-600 mb-2 d-flex align-items-center'
              style={{ fontSize: '0.9rem' }}
            >
              <FaUser size={14} className='me-2' />
              Deceased Information
            </h6>
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

          {/* Legal Information */}
          <div className='mb-4'>
            <h6
              className='fw-bold text-amber-600 mb-2 d-flex align-items-center'
              style={{ fontSize: '0.9rem' }}
            >
              <FaGavel size={14} className='me-2' />
              Legal Information
            </h6>

            {/* Will Preparation Question */}
            <div className='mb-3'>
              <label
                className='form-label fw-medium text-slate-600 mb-2'
                style={{ fontSize: '0.8rem' }}
              >
                <i className='fas fa-gavel me-2'></i>
                Was this will professionally prepared by a solicitor?{' '}
                <span className='text-danger'>*</span>
              </label>
              <div
                className='d-flex gap-4 p-3 rounded-3'
                style={{
                  background: isEmpty(formData.was_will_prepared_by_solicitor)
                    ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
                    : 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: isEmpty(formData.was_will_prepared_by_solicitor)
                    ? '1px solid #ef4444'
                    : '1px solid #bbf7d0',
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
                    style={{ color: '#059669', fontSize: '0.9rem' }}
                  >
                    <i className='fas fa-check-circle me-1'></i>
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
                    style={{ transform: 'scale(1.1)' }}
                  />
                  <label
                    className='form-check-label fw-medium ms-2'
                    htmlFor='will_prepared_no'
                    style={{ color: '#dc2626', fontSize: '0.9rem' }}
                  >
                    <i className='fas fa-times-circle me-1'></i>
                    No
                  </label>
                </div>
              </div>
              {isEmpty(formData.was_will_prepared_by_solicitor) && (
                <small className='text-danger mt-1 d-block'>
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

          {/* Completion Status */}
          <div className='text-center'>
            <div
              className='px-3 py-2 rounded-3'
              style={{
                backgroundColor: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(239,68,68,0.1)',
                color: [
                  formData.amount,
                  formData.deceased.first_name,
                  formData.deceased.last_name,
                  formData.was_will_prepared_by_solicitor,
                ].every((field) => !isEmpty(field))
                  ? '#22c55e'
                  : '#ef4444',
                fontSize: '0.85rem',
              }}
            >
              <i
                className={`fas ${
                  [
                    formData.amount,
                    formData.deceased.first_name,
                    formData.deceased.last_name,
                    formData.was_will_prepared_by_solicitor,
                  ].every((field) => !isEmpty(field))
                    ? 'fa-check-circle'
                    : 'fa-exclamation-circle'
                } me-2`}
              ></i>
              {[
                formData.amount,
                formData.deceased.first_name,
                formData.deceased.last_name,
                formData.was_will_prepared_by_solicitor,
              ].every((field) => !isEmpty(field))
                ? 'Application details completed!'
                : 'Please complete all required fields marked with *'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
