import React, { useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaCompress,
  FaExpand,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
} from 'react-icons/fa';
import { formatMoney } from '../../../../GenericFunctions/HelperGenericFunctions';

// Helper function to convert to number (you may need to import this from wherever it's defined)
const toNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
};

export default function EstateSummarySticky({
  estates,
  formData,
  currency_sign,
}) {
  const [expandLevel, setExpandLevel] = useState(0); // 0: minimal, 1: expanded, 2: full breakdown
  const [showDetails, setShowDetails] = useState({
    lendable: false,
    nonLendable: false,
    liabilities: false,
  });

  const requested = toNumber(formData?.amount || 0);

  // Calculate estate totals using the correct properties
  const calculations = React.useMemo(() => {
    const assets = estates.filter((estate) => estate.is_asset === true);
    const liabilities = estates.filter((estate) => estate.is_asset === false);

    // Categorize assets by lendable property
    const lendableAssets = assets.filter((estate) => estate.lendable === true);
    const nonLendableAssets = assets.filter(
      (estate) => estate.lendable === false
    );

    // Calculate totals
    const totalAssets = assets.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );
    const totalLiabilities = liabilities.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );
    const totalLendableAssets = lendableAssets.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );
    const totalNonLendableAssets = nonLendableAssets.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );

    const netIrishEstate = totalAssets - totalLiabilities;
    const lendableIrishEstate = totalLendableAssets - totalLiabilities;
    const maximumAdvance = Math.max(0, lendableIrishEstate * 0.5);

    return {
      totalAssets,
      totalLiabilities,
      totalLendableAssets,
      totalNonLendableAssets,
      netIrishEstate,
      lendableIrishEstate,
      maximumAdvance,
      lendableAssets,
      nonLendableAssets,
      liabilities,
    };
  }, [estates]);

  const formatCurrency = (amount) => formatMoney(amount, currency_sign);

  const getStatusMessage = () => {
    if (calculations.lendableIrishEstate <= 0) {
      return {
        type: 'warning',
        message:
          'Please enter estate details to calculate advance eligibility.',
        short: 'Enter estate details',
      };
    }
    if (requested <= 0) {
      return {
        type: 'info',
        message: 'Please enter the requested advance amount above.',
        short: 'Enter requested amount',
      };
    }
    if (requested > calculations.maximumAdvance) {
      return {
        type: 'danger',
        message: 'Requested amount exceeds the maximum allowed advance.',
        short: 'Amount exceeds maximum',
      };
    }
    return {
      type: 'success',
      message: 'Requested amount is within the maximum allowed advance.',
      short: 'Amount within limits',
    };
  };

  const status = getStatusMessage();

  const toggleDetails = (section) => {
    setShowDetails((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const cycleExpandLevel = () => {
    setExpandLevel((prev) => (prev + 1) % 3);
  };

  const renderEstateGroup = (estatesGroup, title, colorClass) => {
    if (estatesGroup.length === 0) return null;

    const total = estatesGroup.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );
    const sectionKey = title.toLowerCase().replace(/\s+/g, '');

    return (
      <div className='mb-3'>
        <div
          className='d-flex justify-content-between align-items-center p-2 border rounded'
          onClick={() => toggleDetails(sectionKey)}
          style={{
            backgroundColor: 'var(--surface-secondary)',
            cursor: 'pointer',
            borderColor: 'var(--border-muted)',
          }}
        >
          <div className='d-flex align-items-center'>
            <span className={`fw-bold ${colorClass}`}>{title}</span>
            <span className='ms-2' style={{ color: 'var(--text-muted)' }}>
              ({estatesGroup.length} items)
            </span>
          </div>
          <div className='d-flex align-items-center'>
            <span className={`fw-bold me-2 ${colorClass}`}>
              {formatCurrency(total)}
            </span>
            {showDetails[sectionKey] ? (
              <FaEyeSlash
                size={14}
                className='ms-1'
                style={{ color: 'var(--text-muted)' }}
              />
            ) : (
              <FaEye
                size={14}
                className='ms-1'
                style={{ color: 'var(--text-muted)' }}
              />
            )}
          </div>
        </div>

        {showDetails[sectionKey] && (
          <div className='mt-2 ps-2'>
            {estatesGroup.map((estate, index) => (
              <div
                key={index}
                className='d-flex justify-content-between py-1 border-bottom'
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <span
                  className='text-truncate me-2'
                  style={{
                    maxWidth: '160px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {estate.group_label || estate.name || 'Unnamed'}
                </span>
                <span
                  className='text-nowrap'
                  style={{ color: 'var(--text-primary)' }}
                >
                  {formatCurrency(estate.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // *** MAIN RETURN BLOCK ***
  return (
    <div
      className='estate-summary-sticky position-fixed start-0 end-0 bottom-0 border-top shadow'
      style={{
        zIndex: 1050,
        maxHeight: expandLevel === 2 ? '70vh' : 'auto',
        overflow: expandLevel === 2 ? 'auto' : 'visible',
        transition: 'all 0.3s',
        backgroundColor: 'var(--surface-primary)',
        borderColor: 'var(--border-primary)',
        boxShadow: '0 -8px 24px var(--primary-20)',
      }}
    >
      <div className='container-fluid p-2 p-sm-3'>
        {/* HEADER: PC/Desktop layout */}
        <div className='d-none d-sm-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <FaInfoCircle
              className='me-2'
              style={{ color: 'var(--primary-blue)' }}
            />
            <div>
              <span
                className='fw-bold me-3'
                style={{ color: 'var(--primary-blue)' }}
              >
                Max Advance:{' '}
              </span>
              <span
                className='h6 mb-0 fw-bold'
                style={{ color: 'var(--warning-primary)' }}
              >
                {formatCurrency(calculations.maximumAdvance)}
              </span>
              {requested > 0 && (
                <span
                  className='ms-3 small'
                  style={{ color: 'var(--text-muted)' }}
                >
                  Requested:{' '}
                  <span
                    className='fw-bold'
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {formatCurrency(requested)}
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className='d-flex align-items-center'>
            <div
              className={`badge me-3`}
              style={{
                backgroundColor:
                  status.type === 'danger'
                    ? 'var(--error-primary)'
                    : status.type === 'success'
                    ? 'var(--success-primary)'
                    : status.type === 'warning'
                    ? 'var(--warning-primary)'
                    : 'var(--primary-blue)',
                color: '#ffffff',
                border: '1px solid var(--border-muted)',
              }}
            >
              {status.short}
            </div>
            {expandLevel === 1 ? (
              <div className='d-flex gap-2'>
                <button
                  className='btn btn-sm'
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-muted)',
                  }}
                  onClick={() => setExpandLevel(0)}
                >
                  <FaChevronDown />
                  <span className='ms-1'>Show Less</span>
                </button>
                <button
                  className='btn btn-sm'
                  style={{
                    backgroundColor: 'var(--surface-secondary)',
                    color: 'var(--primary-blue)',
                    border: '1px solid var(--border-primary)',
                  }}
                  onClick={() => setExpandLevel(2)}
                >
                  <FaExpand />
                  <span className='ms-1'>Show Breakdown</span>
                </button>
              </div>
            ) : (
              <button
                className='btn btn-sm'
                style={{
                  backgroundColor: 'var(--surface-secondary)',
                  color: 'var(--primary-blue)',
                  border: '1px solid var(--border-primary)',
                }}
                onClick={cycleExpandLevel}
              >
                {expandLevel === 0 ? (
                  <FaChevronUp />
                ) : expandLevel === 1 ? (
                  <FaExpand />
                ) : (
                  <FaCompress />
                )}
                <span className='ms-2'>
                  {expandLevel === 0
                    ? 'Show More'
                    : expandLevel === 1
                    ? 'Show Less | Show Breakdown'
                    : 'Hide Breakdown'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* HEADER: MOBILE layout */}
        <div className='d-sm-none'>
          <div className='d-flex flex-column gap-2'>
            <div className='d-flex justify-content-between align-items-center'>
              <span>
                <FaInfoCircle
                  className='me-2 fs-5'
                  style={{ color: 'var(--primary-blue)' }}
                />
                <span
                  className='fw-bold'
                  style={{ color: 'var(--primary-blue)' }}
                >
                  Max:
                </span>
                <span
                  className='fw-bold ms-2'
                  style={{ color: 'var(--warning-primary)' }}
                >
                  {formatCurrency(calculations.maximumAdvance)}
                </span>
              </span>
              <button
                className='btn btn-lg px-3 py-2'
                style={{
                  fontSize: '17px',
                  backgroundColor: 'var(--surface-secondary)',
                  color: 'var(--primary-blue)',
                  border: '1px solid var(--border-primary)',
                }}
                onClick={cycleExpandLevel}
              >
                {expandLevel === 0 ? (
                  <FaChevronUp className='fs-5' />
                ) : expandLevel === 1 ? (
                  <FaExpand className='fs-5' />
                ) : (
                  <FaCompress className='fs-5' />
                )}
                <span className='ms-2'>
                  {expandLevel === 0
                    ? 'Details'
                    : expandLevel === 1
                    ? 'Breakdown'
                    : 'Hide'}
                </span>
              </button>
            </div>
            <div className='d-flex align-items-center justify-content-between'>
              {requested > 0 && (
                <span className='small' style={{ color: 'var(--text-muted)' }}>
                  Requested:{' '}
                  <span
                    className='fw-bold'
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {formatCurrency(requested)}
                  </span>
                </span>
              )}
              <div
                className={`badge`}
                style={{
                  backgroundColor:
                    status.type === 'danger'
                      ? 'var(--error-primary)'
                      : status.type === 'success'
                      ? 'var(--success-primary)'
                      : status.type === 'warning'
                      ? 'var(--warning-primary)'
                      : 'var(--primary-blue)',
                  color: '#ffffff',
                  border: '1px solid var(--border-muted)',
                }}
              >
                {status.short}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded View - Level 1 */}
        {expandLevel >= 1 && (
          <div
            className='mt-2 pt-2 border-top'
            style={{ borderColor: 'var(--border-muted)' }}
          >
            {/* PC - columns */}
            <div className='row g-2 mb-3 d-none d-sm-flex'>
              <div className='col-sm-6 col-lg-3'>
                <div
                  className='text-center p-2 border rounded'
                  style={{
                    backgroundColor: 'var(--success-20)',
                    borderColor: 'var(--border-muted)',
                  }}
                >
                  <div
                    className='small mb-1'
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Total Assets
                  </div>
                  <div
                    className='h6 mb-0 fw-bold'
                    style={{ color: 'var(--success-primary)' }}
                  >
                    {formatCurrency(calculations.totalAssets)}
                  </div>
                </div>
              </div>
              <div className='col-sm-6 col-lg-3'>
                <div
                  className='text-center p-2 border rounded'
                  style={{
                    backgroundColor: 'var(--error-20)',
                    borderColor: 'var(--border-muted)',
                  }}
                >
                  <div
                    className='small mb-1'
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Total Liabilities
                  </div>
                  <div
                    className='h6 mb-0 fw-bold'
                    style={{ color: 'var(--error-primary)' }}
                  >
                    {formatCurrency(calculations.totalLiabilities)}
                  </div>
                </div>
              </div>
              <div className='col-sm-6 col-lg-3'>
                <div
                  className='text-center p-2 border rounded'
                  style={{
                    backgroundColor: 'var(--primary-20)',
                    borderColor: 'var(--border-muted)',
                  }}
                >
                  <div
                    className='small mb-1'
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Net Irish Estate
                  </div>
                  <div
                    className='h6 mb-0 fw-bold'
                    style={{ color: 'var(--primary-blue)' }}
                  >
                    {formatCurrency(calculations.netIrishEstate)}
                  </div>
                </div>
              </div>
              <div className='col-sm-6 col-lg-3'>
                <div
                  className='text-center p-2 border rounded'
                  style={{
                    backgroundColor: 'var(--warning-20)',
                    borderColor: 'var(--border-muted)',
                  }}
                >
                  <div
                    className='small mb-1'
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Lendable Estate
                  </div>
                  <div
                    className='h6 mb-0 fw-bold'
                    style={{ color: 'var(--warning-primary)' }}
                  >
                    {formatCurrency(calculations.lendableIrishEstate)}
                  </div>
                </div>
              </div>
            </div>
            {/* MOBILE - stacked cards */}
            <div className='d-sm-none'>
              <div className='row g-2'>
                <div className='col-12'>
                  <div
                    className='text-center p-2 border rounded'
                    style={{
                      backgroundColor: 'var(--success-20)',
                      borderColor: 'var(--border-muted)',
                    }}
                  >
                    <div
                      className='small mb-1'
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Total Assets
                    </div>
                    <div
                      className='fw-bold'
                      style={{ color: 'var(--success-primary)' }}
                    >
                      {formatCurrency(calculations.totalAssets)}
                    </div>
                  </div>
                </div>
                <div className='col-12'>
                  <div
                    className='text-center p-2 border rounded'
                    style={{
                      backgroundColor: 'var(--error-20)',
                      borderColor: 'var(--border-muted)',
                    }}
                  >
                    <div
                      className='small mb-1'
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Total Liabilities
                    </div>
                    <div
                      className='fw-bold'
                      style={{ color: 'var(--error-primary)' }}
                    >
                      {formatCurrency(calculations.totalLiabilities)}
                    </div>
                  </div>
                </div>
                <div className='col-12'>
                  <div
                    className='text-center p-2 border rounded'
                    style={{
                      backgroundColor: 'var(--primary-20)',
                      borderColor: 'var(--border-muted)',
                    }}
                  >
                    <div
                      className='small mb-1'
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Net Irish Estate
                    </div>
                    <div
                      className='fw-bold'
                      style={{ color: 'var(--primary-blue)' }}
                    >
                      {formatCurrency(calculations.netIrishEstate)}
                    </div>
                  </div>
                </div>
                <div className='col-12'>
                  <div
                    className='text-center p-2 border rounded'
                    style={{
                      backgroundColor: 'var(--warning-20)',
                      borderColor: 'var(--border-muted)',
                    }}
                  >
                    <div
                      className='small mb-1'
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Lendable Estate
                    </div>
                    <div
                      className='fw-bold'
                      style={{ color: 'var(--warning-primary)' }}
                    >
                      {formatCurrency(calculations.lendableIrishEstate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Status Message */}
            <div
              className={`alert mb-0 mt-2`}
              style={{
                backgroundColor:
                  status.type === 'danger'
                    ? 'var(--error-20)'
                    : status.type === 'success'
                    ? 'var(--success-20)'
                    : status.type === 'warning'
                    ? 'var(--warning-20)'
                    : 'var(--primary-20)',
                borderColor:
                  status.type === 'danger'
                    ? 'var(--error-30)'
                    : status.type === 'success'
                    ? 'var(--success-30)'
                    : status.type === 'warning'
                    ? 'var(--warning-30)'
                    : 'var(--primary-30)',
                color:
                  status.type === 'danger'
                    ? 'var(--error-primary)'
                    : status.type === 'success'
                    ? 'var(--success-primary)'
                    : status.type === 'warning'
                    ? 'var(--warning-primary)'
                    : 'var(--primary-blue)',
              }}
            >
              <div className='d-flex align-items-start'>
                <FaInfoCircle className='me-2 mt-1' />
                <div>
                  <strong>{status.message}</strong>
                  {status.type === 'danger' && (
                    <div className='mt-1 small'>
                      The maximum advance currently offered is{' '}
                      <strong>50% of the Lendable Irish Estate</strong>.<br />
                      Please adjust the requested amount or estate details.
                    </div>
                  )}
                  {status.type === 'success' && (
                    <div className='mt-1 small'>
                      You can proceed with your application.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Breakdown View - Level 2 */}
        {expandLevel >= 2 && (
          <div
            className='mt-3 pt-3 border-top'
            style={{ borderColor: 'var(--border-muted)' }}
          >
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <h6 className='mb-0' style={{ color: 'var(--text-secondary)' }}>
                Detailed Estate Breakdown
              </h6>
              <button
                className='btn btn-sm'
                style={{
                  backgroundColor: 'var(--surface-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-muted)',
                }}
                onClick={() => setExpandLevel(1)}
              >
                <FaCompress />
                <span className='ms-1 d-none d-sm-inline'>Hide Breakdown</span>
                <span className='ms-1 d-sm-none'>Hide</span>
              </button>
            </div>
            {renderEstateGroup(
              calculations.lendableAssets,
              'Lendable Assets',
              'text-success'
            )}
            {renderEstateGroup(
              calculations.nonLendableAssets,
              'Non-Lendable Assets',
              'text-warning'
            )}
            {renderEstateGroup(
              calculations.liabilities,
              'Liabilities',
              'text-danger'
            )}
            {estates.length === 0 && (
              <div
                className='text-center py-4'
                style={{ color: 'var(--text-muted)' }}
              >
                <FaInfoCircle size={24} className='mb-2' />
                <div>No estate items have been added yet.</div>
                <div className='small'>
                  Add estate items to see the breakdown here.
                </div>
              </div>
            )}
            <div
              className='border-top pt-2 mt-3'
              style={{ borderColor: 'var(--border-muted)' }}
            >
              <small className='d-block' style={{ color: 'var(--text-muted)' }}>
                <sup>*</sup> Only lendable estate items are considered for
                advance calculations. This assessment may change; please consult
                your agent for more information.
              </small>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Custom color classes for estate groups */
        .text-success {
          color: var(--success-primary) !important;
        }
        .text-warning {
          color: var(--warning-primary) !important;
        }
        .text-danger {
          color: var(--error-primary) !important;
        }
      `}</style>
    </div>
  );
}
