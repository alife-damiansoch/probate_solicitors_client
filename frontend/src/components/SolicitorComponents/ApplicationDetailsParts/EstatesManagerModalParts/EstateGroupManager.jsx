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
            marginTop: '12px',
            padding: '12px 16px',
            background: 'var(--gradient-surface)',
            borderRadius: '10px',
            lineHeight: '1.5',
            border: '1px solid var(--border-subtle)',
            boxShadow: `
              0 2px 8px rgba(0, 0, 0, 0.04),
              0 1px 4px var(--primary-10),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'detailsSlideIn 0.3s ease-out',
          }}
          className='mt-3'
        >
          {/* Background shimmer */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)',
              animation: 'shimmer 3s infinite',
            }}
          />

          <div className='row g-2'>
            {relevantFields.map(([key, val], index) => (
              <div key={key} className='col-12 col-md-6'>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    position: 'relative',
                    zIndex: 1,
                  }}
                  className='d-flex align-items-start'
                >
                  <span
                    style={{
                      fontWeight: '700',
                      color: 'var(--primary-blue)',
                      letterSpacing: '0.25px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    className='flex-shrink-0 small'
                  >
                    {/* Field indicator dot */}
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background:
                          key === 'value'
                            ? 'var(--success-primary)'
                            : 'var(--primary-blue)',
                        boxShadow: `0 2px 8px ${
                          key === 'value'
                            ? 'var(--success-20)'
                            : 'var(--primary-20)'
                        }`,
                        flexShrink: 0,
                      }}
                    />
                    {formatFieldName(key)}:
                  </span>
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '500',
                      wordBreak: 'break-word',
                      flex: 1,
                    }}
                    className='ms-2 small flex-grow-1'
                  >
                    {key === 'value' ? formatMoney(val, currency_sign) : val}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
          marginTop: '12px',
          padding: '12px 16px',
          background: 'var(--gradient-surface)',
          borderRadius: '10px',
          lineHeight: '1.5',
          border: '1px solid var(--border-subtle)',
          boxShadow: `
            0 2px 8px rgba(0, 0, 0, 0.04),
            0 1px 4px var(--primary-10),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'detailsSlideIn 0.3s ease-out',
        }}
        className='mt-3'
      >
        {/* Background shimmer */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)',
            animation: 'shimmer 3s infinite',
          }}
        />

        <div className='row g-2'>
          {fieldsToShow.map((field, index) => {
            const value = estate[field.name];
            return (
              <div key={field.name} className='col-12 col-md-6'>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    position: 'relative',
                    zIndex: 1,
                  }}
                  className='d-flex align-items-start'
                >
                  <span
                    style={{
                      fontWeight: '700',
                      color: 'var(--primary-blue)',
                      letterSpacing: '0.25px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    className='flex-shrink-0 small'
                  >
                    {/* Field indicator dot */}
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background:
                          field.name === 'value'
                            ? 'var(--success-primary)'
                            : 'var(--primary-blue)',
                        boxShadow: `0 2px 8px ${
                          field.name === 'value'
                            ? 'var(--success-20)'
                            : 'var(--primary-20)'
                        }`,
                        flexShrink: 0,
                      }}
                    />
                    {field.label}:
                  </span>
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '500',
                      wordBreak: 'break-word',
                      flex: 1,
                    }}
                    className='ms-2 small flex-grow-1'
                  >
                    {field.name === 'value' || field.type === 'number'
                      ? formatMoney(value, currency_sign)
                      : value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className='mb-4 mb-md-5'>
      <div className='d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-3 mb-md-4 px-2'>
        <h4
          style={{
            margin: 0,
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '0.25px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          className='fs-5 fs-md-4'
        >
          {/* Section indicator */}
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, var(--success-primary) 0%, var(--success-dark) 100%)`,
              boxShadow: '0 2px 8px var(--success-20)',
              animation: 'iconPulse 2s ease-in-out infinite',
              flexShrink: 0,
            }}
          />
          {label}
        </h4>

        <button
          onClick={() => onAdd(typeKey)}
          style={{
            fontWeight: '700',
            color: '#ffffff',
            background: `
              linear-gradient(135deg, var(--success-primary) 0%, var(--success-dark) 100%)
            `,
            border: '2px solid var(--success-30)',
            padding: '6px 12px',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `
              0 4px 16px var(--success-20),
              0 2px 8px var(--success-10),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
          className='btn btn-sm flex-shrink-0'
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = `
              0 8px 24px var(--success-30),
              0 4px 12px var(--success-20),
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = `
              0 4px 16px var(--success-20),
              0 2px 8px var(--success-10),
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
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              animation: 'shimmer 2s infinite',
            }}
          />
          <span style={{ position: 'relative', zIndex: 1 }} className='small'>
            + Add {label}
          </span>
        </button>
      </div>

      {estates.length > 0 ? (
        <div className='row g-3 g-md-4'>
          {estates.map((estate, idx) => (
            <div key={estate.id || idx} className='col-12'>
              <div
                style={{
                  background: 'var(--gradient-surface)',
                  border: '2px solid var(--border-muted)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(15px)',
                  WebkitBackdropFilter: 'blur(15px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.08),
                    0 4px 16px var(--primary-10),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `estateCardSlideIn 0.5s ease-out ${
                    idx * 0.1
                  }s both`,
                }}
                className='p-3 p-md-4'
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(-2px) scale(1.01)';
                  e.currentTarget.style.borderColor = 'var(--primary-30)';
                  e.currentTarget.style.boxShadow = `
                    0 16px 48px rgba(0, 0, 0, 0.12),
                    0 8px 24px var(--primary-20),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = 'var(--border-muted)';
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
                    animation: 'cardShimmer 4s infinite',
                  }}
                />

                <div className='row g-3 align-items-start'>
                  <div className='col-12 col-lg-8'>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div
                        style={{
                          fontWeight: '800',
                          color: 'var(--text-primary)',
                          wordBreak: 'break-word',
                          letterSpacing: '0.25px',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        className='fs-6 fs-md-5 mb-2'
                      >
                        {/* Estate type indicator */}
                        <div
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)`,
                            boxShadow: '0 2px 8px var(--primary-20)',
                            animation: 'iconPulse 2s ease-in-out infinite',
                            flexShrink: 0,
                          }}
                        />
                        {renderEstateDetails(estate)}
                      </div>

                      {estate.value && (
                        <div
                          style={{
                            color: 'var(--success-primary)',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          }}
                          className='fs-6 mb-2'
                        >
                          {/* Currency indicator */}
                          <div
                            style={{
                              padding: '2px 6px',
                              background: 'var(--success-10)',
                              borderRadius: '4px',
                              color: 'var(--success-dark)',
                              border: '1px solid var(--success-20)',
                            }}
                            className='small fw-bold'
                          >
                            {currency_sign}
                          </div>
                          <span className='small fw-bold'>
                            {formatMoney(estate.value, '')}
                          </span>
                        </div>
                      )}

                      {renderAllEstateFields(estate)}
                    </div>
                  </div>

                  <div className='col-12 col-lg-4'>
                    <div className='d-flex flex-row flex-lg-column gap-2 justify-content-end'>
                      <button
                        onClick={() => onEdit(typeKey, estate)}
                        style={{
                          fontWeight: '700',
                          color: '#ffffff',
                          background: `
                            linear-gradient(135deg, var(--error-primary) 0%, var(--error-dark) 100%)
                          `,
                          border: '2px solid var(--error-30)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          boxShadow: `
                            0 4px 12px var(--error-20),
                            0 2px 6px var(--error-10),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                          `,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                        className='btn btn-sm flex-fill flex-lg-grow-0'
                        onMouseEnter={(e) => {
                          e.target.style.transform =
                            'translateY(-1px) scale(1.05)';
                          e.target.style.boxShadow = `
                            0 8px 20px var(--error-30),
                            0 4px 10px var(--error-20),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3)
                          `;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0) scale(1)';
                          e.target.style.boxShadow = `
                            0 4px 12px var(--error-20),
                            0 2px 6px var(--error-10),
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                          `;
                        }}
                      >
                        {/* Delete icon shimmer */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background:
                              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                            animation: 'shimmer 3s infinite',
                          }}
                        />
                        <span
                          style={{ position: 'relative', zIndex: 1 }}
                          className='small'
                        >
                          Delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: 'var(--gradient-surface)',
            border: '2px dashed var(--border-muted)',
            borderRadius: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: `
              0 4px 16px rgba(0, 0, 0, 0.04),
              0 2px 8px var(--primary-10),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            position: 'relative',
            overflow: 'hidden',
            animation: 'emptyStateSlideIn 0.4s ease-out',
          }}
          className='p-4 p-md-5'
        >
          {/* Empty state shimmer */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.05), transparent)',
              animation: 'shimmer 4s infinite',
            }}
          />

          {/* Empty state icon */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: `
                linear-gradient(135deg, var(--primary-10) 0%, var(--primary-20) 100%)
              `,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--primary-20)',
              animation: 'emptyIconFloat 3s ease-in-out infinite',
              position: 'relative',
              zIndex: 1,
            }}
            className='mx-auto mb-3'
          >
            <div
              style={{
                color: 'var(--primary-blue)',
                animation: 'iconPulse 2s ease-in-out infinite',
              }}
              className='fs-4'
            >
              📋
            </div>
          </div>

          <div
            style={{
              color: 'var(--text-secondary)',
              fontWeight: '600',
              letterSpacing: '0.25px',
              position: 'relative',
              zIndex: 1,
            }}
            className='fs-6 mb-3'
          >
            No {label.toLowerCase()} entries yet
          </div>

          <button
            onClick={() => onAdd(typeKey)}
            style={{
              fontWeight: '700',
              color: 'var(--primary-blue)',
              background: 'transparent',
              border: '2px dashed var(--primary-30)',
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.25px',
              textTransform: 'uppercase',
              position: 'relative',
              zIndex: 1,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
            className='btn btn-sm'
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--primary-10)';
              e.target.style.borderColor = 'var(--primary-blue)';
              e.target.style.borderStyle = 'solid';
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 8px 24px var(--primary-20)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'var(--primary-30)';
              e.target.style.borderStyle = 'dashed';
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span className='small'>
              + Add the first {label.toLowerCase()} entry
            </span>
          </button>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes estateCardSlideIn {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes detailsSlideIn {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes emptyStateSlideIn {
          from { 
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes emptyIconFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-8px) rotate(2deg); 
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
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default EstateGroupManager;
