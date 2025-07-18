import Cookies from 'js-cookie';
import { FaEdit, FaSave } from 'react-icons/fa';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import { formatMoney } from '../../GenericFunctions/HelperGenericFunctions';

const BasicDetailsSection = ({
  application,
  setApplication,
  editMode,
  toggleEditMode,
  handleChange,
  handleNestedChange,
  submitChangesHandler,
  isApplicationLocked,
  triggerHandleChange,
  setTriggerChandleChange,
}) => {
  const currency_sign = Cookies.get('currency_sign');
  if (!application) return <LoadingComponent />;

  return (
    <div
      className='mb-4 position-relative overflow-hidden'
      style={{
        background: `
          var(--gradient-surface),
          linear-gradient(135deg, var(--primary-10), var(--primary-20)),
          radial-gradient(circle at 30% 10%, var(--primary-20), transparent 50%),
          radial-gradient(circle at 70% 90%, var(--primary-blue), transparent 50%)
        `,
        border: '1px solid var(--border-primary)',
        borderRadius: '24px',
        boxShadow: `
          0 20px 40px var(--primary-10),
          0 8px 16px var(--primary-20),
          inset 0 1px 0 var(--white-10)
        `,
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateZ(0)',
      }}
    >
      {/* Header */}
      <div
        className='px-4 py-4 d-flex flex-column flex-lg-row align-items-center gap-3 position-relative'
        style={{
          background: `
            linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark)),
            var(--gradient-header)
          `,
          color: 'var(--text-primary)',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-muted)',
          borderBottom: '1px solid var(--border-primary)',
        }}
      >
        <div
          className='d-flex align-items-center justify-content-center rounded-circle position-relative mb-3 mb-lg-0'
          style={{
            width: '56px',
            height: '56px',
            background: 'var(--surface-tertiary)',
            border: '2px solid var(--border-muted)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s',
            cursor: 'pointer',
            animation: 'iconFloat 3.5s ease-in-out infinite',
          }}
        >
          <i
            className='fas fa-edit'
            style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}
          ></i>
          <div
            className='position-absolute rounded-circle'
            style={{
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: 'var(--primary-10)',
              filter: 'blur(8px)',
              zIndex: -1,
            }}
          />
        </div>
        <div className='flex-grow-1 text-center text-lg-start'>
          <h5
            className='fw-bold mb-2'
            style={{
              fontSize: '1.4rem',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            Application Details
          </h5>
          <div
            className='px-3 py-2 rounded-pill fw-semibold'
            style={{
              background: 'var(--primary-10)',
              fontSize: '0.9rem',
              border: '1px solid var(--border-primary)',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.02em',
              color: 'var(--text-primary)',
            }}
          >
            {isApplicationLocked ? 'Locked' : 'Editable'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='px-4 pb-4'>
        <form>
          {/* Amount and Term Row */}
          <div className='row g-4 mb-4'>
            <div className='col-12 col-xxl-6'>
              <label className='form-label fw-semibold mb-2 theme-text-secondary'>
                <i className='fas fa-euro-sign me-2 status-success'></i>
                Amount
              </label>
              <div
                className='input-group input-group-sm position-relative'
                style={{
                  borderRadius: '16px',
                  overflow: 'visible',
                  background: 'var(--surface-secondary)',
                  border: editMode.amount
                    ? '2px solid var(--success-primary)'
                    : '1px solid var(--border-muted)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: editMode.amount
                    ? '0 15px 35px var(--success-30), 0 5px 15px var(--primary-10)'
                    : '0 8px 24px var(--primary-10)',
                  transition: 'all 0.3s',
                }}
              >
                {editMode.amount && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      background:
                        'linear-gradient(135deg, var(--success-30), var(--success-20))',
                      borderRadius: '18px',
                      filter: 'blur(8px)',
                      zIndex: -1,
                      animation:
                        'selectionGlow 3s ease-in-out infinite alternate',
                    }}
                  />
                )}
                <input
                  type='text'
                  className='form-control border-0'
                  style={{
                    backgroundColor: 'transparent',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                  value={
                    editMode.amount
                      ? application.amount
                      : ` ${formatMoney(application.amount, currency_sign)}`
                  }
                  onChange={(e) => handleChange(e, 'amount')}
                  readOnly={!editMode.amount}
                />
                <button
                  type='button'
                  className='btn position-relative'
                  style={{
                    backgroundColor: editMode.amount
                      ? 'var(--error-primary)'
                      : 'var(--surface-primary)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    padding: '0 1rem',
                    transition: 'all 0.2s',
                    borderRadius: '16px',
                  }}
                  onClick={() => {
                    if (editMode.amount) submitChangesHandler();
                    toggleEditMode('amount');
                  }}
                  disabled={
                    application.approved ||
                    application.is_rejected ||
                    isApplicationLocked
                  }
                >
                  {editMode.amount ? (
                    <FaSave size={16} />
                  ) : (
                    <FaEdit size={16} />
                  )}
                </button>
                {editMode.amount && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-8px',
                      right: '70px',
                      background:
                        'linear-gradient(135deg, var(--success-primary), var(--success-dark))',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 8px var(--success-20)',
                      animation: 'editingPulse 2s ease-in-out infinite',
                    }}
                  >
                    EDITING
                  </div>
                )}
              </div>
              {(application.amount === '' ||
                isNaN(parseFloat(application.amount)) ||
                parseFloat(application.amount) <= 0) && (
                <div
                  className='text-danger mt-2 small fw-medium d-flex align-items-center gap-2'
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: 'var(--error-20)',
                    borderRadius: '12px',
                    border: '1px solid var(--error-30)',
                    backdropFilter: 'blur(10px)',
                    color: 'var(--error-primary)',
                  }}
                >
                  <i className='fas fa-exclamation-circle'></i>
                  Please enter a valid amount greater than zero.
                </div>
              )}
            </div>
            <div className='col-12 col-xxl-6'>
              <label className='form-label fw-semibold mb-2 theme-text-secondary'>
                <i
                  className='fas fa-calendar-alt me-2'
                  style={{ color: 'var(--primary-blue)' }}
                ></i>
                Initial Term
              </label>
              <div
                className='input-group input-group-sm'
                style={{
                  borderRadius: '16px',
                  overflow: 'visible',
                  background: 'var(--surface-secondary)',
                  border: '1px solid var(--border-muted)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 24px var(--primary-10)',
                  opacity: 0.7,
                }}
              >
                <input
                  type='text'
                  className='form-control border-0'
                  style={{
                    backgroundColor: 'transparent',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-muted)',
                  }}
                  value={`${application.term} months`}
                  readOnly
                />
                <button
                  type='button'
                  className='btn'
                  style={{
                    backgroundColor: 'var(--text-muted)',
                    color: 'white',
                    border: 'none',
                    padding: '0 1rem',
                    cursor: 'not-allowed',
                    borderRadius: '16px',
                  }}
                  disabled
                >
                  <FaEdit size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className='my-4 d-flex align-items-center position-relative'>
            <div
              style={{
                flex: 1,
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, var(--primary-20), transparent)',
              }}
            />
            <div
              className='d-flex align-items-center justify-content-center mx-3'
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, var(--primary-blue-light), var(--primary-blue-dark))',
                color: 'white',
                fontSize: '1rem',
                boxShadow: '0 8px 16px var(--primary-20)',
                animation: 'iconFloat 4s ease-in-out infinite',
              }}
            >
              <i className='fas fa-user-friends'></i>
            </div>
            <div
              style={{
                flex: 1,
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, var(--primary-20), transparent)',
              }}
            />
          </div>

          {/* Deceased Details Row */}
          <div className='row g-4 mb-4'>
            {/* Deceased First Name */}
            <div className='col-12 col-xxl-6'>
              <label className='form-label fw-semibold mb-2 theme-text-secondary'>
                <i
                  className='fas fa-user me-2'
                  style={{ color: 'var(--primary-blue)' }}
                ></i>
                Deceased First Name
              </label>
              <div
                className='input-group input-group-sm position-relative'
                style={{
                  borderRadius: '16px',
                  overflow: 'visible',
                  background: 'var(--surface-secondary)',
                  border: editMode.deceased_first_name
                    ? '2px solid var(--primary-blue)'
                    : '1px solid var(--border-muted)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: editMode.deceased_first_name
                    ? '0 15px 35px var(--primary-20), 0 5px 15px var(--primary-10)'
                    : '0 8px 24px var(--primary-10)',
                  transition: 'all 0.3s',
                }}
              >
                {editMode.deceased_first_name && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      background:
                        'linear-gradient(135deg, var(--primary-30), var(--primary-20))',
                      borderRadius: '18px',
                      filter: 'blur(8px)',
                      zIndex: -1,
                      animation:
                        'selectionGlow 3s ease-in-out infinite alternate',
                    }}
                  />
                )}
                <input
                  type='text'
                  className='form-control border-0'
                  style={{
                    backgroundColor: 'transparent',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                  }}
                  value={application.deceased.first_name}
                  onChange={(e) =>
                    handleNestedChange(e, 'deceased', 'first_name')
                  }
                  readOnly={!editMode.deceased_first_name}
                />
                <button
                  type='button'
                  className='btn'
                  style={{
                    backgroundColor: editMode.deceased_first_name
                      ? 'var(--error-primary)'
                      : 'var(--surface-primary)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    padding: '0 1rem',
                    transition: 'all 0.2s',
                    borderRadius: '16px',
                  }}
                  onClick={() => {
                    if (editMode.deceased_first_name) submitChangesHandler();
                    toggleEditMode('deceased_first_name');
                  }}
                  disabled={
                    application.approved ||
                    application.is_rejected ||
                    isApplicationLocked
                  }
                >
                  {editMode.deceased_first_name ? (
                    <FaSave size={16} />
                  ) : (
                    <FaEdit size={16} />
                  )}
                </button>
                {editMode.deceased_first_name && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-8px',
                      right: '70px',
                      background:
                        'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 8px var(--primary-20)',
                      animation: 'editingPulse 2s ease-in-out infinite',
                    }}
                  >
                    EDITING
                  </div>
                )}
              </div>
            </div>
            {/* Deceased Last Name */}
            <div className='col-12 col-xxl-6'>
              <label className='form-label fw-semibold mb-2 theme-text-secondary'>
                <i
                  className='fas fa-user me-2'
                  style={{ color: 'var(--primary-blue)' }}
                ></i>
                Deceased Last Name
              </label>
              <div
                className='input-group input-group-sm position-relative'
                style={{
                  borderRadius: '16px',
                  overflow: 'visible',
                  background: 'var(--surface-secondary)',
                  border: editMode.deceased_last_name
                    ? '2px solid var(--primary-blue)'
                    : '1px solid var(--border-muted)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: editMode.deceased_last_name
                    ? '0 15px 35px var(--primary-20), 0 5px 15px var(--primary-10)'
                    : '0 8px 24px var(--primary-10)',
                  transition: 'all 0.3s',
                }}
              >
                {editMode.deceased_last_name && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      background:
                        'linear-gradient(135deg, var(--primary-30), var(--primary-20))',
                      borderRadius: '18px',
                      filter: 'blur(8px)',
                      zIndex: -1,
                      animation:
                        'selectionGlow 3s ease-in-out infinite alternate',
                    }}
                  />
                )}
                <input
                  type='text'
                  className='form-control border-0'
                  style={{
                    backgroundColor: 'transparent',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                  }}
                  value={application.deceased.last_name}
                  onChange={(e) =>
                    handleNestedChange(e, 'deceased', 'last_name')
                  }
                  readOnly={!editMode.deceased_last_name}
                />
                <button
                  type='button'
                  className='btn'
                  style={{
                    backgroundColor: editMode.deceased_last_name
                      ? 'var(--error-primary)'
                      : 'var(--surface-primary)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    padding: '0 1rem',
                    transition: 'all 0.2s',
                    borderRadius: '16px',
                  }}
                  onClick={() => {
                    if (editMode.deceased_last_name) submitChangesHandler();
                    toggleEditMode('deceased_last_name');
                  }}
                  disabled={
                    application.approved ||
                    application.is_rejected ||
                    isApplicationLocked
                  }
                >
                  {editMode.deceased_last_name ? (
                    <FaSave size={16} />
                  ) : (
                    <FaEdit size={16} />
                  )}
                </button>
                {editMode.deceased_last_name && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-8px',
                      right: '70px',
                      background:
                        'linear-gradient(135deg, var(--primary-blue), var(--primary-blue-dark))',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 8px var(--primary-20)',
                      animation: 'editingPulse 2s ease-in-out infinite',
                    }}
                  >
                    EDITING
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Will Preparation Section */}
          <div className='mb-4'>
            <label className='form-label fw-semibold mb-3 theme-text-secondary'>
              <i
                className='fas fa-gavel me-2'
                style={{ color: 'var(--warning-primary)' }}
              ></i>
              Was this will professionally prepared by a solicitor?
            </label>
            <div
              className='d-flex gap-4 p-4 flex-column flex-md-row'
              style={{
                background: 'var(--surface-secondary)',
                borderRadius: '18px',
                border: '1px solid var(--border-muted)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 24px var(--primary-10)',
              }}
            >
              {/* YES Option */}
              <div
                className='form-check position-relative flex-fill'
                style={{
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  background: !!application.was_will_prepared_by_solicitor
                    ? 'linear-gradient(135deg, var(--success-primary), var(--success-dark))'
                    : 'var(--surface-tertiary)',
                  border: !!application.was_will_prepared_by_solicitor
                    ? '2px solid var(--success-primary)'
                    : '1px solid var(--border-muted)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  transform: !!application.was_will_prepared_by_solicitor
                    ? 'scale(1.02) translateY(-2px)'
                    : 'scale(1)',
                  boxShadow: !!application.was_will_prepared_by_solicitor
                    ? '0 8px 16px var(--success-20)'
                    : '0 4px 8px var(--primary-10)',
                }}
              >
                {!!application.was_will_prepared_by_solicitor && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-3px',
                      left: '-3px',
                      right: '-3px',
                      bottom: '-3px',
                      background:
                        'linear-gradient(135deg, var(--success-30), var(--success-20))',
                      borderRadius: '17px',
                      filter: 'blur(6px)',
                      zIndex: -1,
                      animation:
                        'selectionGlow 3s ease-in-out infinite alternate',
                    }}
                  />
                )}
                <input
                  className='form-check-input position-absolute'
                  type='radio'
                  name='was_will_prepared_by_solicitor'
                  id='will_prepared_yes'
                  value={true}
                  checked={!!application.was_will_prepared_by_solicitor}
                  onChange={() => {
                    setApplication({
                      ...application,
                      was_will_prepared_by_solicitor: true,
                    });
                    setTriggerChandleChange(!triggerHandleChange);
                  }}
                  disabled={
                    application.approved ||
                    application.is_rejected ||
                    isApplicationLocked
                  }
                  style={{
                    opacity: 0,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                />
                <label
                  className='form-check-label fw-medium d-flex align-items-center justify-content-center gap-2 w-100'
                  htmlFor='will_prepared_yes'
                  style={{
                    color: !!application.was_will_prepared_by_solicitor
                      ? 'white'
                      : 'var(--success-dark)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  <i className='fas fa-check-circle'></i>
                  Yes
                </label>
              </div>
              {/* NO Option */}
              <div
                className='form-check position-relative flex-fill'
                style={{
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  background: !application.was_will_prepared_by_solicitor
                    ? 'linear-gradient(135deg, var(--error-primary), var(--error-dark))'
                    : 'var(--surface-tertiary)',
                  border: !application.was_will_prepared_by_solicitor
                    ? '2px solid var(--error-primary)'
                    : '1px solid var(--border-muted)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  transform: !application.was_will_prepared_by_solicitor
                    ? 'scale(1.02) translateY(-2px)'
                    : 'scale(1)',
                  boxShadow: !application.was_will_prepared_by_solicitor
                    ? '0 8px 16px var(--error-20)'
                    : '0 4px 8px var(--primary-10)',
                }}
              >
                {!application.was_will_prepared_by_solicitor && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-3px',
                      left: '-3px',
                      right: '-3px',
                      bottom: '-3px',
                      background:
                        'linear-gradient(135deg, var(--error-30), var(--error-20))',
                      borderRadius: '17px',
                      filter: 'blur(6px)',
                      zIndex: -1,
                      animation:
                        'selectionGlow 3s ease-in-out infinite alternate',
                    }}
                  />
                )}
                <input
                  className='form-check-input position-absolute'
                  type='radio'
                  name='was_will_prepared_by_solicitor'
                  id='will_prepared_no'
                  value={false}
                  checked={!application.was_will_prepared_by_solicitor}
                  onChange={() => {
                    setApplication({
                      ...application,
                      was_will_prepared_by_solicitor: false,
                    });
                    setTriggerChandleChange(!triggerHandleChange);
                  }}
                  disabled={
                    application.approved ||
                    application.is_rejected ||
                    isApplicationLocked
                  }
                  style={{
                    opacity: 0,
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                />
                <label
                  className='form-check-label fw-medium d-flex align-items-center justify-content-center gap-2 w-100'
                  htmlFor='will_prepared_no'
                  style={{
                    color: !application.was_will_prepared_by_solicitor
                      ? 'white'
                      : 'var(--error-dark)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  <i className='fas fa-times-circle'></i>
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Dispute Details */}
          <div className='mb-4'>
            <label className='form-label fw-semibold mb-2 theme-text-secondary'>
              <i
                className='fas fa-exclamation-triangle me-2'
                style={{ color: 'var(--warning-primary)' }}
              ></i>
              Dispute Details
            </label>
            <div
              className='input-group position-relative'
              style={{
                borderRadius: '16px',
                overflow: 'visible',
                background: 'var(--surface-secondary)',
                border: editMode.dispute_details
                  ? '2px solid var(--warning-primary)'
                  : '1px solid var(--border-muted)',
                backdropFilter: 'blur(20px)',
                boxShadow: editMode.dispute_details
                  ? '0 15px 35px var(--warning-20), 0 5px 15px var(--primary-10)'
                  : '0 8px 24px var(--primary-10)',
                transition: 'all 0.3s',
              }}
            >
              {editMode.dispute_details && (
                <div
                  className='position-absolute'
                  style={{
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background:
                      'linear-gradient(135deg, var(--warning-30), var(--warning-20))',
                    borderRadius: '18px',
                    filter: 'blur(8px)',
                    zIndex: -1,
                    animation:
                      'selectionGlow 3s ease-in-out infinite alternate',
                  }}
                />
              )}
              <textarea
                className='form-control border-0'
                style={{
                  backgroundColor: 'transparent',
                  fontSize: '1rem',
                  fontWeight: '400',
                  padding: '1rem',
                  minHeight: '120px',
                  resize: 'vertical',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                  lineHeight: '1.6',
                }}
                value={
                  application.dispute.details === 'No dispute'
                    ? ''
                    : application.dispute.details
                }
                onChange={(e) => handleNestedChange(e, 'dispute', 'details')}
                readOnly={!editMode.dispute_details}
                placeholder={
                  editMode.dispute_details
                    ? "Describe any disputes or leave empty for 'No dispute'"
                    : ''
                }
              />
              <button
                type='button'
                className='btn align-self-stretch'
                style={{
                  backgroundColor: editMode.dispute_details
                    ? 'var(--error-primary)'
                    : 'var(--surface-primary)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  padding: '1rem',
                  transition: 'all 0.2s',
                  borderRadius: '16px',
                }}
                onClick={() => {
                  if (editMode.dispute_details) submitChangesHandler();
                  toggleEditMode('dispute_details');
                }}
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  isApplicationLocked
                }
              >
                {editMode.dispute_details ? (
                  <FaSave size={16} />
                ) : (
                  <FaEdit size={16} />
                )}
              </button>
              {editMode.dispute_details && (
                <div
                  className='position-absolute'
                  style={{
                    top: '-8px',
                    right: '70px',
                    background:
                      'linear-gradient(135deg, var(--warning-primary), var(--warning-dark))',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 8px var(--warning-20)',
                    animation: 'editingPulse 2s ease-in-out infinite',
                  }}
                >
                  EDITING
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes editingPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes selectionGlow {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-8px) rotate(5deg) scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default BasicDetailsSection;
