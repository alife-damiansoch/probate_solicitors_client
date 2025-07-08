import LoadingComponent from '../../GenericComponents/LoadingComponent';
import {
  formatDate,
  formatMoney,
} from '../../GenericFunctions/HelperGenericFunctions';

const AdvancementInfo = ({ advancement }) => {
  if (!advancement) return <LoadingComponent />;

  const isSettled = advancement?.is_settled;

  const statusStyles = {
    cardBg: isSettled
      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))'
      : 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
    borderColor: isSettled
      ? 'rgba(34, 197, 94, 0.3)'
      : 'rgba(245, 158, 11, 0.3)',
    headerBg: isSettled
      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
      : 'linear-gradient(135deg, #f59e0b, #d97706)',
    accentGlow: isSettled
      ? 'rgba(34, 197, 94, 0.2)'
      : 'rgba(245, 158, 11, 0.2)',
  };

  return (
    <div
      className='modern-main-card mb-4 position-relative overflow-hidden'
      style={{
        background: `${statusStyles.cardBg}, 
                    radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.6), transparent 50%),
                    radial-gradient(circle at 70% 90%, ${statusStyles.accentGlow}, transparent 50%)`,
        border: `1px solid ${statusStyles.borderColor}`,
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
            radial-gradient(circle at 20% 20%, ${statusStyles.accentGlow} 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, ${statusStyles.accentGlow} 0%, transparent 50%)
          `,
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      {/* Header with Glassmorphism */}
      <div
        className='px-4 py-4 d-flex align-items-center gap-3 position-relative'
        style={{
          background: `${statusStyles.headerBg}, 
                      linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
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
          <svg width='26' height='26' fill='currentColor' viewBox='0 0 20 20'>
            <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z'
              clipRule='evenodd'
            />
          </svg>

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
            Advancement Details
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
            ID: {advancement?.id}
          </div>
        </div>
      </div>

      {/* Status Badges with Modern Design */}
      <div className='px-4 py-4 d-flex flex-wrap justify-content-start gap-3'>
        <span
          className='px-4 py-3 rounded-pill text-white fw-bold d-flex align-items-center gap-2 position-relative'
          style={{
            background: `${
              isSettled
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #f59e0b, #d97706)'
            }, linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))`,
            fontSize: '0.9rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'default',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
        >
          <svg width='18' height='18' fill='currentColor' viewBox='0 0 20 20'>
            {isSettled ? (
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            ) : (
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                clipRule='evenodd'
              />
            )}
          </svg>
          Settlement: {isSettled ? 'Complete' : 'Pending'}
        </span>

        <span
          className='px-4 py-3 rounded-pill text-white fw-bold d-flex align-items-center gap-2'
          style={{
            background:
              'linear-gradient(135deg, #3b82f6, #2563eb), linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            fontSize: '0.9rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'default',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
          }}
        >
          <svg width='18' height='18' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
              clipRule='evenodd'
            />
          </svg>
          Settled: {formatDate(advancement?.settled_date) || 'N/A'}
        </span>
      </div>

      {/* Modern Detail Cards */}
      <div className='px-4 pb-4'>
        <div className='row g-4'>
          {/* Timeline Card */}
          <div className='col-12 col-md-6'>
            <div
              className='p-4 h-100 position-relative'
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 16px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div className='d-flex align-items-center gap-3 mb-3'>
                <div
                  className='d-flex align-items-center justify-content-center rounded-circle'
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                  }}
                >
                  <svg
                    width='18'
                    height='18'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h6
                  className='fw-bold text-primary mb-0'
                  style={{ fontSize: '1.1rem', letterSpacing: '-0.01em' }}
                >
                  Timeline & Terms
                </h6>
              </div>

              <div className='space-y-3'>
                {[
                  {
                    label: 'Approved Date',
                    value: formatDate(advancement?.approved_date),
                  },
                  {
                    label: 'Initial Term',
                    value: `${advancement?.term_agreed} months`,
                  },
                  {
                    label: 'Maturity Date',
                    value: advancement?.is_paid_out
                      ? formatDate(advancement?.maturity_date)
                      : 'Not paid out',
                    color: advancement?.is_paid_out ? '#111827' : '#dc2626',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className='d-flex justify-content-between align-items-center py-3 px-3 rounded-lg'
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span className='text-muted fw-medium'>{item.label}</span>
                    <span
                      className='fw-bold'
                      style={{ color: item.color || '#111827' }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Card */}
          <div className='col-12 col-md-6'>
            <div
              className='p-4 h-100 position-relative'
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '18px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 16px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div className='d-flex align-items-center gap-3 mb-3'>
                <div
                  className='d-flex align-items-center justify-content-center rounded-circle'
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                  }}
                >
                  <svg
                    width='18'
                    height='18'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h6
                  className='fw-bold text-success mb-0'
                  style={{ fontSize: '1.1rem', letterSpacing: '-0.01em' }}
                >
                  Financial Summary
                </h6>
              </div>

              <div className='space-y-3'>
                {[
                  {
                    label: 'Principal',
                    value: formatMoney(
                      advancement?.loanbook_data
                        ? advancement.loanbook_data.initial_amount
                        : advancement.amount_agreed,
                      advancement.currency_sign
                    ),
                    color: '#111827',
                  },
                  {
                    label: 'Total Fees',
                    value: formatMoney(
                      advancement?.loanbook_data
                        ? advancement.amount_paid +
                            advancement.loanbook_data.total_due -
                            advancement.loanbook_data.initial_amount
                        : advancement.fee_agreed,
                      advancement.currency_sign
                    ),
                    color: '#f59e0b',
                  },
                  ...(advancement.extension_fees_total > 0
                    ? [
                        {
                          label: 'Extension Fees',
                          value: formatMoney(
                            advancement.extension_fees_total,
                            advancement.currency_sign
                          ),
                          color: '#f59e0b',
                        },
                      ]
                    : []),
                  ...(advancement.amount_paid > 0
                    ? [
                        {
                          label: 'Amount Paid',
                          value: formatMoney(
                            advancement.amount_paid,
                            advancement.currency_sign
                          ),
                          color: '#22c55e',
                        },
                      ]
                    : []),
                  {
                    label: 'Total Balance',
                    value: formatMoney(
                      advancement?.loanbook_data
                        ? advancement.loanbook_data.total_due
                        : advancement.current_balance,
                      advancement.currency_sign
                    ),
                    color: '#3b82f6',
                    highlight: true,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className='d-flex justify-content-between align-items-center py-3 px-3 rounded-lg'
                    style={{
                      background: item.highlight
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(255, 255, 255, 0.5)',
                      border: item.highlight
                        ? '1px solid rgba(59, 130, 246, 0.2)'
                        : '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = item.highlight
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = item.highlight
                        ? 'rgba(59, 130, 246, 0.1)'
                        : 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span className='text-muted fw-medium'>{item.label}</span>
                    <span
                      className={item.highlight ? 'fw-bold' : 'fw-bold'}
                      style={{
                        color: item.color,
                        fontSize: item.highlight ? '1.1em' : '1em',
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
            transform: translateY(-10px) rotate(2deg);
          }
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

export default AdvancementInfo;
