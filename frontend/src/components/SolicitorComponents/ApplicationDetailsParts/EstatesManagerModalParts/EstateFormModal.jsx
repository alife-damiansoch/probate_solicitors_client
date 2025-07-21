import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { estateFieldMap } from './estateFieldConfig';

const EstateFormModal = ({
  show,
  onClose,
  onSubmit,
  estateType,
  initialData,
  currency_sign = '€',
}) => {
  const [formData, setFormData] = useState({});
  const [selectStates, setSelectStates] = useState({});
  const [dropdownPositions, setDropdownPositions] = useState({});
  const selectRefs = useRef({});

  useEffect(() => {
    if (!estateType) return;

    if (initialData) {
      setFormData(initialData);
    } else {
      const emptyFields =
        estateFieldMap[estateType]?.reduce((acc, f) => {
          acc[f.name] = '';
          return acc;
        }, {}) || {};
      setFormData(emptyFields);
    }
  }, [initialData, estateType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (fieldName, optionValue, isChecked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldName]
        ? prev[fieldName].split(', ').filter((v) => v)
        : [];
      let newValues;

      if (isChecked) {
        newValues = [...currentValues, optionValue];
      } else {
        newValues = currentValues.filter((v) => v !== optionValue);
      }

      return {
        ...prev,
        [fieldName]: newValues.join(', '),
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(estateType, formData);
  };

  const shouldShowField = (field) => {
    if (!field.showWhen) return true;
    return formData[field.showWhen.field] === field.showWhen.value;
  };

  const renderFormField = (field) => {
    const baseInputStyles = {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid var(--border-muted)',
      borderRadius: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      fontWeight: '500',
      backgroundColor: 'var(--surface-primary)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: 'var(--text-primary)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      boxShadow: `
        0 4px 12px rgba(0, 0, 0, 0.05),
        0 2px 6px var(--primary-10),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `,
    };

    const focusStyles = {
      borderColor: 'var(--primary-blue)',
      boxShadow: `
        0 8px 24px var(--primary-20),
        0 0 0 3px var(--primary-10),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      transform: 'translateY(-1px) scale(1.01)',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={true}
            style={{
              ...baseInputStyles,
              minHeight: '96px',
              resize: 'vertical',
              lineHeight: '1.5',
            }}
            className='form-control'
            onFocus={(e) => {
              Object.assign(e.target.style, focusStyles);
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-muted)';
              e.target.style.boxShadow = baseInputStyles.boxShadow;
              e.target.style.transform = 'translateY(0) scale(1)';
            }}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        );

      case 'multiselect':
        const selectedValues = formData[field.name]
          ? formData[field.name].split(', ').filter((v) => v)
          : [];

        const groupedOptions = field.options?.reduce((groups, option) => {
          const category = option.category || 'Other';
          if (!groups[category]) groups[category] = [];
          groups[category].push(option);
          return groups;
        }, {});

        return (
          <div
            style={{
              padding: '16px',
              border: '2px solid var(--border-muted)',
              borderRadius: '12px',
              backgroundColor: 'var(--surface-primary)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              maxHeight: '240px',
              overflowY: 'auto',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.08),
                0 4px 16px var(--primary-10),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            {Object.entries(groupedOptions || {}).map(([category, options]) => (
              <div key={category} className='mb-3'>
                <div
                  style={{
                    fontWeight: '700',
                    color: 'var(--primary-blue)',
                    marginBottom: '8px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid var(--border-subtle)',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                  className='small'
                >
                  {category}
                </div>
                <div className='row g-2'>
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className='col-12 col-sm-6 col-lg-4'
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          color: 'var(--text-secondary)',
                          backgroundColor: selectedValues.includes(option.value)
                            ? 'var(--primary-10)'
                            : 'transparent',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          border: `1px solid ${
                            selectedValues.includes(option.value)
                              ? 'var(--primary-20)'
                              : 'transparent'
                          }`,
                        }}
                        className='small'
                      >
                        <input
                          type='checkbox'
                          checked={selectedValues.includes(option.value)}
                          onChange={(e) =>
                            handleMultiSelectChange(
                              field.name,
                              option.value,
                              e.target.checked
                            )
                          }
                          style={{
                            marginRight: '8px',
                            accentColor: 'var(--primary-blue)',
                            transform: 'scale(1.2)',
                          }}
                          className='form-check-input'
                        />
                        <span className='flex-grow-1'>{option.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {selectedValues.length > 0 && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--primary-10)',
                  borderRadius: '10px',
                  color: 'var(--primary-blue)',
                  lineHeight: '1.4',
                  border: '1px solid var(--primary-20)',
                  boxShadow: '0 4px 12px var(--primary-10)',
                }}
                className='small'
              >
                <strong>SELECTED ({selectedValues.length}):</strong>{' '}
                {selectedValues.join(', ')}
              </div>
            )}
          </div>
        );

      case 'select':
        const isSelectOpen = selectStates[field.name] || false;
        const selectedOption = field.options?.find(
          (opt) => opt.value === formData[field.name]
        );

        const handleSelectClick = () => {
          const newState = !isSelectOpen;
          setSelectStates((prev) => ({
            ...prev,
            [field.name]: newState,
          }));

          if (newState && selectRefs.current[field.name]) {
            const rect = selectRefs.current[field.name].getBoundingClientRect();
            setDropdownPositions((prev) => ({
              ...prev,
              [field.name]: {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
              },
            }));
          }
        };

        return (
          <>
            <div style={{ position: 'relative' }}>
              <div
                ref={(el) => (selectRefs.current[field.name] = el)}
                onClick={handleSelectClick}
                style={{
                  ...baseInputStyles,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  userSelect: 'none',
                  border: isSelectOpen
                    ? '2px solid var(--primary-blue)'
                    : '2px solid var(--border-muted)',
                  boxShadow: isSelectOpen
                    ? `
                      0 8px 24px var(--primary-20),
                      0 0 0 3px var(--primary-10),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `
                    : baseInputStyles.boxShadow,
                }}
                className='form-select'
              >
                <span
                  style={{
                    color: selectedOption
                      ? 'var(--text-primary)'
                      : 'var(--text-muted)',
                    fontStyle: selectedOption ? 'normal' : 'italic',
                  }}
                >
                  {selectedOption
                    ? selectedOption.label
                    : `Select ${field.label.toLowerCase()}...`}
                </span>
                <div
                  style={{
                    width: '0',
                    height: '0',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid ${
                      isSelectOpen ? 'var(--primary-blue)' : 'var(--text-muted)'
                    }`,
                    transform: isSelectOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>
            </div>

            {/* Portal the dropdown to body to escape any overflow constraints */}
            {isSelectOpen &&
              dropdownPositions[field.name] &&
              createPortal(
                <>
                  {/* Invisible backdrop to close dropdown when clicking outside */}
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999999,
                      background: 'transparent',
                    }}
                    onClick={() =>
                      setSelectStates((prev) => ({
                        ...prev,
                        [field.name]: false,
                      }))
                    }
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: `${dropdownPositions[field.name].top}px`,
                      left: `${dropdownPositions[field.name].left}px`,
                      width: `${dropdownPositions[field.name].width}px`,
                      backgroundColor: 'var(--surface-primary)',
                      border: '2px solid var(--primary-30)',
                      borderRadius: '12px',
                      boxShadow: `
                        0 20px 60px rgba(0, 0, 0, 0.3),
                        0 16px 48px rgba(0, 0, 0, 0.25),
                        0 8px 32px rgba(0, 0, 0, 0.15),
                        0 4px 16px var(--primary-20),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      `,
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      zIndex: 1000000,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      animation: 'dropdownSlideIn 0.2s ease-out',
                    }}
                  >
                    {field.options?.map((option, index) => (
                      <div
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChange({
                            target: { name: field.name, value: option.value },
                          });
                          setSelectStates((prev) => ({
                            ...prev,
                            [field.name]: false,
                          }));
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          color: 'var(--text-primary)',
                          fontWeight: '500',
                          borderBottom:
                            index === field.options.length - 1
                              ? 'none'
                              : '1px solid var(--border-subtle)',
                          transition: 'all 0.2s ease',
                          backgroundColor:
                            formData[field.name] === option.value
                              ? 'var(--primary-10)'
                              : 'transparent',
                          borderRadius:
                            index === 0
                              ? '10px 10px 0 0'
                              : index === field.options.length - 1
                              ? '0 0 10px 10px'
                              : '0',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--primary-10)';
                          e.target.style.color = 'var(--primary-blue)';
                          e.target.style.transform = 'translateX(2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor =
                            formData[field.name] === option.value
                              ? 'var(--primary-10)'
                              : 'transparent';
                          e.target.style.color = 'var(--text-primary)';
                          e.target.style.transform = 'translateX(0px)';
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </>,
                document.body
              )}
          </>
        );

      case 'number':
        return (
          <div style={{ position: 'relative' }}>
            <input
              type='number'
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={true}
              step='0.01'
              min='0'
              style={{
                ...baseInputStyles,
                paddingLeft: field.name === 'value' ? '40px' : '16px',
              }}
              className='form-control'
              onFocus={(e) => {
                Object.assign(e.target.style, focusStyles);
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-muted)';
                e.target.style.boxShadow = baseInputStyles.boxShadow;
                e.target.style.transform = 'translateY(0) scale(1)';
              }}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
            />
            {field.name === 'value' && (
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--primary-blue)',
                  fontSize: '16px',
                  fontWeight: '700',
                  pointerEvents: 'none',
                }}
              >
                {currency_sign}
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type='text'
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={true}
            style={baseInputStyles}
            className='form-control'
            onFocus={(e) => {
              Object.assign(e.target.style, focusStyles);
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-muted)';
              e.target.style.boxShadow = baseInputStyles.boxShadow;
              e.target.style.transform = 'translateY(0) scale(1)';
            }}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        );
    }
  };

  if (!show || !estateType) return null;

  const estateTypeLabel = estateType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return createPortal(
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
        zIndex: 1200,
        animation: 'fadeIn 0.4s ease-out',
      }}
      className='d-flex justify-content-center align-items-center p-3 p-md-4'
    >
      <div
        style={{
          background: 'var(--gradient-surface)',
          backgroundBlendMode: 'overlay',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          borderRadius: '20px',
          boxShadow: `
            0 32px 64px rgba(0, 0, 0, 0.25),
            0 16px 40px var(--primary-20),
            0 8px 24px rgba(0, 0, 0, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          border: '1px solid var(--border-muted)',
          animation: 'modalSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
        }}
        className='container-fluid p-0'
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
              radial-gradient(circle at 15% 15%, var(--primary-10) 0%, transparent 50%),
              radial-gradient(circle at 85% 85%, var(--primary-05) 0%, transparent 50%)
            `,
            opacity: 0.6,
            animation: 'backgroundFloat 8s ease-in-out infinite',
          }}
        />

        {/* Header */}
        <div
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            background: `linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)`,
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: `
              0 8px 32px var(--primary-20),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
            position: 'relative',
            zIndex: 1,
          }}
          className='d-flex justify-content-between align-items-center p-3 p-md-4'
        >
          <h3
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
            {initialData ? 'Edit' : 'Add'} {estateTypeLabel}
          </h3>

          <button
            type='button'
            onClick={onClose}
            style={{
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#ffffff',
              lineHeight: 1,
              fontWeight: '700',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: `
                0 4px 16px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `,
            }}
            className='btn'
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1.1) rotate(90deg)';
              e.target.style.boxShadow = `
                0 8px 24px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.4)
              `;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'scale(1) rotate(0deg)';
              e.target.style.boxShadow = `
                0 4px 16px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `;
            }}
          >
            <span className='fs-6'>✕</span>
          </button>
        </div>

        {/* Form Body */}
        <div
          style={{
            flex: 1,
            background: 'transparent',
            position: 'relative',
            zIndex: 1,
          }}
          className='p-3 p-md-4'
        >
          <form onSubmit={handleSubmit}>
            <div className='row g-3 g-md-4'>
              {estateFieldMap[estateType]?.map((field, index) => {
                if (!shouldShowField(field)) return null;

                return (
                  <div
                    key={field.name}
                    className='col-12'
                    style={{
                      animation: `fieldSlideIn 0.4s ease-out ${
                        index * 0.1
                      }s both`,
                    }}
                  >
                    <div className='mb-3'>
                      <label
                        style={{
                          display: 'block',
                          fontWeight: '700',
                          color: 'var(--text-secondary)',
                          marginBottom: '8px',
                          letterSpacing: '0.25px',
                          textTransform: 'uppercase',
                        }}
                        className='form-label small'
                      >
                        {field.label}
                        {field.name === 'value' && (
                          <span
                            style={{
                              color: 'var(--error-primary)',
                              marginLeft: '4px',
                            }}
                          >
                            *
                          </span>
                        )}
                      </label>
                      {renderFormField(field)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div
              style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
                background: `
                  linear-gradient(135deg, var(--surface-secondary) 0%, var(--gradient-surface) 100%),
                  linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
                `,
                backgroundBlendMode: 'overlay',
                margin: '32px -16px -16px -16px',
                padding: '20px 16px 16px 16px',
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px',
                boxShadow: `
                  0 -8px 32px rgba(0, 0, 0, 0.05),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
              }}
              className='d-flex flex-column flex-sm-row justify-content-end gap-3 mx-n3 mx-md-n4 px-3 px-md-4'
            >
              <button
                type='button'
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--surface-primary)',
                  border: '2px solid var(--border-muted)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  boxShadow: `
                    0 4px 12px rgba(0, 0, 0, 0.05),
                    0 2px 6px var(--primary-10),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
                className='btn order-2 order-sm-1'
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'var(--error-30)';
                  e.target.style.color = 'var(--error-primary)';
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = `
                    0 8px 24px var(--error-20),
                    0 4px 12px var(--error-10),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'var(--border-muted)';
                  e.target.style.color = 'var(--text-primary)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `
                    0 4px 12px rgba(0, 0, 0, 0.05),
                    0 2px 6px var(--primary-10),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `;
                }}
              >
                <span className='small fw-bold'>Cancel</span>
              </button>

              <button
                type='submit'
                style={{
                  padding: '10px 20px',
                  fontWeight: '700',
                  color: '#ffffff',
                  background: `linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)`,
                  border: '2px solid var(--primary-30)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  boxShadow: `
                    0 8px 24px var(--primary-20),
                    0 4px 12px var(--primary-10),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className='btn order-1 order-sm-2'
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = `
                    0 12px 32px var(--primary-30),
                    0 6px 16px var(--primary-20),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `
                    0 8px 24px var(--primary-20),
                    0 4px 12px var(--primary-10),
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
                <span
                  style={{ position: 'relative', zIndex: 1 }}
                  className='small fw-bold'
                >
                  {initialData ? 'Update' : 'Save'}
                </span>
              </button>
            </div>
          </form>
        </div>
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

        @keyframes fieldSlideIn {
          from { 
            opacity: 0;
            transform: translateX(-20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes dropdownSlideIn {
          from { 
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
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

        /* Responsive adjustments */
        @media (max-width: 576px) {
          .form-control, .form-select {
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default EstateFormModal;
