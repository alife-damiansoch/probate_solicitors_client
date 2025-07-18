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
  if (!show) return null;

  const token = Cookies.get('auth_token')?.access;

  const grouped = ESTATE_DISPLAY_ORDER.reduce((acc, key) => {
    acc[key] = estates?.filter((e) => e.category === key) || [];
    return acc;
  }, {});

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

  const renderSectionHeader = (title, description, isLiability = false) => (
    <div
      style={{
        padding: '12px 18px',
        marginBottom: '18px',
        background: isLiability
          ? 'var(--warning-10, #fff7e6)'
          : 'var(--primary-10, #e0e7ff)',
        border: `1.5px solid ${
          isLiability
            ? 'var(--warning-primary, #f59e0b)'
            : 'var(--primary-blue, #3b82f6)'
        }`,
        borderRadius: '9px',
        borderLeft: `4px solid ${
          isLiability
            ? 'var(--warning-primary, #f59e0b)'
            : 'var(--primary-blue, #3b82f6)'
        }`,
        boxShadow: '0 1.5px 8px var(--primary-10, rgba(59,130,246,0.09))',
        backdropFilter: 'blur(6px)',
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: '15.7px',
          fontWeight: '700',
          color: isLiability
            ? 'var(--warning-primary, #92400e)'
            : 'var(--primary-blue, #1e40af)',
          marginBottom: description ? '4px' : 0,
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: '12.5px',
            color: 'var(--text-secondary, #6b7280)',
            lineHeight: '1.47',
            fontWeight: 500,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );

  const renderSimpleEstateInput = (type, isLiability = false) => {
    const hasPendingChanges = pendingChanges.has(type);
    const isSaving = savingStates[type];
    const hasExistingValue = grouped[type].length > 0;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}
        >
          <label
            htmlFor={`value-${type}`}
            style={{
              fontSize: '13.5px',
              fontWeight: '600',
              color: 'var(--text-primary, #374151)',
              marginRight: '9px',
              minWidth: '53px',
            }}
          >
            {isLiability ? 'Amount:' : 'Value:'}
          </label>
          <input
            id={`value-${type}`}
            type='number'
            value={simpleValues[type]}
            onChange={(e) => handleSimpleChange(e, type)}
            placeholder={isLiability ? 'Enter amount owed' : 'Enter value'}
            disabled={isSaving}
            style={{
              width: '140px',
              padding: '6.5px 12px',
              fontSize: '13.4px',
              border: `1.5px solid ${
                hasPendingChanges
                  ? 'var(--warning-primary, #f59e0b)'
                  : 'var(--border-primary, #cbd5e1)'
              }`,
              borderRadius: '7px',
              background: isSaving
                ? 'var(--surface-disabled, #f3f4f6)'
                : 'var(--surface-primary, #ffffff)',
              outline: 'none',
              transition: 'border-color 0.13s',
              fontWeight: 500,
              color: 'var(--text-primary, #22223b)',
              boxShadow: hasPendingChanges
                ? '0 0 0 1.5px var(--warning-primary, #f59e0b)'
                : undefined,
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {hasPendingChanges && (
            <button
              onClick={() => handleSimpleSave(type)}
              disabled={isSaving}
              style={{
                padding: '5px 14px',
                fontSize: '12.6px',
                fontWeight: '700',
                color: 'var(--white, #fff)',
                background: isSaving
                  ? 'var(--border-primary, #9ca3af)'
                  : 'var(--success-primary, #10b981)',
                border: 'none',
                borderRadius: '5px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 6px 0 var(--success-10, #d1fae5)',
                transition: 'background 0.15s',
                letterSpacing: '.01em',
              }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
          {(hasExistingValue || simpleValues[type]) && (
            <button
              onClick={() => handleSimpleDelete(type)}
              disabled={isSaving}
              style={{
                padding: '5px 14px',
                fontSize: '12.6px',
                fontWeight: '700',
                color: 'var(--white, #fff)',
                background: isSaving
                  ? 'var(--border-primary, #9ca3af)'
                  : 'var(--error-primary, #dc2626)',
                border: 'none',
                borderRadius: '5px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 6px 0 var(--error-10, #fee2e2)',
                transition: 'background 0.15s',
                letterSpacing: '.01em',
              }}
            >
              {isSaving ? 'Deleting...' : 'Delete'}
            </button>
          )}
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
        background: 'rgba(40, 46, 85, 0.60)',
        backdropFilter: 'blur(4.5px) saturate(112%)',
        zIndex: 1050,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '26px',
        animation: 'modalFadeIn 0.4s',
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      <div
        style={{
          background: `
            linear-gradient(135deg, var(--surface-primary, #fff) 94%, var(--primary-10, #e0e7ff) 100%),
            radial-gradient(circle at 15% 15%, var(--primary-blue, #667eea)10 0%, transparent 54%),
            radial-gradient(circle at 92% 85%, var(--primary-purple, #a78bfa)10 0%, transparent 55%)
          `,
          width: '100%',
          maxWidth: '950px',
          height: '90vh',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: `
            0 24px 48px -8px var(--primary-20, rgba(59,130,246,0.11)),
            0 2px 12px 0 var(--primary-10, rgba(59,130,246,0.08))
          `,
          border: '1.5px solid var(--border-primary, #e5e7eb)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '19px 26px',
            borderBottom: '1.5px solid var(--border-primary, #e5e7eb)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--surface-header, #f9fafb)',
            boxShadow: '0 3px 18px var(--primary-10, rgba(59,130,246,0.04))',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '800',
              color: 'var(--primary-blue, #1e40af)',
              letterSpacing: '0.01em',
            }}
          >
            Estate Assets and Liabilities
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '7px',
              background: 'rgba(59,130,246,0.07)',
              border: 'none',
              borderRadius: '7px',
              cursor: 'pointer',
              color: 'var(--primary-blue, #64748b)',
              fontSize: '22px',
              lineHeight: 1,
              fontWeight: 700,
              boxShadow: '0 1px 6px rgba(59,130,246,0.07)',
              transition: 'background .18s',
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(59,130,246,0.18)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(59,130,246,0.07)';
            }}
            aria-label='Close modal'
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div
          style={{
            flex: 1,
            padding: '24px 24px 20px 24px',
            overflowY: 'auto',
            background: 'var(--surface-main, #f9fafb)',
            boxShadow:
              'inset 0 2px 14px var(--primary-10, rgba(59,130,246,0.06))',
          }}
        >
          {/* Assets Section */}
          {renderSectionHeader(
            'ESTATE ASSETS',
            'Property, investments, debts owed to the deceased, and other valuable items comprising the gross estate'
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginBottom: '34px',
            }}
          >
            {ESTATE_ASSETS.map((type) => {
              const label = estateLabels[type];
              const entries = grouped[type];
              const isSimple = SIMPLE_TYPES.includes(type);

              return (
                <div
                  key={type}
                  style={{
                    background: 'var(--surface-card, #fff)',
                    border: '1.5px solid var(--primary-20, #e5e7eb)',
                    borderRadius: '9px',
                    padding: '15px 20px',
                    marginBottom: '2px',
                    position: 'relative',
                    boxShadow:
                      '0 2.5px 9px var(--primary-10, rgba(59,130,246,0.06))',
                    transition: 'border-color 0.13s',
                  }}
                >
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: 'var(--primary-blue, #3b82f6)',
                      marginBottom: isSimple ? '7px' : '13px',
                      letterSpacing: '.01em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                    }}
                  >
                    {label}
                  </div>
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
              );
            })}
          </div>
          {/* Liabilities Section */}
          {renderSectionHeader(
            'ESTATE LIABILITIES',
            'Debts, funeral expenses, and other obligations payable by the estate',
            true
          )}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}
          >
            {ESTATE_LIABILITIES.map((type) => {
              const label = estateLabels[type];
              const entries = grouped[type];
              const isSimple = SIMPLE_TYPES.includes(type);

              return (
                <div
                  key={type}
                  style={{
                    background: 'var(--surface-card, #fff)',
                    border: '1.5px solid var(--warning-primary, #f59e0b)',
                    borderRadius: '9px',
                    padding: '15px 20px',
                    boxShadow:
                      '0 2.5px 9px var(--warning-10, rgba(245,158,11,0.06))',
                    marginBottom: '2px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: 'var(--warning-primary, #d97706)',
                      marginBottom: isSimple ? '7px' : '13px',
                      letterSpacing: '.01em',
                    }}
                  >
                    {label}
                  </div>
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
              );
            })}
          </div>
        </div>
        {/* Footer */}
        <div
          style={{
            padding: '17px 26px',
            borderTop: '1.5px solid var(--border-primary, #e5e7eb)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            background: 'var(--surface-header, #f9fafb)',
            boxShadow: '0 -2px 8px var(--primary-10, rgba(59,130,246,0.07))',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '9px 19px',
              fontSize: '15.1px',
              fontWeight: '800',
              color: 'var(--primary-blue, #2563eb)',
              background: 'var(--surface-card, #fff)',
              border: '1.5px solid var(--primary-blue, #c7d2fe)',
              borderRadius: '7px',
              cursor: 'pointer',
              transition: 'background .15s',
              boxShadow: '0 1px 7px 0 var(--primary-10, rgba(59,130,246,0.05))',
              letterSpacing: '.01em',
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--primary-10, #e0e7ff)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'var(--surface-card, #fff)';
            }}
          >
            Close
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
    </div>
  );

  // Portal: Glassmorphic overlay
  return createPortal(modalContent, document.body);
};

export default EstateManagerModal;
