import {
  formatDate,
  formatMoney,
} from '../../GenericFunctions/HelperGenericFunctions';

const AdvancementInfo = ({ advancement }) => {
  console.log('ADVANCEMENT INFO: ', advancement);

  // Get styling based on settlement status
  const getStatusStyles = () => {
    if (advancement.is_settled) {
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        borderColor: '#22c55e',
        headerBg: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        headerText: '#ffffff',
      };
    }
    return {
      background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
      borderColor: '#f59e0b',
      headerBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      headerText: '#ffffff',
    };
  };

  const statusStyles = getStatusStyles();

  return (
    <div
      key={advancement.id}
      className='mb-4'
      style={{
        background: statusStyles.background,
        borderRadius: '20px',
        border: `2px solid ${statusStyles.borderColor}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Modern Header */}
      <div
        className='text-center'
        style={{
          background: statusStyles.headerBg,
          padding: '20px 24px',
          color: statusStyles.headerText,
        }}
      >
        <div className='d-flex align-items-center justify-content-center gap-3'>
          <div
            className='d-flex align-items-center justify-content-center rounded-3'
            style={{
              width: '44px',
              height: '44px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <svg width='22' height='22' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h4 className='mb-0 fw-bold' style={{ fontSize: '1.5rem' }}>
              Advancement Details
            </h4>
            <span
              className='px-3 py-1 rounded-pill fw-bold'
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontSize: '1.1rem',
                marginTop: '4px',
                display: 'inline-block',
              }}
            >
              ID: {advancement.id}
            </span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '24px' }}>
        {/* Status Badges */}
        <div className='d-flex justify-content-end gap-3 mb-4'>
          <span
            className={`px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2`}
            style={{
              background: advancement.is_settled
                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              fontSize: '0.9rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
              {advancement.is_settled ? (
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
            Settlement: {advancement.is_settled ? 'Complete' : 'Pending'}
          </span>

          <span
            className='px-4 py-2 rounded-pill fw-bold d-flex align-items-center gap-2'
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#ffffff',
              fontSize: '0.9rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                clipRule='evenodd'
              />
            </svg>
            Settled: {advancement.settled_date || 'N/A'}
          </span>
        </div>

        {/* Information Tables */}
        <div className='row g-4'>
          {/* Timeline Information */}
          <div className='col-md-6'>
            <div
              className='p-4 rounded-3'
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #3b82f6',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h6
                className='fw-bold mb-3 pb-2 d-flex align-items-center gap-2'
                style={{
                  color: '#1e40af',
                  borderBottom: '2px solid #3b82f6',
                  fontSize: '1rem',
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
                Timeline & Terms
              </h6>

              <div className='d-flex flex-column gap-3'>
                <div
                  className='p-3 rounded-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    border: '1px solid #93c5fd',
                  }}
                >
                  <div className='d-flex justify-content-between align-items-center'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#1e40af', fontSize: '0.9rem' }}
                    >
                      Approved Date:
                    </span>
                    <span
                      className='fw-bold'
                      style={{ color: '#1e40af', fontSize: '1rem' }}
                    >
                      {formatDate(advancement.approved_date)}
                    </span>
                  </div>
                </div>

                <div
                  className='p-3 rounded-3'
                  style={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex justify-content-between align-items-center'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Initial Term :
                    </span>
                    <span
                      className='fw-bold'
                      style={{ color: '#374151', fontSize: '1rem' }}
                    >
                      {advancement.term_agreed} months
                    </span>
                  </div>
                </div>

                <div
                  className='p-3 rounded-3'
                  style={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex justify-content-between align-items-center'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Maturity Date:
                    </span>
                    {!advancement.is_paid_out ? (
                      <span
                        className='fw-bold'
                        style={{ color: 'red', fontSize: '1rem' }}
                      >
                        Not paid out
                      </span>
                    ) : (
                      <span
                        className='fw-bold'
                        style={{ color: '#374151', fontSize: '1rem' }}
                      >
                        {formatDate(advancement.maturity_date)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className='col-md-6'>
            <div
              className='p-4 rounded-3'
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #16a34a',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h6
                className='fw-bold mb-3 pb-2 d-flex align-items-center gap-2'
                style={{
                  color: '#15803d',
                  borderBottom: '2px solid #16a34a',
                  fontSize: '1rem',
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
                Financial Summary
              </h6>

              <div className='d-flex flex-column gap-3'>
                <div
                  className='p-3 rounded-3'
                  style={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex justify-content-between align-items-center'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Advancement principal:
                    </span>
                    <span
                      className='fw-bold'
                      style={{ color: '#374151', fontSize: '1rem' }}
                    >
                      {formatMoney(
                        advancement?.loanbook_data?.initial_amount ||
                          advancement.amount_agreed,
                        advancement.currency_sign
                      )}
                    </span>
                  </div>
                </div>

                <div
                  className='p-3 rounded-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '1px solid #fbbf24',
                  }}
                >
                  <div className='d-flex justify-content-between align-items-center'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#92400e', fontSize: '0.9rem' }}
                    >
                      Total fees to date:
                    </span>
                    <span
                      className='fw-bold'
                      style={{ color: '#d97706', fontSize: '1rem' }}
                    >
                      {formatMoney(
                        advancement?.amount_paid +
                          advancement?.loanbook_data?.total_due -
                          advancement?.loanbook_data?.initial_amount ||
                          advancement.fee_agreed,
                        advancement.currency_sign
                      )}
                    </span>
                  </div>
                </div>

                {advancement.extension_fees_total > 0 && (
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background:
                        'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      border: '1px solid #fbbf24',
                    }}
                  >
                    <div className='d-flex justify-content-between align-items-center'>
                      <span
                        className='fw-semibold'
                        style={{ color: '#92400e', fontSize: '0.9rem' }}
                      >
                        Extension Fees:
                      </span>
                      <span
                        className='fw-bold'
                        style={{ color: '#d97706', fontSize: '1rem' }}
                      >
                        {formatMoney(
                          advancement.extension_fees_total,
                          advancement.currency_sign
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {advancement.amount_paid > 0 && (
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background:
                        'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                      border: '1px solid #86efac',
                    }}
                  >
                    <div className='d-flex justify-content-between align-items-center'>
                      <span
                        className='fw-semibold'
                        style={{ color: '#15803d', fontSize: '0.9rem' }}
                      >
                        Amount Paid:
                      </span>
                      <span
                        className='fw-bold'
                        style={{ color: '#16a34a', fontSize: '1rem' }}
                      >
                        {formatMoney(
                          advancement.amount_paid,
                          advancement.currency_sign
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div
                  className='p-3 rounded-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    border: '2px solid #3b82f6',
                  }}
                >
                  <div className='d-flex justify-content-between align-items-center'>
                    <span
                      className='fw-bold'
                      style={{ color: '#1e40af', fontSize: '1rem' }}
                    >
                      Total balance to date:
                    </span>
                    <span
                      className='fw-bold'
                      style={{ color: '#1e40af', fontSize: '1.2rem' }}
                    >
                      {formatMoney(
                        advancement?.loanbook_data?.total_due ||
                          advancement.current_balance,
                        advancement.currency_sign
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancementInfo;
