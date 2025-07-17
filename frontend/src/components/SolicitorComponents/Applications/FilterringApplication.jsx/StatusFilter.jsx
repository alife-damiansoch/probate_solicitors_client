import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const StatusFilter = ({
  status,
  setStatus,
  searchId,
  setSearchId,
  applicantDetailSearch,
  setApplicantDetailSearch,
  setIsFiltered,
  setPageTitle,
}) => {
  const [localSearchId, setLocalSearchId] = useState('');
  const [localApplicantDetail, setLocalApplicantDetail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Component-level styles with cutting-edge design
  const styles = {
    verticalButton: {
      position: 'fixed',
      top: '50%',
      right: '10px',
      transform: 'translateY(-50%)',
      width: '30px',
      height: 'auto',
      padding: '8px 5px',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '5px 0 0 5px',
      cursor: 'pointer',
      writingMode: 'vertical-rl',
      textOrientation: 'mixed',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1000,
      boxShadow:
        '0 10px 20px rgba(59, 130, 246, 0.2), 0 6px 6px rgba(59, 130, 246, 0.1)',
      backdropFilter: 'blur(10px)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
    },
    verticalButtonHover: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      transform: 'translateY(-50%) scale(1.05)',
      boxShadow:
        '0 20px 40px rgba(59, 130, 246, 0.3), 0 10px 20px rgba(59, 130, 246, 0.2)',
    },
    overlay: {
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(31, 32, 73, 0.6)',
      zIndex: 1039,
    },
    filterPanel: {
      width: '90vw',
      maxWidth: '480px',
      height: 'auto',
      maxHeight: '90vh',
      zIndex: 1040,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(59, 130, 246, 0.1)',
      boxShadow:
        '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.05)',
      backdropFilter: 'blur(20px)',
      overflow: 'hidden',
    },
    filterPanelMobile: {
      width: '95vw',
      maxWidth: '400px',
      borderRadius: '16px',
    },
    closeButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      zIndex: 1041,
      backgroundColor: 'rgba(248, 250, 252, 0.8)',
      border: '1px solid rgba(59, 130, 246, 0.1)',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.2s ease',
    },
    closeButtonHover: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.2)',
      transform: 'scale(1.1)',
    },
    headerSection: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      borderRadius: '16px',
      padding: '20px',
      margin: '-24px -24px 24px -24px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    },
    headerSectionMobile: {
      borderRadius: '12px',
      padding: '16px',
      margin: '-16px -16px 16px -16px',
    },
    headerGlow: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '100%',
      background:
        'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    inputGroup: {
      position: 'relative',
      marginBottom: '20px',
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
      display: 'block',
    },
    inputWrapper: {
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '12px',
      border: '2px solid rgba(59, 130, 246, 0.1)',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    inputWrapperFocus: {
      borderColor: 'rgba(59, 130, 246, 0.4)',
      boxShadow:
        '0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    input: {
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#1f2937',
      padding: '12px 16px',
      width: '100%',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    select: {
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#1f2937',
      padding: '12px 16px',
      width: '100%',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '18px',
      paddingRight: '40px',
    },
    searchButton: {
      position: 'absolute',
      right: '4px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)',
      minWidth: '70px',
    },
    searchButtonHover: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      transform: 'translateY(-50%) scale(1.05)',
      boxShadow: '0 6px 12px rgba(16, 185, 129, 0.4)',
    },
    searchButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'translateY(-50%) scale(1)',
    },
    warningBox: {
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '10px',
      marginTop: '8px',
      fontSize: '0.8rem',
      fontWeight: '500',
      boxShadow: '0 4px 8px rgba(251, 191, 36, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    clearButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 24px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow:
        '0 10px 20px rgba(239, 68, 68, 0.3), 0 6px 6px rgba(239, 68, 68, 0.1)',
      width: '100%',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      position: 'relative',
      overflow: 'hidden',
    },
    clearButtonHover: {
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      transform: 'translateY(-2px)',
      boxShadow:
        '0 20px 40px rgba(239, 68, 68, 0.4), 0 10px 20px rgba(239, 68, 68, 0.2)',
    },
    clearButtonBefore: {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: 'left 0.6s ease',
    },
    glassEffect: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  };

  useEffect(() => {
    if (searchId) {
      setLocalSearchId(searchId);
    }
  }, [searchId, setPageTitle]);

  useEffect(() => {
    if (applicantDetailSearch) {
      setLocalApplicantDetail(applicantDetailSearch);
    }
  }, [applicantDetailSearch, setPageTitle]);

  const handleStatusChange = (event) => {
    setPageTitle(
      `Application Search Results by: </br> <span style="color: purple;">Status - ${event.target.value} applications</span>`
    );
    setIsFiltered(true);
    setStatus(event.target.value);
  };

  const handleSearchIdSubmit = () => {
    if (localSearchId.trim()) {
      setPageTitle(
        `Application Search Results by:</br> <span style="color: purple;">ID: ${localSearchId}</span>`
      );
      setIsFiltered(true);
      setSearchId(localSearchId);
    }
  };

  const handleSearchApplicantSubmit = () => {
    if (localApplicantDetail.trim()) {
      setPageTitle(
        `Application Search Results by:</br> <span style="color: purple;">Applicant Details : "${localApplicantDetail}"</span>`
      );
      setIsFiltered(true);
      setApplicantDetailSearch(localApplicantDetail);
    }
  };

  const handleClearAll = () => {
    setPageTitle('All applications');
    setIsFiltered(false);
    setLocalApplicantDetail('');
    setApplicantDetailSearch('');
    setLocalSearchId('');
    setSearchId(null);
    setStatus('');
    setIsOpen(false);
  };

  const toggleFilterPanel = () => {
    setIsOpen(!isOpen);
  };

  const closeOnOutsideClick = (e) => {
    if (e.target.id === 'overlay') {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  return (
    <div>
      {/* Toggle button */}
      <button
        style={styles.verticalButton}
        onClick={toggleFilterPanel}
        aria-label={isOpen ? 'Close Filters' : 'Open Filters'}
        onMouseEnter={(e) => {
          Object.assign(e.target.style, styles.verticalButtonHover);
        }}
        onMouseLeave={(e) => {
          e.target.style.background =
            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
          e.target.style.transform = 'translateY(-50%)';
          e.target.style.boxShadow =
            '0 10px 20px rgba(59, 130, 246, 0.2), 0 6px 6px rgba(59, 130, 246, 0.1)';
        }}
      >
        {isOpen ? 'Close Filters' : 'Open Filters'}
      </button>

      {/* Background blur and sliding filter panel */}
      <AnimatePresence>
        {isOpen && (
          <div>
            {/* Background Blur */}
            <motion.div
              id='overlay'
              className='position-fixed top-0 start-0 w-100 h-100'
              style={styles.overlay}
              onClick={closeOnOutsideClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sliding Filter Panel */}
            <motion.div
              className='position-fixed top-50 start-50 translate-middle'
              style={{
                ...styles.filterPanel,
                ...(window.innerWidth <= 768 ? styles.filterPanelMobile : {}),
                padding: window.innerWidth <= 768 ? '16px' : '24px',
              }}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Close Button */}
              <button
                style={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label='Close'
                onMouseEnter={(e) => {
                  Object.assign(e.target.style, styles.closeButtonHover);
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(248, 250, 252, 0.8)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                ×
              </button>

              {/* Header Section */}
              <div
                style={{
                  ...styles.headerSection,
                  ...(window.innerWidth <= 768
                    ? styles.headerSectionMobile
                    : {}),
                }}
              >
                <div style={styles.headerGlow} />
                <div className='position-relative'>
                  <h4 className='mb-2 fw-bold text-center'>
                    🔍 Filter Applications
                  </h4>
                  <p className='mb-0 text-center opacity-75 fs-6'>
                    Find exactly what you're looking for
                  </p>
                </div>
              </div>

              {/* Filter Content */}
              <div className='d-flex flex-column' style={{ gap: '20px' }}>
                {/* Search by ID */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    🆔 Search by Application ID
                  </label>
                  <div style={styles.inputWrapper}>
                    <input
                      type='number'
                      style={styles.input}
                      placeholder='Enter application ID...'
                      value={localSearchId}
                      onChange={(e) => setLocalSearchId(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSearchIdSubmit()
                      }
                    />
                    <button
                      style={{
                        ...styles.searchButton,
                        ...(localSearchId.trim()
                          ? {}
                          : styles.searchButtonDisabled),
                      }}
                      onClick={handleSearchIdSubmit}
                      disabled={!localSearchId.trim()}
                      onMouseEnter={(e) => {
                        if (localSearchId.trim()) {
                          Object.assign(
                            e.target.style,
                            styles.searchButtonHover
                          );
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background =
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                        e.target.style.transform = 'translateY(-50%)';
                        e.target.style.boxShadow =
                          '0 4px 8px rgba(16, 185, 129, 0.3)';
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Search by Applicant */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    👤 Search by Applicant Details
                  </label>
                  <div
                    style={{
                      ...styles.inputWrapper,
                      opacity: localSearchId !== '' ? 0.5 : 1,
                    }}
                  >
                    <input
                      type='text'
                      style={styles.input}
                      placeholder='Enter name or PPS number...'
                      value={localApplicantDetail}
                      onChange={(e) => setLocalApplicantDetail(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSearchApplicantSubmit()
                      }
                      disabled={localSearchId !== ''}
                    />
                    <button
                      style={{
                        ...styles.searchButton,
                        ...(localSearchId !== '' || !localApplicantDetail.trim()
                          ? styles.searchButtonDisabled
                          : {}),
                      }}
                      onClick={handleSearchApplicantSubmit}
                      disabled={
                        localSearchId !== '' || !localApplicantDetail.trim()
                      }
                      onMouseEnter={(e) => {
                        if (
                          localSearchId === '' &&
                          localApplicantDetail.trim()
                        ) {
                          Object.assign(
                            e.target.style,
                            styles.searchButtonHover
                          );
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background =
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                        e.target.style.transform = 'translateY(-50%)';
                        e.target.style.boxShadow =
                          '0 4px 8px rgba(16, 185, 129, 0.3)';
                      }}
                    >
                      Search
                    </button>
                  </div>
                  {localSearchId !== '' && (
                    <div style={styles.warningBox}>
                      ⚠️ Clear the application ID to enable applicant search
                    </div>
                  )}
                </div>

                {/* Filter by Status */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📊 Filter by Status</label>
                  <div
                    style={{
                      ...styles.inputWrapper,
                      opacity: localSearchId !== '' ? 0.5 : 1,
                    }}
                  >
                    <select
                      style={styles.select}
                      value={status}
                      onChange={handleStatusChange}
                      disabled={localSearchId !== ''}
                    >
                      <option value=''>All Applications</option>
                      <option value='active'>🔄 Currently in Process</option>
                      <option value='rejected'>❌ Rejected</option>
                      <option value='approved'>
                        ✅ Fully Approved (Not Paid Out)
                      </option>
                      <option value='paid_out'>
                        💰 Approved & Paid Out (Not Settled)
                      </option>
                      <option value='settled'>🏁 Settled (Closed)</option>
                    </select>
                  </div>
                </div>

                {/* Clear All Button */}
                <div className='mt-4'>
                  <button
                    style={styles.clearButton}
                    onClick={handleClearAll}
                    onMouseEnter={(e) => {
                      Object.assign(e.target.style, styles.clearButtonHover);
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background =
                        'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow =
                        '0 10px 20px rgba(239, 68, 68, 0.3), 0 6px 6px rgba(239, 68, 68, 0.1)';
                    }}
                  >
                    🗑️ Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusFilter;
