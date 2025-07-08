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

  if (!application) {
    return <LoadingComponent />;
  }

  return (
    <div
      className='modern-main-card mb-4 position-relative overflow-hidden'
      style={{
        background: `
          linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(248, 250, 252, 0.05)),
          radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.6), transparent 50%),
          radial-gradient(circle at 70% 90%, rgba(59, 130, 246, 0.1), transparent 50%)
        `,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '24px',
        boxShadow: `
          0 20px 40px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.4)
        `,
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: 'translateZ(0)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
        e.currentTarget.style.boxShadow = `
          0 32px 64px rgba(0, 0, 0, 0.12),
          0 16px 32px rgba(0, 0, 0, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.6)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = `
          0 20px 40px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.4)
        `;
      }}
    >
      {/* Animated Background Pattern */}
      <div
        className='position-absolute w-100 h-100'
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)
          `,
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      {/* Premium Header */}
      <div
        className='px-4 py-4 d-flex align-items-center gap-3 position-relative'
        style={{
          background: `
            linear-gradient(135deg, #3b82f6, #2563eb),
            linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))
          `,
          color: '#ffffff',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Icon with Micro-animation */}
        <div
          className='d-flex align-items-center justify-content-center rounded-circle position-relative'
          style={{
            width: '56px',
            height: '56px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <i className='fas fa-edit' style={{ fontSize: '1.5rem' }}></i>

          {/* Subtle glow effect */}
          <div
            className='position-absolute rounded-circle'
            style={{
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              background: 'rgba(255, 255, 255, 0.1)',
              filter: 'blur(8px)',
              zIndex: -1,
            }}
          />
        </div>

        <div className='flex-grow-1'>
          <h5
            className='fw-bold mb-2 text-white'
            style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}
          >
            Application Details
          </h5>
          <div
            className='px-3 py-2 rounded-pill fw-semibold text-white'
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              fontSize: '0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              letterSpacing: '0.02em',
            }}
          >
            {isApplicationLocked ? 'Locked' : 'Editable'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className='px-4 pb-4'>
        <form>
          {/* Amount and Term Row */}
          <div className='row g-4 mb-4'>
            <div className='col-md-6'>
              <label className='form-label fw-semibold text-slate-700 mb-2'>
                <i className='fas fa-euro-sign me-2 text-success'></i>
                Amount
              </label>
              <div
                className='input-group input-group-sm position-relative'
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: editMode.amount
                    ? '2px solid #22c55e'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: editMode.amount
                    ? '0 15px 35px rgba(34, 197, 94, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)'
                    : '0 8px 24px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!editMode.amount) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 16px 40px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editMode.amount) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(0, 0, 0, 0.06)';
                  }
                }}
              >
                {/* Glow effect for editing */}
                {editMode.amount && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      background:
                        'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))',
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
                    color: '#1e293b',
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
                    backgroundColor: editMode.amount ? '#ef4444' : '#1f2937',
                    color: 'white',
                    border: 'none',
                    padding: '0 1rem',
                    transition: 'all 0.2s ease',
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

                {/* Editing Badge */}
                {editMode.amount && (
                  <div
                    className='position-absolute'
                    style={{
                      top: '-8px',
                      right: '70px',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 8px rgba(34, 197, 94, 0.3)',
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
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <i className='fas fa-exclamation-circle'></i>
                  Please enter a valid amount greater than zero.
                </div>
              )}
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-semibold text-slate-700 mb-2'>
                <i className='fas fa-calendar-alt me-2 text-blue-500'></i>
                Initial Term
              </label>
              <div
                className='input-group input-group-sm'
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
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
                    color: '#64748b',
                  }}
                  value={`${application.term} months`}
                  readOnly
                />
                <button
                  type='button'
                  className='btn'
                  style={{
                    backgroundColor: '#94a3b8',
                    color: 'white',
                    border: 'none',
                    padding: '0 1rem',
                    cursor: 'not-allowed',
                  }}
                  disabled
                >
                  <FaEdit size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Divider */}
          <div
            className='my-4 d-flex align-items-center position-relative'
            style={{ margin: '2rem 0' }}
          >
            <div
              style={{
                flex: 1,
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              }}
            />
            <div
              className='d-flex align-items-center justify-content-center mx-3'
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                fontSize: '1rem',
                boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)',
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
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              }}
            />
          </div>

          {/* Deceased Details Row */}
          <div className='row g-4 mb-4'>
            <div className='col-md-6'>
              <label className='form-label fw-semibold text-slate-700 mb-2'>
                <i className='fas fa-user me-2 text-purple-500'></i>
                Deceased First Name
              </label>
              <div
                className='input-group input-group-sm position-relative'
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: editMode.deceased_first_name
                    ? '2px solid #8b5cf6'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: editMode.deceased_first_name
                    ? '0 15px 35px rgba(139, 92, 246, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)'
                    : '0 8px 24px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!editMode.deceased_first_name) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 16px 40px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editMode.deceased_first_name) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(0, 0, 0, 0.06)';
                  }
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
                        'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.1))',
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
                    color: '#1e293b',
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
                      ? '#ef4444'
                      : '#1f2937',
                    color: 'white',
                    border: 'none',
                    padding: '0 1rem',
                    transition: 'all 0.2s ease',
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
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 8px rgba(139, 92, 246, 0.3)',
                      animation: 'editingPulse 2s ease-in-out infinite',
                    }}
                  >
                    EDITING
                  </div>
                )}
              </div>
            </div>

            <div className='col-md-6'>
              <label className='form-label fw-semibold text-slate-700 mb-2'>
                <i className='fas fa-user me-2 text-purple-500'></i>
                Deceased Last Name
              </label>
              <div
                className='input-group input-group-sm position-relative'
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: editMode.deceased_last_name
                    ? '2px solid #8b5cf6'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: editMode.deceased_last_name
                    ? '0 15px 35px rgba(139, 92, 246, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)'
                    : '0 8px 24px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!editMode.deceased_last_name) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 16px 40px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editMode.deceased_last_name) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(0, 0, 0, 0.06)';
                  }
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
                        'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(139, 92, 246, 0.1))',
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
                    color: '#1e293b',
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
                      ? '#ef4444'
                      : '#1f2937',
                    color: 'white',
                    border: 'none',
                    padding: '0 1rem',
                    transition: 'all 0.2s ease',
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
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 8px rgba(139, 92, 246, 0.3)',
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
            <label className='form-label fw-semibold text-slate-700 mb-3'>
              <i className='fas fa-gavel me-2 text-amber-500'></i>
              Was this will professionally prepared by a solicitor?
            </label>
            <div
              className='d-flex gap-4 p-4'
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div
                className='form-check position-relative'
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  background: !!application.was_will_prepared_by_solicitor
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'rgba(255, 255, 255, 0.5)',
                  border: !!application.was_will_prepared_by_solicitor
                    ? '2px solid #22c55e'
                    : '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: !!application.was_will_prepared_by_solicitor
                    ? 'scale(1.02) translateY(-2px)'
                    : 'scale(1)',
                  boxShadow: !!application.was_will_prepared_by_solicitor
                    ? '0 8px 16px rgba(34, 197, 94, 0.30)'
                    : '0 4px 8px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  if (!application.was_will_prepared_by_solicitor) {
                    e.currentTarget.style.transform =
                      'scale(1.01) translateY(-1px)';
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!application.was_will_prepared_by_solicitor) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.5)';
                  }
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
                        'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))',
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
                      : '#059669',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  <i className='fas fa-check-circle'></i>
                  Yes
                </label>
              </div>

              <div
                className='form-check position-relative'
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  background: !application.was_will_prepared_by_solicitor
                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                    : 'rgba(255, 255, 255, 0.5)',
                  border: !application.was_will_prepared_by_solicitor
                    ? '2px solid #ef4444'
                    : '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: !application.was_will_prepared_by_solicitor
                    ? 'scale(1.02) translateY(-2px)'
                    : 'scale(1)',
                  boxShadow: !application.was_will_prepared_by_solicitor
                    ? '0 8px 16px rgba(239, 68, 68, 0.30)'
                    : '0 4px 8px rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  if (application.was_will_prepared_by_solicitor) {
                    e.currentTarget.style.transform =
                      'scale(1.01) translateY(-1px)';
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (application.was_will_prepared_by_solicitor) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.5)';
                  }
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
                        'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1))',
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
                      : '#dc2626',
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
            <label className='form-label fw-semibold text-slate-700 mb-2'>
              <i className='fas fa-exclamation-triangle me-2 text-orange-500'></i>
              Dispute Details
            </label>
            <div
              className='input-group position-relative'
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.7)',
                border: editMode.dispute_details
                  ? '2px solid #f97316'
                  : '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                boxShadow: editMode.dispute_details
                  ? '0 15px 35px rgba(249, 115, 22, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1)'
                  : '0 8px 24px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!editMode.dispute_details) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 16px 40px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!editMode.dispute_details) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 24px rgba(0, 0, 0, 0.06)';
                }
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
                      'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(249, 115, 22, 0.1))',
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
                  color: '#1e293b',
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
                    ? '#ef4444'
                    : '#1f2937',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  transition: 'all 0.2s ease',
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
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 8px rgba(249, 115, 22, 0.3)',
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
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
          }
          50% { 
            transform: translateY(-10px) rotate(2deg);
          }
        }
        
        @keyframes editingPulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.05); 
          }
        }
        
        @keyframes selectionGlow {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-8px) rotate(5deg) scale(1.02); }
        }
        
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
        
        .rounded-lg {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default BasicDetailsSection;
