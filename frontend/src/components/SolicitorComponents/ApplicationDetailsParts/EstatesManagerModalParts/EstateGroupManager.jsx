import { formatMoney } from '../../../GenericFunctions/HelperGenericFunctions';
import { estateFieldMap } from './estateFieldConfig';

const EstateGroupManager = ({
  label,
  typeKey,
  estates,
  onAdd,
  onEdit,
  onDelete,
  currency_sign = '€',
}) => {
  const formatFieldName = (fieldName) => {
    return fieldName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFieldsForCategory = (category) => {
    return estateFieldMap[category] || [];
  };

  const renderEstateDetails = (estate) => {
    const fields = getFieldsForCategory(typeKey);

    if (fields.length === 0) {
      const keyFields = [
        'description',
        'address',
        'institution',
        'insurer',
        'debtor',
        'creditor',
      ];
      const displayField = keyFields.find((field) => estate[field]);
      return estate[displayField] || estate.label || `Entry`;
    }

    const primaryField = fields.find(
      (field) =>
        field.name !== 'value' &&
        estate[field.name] &&
        estate[field.name].toString().trim() !== ''
    );

    if (primaryField) {
      return estate[primaryField.name];
    }

    return `${label} Entry`;
  };

  const renderAllEstateFields = (estate) => {
    const fields = getFieldsForCategory(typeKey);

    if (fields.length === 0) {
      const relevantFields = Object.entries(estate).filter(
        ([key, val]) =>
          val !== null &&
          val !== undefined &&
          val !== '' &&
          !['id', 'category', 'group_label', 'is_asset'].includes(key)
      );

      if (relevantFields.length === 0) return null;

      return (
        <div
          style={{
            marginTop: '8px',
            padding: '8px',
            background: 'var(--surface-main, #f9fafb)',
            borderRadius: '7px',
            fontSize: '13px',
            lineHeight: '1.4',
          }}
        >
          {relevantFields.map(([key, val]) => (
            <div key={key} style={{ display: 'flex', marginBottom: '2px' }}>
              <span
                style={{
                  fontWeight: '600',
                  color: 'var(--primary-blue, #374151)',
                  minWidth: '85px',
                  letterSpacing: '.01em',
                }}
              >
                {formatFieldName(key)}:
              </span>
              <span
                style={{
                  color: 'var(--text-secondary, #6b7280)',
                  marginLeft: '8px',
                }}
              >
                {key === 'value' ? formatMoney(val, currency_sign) : val}
              </span>
            </div>
          ))}
        </div>
      );
    }

    const fieldsToShow = fields.filter((field) => {
      const value = estate[field.name];
      return value !== null && value !== undefined && value !== '';
    });

    if (fieldsToShow.length === 0) return null;

    return (
      <div
        style={{
          marginTop: '8px',
          padding: '8px',
          background: 'var(--surface-main, #f9fafb)',
          borderRadius: '7px',
          fontSize: '13px',
          lineHeight: '1.4',
        }}
      >
        {fieldsToShow.map((field) => {
          const value = estate[field.name];
          return (
            <div
              key={field.name}
              style={{ display: 'flex', marginBottom: '2px' }}
            >
              <span
                style={{
                  fontWeight: '600',
                  color: 'var(--primary-blue, #374151)',
                  minWidth: '85px',
                  letterSpacing: '.01em',
                }}
              >
                {field.label}:
              </span>
              <span
                style={{
                  color: 'var(--text-secondary, #6b7280)',
                  marginLeft: '8px',
                }}
              >
                {field.name === 'value' || field.type === 'number'
                  ? formatMoney(value, currency_sign)
                  : value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '26px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '13px',
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: '17px',
            fontWeight: '700',
            color: 'var(--primary-blue, #1e293b)',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </h4>
        <button
          onClick={() => onAdd(typeKey)}
          style={{
            fontSize: '12.3px',
            fontWeight: '700',
            color: 'var(--primary-green, #10b981)',
            background: 'transparent',
            border: '1.3px solid var(--primary-green, #10b981)',
            padding: '5px 13px',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.16s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 1px 8px 0 var(--primary-green, #10b981)10',
            letterSpacing: '.01em',
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'var(--primary-green, #10b981)';
            e.target.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--primary-green, #10b981)';
          }}
        >
          + Add {label}
        </button>
      </div>

      {estates.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {estates.map((estate, idx) => (
            <div
              key={estate.id || idx}
              style={{
                padding: '14px',
                border: '1.5px solid var(--border-primary, #e5e7eb)',
                borderRadius: '8px',
                background:
                  'linear-gradient(110deg, var(--surface-card, #fff) 90%, var(--primary-10, #f1f5f9) 100%)',
                transition: 'border-color 0.17s',
                boxShadow:
                  '0 1.5px 6px var(--primary-blue, #667eea)08, 0 1px 2px var(--primary-10, #e0e7ff)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '13px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '14.2px',
                      fontWeight: '700',
                      color: 'var(--primary-blue, #0f172a)',
                      marginBottom: '4px',
                      wordBreak: 'break-word',
                    }}
                  >
                    {renderEstateDetails(estate)}
                  </div>
                  {estate.value && (
                    <div
                      style={{
                        fontSize: '13.3px',
                        color: 'var(--primary-green, #059669)',
                        fontWeight: '700',
                        marginBottom: '4px',
                      }}
                    >
                      {formatMoney(estate.value, currency_sign)}
                    </div>
                  )}
                  {renderAllEstateFields(estate)}
                </div>

                <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                  <button
                    onClick={() => onEdit(typeKey, estate)}
                    style={{
                      fontSize: '11.6px',
                      fontWeight: '700',
                      color: 'var(--primary-orange, #d97706)',
                      background: 'var(--orange-10, #fef3c7)',
                      border: '1.3px solid var(--primary-orange, #fbbf24)',
                      padding: '4.5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.16s',
                      boxShadow: '0 1px 6px 0 var(--primary-orange, #fbbf24)08',
                      letterSpacing: '.01em',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background =
                        'var(--primary-orange, #fbbf24)';
                      e.target.style.color = '#92400e';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'var(--orange-10, #fef3c7)';
                      e.target.style.color = 'var(--primary-orange, #d97706)';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(typeKey, estate)}
                    style={{
                      fontSize: '11.6px',
                      fontWeight: '700',
                      color: 'var(--error-primary, #dc2626)',
                      background: 'var(--error-10, #fee2e2)',
                      border: '1.3px solid var(--error-primary, #f87171)',
                      padding: '4.5px 10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'all 0.16s',
                      boxShadow: '0 1px 6px 0 var(--error-primary, #f87171)08',
                      letterSpacing: '.01em',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background =
                        'var(--error-primary, #f87171)';
                      e.target.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'var(--error-10, #fee2e2)';
                      e.target.style.color = 'var(--error-primary, #dc2626)';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: '17px',
            background: 'var(--surface-main, #f9fafb)',
            border: '2px dashed var(--border-primary, #d1d5db)',
            borderRadius: '7px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '13.3px',
              color: 'var(--text-secondary, #6b7280)',
              marginBottom: '8px',
              fontWeight: 500,
              letterSpacing: '.01em',
            }}
          >
            No {label.toLowerCase()} entries yet
          </div>
          <button
            onClick={() => onAdd(typeKey)}
            style={{
              fontSize: '12.3px',
              fontWeight: '700',
              color: 'var(--primary-green, #10b981)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Add the first {label.toLowerCase()} entry
          </button>
        </div>
      )}
    </div>
  );
};

export default EstateGroupManager;
