import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

function PaginationComponent({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  onPageChange,
  setItemsPerPage,
}) {
  const [hoveredPage, setHoveredPage] = useState(null);
  const [hoveredPerPage, setHoveredPerPage] = useState(null);

  const handleSelect = (pageNum) => {
    onPageChange(pageNum);
  };

  const handlePerPageChange = (value) => {
    if (value !== itemsPerPage) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  const options = [25, 50, 100, 200];
  const pagesCount = Math.ceil(totalItems / itemsPerPage);

  // Smart pagination logic
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pagesCount - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < pagesCount - 1) {
      rangeWithDots.push('...', pagesCount);
    } else {
      rangeWithDots.push(pagesCount);
    }

    return rangeWithDots.filter(
      (page, index, arr) => arr.indexOf(page) === index
    );
  };

  const visiblePages = pagesCount > 1 ? getVisiblePages() : [1];
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Enhanced styles using theme variables
  const containerStyle = {
    background: 'var(--gradient-surface)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    borderRadius: '20px',
    border: '2px solid var(--border-secondary)',
    boxShadow: `
      0 12px 24px rgba(0, 0, 0, 0.1),
      0 6px 12px var(--primary-10),
      inset 0 1px 0 var(--white-10)
    `,
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  };

  const pageButtonStyle = (isActive = false, isDisabled = false) => ({
    background: isActive
      ? `linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%)`
      : 'var(--surface-secondary)',
    border: `2px solid ${
      isActive ? 'var(--primary-blue)' : 'var(--border-muted)'
    }`,
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: isActive ? '#ffffff' : 'var(--text-primary)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    minWidth: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 2px',
    opacity: isDisabled ? 0.5 : 1,
    boxShadow: isActive
      ? `0 6px 12px var(--primary-40), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
      : `0 2px 4px rgba(0, 0, 0, 0.05), inset 0 1px 0 var(--white-05)`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  });

  const perPageButtonStyle = (isActive = false) => ({
    background: isActive
      ? `linear-gradient(135deg, var(--success-primary) 0%, var(--success-dark) 100%)`
      : 'var(--surface-tertiary)',
    border: `2px solid ${
      isActive ? 'var(--success-primary)' : 'var(--border-muted)'
    }`,
    borderRadius: '10px',
    padding: '8px 12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: isActive ? '#ffffff' : 'var(--text-secondary)',
    cursor: isActive ? 'default' : 'pointer',
    margin: '0 2px',
    boxShadow: isActive
      ? `0 4px 8px var(--success-30), inset 0 1px 0 rgba(255, 255, 255, 0.3)`
      : `0 2px 4px rgba(0, 0, 0, 0.05)`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  });

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, var(--primary-10) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, var(--success-10) 0%, transparent 50%)
          `,
          animation: 'backgroundFloat 12s ease-in-out infinite',
          opacity: 0.6,
        }}
      />

      <div className='position-relative'>
        {/* Results Info */}
        <motion.div
          className='text-center mb-4'
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: '500',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Showing{' '}
          <span className='fw-bold' style={{ color: 'var(--text-primary)' }}>
            {startItem}
          </span>{' '}
          to{' '}
          <span className='fw-bold' style={{ color: 'var(--text-primary)' }}>
            {endItem}
          </span>{' '}
          of{' '}
          <span className='fw-bold' style={{ color: 'var(--primary-blue)' }}>
            {totalItems}
          </span>{' '}
          results
        </motion.div>

        {/* Elegant Separator */}
        <div
          style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, var(--border-muted), transparent)`,
            margin: '20px 0',
            opacity: 0.6,
          }}
        />

        {/* Main Pagination Controls */}
        <div className='d-flex flex-column flex-lg-row align-items-center justify-content-center gap-4'>
          {/* Page Navigation */}
          <motion.div
            className='d-flex align-items-center flex-wrap justify-content-center gap-1'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {/* Previous Button */}
            <motion.button
              style={pageButtonStyle(false, currentPage === 1)}
              onClick={
                currentPage > 1
                  ? () => handleSelect(currentPage - 1)
                  : undefined
              }
              disabled={currentPage === 1}
              whileHover={
                currentPage > 1
                  ? {
                      scale: 1.05,
                      borderColor: 'var(--primary-blue)',
                      boxShadow: `0 4px 8px var(--primary-20), inset 0 1px 0 var(--white-10)`,
                    }
                  : {}
              }
              whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
            >
              <ChevronLeft size={18} />
            </motion.button>

            {/* Page Numbers */}
            {visiblePages.map((page, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
              >
                {page === '...' ? (
                  <div
                    style={{
                      ...pageButtonStyle(false, true),
                      cursor: 'default',
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    <MoreHorizontal
                      size={18}
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </div>
                ) : (
                  <motion.button
                    style={pageButtonStyle(page === currentPage)}
                    onClick={() => handleSelect(page)}
                    whileHover={
                      page !== currentPage
                        ? {
                            scale: 1.05,
                            borderColor: 'var(--primary-blue)',
                            boxShadow: `0 4px 8px var(--primary-20), inset 0 1px 0 var(--white-10)`,
                          }
                        : {}
                    }
                    whileTap={{ scale: 0.95 }}
                  >
                    {page}
                  </motion.button>
                )}
              </motion.div>
            ))}

            {/* Next Button */}
            <motion.button
              style={pageButtonStyle(false, currentPage === pagesCount)}
              onClick={
                currentPage < pagesCount
                  ? () => handleSelect(currentPage + 1)
                  : undefined
              }
              disabled={currentPage === pagesCount}
              whileHover={
                currentPage < pagesCount
                  ? {
                      scale: 1.05,
                      borderColor: 'var(--primary-blue)',
                      boxShadow: `0 4px 8px var(--primary-20), inset 0 1px 0 var(--white-10)`,
                    }
                  : {}
              }
              whileTap={currentPage < pagesCount ? { scale: 0.95 } : {}}
            >
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>

          {/* Items Per Page */}
          <motion.div
            className='d-flex align-items-center gap-3'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
              }}
            >
              Per page:
            </span>
            <div className='d-flex gap-1'>
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  style={perPageButtonStyle(option === itemsPerPage)}
                  onClick={() => handlePerPageChange(option)}
                  disabled={option === itemsPerPage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                  whileHover={
                    option !== itemsPerPage
                      ? {
                          scale: 1.05,
                          borderColor: 'var(--success-primary)',
                          boxShadow: `0 4px 8px var(--success-20)`,
                        }
                      : {}
                  }
                  whileTap={option !== itemsPerPage ? { scale: 0.95 } : {}}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes backgroundFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
            opacity: 0.8;
          }
        }

        /* Smooth transitions */
        button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced focus states */
        button:focus {
          outline: none;
          box-shadow: 
            0 0 0 4px var(--primary-20),
            0 4px 8px var(--primary-30) !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .pagination-container {
            padding: 16px !important;
          }
          
          .pagination-button {
            min-width: 40px !important;
            height: 40px !important;
            font-size: 0.8rem !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default PaginationComponent;
