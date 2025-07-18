import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FaChartBar,
  FaCog,
  FaFilter,
  FaIdCard,
  FaSearch,
  FaStar,
  FaTimes,
  FaTrashAlt,
  FaUser,
} from 'react-icons/fa';

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
  const [focusedField, setFocusedField] = useState(null);

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
      `Application Search Results by: </br> <span style="color: var(--primary-blue);">Status - ${event.target.value} applications</span>`
    );
    setIsFiltered(true);
    setStatus(event.target.value);
  };

  const handleSearchIdSubmit = () => {
    if (localSearchId.trim()) {
      setPageTitle(
        `Application Search Results by:</br> <span style="color: var(--primary-blue);">ID: ${localSearchId}</span>`
      );
      setIsFiltered(true);
      setSearchId(localSearchId);
    }
  };

  const handleSearchApplicantSubmit = () => {
    if (localApplicantDetail.trim()) {
      setPageTitle(
        `Application Search Results by:</br> <span style="color: var(--primary-blue);">Applicant Details : "${localApplicantDetail}"</span>`
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

  const toggleButtonStyle = {
    position: 'fixed',
    top: '50%',
    right: '0px',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    background: `
      linear-gradient(135deg, var(--primary-blue) 0%, var(--success-primary) 100%)
    `,
    color: '#ffffff',
    fontSize: '8px',
    fontWeight: '500',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 10000,
    boxShadow: `
      0 16px 32px var(--primary-40),
      0 8px 16px rgba(0, 0, 0, 0.2)
    `,
    backdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '2px',
  };

  const overlayStyle = {
    backdropFilter: 'blur(12px)',
    background: `var(--bg-primary)`,
    opacity: 0.9,
    zIndex: 9999,
  };

  const filterPanelStyle = {
    width: '90vw',
    maxWidth: '520px',
    maxHeight: '90vh',
    zIndex: 10001,
    background: 'var(--gradient-surface)',
    borderRadius: '28px',
    border: '2px solid var(--border-primary)',
    boxShadow: `
      0 32px 64px rgba(0, 0, 0, 0.3),
      0 16px 32px var(--primary-30)
    `,
    backdropFilter: 'blur(40px)',
    overflow: ' auto',
    padding: '24px',
  };

  const inputStyle = (fieldName) => ({
    border: 'none',
    background: 'var(--surface-secondary)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '16px 20px',
    width: '100%',
    borderRadius: '16px',
    outline: 'none',
    boxShadow:
      focusedField === fieldName
        ? `0 0 0 4px var(--primary-20), 0 8px 16px var(--primary-10)`
        : `0 4px 8px rgba(0, 0, 0, 0.1)`,
  });

  return (
    <div>
      {/* Toggle Button */}
      <motion.button
        style={toggleButtonStyle}
        onClick={toggleFilterPanel}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
      >
        {isOpen ? <FaTimes size={10} /> : <FaFilter size={10} />}
        <span style={{ fontSize: '8px', fontWeight: '600' }}>
          {isOpen ? 'CLOSE' : 'FILTER'}
        </span>
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              id='overlay'
              className='position-fixed top-0 start-0 w-100 h-100'
              style={overlayStyle}
              onClick={closeOnOutsideClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className='position-fixed top-50 start-50 translate-middle'
              style={filterPanelStyle}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
            >
              {/* Close Button */}
              <button
                className='position-absolute'
                style={{
                  top: '16px',
                  right: '16px',
                  background: 'var(--surface-tertiary)',
                  border: '2px solid var(--border-muted)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                onClick={() => setIsOpen(false)}
              >
                <FaTimes />
              </button>

              {/* Header */}
              <div
                style={{
                  background: `linear-gradient(135deg, var(--primary-blue) 0%, var(--success-primary) 100%)`,
                  borderRadius: '24px',
                  padding: '24px',
                  margin: '-24px -24px 24px -24px',
                  color: '#ffffff',
                  textAlign: 'center',
                }}
              >
                <div className='d-flex align-items-center justify-content-center mb-3'>
                  <FaStar className='me-3' size={20} />
                  <h3 className='mb-0 fw-bold'>Smart Filter System</h3>
                </div>
                <p className='mb-0 opacity-90'>
                  Find exactly what you're looking for with precision
                </p>
              </div>

              {/* Filter Content */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {/* Search by ID */}
                <div>
                  <label
                    className='form-label fw-bold mb-3 d-flex align-items-center'
                    style={{ color: 'var(--text-primary)', fontSize: '1rem' }}
                  >
                    <FaIdCard
                      className='me-2'
                      style={{ color: 'var(--primary-blue)' }}
                    />
                    Search by Application ID
                  </label>
                  <div className='position-relative'>
                    <input
                      type='number'
                      style={inputStyle('searchId')}
                      placeholder='Enter application ID...'
                      value={localSearchId}
                      onChange={(e) => setLocalSearchId(e.target.value)}
                      onFocus={() => setFocusedField('searchId')}
                      onBlur={() => setFocusedField(null)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSearchIdSubmit()
                      }
                    />
                    <button
                      style={{
                        position: 'absolute',
                        right: '6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: `linear-gradient(135deg, var(--success-primary) 0%, var(--success-dark) 100%)`,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: localSearchId.trim()
                          ? 'pointer'
                          : 'not-allowed',
                        opacity: localSearchId.trim() ? 1 : 0.5,
                      }}
                      onClick={handleSearchIdSubmit}
                      disabled={!localSearchId.trim()}
                    >
                      <FaSearch className='me-1' size={12} />
                      Search
                    </button>
                  </div>
                </div>

                {/* Search by Applicant */}
                <div style={{ opacity: localSearchId !== '' ? 0.5 : 1 }}>
                  <label
                    className='form-label fw-bold mb-3 d-flex align-items-center'
                    style={{ color: 'var(--text-primary)', fontSize: '1rem' }}
                  >
                    <FaUser
                      className='me-2'
                      style={{ color: 'var(--success-primary)' }}
                    />
                    Search by Applicant Details
                  </label>
                  <div className='position-relative'>
                    <input
                      type='text'
                      style={inputStyle('applicantDetail')}
                      placeholder='Enter name or PPS number...'
                      value={localApplicantDetail}
                      onChange={(e) => setLocalApplicantDetail(e.target.value)}
                      onFocus={() => setFocusedField('applicantDetail')}
                      onBlur={() => setFocusedField(null)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleSearchApplicantSubmit()
                      }
                      disabled={localSearchId !== ''}
                    />
                    <button
                      style={{
                        position: 'absolute',
                        right: '6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: `linear-gradient(135deg, var(--success-primary) 0%, var(--success-dark) 100%)`,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor:
                          localSearchId !== '' || !localApplicantDetail.trim()
                            ? 'not-allowed'
                            : 'pointer',
                        opacity:
                          localSearchId !== '' || !localApplicantDetail.trim()
                            ? 0.5
                            : 1,
                      }}
                      onClick={handleSearchApplicantSubmit}
                      disabled={
                        localSearchId !== '' || !localApplicantDetail.trim()
                      }
                    >
                      <FaSearch className='me-1' size={12} />
                      Search
                    </button>
                  </div>

                  {localSearchId !== '' && (
                    <div
                      style={{
                        background: 'var(--warning-20)',
                        color: 'var(--warning-primary)',
                        border: '1px solid var(--warning-30)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        marginTop: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <FaCog size={14} />
                      Clear the application ID to enable applicant search
                    </div>
                  )}
                </div>

                {/* Filter by Status */}
                <div style={{ opacity: localSearchId !== '' ? 0.5 : 1 }}>
                  <label
                    className='form-label fw-bold mb-3 d-flex align-items-center'
                    style={{ color: 'var(--text-primary)', fontSize: '1rem' }}
                  >
                    <FaChartBar
                      className='me-2'
                      style={{ color: 'var(--warning-primary)' }}
                    />
                    Filter by Status
                  </label>
                  <select
                    style={{
                      ...inputStyle('status'),
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 16px center',
                      backgroundSize: '20px',
                      paddingRight: '50px',
                    }}
                    value={status}
                    onChange={handleStatusChange}
                    onFocus={() => setFocusedField('status')}
                    onBlur={() => setFocusedField(null)}
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

                {/* Clear All Button */}
                <button
                  style={{
                    background: `linear-gradient(135deg, var(--error-primary) 0%, var(--error-dark) 100%)`,
                    color: '#ffffff',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: `0 12px 24px var(--error-40)`,
                    width: '100%',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '16px',
                  }}
                  onClick={handleClearAll}
                >
                  <FaTrashAlt size={16} />
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StatusFilter;
