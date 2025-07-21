import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { API_URL } from '../../../baseUrls';
import {
  deleteData,
  patchData,
  postData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import EstateFormModal from './EstatesManagerModalParts/EstateFormModal';
import EstateGroupManager from './EstatesManagerModalParts/EstateGroupManager';

const SIMPLE_TYPES = [
  'household_contents',
  'cars_boats',
  'business_farming',
  'business_other',
  'unpaid_purchase_money',
];

const ESTATE_ASSETS = [
  'real_and_leasehold',
  'household_contents',
  'cars_boats',
  'business_farming',
  'business_other',
  'financial_assets',
  'life_insurance',
  'debts_owing',
  'securities_quoted',
  'securities_unquoted',
  'unpaid_purchase_money',
  'other_property',
];

const ESTATE_LIABILITIES = ['irish_debts'];
const ESTATE_DISPLAY_ORDER = [...ESTATE_ASSETS, ...ESTATE_LIABILITIES];

const estateLabels = {
  real_and_leasehold: 'Real and Leasehold Property',
  household_contents: 'Household Contents',
  cars_boats: 'Cars/Boats',
  business_farming: 'Business Assets (Farming)',
  business_other: 'Business Assets (Other)',
  financial_assets: 'Assets with Financial Institutions',
  life_insurance: 'Proceeds of Life Insurance Policies',
  debts_owing: 'Debts Owing to the Deceased',
  securities_quoted: 'Stocks, Shares and Securities (Quoted)',
  securities_unquoted: 'Stocks, Shares and Securities (Unquoted)',
  unpaid_purchase_money: 'Unpaid Purchase Money',
  other_property: 'Other Property',
  irish_debts: 'Irish Debts and Funeral Expenses',
};

const EstateManagerModal = ({
  show,
  onClose,
  estates,
  applicationId,
  refreshEstates,
  currency_sign = '€',
}) => {
  const [simpleValues, setSimpleValues] = useState(() => {
    const initial = {};
    SIMPLE_TYPES.forEach((type) => {
      const typeEstates = estates?.filter((e) => e.category === type) || [];
      initial[type] = typeEstates[0]?.value || '';
    });
    return initial;
  });

  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [savingStates, setSavingStates] = useState({});
  const [formState, setFormState] = useState({
    show: false,
    mode: 'add',
    estateType: null,
    initialData: null,
  });

  const token = Cookies.get('auth_token')?.access;

  const grouped = ESTATE_DISPLAY_ORDER.reduce((acc, key) => {
    acc[key] = estates?.filter((e) => e.category === key) || [];
    return acc;
  }, {});

  useEffect(() => {
    const newValues = {};
    SIMPLE_TYPES.forEach((type) => {
      newValues[type] = grouped[type]?.[0]?.value || '';
    });
    setSimpleValues(newValues);
    setPendingChanges(new Set());
  }, [estates]);

  const openForm = (type, estate = null) => {
    setFormState({
      show: true,
      mode: estate ? 'edit' : 'add',
      estateType: type,
      initialData: estate,
    });
  };

  const closeForm = () => {
    setFormState({
      show: false,
      mode: 'add',
      estateType: null,
      initialData: null,
    });
  };

  const handleFormSubmit = async (type, data) => {
    if (!type) return;
    const baseUrl = `${API_URL}/api/estates/${type}/`;
    const body = { ...data, application: applicationId };

    try {
      if (formState.mode === 'add') {
        await postData(token, baseUrl, body);
      } else if (data.id) {
        await patchData(`${baseUrl}${data.id}/`, body);
      } else {
        throw new Error('Estate ID is required for editing');
      }
      closeForm();
      refreshEstates();
    } catch (err) {
      alert('Failed to save estate. Please try again.');
    }
  };

  const handleDelete = async (type, estate) => {
    if (!type || !estate?.id) return;
    if (!confirm('Are you sure you want to delete this estate?')) return;
    try {
      const deleteEndpoint = `${API_URL}/api/estates/${type}/${estate.id}/`;
      await deleteData(deleteEndpoint);
      refreshEstates();
    } catch (err) {
      alert('Failed to delete estate. Please try again.');
    }
  };

  const handleSimpleChange = (e, type) => {
    const newValue = e.target.value;
    setSimpleValues((prev) => ({ ...prev, [type]: newValue }));
    setPendingChanges((prev) => new Set([...prev, type]));
  };

  const handleSimpleSave = async (type) => {
    if (!type) return;
    setSavingStates((prev) => ({ ...prev, [type]: true }));
    try {
      const value = simpleValues[type];
      const existing = grouped[type]?.[0];
      if (existing?.id) {
        const updateEndpoint = `${API_URL}/api/estates/${type}/${existing.id}/`;
        await patchData(updateEndpoint, {
          value,
          application: applicationId,
        });
      } else if (value !== '' && value !== null && value !== undefined) {
        const createEndpoint = `${API_URL}/api/estates/${type}/`;
        await postData(token, createEndpoint, {
          value,
          application: applicationId,
        });
      }
      setPendingChanges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
      refreshEstates();
    } catch (err) {
      alert(`Failed to save ${estateLabels[type]}. Please try again.`);
    } finally {
      setSavingStates((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSimpleDelete = async (type) => {
    const existing = grouped[type]?.[0];
    if (!existing?.id) {
      setSimpleValues((prev) => ({ ...prev, [type]: '' }));
      setPendingChanges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
      return;
    }
    if (!confirm(`Are you sure you want to delete ${estateLabels[type]}?`))
      return;
    setSavingStates((prev) => ({ ...prev, [type]: true }));
    try {
      const deleteEndpoint = `${API_URL}/api/estates/${type}/${existing.id}/`;
      await deleteData(deleteEndpoint);
      setSimpleValues((prev) => ({ ...prev, [type]: '' }));
      setPendingChanges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
      refreshEstates();
    } catch (err) {
      alert(`Failed to delete ${estateLabels[type]}. Please try again.`);
    } finally {
      setSavingStates((prev) => ({ ...prev, [type]: false }));
    }
  };

  if (!show) return null;

  const renderSectionHeader = (title, description, isLiability = false) => (
    <div className='mb-4'>
      <div
        style={{
          background: `
            linear-gradient(135deg, 
              ${
                isLiability ? 'var(--warning-primary)' : 'var(--primary-blue)'
              } 0%, 
              ${
                isLiability ? 'var(--warning-dark)' : 'var(--primary-blue-dark)'
              } 80%),
            linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
          backgroundBlendMode: 'overlay',
          border: `1px solid ${
            isLiability ? 'var(--warning-30)' : 'var(--primary-30)'
          }`,
          borderRadius: '16px',
          borderLeft: `4px solid ${
            isLiability ? 'var(--warning-primary)' : 'var(--primary-blue)'
          }`,
          boxShadow: `
            0 16px 50px rgba(0, 0, 0, 0.08),
            0 8px 32px ${
              isLiability ? 'var(--warning-20)' : 'var(--primary-20)'
            },
            0 4px 16px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'sectionSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className='p-3 p-md-4'
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 30% 30%, 
                ${isLiability ? 'var(--warning-10)' : 'var(--primary-10)'}, 
                transparent 60%),
              radial-gradient(circle at 70% 70%, 
                ${isLiability ? 'var(--warning-05)' : 'var(--primary-05)'}, 
                transparent 60%)
            `,
            animation: 'float 8s ease-in-out infinite',
          }}
        />

        <h3
          style={{
            position: 'relative',
            zIndex: 1,
            margin: 0,
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: description ? '8px' : 0,
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            textTransform: 'uppercase',
          }}
          className='fs-6 fs-md-5'
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              position: 'relative',
              zIndex: 1,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.5',
              fontWeight: '500',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            }}
            className='small'
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );

  const renderSimpleEstateInput = (type, isLiability = false) => {
    const hasPendingChanges = pendingChanges.has(type);
    const isSaving = savingStates[type];
    const hasExistingValue = grouped[type].length > 0;

    return (
      <div className='row g-3 align-items-center'>
        <div className='col-12 col-lg-6'>
          <div className='row g-2 align-items-center'>
            <div className='col-auto'>
              <label
                htmlFor={`value-${type}`}
                style={{
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  whiteSpace: 'nowrap',
                }}
                className='form-label mb-0 small'
              >
                {isLiability ? 'Amount:' : 'Value:'}
              </label>
            </div>
            <div className='col'>
              <div style={{ position: 'relative' }}>
                <input
                  id={`value-${type}`}
                  type='number'
                  value={simpleValues[type]}
                  onChange={(e) => handleSimpleChange(e, type)}
                  placeholder={
                    isLiability ? 'Enter amount owed' : 'Enter value'
                  }
                  disabled={isSaving}
                  style={{
                    padding: '8px 12px',
                    border: `2px solid ${
                      hasPendingChanges
                        ? 'var(--warning-primary)'
                        : 'var(--border-secondary)'
                    }`,
                    borderRadius: '12px',
                    background: isSaving
                      ? 'var(--surface-disabled)'
                      : `
                        linear-gradient(135deg, var(--surface-primary) 0%, var(--gradient-surface) 100%),
                        linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
                      `,
                    backgroundBlendMode: 'overlay',
                    outline: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    boxShadow: hasPendingChanges
                      ? `
                        0 8px 24px var(--warning-20),
                        0 0 0 3px var(--warning-10),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                      `
                      : `
                        0 4px 12px rgba(0, 0, 0, 0.05),
                        0 2px 6px var(--primary-10),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                  }}
                  className='form-control'
                  onFocus={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = `
                      0 12px 32px var(--primary-30),
                      0 0 0 3px var(--primary-10),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3)
                    `;
                  }}
                  onBlur={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = hasPendingChanges
                      ? `
                        0 8px 24px var(--warning-20),
                        0 0 0 3px var(--warning-10),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                      `
                      : `
                        0 4px 12px rgba(0, 0, 0, 0.05),
                        0 2px 6px var(--primary-10),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `;
                  }}
                />
                {/* Shimmer effect for pending changes */}
                {hasPendingChanges && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent)',
                      animation: 'shimmer 2s infinite',
                      borderRadius: '12px',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='col-12 col-lg-6'>
          <div className='d-flex gap-2 flex-wrap'>
            {hasPendingChanges && (
              <button
                onClick={() => handleSimpleSave(type)}
                disabled={isSaving}
                style={{
                  padding: '8px 16px',
                  fontWeight: '700',
                  color: '#ffffff',
                  background: isSaving
                    ? 'var(--border-muted)'
                    : `
                      linear-gradient(135deg, var(--success-primary) 0%, var(--success-dark) 100%)
                    `,
                  border: `1px solid ${
                    isSaving ? 'var(--border-muted)' : 'var(--success-30)'
                  }`,
                  borderRadius: '10px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: `
                    0 8px 24px var(--success-20),
                    0 4px 12px var(--success-10),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  textTransform: 'uppercase',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className='btn btn-sm flex-fill flex-lg-grow-0'
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                    e.target.style.boxShadow = `
                      0 12px 32px var(--success-30),
                      0 6px 16px var(--success-20),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3)
                    `;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = `
                      0 8px 24px var(--success-20),
                      0 4px 12px var(--success-10),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `;
                  }
                }}
              >
                {/* Button shimmer effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: isSaving ? '-100%' : '0%',
                    width: '100%',
                    height: '100%',
                    background:
                      'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    animation: isSaving ? 'shimmer 1.5s infinite' : 'none',
                  }}
                />
                <span
                  style={{ position: 'relative', zIndex: 1 }}
                  className='small'
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </span>
              </button>
            )}

            {(hasExistingValue || simpleValues[type]) && (
              <button
                onClick={() => handleSimpleDelete(type)}
                disabled={isSaving}
                style={{
                  padding: '8px 16px',
                  fontWeight: '700',
                  color: '#ffffff',
                  background: isSaving
                    ? 'var(--border-muted)'
                    : `
                      linear-gradient(135deg, var(--error-primary) 0%, var(--error-dark) 100%)
                    `,
                  border: `1px solid ${
                    isSaving ? 'var(--border-muted)' : 'var(--error-30)'
                  }`,
                  borderRadius: '10px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  boxShadow: `
                    0 8px 24px var(--error-20),
                    0 4px 12px var(--error-10),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  textTransform: 'uppercase',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className='btn btn-sm flex-fill flex-lg-grow-0'
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                    e.target.style.boxShadow = `
                      0 12px 32px var(--error-30),
                      0 6px 16px var(--error-20),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3)
                    `;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = `
                      0 8px 24px var(--error-20),
                      0 4px 12px var(--error-10),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `;
                  }
                }}
              >
                {/* Button shimmer effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: isSaving ? '-100%' : '0%',
                    width: '100%',
                    height: '100%',
                    background:
                      'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    animation: isSaving ? 'shimmer 1.5s infinite' : 'none',
                  }}
                />
                <span
                  style={{ position: 'relative', zIndex: 1 }}
                  className='small'
                >
                  {isSaving ? 'Deleting...' : 'Delete'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- MODAL CONTENT ---
  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        zIndex: 1050,
        animation: 'fadeIn 0.4s ease-out',
      }}
      className='d-flex justify-content-center align-items-center p-3 p-md-4'
    >
      <div
        style={{
          background: `
            linear-gradient(135deg, var(--gradient-surface) 0%, var(--surface-primary) 100%),
            linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
          `,
          backgroundBlendMode: 'overlay',
          width: '100%',
          maxWidth: '1000px',
          height: '90vh',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: `
            0 32px 64px rgba(0, 0, 0, 0.25),
            0 16px 40px var(--primary-20),
            0 8px 24px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 var(--white-10)
          `,
          border: '1px solid var(--border-secondary)',
          position: 'relative',
          animation: 'modalSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 15% 15%, var(--primary-blue)10 0%, transparent 50%),
              radial-gradient(circle at 85% 85%, var(--primary-purple)10 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, var(--gradient-accent)05 0%, transparent 70%)
            `,
            opacity: 0.6,
            animation: 'backgroundFloat 12s ease-in-out infinite',
          }}
        />

        {/* Header */}
        <div
          style={{
            borderBottom: '1px solid var(--border-secondary)',
            background: `
              linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)
            `,
            boxShadow: `
              0 8px 32px var(--primary-20),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
            position: 'relative',
            zIndex: 1,
          }}
          className='d-flex justify-content-between align-items-center p-3 p-md-4'
        >
          <h2
            style={{
              margin: 0,
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              textTransform: 'uppercase',
            }}
            className='fs-5 fs-md-4'
          >
            Estate Assets and Liabilities
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              color: '#ffffff',
              lineHeight: 1,
              fontWeight: '700',
              boxShadow: `
                0 4px 16px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            className='btn'
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1) rotate(90deg)';
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = `
                0 8px 24px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.4)
              `;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1) rotate(0deg)';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = `
                0 4px 16px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `;
            }}
            aria-label='Close modal'
          >
            <span className='fs-5'>✕</span>
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'var(--gradient-surface)',
            position: 'relative',
            zIndex: 1,
          }}
          className='p-3 p-md-4'
        >
          {/* Assets Section */}
          {renderSectionHeader(
            'Estate Assets',
            'Property, investments, debts owed to the deceased, and other valuable items comprising the gross estate'
          )}

          <div className='row g-3 g-md-4 mb-5'>
            {ESTATE_ASSETS.map((type, index) => {
              const label = estateLabels[type];
              const entries = grouped[type];
              const isSimple = SIMPLE_TYPES.includes(type);

              return (
                <div key={type} className='col-12'>
                  <div
                    style={{
                      background: `
                        var(--gradient-surface)
                      `,
                      border: '1px solid var(--border-muted)',
                      borderRadius: '16px',
                      position: 'relative',
                      boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.08),
                        0 4px 16px var(--primary-10),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backdropFilter: 'blur(15px)',
                      WebkitBackdropFilter: 'blur(15px)',
                      animation: `cardSlideIn 0.6s ease-out ${
                        index * 0.1
                      }s both`,
                      overflow: 'hidden',
                    }}
                    className='p-3 p-md-4'
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-4px) scale(1.01)';
                      e.currentTarget.style.boxShadow = `
                        0 16px 48px rgba(0, 0, 0, 0.12),
                        0 8px 24px var(--primary-20),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                      `;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `
                        0 8px 32px rgba(0, 0, 0, 0.08),
                        0 4px 16px var(--primary-10),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `;
                    }}
                  >
                    {/* Card shimmer effect */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background:
                          'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
                        animation: 'cardShimmer 3s infinite',
                      }}
                    />

                    <div
                      style={{
                        fontWeight: '800',
                        color: 'var(--primary-blue)',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        position: 'relative',
                        zIndex: 1,
                      }}
                      className={`fs-6 fs-md-5 mb-${isSimple ? '3' : '4'}`}
                    >
                      {/* Icon based on type */}
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: `
                            linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)
                          `,
                          boxShadow: '0 2px 8px var(--primary-20)',
                          animation: 'iconPulse 2s ease-in-out infinite',
                          flexShrink: 0,
                        }}
                      />
                      {label}
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {isSimple ? (
                        renderSimpleEstateInput(type, false)
                      ) : (
                        <EstateGroupManager
                          typeKey={type}
                          label={label}
                          estates={entries}
                          onAdd={openForm}
                          onEdit={openForm}
                          onDelete={handleDelete}
                          currency_sign={currency_sign}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Liabilities Section */}
          {renderSectionHeader(
            'Estate Liabilities',
            'Debts, funeral expenses, and other obligations payable by the estate',
            true
          )}

          <div className='row g-3 g-md-4'>
            {ESTATE_LIABILITIES.map((type, index) => {
              const label = estateLabels[type];
              const entries = grouped[type];
              const isSimple = SIMPLE_TYPES.includes(type);

              return (
                <div key={type} className='col-12'>
                  <div
                    style={{
                      background: `
                        linear-gradient(135deg, var(--surface-primary) 0%, var(--warning-10) 100%)
                      `,
                      border: '1px solid var(--warning-30)',
                      borderRadius: '16px',
                      boxShadow: `
                        0 8px 32px var(--warning-20),
                        0 4px 16px var(--warning-10),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                      position: 'relative',
                      backdropFilter: 'blur(15px)',
                      WebkitBackdropFilter: 'blur(15px)',
                      animation: `cardSlideIn 0.6s ease-out ${
                        (ESTATE_ASSETS.length + index) * 0.1
                      }s both`,
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className='p-3 p-md-4'
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-4px) scale(1.01)';
                      e.currentTarget.style.boxShadow = `
                        0 16px 48px var(--warning-30),
                        0 8px 24px var(--warning-20),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                      `;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `
                        0 8px 32px var(--warning-20),
                        0 4px 16px var(--warning-10),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `;
                    }}
                  >
                    {/* Card shimmer effect */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background:
                          'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent)',
                        animation: 'cardShimmer 3s infinite 1s',
                      }}
                    />

                    <div
                      style={{
                        fontWeight: '800',
                        color: 'var(--warning-primary)',
                        letterSpacing: '0.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        position: 'relative',
                        zIndex: 1,
                      }}
                      className={`fs-6 fs-md-5 mb-${isSimple ? '3' : '4'}`}
                    >
                      {/* Warning icon */}
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: `
                            linear-gradient(135deg, var(--warning-primary) 0%, var(--warning-dark) 100%)
                          `,
                          boxShadow: '0 2px 8px var(--warning-20)',
                          animation: 'warningPulse 1.5s ease-in-out infinite',
                          flexShrink: 0,
                        }}
                      />
                      {label}
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      {isSimple ? (
                        renderSimpleEstateInput(type, true)
                      ) : (
                        <EstateGroupManager
                          typeKey={type}
                          label={label}
                          estates={entries}
                          onAdd={openForm}
                          onEdit={openForm}
                          onDelete={handleDelete}
                          currency_sign={currency_sign}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid var(--border-secondary)',
            background:
              'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)',
            backgroundBlendMode: 'overlay',
            boxShadow: `
              0 -8px 32px rgba(0, 0, 0, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            position: 'relative',
            zIndex: 1,
          }}
          className='d-flex justify-content-end align-items-center p-3 p-md-4'
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              fontWeight: '700',
              color: 'var(--primary-blue)',
              background: 'var(--gradient-surface)',
              border: '2px solid var(--primary-blue)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `
                0 8px 24px var(--primary-10),
                0 4px 12px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              position: 'relative',
              overflow: 'hidden',
            }}
            className='btn'
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.background = `
                linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)
              `;
              e.target.style.color = '#ffffff';
              e.target.style.boxShadow = `
                0 12px 32px var(--primary-30),
                0 6px 16px var(--primary-20),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.background = 'var(--gradient-surface)';
              e.target.style.color = 'var(--primary-blue)';
              e.target.style.boxShadow = `
                0 8px 24px var(--primary-10),
                0 4px 12px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `;
            }}
          >
            {/* Button shimmer effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)',
                animation: 'shimmer 2s infinite',
              }}
            />
            <span
              style={{ position: 'relative', zIndex: 1 }}
              className='small fw-bold'
            >
              Close
            </span>
          </button>
        </div>

        <EstateFormModal
          show={formState.show}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
          estateType={formState.estateType}
          initialData={formState.initialData}
          currency_sign={currency_sign}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
          }
          to { 
            opacity: 1; 
          }
        }

        @keyframes modalSlideIn {
          from { 
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes sectionSlideIn {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cardSlideIn {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes inputSlideIn {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-8px) rotate(2deg); 
          }
        }

        @keyframes backgroundFloat {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
          }
          50% { 
            transform: translateY(-10px) scale(1.02); 
          }
        }

        @keyframes shimmer {
          0% { 
            left: -100%; 
          }
          100% { 
            left: 100%; 
          }
        }

        @keyframes cardShimmer {
          0% { 
            left: -100%; 
          }
          50%, 100% { 
            left: 100%; 
          }
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            boxShadow: 0 2px 8px var(--primary-20);
          }
          50% {
            transform: scale(1.2);
            boxShadow: 0 4px 16px var(--primary-30);
          }
        }

        @keyframes warningPulse {
          0%, 100% {
            transform: scale(1);
            boxShadow: 0 2px 8px var(--warning-20);
          }
          50% {
            transform: scale(1.2);
            boxShadow: 0 4px 16px var(--warning-30);
          }
        }
      `}</style>
    </div>
  );

  // Portal: Advanced glassmorphic overlay
  return createPortal(modalContent, document.body);
};

export default EstateManagerModal;
