import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { FaBuilding, FaCog, FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import {
  formatFieldName,
  formatMoney,
  getEstates,
} from '../../GenericFunctions/HelperGenericFunctions';
import EstateSummarySticky from '../Applications/AddApplicationParts/FormParts/EstateSummarySticky';
import EstateManagerModal from './EstatesManagerModal';
import { estateFieldMap } from './EstatesManagerModalParts/estateFieldConfig';

const EstatesPart = ({
  application,
  refresh,
  setRefresh,
  isApplicationLocked,
}) => {
  const currency_sign = Cookies.get('currency_sign');
  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEstateModal, setShowEstateModal] = useState(false);

  // Mobile detection
  const isMobile = window.innerWidth < 768;

  console.log('Application:', application.id);

  // Fetch estates when application.estate_summary changes
  useEffect(() => {
    const fetchEstates = async () => {
      setLoading(true);
      try {
        const estatesData = await getEstates(application);
        setEstates(estatesData);
      } catch (error) {
        console.error('Error fetching estates:', error);
        setEstates([]);
      }
      setLoading(false);
    };

    fetchEstates();
  }, [application.estate_summary, refresh]);

  // Helper function to get field configuration for an estate category
  const getFieldsForCategory = (category) => {
    return estateFieldMap[category] || [];
  };

  // Helper function to render estate fields based on configuration
  const renderEstateFields = (estate) => {
    const fields = getFieldsForCategory(estate.category);

    if (fields.length === 0) {
      const relevantFields = Object.entries(estate).filter(
        ([key, val]) =>
          val !== null &&
          val !== undefined &&
          val !== '' &&
          !['id', 'category', 'group_label', 'is_asset', 'value'].includes(key)
      );

      if (relevantFields.length === 0) return null;

      return (
        <div
          className={`d-flex flex-${isMobile ? 'column' : 'wrap'} gap-${
            isMobile ? '2' : '3'
          }`}
        >
          {relevantFields.map(([key, val]) => (
            <div
              key={key}
              className={`d-flex ${
                isMobile
                  ? 'justify-content-between align-items-start'
                  : 'align-items-center'
              }`}
            >
              <span
                className='fw-medium text-slate-600 me-2'
                style={{
                  fontSize: isMobile ? '0.75rem' : '0.8rem',
                  minWidth: isMobile ? '40%' : 'auto',
                  flexShrink: 0,
                }}
              >
                {formatFieldName(key)}:
              </span>
              <span
                className='text-slate-500 text-end'
                style={{
                  fontSize: isMobile ? '0.75rem' : '0.8rem',
                  wordBreak: 'break-word',
                  lineHeight: '1.3',
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      );
    }

    const fieldsToShow = fields.filter((field) => {
      const value = estate[field.name];
      return (
        field.name !== 'value' &&
        value !== null &&
        value !== undefined &&
        value !== ''
      );
    });

    if (fieldsToShow.length === 0) return null;

    return (
      <div
        className={`d-flex flex-${isMobile ? 'column' : 'wrap'} gap-${
          isMobile ? '2' : '3'
        }`}
      >
        {fieldsToShow.map((field) => {
          const value = estate[field.name];
          return (
            <div
              key={field.name}
              className={`d-flex ${
                isMobile
                  ? 'justify-content-between align-items-start'
                  : 'align-items-center'
              }`}
            >
              <span
                className='fw-medium text-slate-600 me-2'
                style={{
                  fontSize: isMobile ? '0.75rem' : '0.8rem',
                  minWidth: isMobile ? '40%' : 'auto',
                  flexShrink: 0,
                }}
              >
                {field.label}:
              </span>
              <span
                className='text-slate-500 text-end'
                style={{
                  fontSize: isMobile ? '0.75rem' : '0.8rem',
                  wordBreak: 'break-word',
                  lineHeight: '1.3',
                }}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className='modern-main-card mb-4 position-relative overflow-hidden'
        style={{
          background: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(248, 250, 252, 0.05)),
            radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.6), transparent 50%),
            radial-gradient(circle at 70% 90%, rgba(245, 158, 11, 0.1), transparent 50%)
          `,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: isMobile ? '16px' : '24px',
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.08),
            0 8px 16px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.4)
          `,
          backdropFilter: 'blur(20px)',
          padding: isMobile ? '1.5rem' : '3rem',
          textAlign: 'center',
          margin: isMobile ? '0 8px 16px 8px' : '0 0 16px 0',
        }}
      >
        <div
          className='spinner-border mb-3'
          role='status'
          style={{
            color: '#f59e0b',
            width: isMobile ? '2rem' : '3rem',
            height: isMobile ? '2rem' : '3rem',
          }}
        >
          <span className='visually-hidden'>Loading...</span>
        </div>
        <div
          className='fw-bold'
          style={{
            color: '#1e293b',
            fontSize: isMobile ? '1rem' : '1.2rem',
          }}
        >
          Loading estates...
        </div>
      </div>
    );
  }

  if (!estates || estates.length === 0) {
    return (
      <>
        <div
          className='modern-main-card mb-4 position-relative overflow-hidden'
          style={{
            background: `
            linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(248, 250, 252, 0.05)),
            radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.6), transparent 50%),
            radial-gradient(circle at 70% 90%, rgba(245, 158, 11, 0.1), transparent 50%)
          `,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: isMobile ? '16px' : '24px',
            boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.08),
            0 8px 16px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.4)
          `,
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'translateZ(0)',
            marginBottom: isMobile ? '100px' : '200px',
            margin: isMobile ? '0 8px 100px 8px' : '0 0 200px 0',
          }}
        >
          {/* Premium Header */}
          <div
            className={`px-${isMobile ? '3' : '4'} py-${
              isMobile ? '3' : '4'
            } d-flex align-items-center gap-${
              isMobile ? '2' : '3'
            } position-relative`}
            style={{
              background: `
              linear-gradient(135deg, #f59e0b, #d97706),
              linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))
            `,
              color: '#ffffff',
              borderTopLeftRadius: isMobile ? '14px' : '22px',
              borderTopRightRadius: isMobile ? '14px' : '22px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              flexDirection: isMobile ? 'column' : 'row',
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            {/* Icon with Micro-animation */}
            <div
              className='d-flex align-items-center justify-content-center rounded-circle position-relative flex-shrink-0'
              style={{
                width: isMobile ? '40px' : '56px',
                height: isMobile ? '40px' : '56px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                marginBottom: isMobile ? '8px' : '0',
              }}
            >
              <FaBuilding size={isMobile ? 16 : 20} />
            </div>

            <div className={`flex-grow-1 ${isMobile ? 'text-center' : ''}`}>
              <h5
                className='fw-bold mb-2 text-white'
                style={{
                  fontSize: isMobile ? '1.1rem' : '1.4rem',
                  letterSpacing: '-0.02em',
                  marginBottom: isMobile ? '4px' : '8px',
                }}
              >
                <span className='d-none d-sm-inline'>Estate Assessment</span>
                <span className='d-inline d-sm-none'>Estate</span>
              </h5>
              <div
                className='px-3 py-2 rounded-pill fw-semibold text-white'
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  fontSize: isMobile ? '0.75rem' : '0.9rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'inline-block',
                  backdropFilter: 'blur(10px)',
                  letterSpacing: '0.02em',
                }}
              >
                <span className='d-none d-sm-inline'>Assets & Liabilities</span>
                <span className='d-inline d-sm-none'>Assets</span>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`px-${isMobile ? '3' : '4'} py-${
                isMobile ? '2' : '3'
              } rounded-pill text-white fw-bold d-flex align-items-center gap-2 flex-shrink-0`}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                fontSize: isMobile ? '0.75rem' : '0.9rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'default',
                letterSpacing: '0.02em',
                marginTop: isMobile ? '8px' : '0',
                justifyContent: 'center',
                minWidth: isMobile ? '80px' : 'auto',
              }}
            >
              <svg
                width={isMobile ? '14' : '18'}
                height={isMobile ? '14' : '18'}
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='d-none d-sm-inline'>Required</span>
              <span className='d-inline d-sm-none'>!</span>
            </span>
          </div>

          {/* Content */}
          <div
            className={`px-${isMobile ? '3' : '4'} pb-${isMobile ? '3' : '4'}`}
          >
            <div
              className='alert border-0 mb-4'
              style={{
                background:
                  'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                borderRadius: isMobile ? '12px' : '16px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)',
                color: '#dc2626',
                padding: isMobile ? '1rem' : '1.5rem',
              }}
            >
              <div
                style={{
                  width: isMobile ? '32px' : '40px',
                  height: isMobile ? '32px' : '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 8px 16px rgba(239, 68, 68, 0.3)',
                }}
              >
                <i
                  className='fas fa-exclamation-triangle'
                  style={{ fontSize: isMobile ? '12px' : '14px' }}
                ></i>
              </div>
              <div
                className='text-center fw-semibold'
                style={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
              >
                <span className='d-none d-sm-inline'>
                  No estate information available for this application.
                </span>
                <span className='d-inline d-sm-none'>
                  No estate information available.
                </span>
              </div>
            </div>

            <div className='text-center'>
              <button
                className='btn px-4 py-3 fw-medium d-inline-flex align-items-center gap-2'
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: isMobile ? '12px' : '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                  fontSize: isMobile ? '0.85rem' : '1rem',
                  minHeight: isMobile ? '44px' : 'auto',
                  padding: isMobile ? '12px 20px' : '12px 16px',
                }}
                onClick={() => setShowEstateModal(true)}
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  isApplicationLocked
                }
              >
                <FaPlus size={isMobile ? 12 : 14} />
                <span className='d-none d-sm-inline'>Manage Estates</span>
                <span className='d-inline d-sm-none'>Add Estates</span>
              </button>
            </div>
          </div>
        </div>
        <EstateManagerModal
          show={showEstateModal}
          onClose={() => setShowEstateModal(false)}
          estates={estates}
          applicationId={application.id}
          refreshEstates={() => setRefresh(!refresh)}
          currency_sign={currency_sign}
        />
      </>
    );
  }

  // Group by label and separate assets from liabilities
  const grouped = estates.reduce((acc, estate) => {
    const key = estate.group_label || estate.label || estate.name || 'Unnamed';
    if (!acc[key]) acc[key] = [];
    acc[key].push(estate);
    return acc;
  }, {});

  // Separate assets and liabilities
  const assetGroups = {};
  const liabilityGroups = {};

  Object.entries(grouped).forEach(([key, estatesArray]) => {
    if (estatesArray.some((estate) => estate.is_asset === false)) {
      liabilityGroups[key] = estatesArray;
    } else {
      assetGroups[key] = estatesArray;
    }
  });

  return (
    <>
      <div
        className='modern-main-card mb-4 position-relative overflow-hidden'
        style={{
          background: `
          linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(248, 250, 252, 0.05)),
          radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.6), transparent 50%),
          radial-gradient(circle at 70% 90%, rgba(245, 158, 11, 0.1), transparent 50%)
        `,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: isMobile ? '16px' : '24px',
          boxShadow: `
          0 20px 40px rgba(0, 0, 0, 0.08),
          0 8px 16px rgba(0, 0, 0, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.4)
        `,
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateZ(0)',
          marginBottom: isMobile ? '100px' : '200px',
          margin: isMobile ? '0 8px 100px 8px' : '0 0 200px 0',
        }}
      >
        {/* Premium Header */}
        <div
          className={`px-${isMobile ? '3' : '4'} py-${
            isMobile ? '3' : '4'
          } d-flex align-items-center gap-${
            isMobile ? '2' : '3'
          } position-relative`}
          style={{
            background: `
            linear-gradient(135deg, #f59e0b, #d97706),
            linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))
          `,
            color: '#ffffff',
            borderTopLeftRadius: isMobile ? '14px' : '22px',
            borderTopRightRadius: isMobile ? '14px' : '22px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          {/* Icon with Micro-animation */}
          <div
            className='d-flex align-items-center justify-content-center rounded-circle position-relative flex-shrink-0'
            style={{
              width: isMobile ? '40px' : '56px',
              height: isMobile ? '40px' : '56px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              marginBottom: isMobile ? '8px' : '0',
            }}
          >
            <FaBuilding size={isMobile ? 16 : 20} />
          </div>

          <div className={`flex-grow-1 ${isMobile ? 'text-center' : ''}`}>
            <h5
              className='fw-bold mb-2 text-white'
              style={{
                fontSize: isMobile ? '1.1rem' : '1.4rem',
                letterSpacing: '-0.02em',
                marginBottom: isMobile ? '4px' : '8px',
              }}
            >
              <span className='d-none d-sm-inline'>Estate Assessment</span>
              <span className='d-inline d-sm-none'>Estate</span>
            </h5>
            <div
              className='px-3 py-2 rounded-pill fw-semibold text-white'
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                fontSize: isMobile ? '0.75rem' : '0.9rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'inline-block',
                backdropFilter: 'blur(10px)',
                letterSpacing: '0.02em',
              }}
            >
              <span className='d-none d-sm-inline'>Assets & Liabilities</span>
              <span className='d-inline d-sm-none'>Assets</span>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-${isMobile ? '3' : '4'} py-${
              isMobile ? '2' : '3'
            } rounded-pill text-white fw-bold d-flex align-items-center gap-2 flex-shrink-0`}
            style={{
              background:
                Object.keys(assetGroups).length > 0 ||
                Object.keys(liabilityGroups).length > 0
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626)',
              fontSize: isMobile ? '0.75rem' : '0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'default',
              letterSpacing: '0.02em',
              marginTop: isMobile ? '8px' : '0',
              justifyContent: 'center',
              minWidth: isMobile ? '80px' : 'auto',
            }}
          >
            <svg
              width={isMobile ? '14' : '18'}
              height={isMobile ? '14' : '18'}
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              {Object.keys(assetGroups).length > 0 ||
              Object.keys(liabilityGroups).length > 0 ? (
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              ) : (
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              )}
            </svg>
            {Object.keys(assetGroups).length > 0 ||
            Object.keys(liabilityGroups).length > 0 ? (
              <>
                <span className='d-none d-sm-inline'>Complete</span>
                <span className='d-inline d-sm-none'>✓</span>
              </>
            ) : (
              <>
                <span className='d-none d-sm-inline'>Required</span>
                <span className='d-inline d-sm-none'>!</span>
              </>
            )}
          </span>
        </div>

        {/* Content Area */}
        <div
          className={`px-${isMobile ? '2' : '4'} pb-${isMobile ? '3' : '4'}`}
        >
          {/* Assets Section */}
          {Object.keys(assetGroups).length > 0 && (
            <>
              <div
                className={`p-${isMobile ? '3' : '4'} mb-${
                  isMobile ? '3' : '4'
                } position-relative`}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: isMobile ? '12px' : '18px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                }}
              >
                <div
                  className={`d-flex align-items-center mb-${
                    isMobile ? '2' : '2'
                  } ${isMobile ? 'flex-column text-center' : ''}`}
                >
                  <div
                    style={{
                      width: isMobile ? '32px' : '40px',
                      height: isMobile ? '32px' : '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: isMobile ? '0' : '1rem',
                      marginBottom: isMobile ? '8px' : '0',
                      boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <i
                      className='fas fa-chart-line'
                      style={{ fontSize: isMobile ? '12px' : '14px' }}
                    ></i>
                  </div>
                  <h6
                    className='mb-0 fw-bold'
                    style={{
                      color: '#1e40af',
                      fontSize: isMobile ? '1rem' : '1.2rem',
                    }}
                  >
                    <span className='d-none d-sm-inline'>ESTATE ASSETS</span>
                    <span className='d-inline d-sm-none'>ASSETS</span>
                  </h6>
                </div>
                {!isMobile && (
                  <p
                    className='mb-0 small'
                    style={{ color: '#1e3a8a', fontStyle: 'italic' }}
                  >
                    Property, investments, debts owed to the deceased, and other
                    valuable items comprising the gross estate
                  </p>
                )}
              </div>

              {Object.entries(assetGroups).map(
                ([estateName, groupedEstates], groupIndex) => (
                  <div
                    key={groupIndex}
                    className={`mb-${isMobile ? '3' : '4'}`}
                  >
                    <div
                      className='position-relative'
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: isMobile ? '12px' : '18px',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        className={`p-${isMobile ? '2' : '3'}`}
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                          borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                      >
                        <h5
                          className='mb-0 fw-bold'
                          style={{
                            color: '#3b82f6',
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                          }}
                        >
                          {isMobile && estateName.length > 30
                            ? `${estateName.substring(0, 30)}...`
                            : estateName}
                        </h5>
                      </div>
                      <div
                        className={`p-${isMobile ? '2' : '3'}`}
                        style={{ backgroundColor: 'transparent' }}
                      >
                        {groupedEstates.map((estate, index) => {
                          const displayName =
                            groupedEstates.length > 1
                              ? `${estateName} (${index + 1})`
                              : estateName;

                          return (
                            <div
                              key={index}
                              className={`${
                                isMobile
                                  ? 'd-block'
                                  : 'd-flex align-items-center justify-content-between'
                              } 
                          px-${isMobile ? '2' : '3'} py-${
                                isMobile ? '2' : '3'
                              } position-relative ${
                                index < groupedEstates.length - 1
                                  ? `mb-${isMobile ? '2' : '3'}`
                                  : ''
                              }`}
                              style={{
                                background:
                                  estate.is_asset === false
                                    ? 'rgba(239, 68, 68, 0.1)'
                                    : 'rgba(6, 182, 212, 0.1)',
                                borderLeft:
                                  estate.is_asset === false
                                    ? '4px solid #ef4444'
                                    : '4px solid #06b6d4',
                                borderRadius: '12px',
                                minHeight: isMobile ? '60px' : '70px',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                              }}
                            >
                              <div
                                className={`${
                                  isMobile ? 'mb-2' : 'flex-grow-1 pe-3'
                                }`}
                              >
                                <div
                                  className={`d-flex align-items-center flex-wrap gap-2 ${
                                    isMobile ? 'mb-1' : 'mb-2'
                                  }`}
                                >
                                  {groupedEstates.length > 1 && (
                                    <span
                                      className='fw-bold text-slate-700 small'
                                      style={{
                                        fontSize: isMobile
                                          ? '0.75rem'
                                          : '0.85rem',
                                      }}
                                    >
                                      {isMobile && displayName.length > 25
                                        ? `${displayName.substring(0, 25)}...`
                                        : displayName}
                                    </span>
                                  )}
                                  {estate.is_asset === false && (
                                    <span
                                      className='badge rounded-pill px-2 py-1 d-flex align-items-center gap-1'
                                      style={{
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        color: '#dc2626',
                                        fontSize: isMobile
                                          ? '0.6rem'
                                          : '0.7rem',
                                        border:
                                          '1px solid rgba(239, 68, 68, 0.3)',
                                      }}
                                      title='Liability'
                                    >
                                      <FaFileInvoiceDollar
                                        size={isMobile ? 8 : 10}
                                      />
                                      <span className='d-none d-sm-inline'>
                                        Liability
                                      </span>
                                      <span className='d-inline d-sm-none'>
                                        Debt
                                      </span>
                                    </span>
                                  )}
                                </div>
                                <div>{renderEstateFields(estate)}</div>
                              </div>

                              <div
                                className={`d-flex align-items-center ${
                                  isMobile ? 'justify-content-between' : ''
                                }`}
                                style={{
                                  minWidth: isMobile ? '100%' : '140px',
                                }}
                              >
                                <div
                                  className={`${
                                    isMobile ? 'flex-grow-1' : 'text-end w-100'
                                  }`}
                                >
                                  <div
                                    className='small text-muted mb-1'
                                    style={{
                                      fontSize: isMobile ? '0.7rem' : '0.75rem',
                                    }}
                                  >
                                    {estate.category === 'irish_debt'
                                      ? 'Amount Owed'
                                      : 'Value'}
                                  </div>
                                  <div
                                    className='fw-bold'
                                    style={{
                                      color:
                                        estate.is_asset === false
                                          ? '#ef4444'
                                          : '#059669',
                                      fontSize: isMobile ? '0.9rem' : '1.1rem',
                                    }}
                                  >
                                    {formatMoney(estate.value, currency_sign)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )
              )}
            </>
          )}

          {/* Liabilities Section */}
          {Object.keys(liabilityGroups).length > 0 && (
            <>
              <div
                className={`p-${isMobile ? '3' : '4'} mb-${
                  isMobile ? '3' : '4'
                } position-relative`}
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: isMobile ? '12px' : '18px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                  marginTop:
                    Object.keys(assetGroups).length > 0
                      ? isMobile
                        ? '1.5rem'
                        : '2rem'
                      : '0',
                }}
              >
                <div
                  className={`d-flex align-items-center mb-${
                    isMobile ? '2' : '2'
                  } ${isMobile ? 'flex-column text-center' : ''}`}
                >
                  <div
                    style={{
                      width: isMobile ? '32px' : '40px',
                      height: isMobile ? '32px' : '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: isMobile ? '0' : '1rem',
                      marginBottom: isMobile ? '8px' : '0',
                      boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <i
                      className='fas fa-exclamation-triangle'
                      style={{ fontSize: isMobile ? '12px' : '14px' }}
                    ></i>
                  </div>
                  <h6
                    className='mb-0 fw-bold'
                    style={{
                      color: '#92400e',
                      fontSize: isMobile ? '1rem' : '1.2rem',
                    }}
                  >
                    <span className='d-none d-sm-inline'>
                      ESTATE LIABILITIES
                    </span>
                    <span className='d-inline d-sm-none'>LIABILITIES</span>
                  </h6>
                </div>
                {!isMobile && (
                  <p
                    className='mb-0 small'
                    style={{ color: '#92400e', fontStyle: 'italic' }}
                  >
                    Debts, funeral expenses, and other obligations payable by
                    the estate
                  </p>
                )}
              </div>

              {Object.entries(liabilityGroups).map(
                ([estateName, groupedEstates], groupIndex) => (
                  <div
                    key={groupIndex}
                    className={`mb-${isMobile ? '3' : '4'}`}
                  >
                    <div
                      className='position-relative'
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: isMobile ? '12px' : '18px',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        className={`p-${isMobile ? '2' : '3'}`}
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                          borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                        }}
                      >
                        <h5
                          className='mb-0 fw-bold'
                          style={{
                            color: '#f59e0b',
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                          }}
                        >
                          {isMobile && estateName.length > 30
                            ? `${estateName.substring(0, 30)}...`
                            : estateName}
                        </h5>
                      </div>
                      <div
                        className={`p-${isMobile ? '2' : '3'}`}
                        style={{ backgroundColor: 'transparent' }}
                      >
                        {groupedEstates.map((estate, index) => {
                          const displayName =
                            groupedEstates.length > 1
                              ? `${estateName} (${index + 1})`
                              : estateName;

                          return (
                            <div
                              key={index}
                              className={`position-relative ${
                                index < groupedEstates.length - 1
                                  ? `mb-${isMobile ? '3' : '3'}`
                                  : ''
                              }`}
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderLeft: '4px solid #ef4444',
                                borderRadius: '12px',
                                minHeight: isMobile ? 'auto' : '70px',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                padding: isMobile ? '16px' : '16px 24px',
                              }}
                              onMouseEnter={(e) => {
                                if (!isMobile) {
                                  e.currentTarget.style.transform =
                                    'translateY(-2px) translateX(4px)';
                                  e.currentTarget.style.boxShadow =
                                    '0 8px 16px rgba(0, 0, 0, 0.1)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isMobile) {
                                  e.currentTarget.style.transform =
                                    'translateY(0) translateX(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }
                              }}
                            >
                              {/* Mobile Layout */}
                              {isMobile ? (
                                <div className='d-flex flex-column'>
                                  {/* Header Row */}
                                  <div className='d-flex justify-content-between align-items-start mb-2'>
                                    <div className='flex-grow-1'>
                                      {groupedEstates.length > 1 && (
                                        <div
                                          className='fw-bold text-slate-700 mb-1'
                                          style={{ fontSize: '0.85rem' }}
                                        >
                                          {displayName}
                                        </div>
                                      )}
                                      <div className='d-flex flex-wrap gap-1'>
                                        <span
                                          className='badge rounded-pill px-2 py-1 d-flex align-items-center gap-1'
                                          style={{
                                            background:
                                              'rgba(239, 68, 68, 0.2)',
                                            color: '#dc2626',
                                            fontSize: '0.65rem',
                                            border:
                                              '1px solid rgba(239, 68, 68, 0.3)',
                                          }}
                                          title='Liability'
                                        >
                                          <FaFileInvoiceDollar size={8} />
                                          Liability
                                        </span>
                                      </div>
                                    </div>
                                    <div className='text-end ms-2'>
                                      <div
                                        className='small text-muted mb-1'
                                        style={{ fontSize: '0.7rem' }}
                                      >
                                        {estate.category === 'irish_debt'
                                          ? 'Amount Owed'
                                          : 'Value'}
                                      </div>
                                      <div
                                        className='fw-bold'
                                        style={{
                                          color: '#ef4444',
                                          fontSize: '1rem',
                                        }}
                                      >
                                        {formatMoney(
                                          estate.value,
                                          currency_sign
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Details Section */}
                                  <div
                                    className='mt-2 pt-2 border-top border-1'
                                    style={{
                                      borderColor: 'rgba(148, 163, 184, 0.2)',
                                    }}
                                  >
                                    {renderEstateFields(estate)}
                                  </div>
                                </div>
                              ) : (
                                /* Desktop Layout */
                                <div className='d-flex align-items-center justify-content-between'>
                                  <div className='flex-grow-1 pe-3'>
                                    <div className='d-flex align-items-center flex-wrap gap-2 mb-2'>
                                      {groupedEstates.length > 1 && (
                                        <span className='fw-bold text-slate-700 small'>
                                          {displayName}
                                        </span>
                                      )}
                                      <span
                                        className='badge rounded-pill px-2 py-1 d-flex align-items-center gap-1'
                                        style={{
                                          background: 'rgba(239, 68, 68, 0.2)',
                                          color: '#dc2626',
                                          fontSize: '0.7rem',
                                          border:
                                            '1px solid rgba(239, 68, 68, 0.3)',
                                        }}
                                        title='Liability'
                                      >
                                        <FaFileInvoiceDollar size={10} />
                                        Liability
                                      </span>
                                    </div>
                                    <div>{renderEstateFields(estate)}</div>
                                  </div>

                                  <div
                                    className='d-flex align-items-center'
                                    style={{ minWidth: '140px' }}
                                  >
                                    <div className='text-end w-100'>
                                      <div
                                        className='small text-muted mb-1'
                                        style={{ fontSize: '0.75rem' }}
                                      >
                                        {estate.category === 'irish_debt'
                                          ? 'Amount Owed'
                                          : 'Value'}
                                      </div>
                                      <div
                                        className='fw-bold'
                                        style={{
                                          color: '#ef4444',
                                          fontSize: '1.1rem',
                                        }}
                                      >
                                        {formatMoney(
                                          estate.value,
                                          currency_sign
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )
              )}
            </>
          )}

          {/* Manage Estates Button */}
          <div
            className={`text-center mb-${isMobile ? '3' : '5'}`}
            style={{ paddingBottom: isMobile ? '100px' : '100px' }}
          >
            <button
              className='btn px-4 py-3 fw-medium d-inline-flex align-items-center gap-2'
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#3b82f6',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: isMobile ? '12px' : '16px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                fontSize: isMobile ? '0.85rem' : '1rem',
                minHeight: isMobile ? '44px' : 'auto',
                padding: isMobile ? '12px 20px' : '12px 16px',
              }}
              onClick={() => setShowEstateModal(true)}
              disabled={
                application.approved ||
                application.is_rejected ||
                isApplicationLocked
              }
            >
              <FaCog size={isMobile ? 12 : 14} />
              <span className='d-none d-sm-inline'>Manage Estates</span>
              <span className='d-inline d-sm-none'>Manage</span>
            </button>
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

          @keyframes selectionGlow {
            0% {
              opacity: 0.3;
            }
            100% {
              opacity: 0.6;
            }
          }
          
          @media (max-width: 767px) {
            .modern-main-card {
              transform: none !important;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08) !important;
            }
            
            .modern-main-card:hover {
              transform: none !important;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08) !important;
            }
          }
        `}</style>
      </div>
      <EstateSummarySticky
        estates={estates}
        formData={application}
        currency_sign={currency_sign}
      />
      <EstateManagerModal
        show={showEstateModal}
        onClose={() => setShowEstateModal(false)}
        estates={estates}
        applicationId={application.id}
        refreshEstates={() => setRefresh(!refresh)}
        currency_sign={currency_sign}
      />
    </>
  );
};

export default EstatesPart;
