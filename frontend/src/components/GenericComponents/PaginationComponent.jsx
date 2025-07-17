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

  // Component-level styles with cutting-edge design
  const styles = {
    container: {
      background: `
        linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(248, 250, 252, 0.08)),
        radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.15), transparent 50%),
        radial-gradient(circle at 70% 90%, rgba(59, 130, 246, 0.08), transparent 50%)
      `,
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '16px',
      boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.12),
        0 4px 16px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      backdropFilter: 'blur(20px)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.02) 0%, transparent 50%)
      `,
      opacity: 0.6,
      animation: 'float 6s ease-in-out infinite',
    },
    pageButton: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.9)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      minWidth: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 2px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden',
    },
    pageButtonActive: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      borderColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
      transform: 'scale(1.05)',
    },
    pageButtonHover: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    pageButtonDisabled: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.4)',
      cursor: 'not-allowed',
      transform: 'none',
    },
    perPageButton: {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '8px',
      padding: '6px 12px',
      fontSize: '0.8rem',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.8)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      margin: '0 2px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden',
    },
    perPageButtonActive: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      borderColor: '#10b981',
      color: 'white',
      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
      cursor: 'default',
    },
    perPageButtonHover: {
      background: 'rgba(255, 255, 255, 0.15)',
      borderColor: 'rgba(255, 255, 255, 0.25)',
      transform: 'translateY(-1px)',
    },
    infoText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '0.8rem',
      fontWeight: '500',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      marginBottom: '16px',
    },
    separator: {
      height: '1px',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      margin: '16px 0',
      border: 'none',
    },
    glowEffect: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      transition: 'left 0.4s ease',
    },
  };

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

  // Smart pagination logic - show max 7 pages
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

  return (
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern} />

      <div className='position-relative'>
        {/* Info Text */}
        <div style={styles.infoText}>
          Showing <span className='fw-bold'>{startItem}</span> to{' '}
          <span className='fw-bold'>{endItem}</span> of{' '}
          <span className='fw-bold'>{totalItems}</span> results
        </div>

        {/* Separator */}
        <hr style={styles.separator} />

        {/* Pagination Controls */}
        <div className='d-flex flex-column flex-md-row align-items-center justify-content-center gap-3'>
          {/* Page Navigation */}
          <div className='d-flex align-items-center flex-wrap justify-content-center gap-1'>
            {/* Previous Button */}
            <button
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
              }}
              onClick={
                currentPage > 1
                  ? () => handleSelect(currentPage - 1)
                  : undefined
              }
              disabled={currentPage === 1}
              onMouseEnter={(e) => {
                if (currentPage > 1) {
                  Object.assign(e.currentTarget.style, styles.pageButtonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage > 1) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            {visiblePages.map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <div style={{ ...styles.pageButton, cursor: 'default' }}>
                    <MoreHorizontal size={16} />
                  </div>
                ) : (
                  <button
                    style={{
                      ...styles.pageButton,
                      ...(page === currentPage ? styles.pageButtonActive : {}),
                      ...(hoveredPage === page && page !== currentPage
                        ? styles.pageButtonHover
                        : {}),
                    }}
                    onClick={() => handleSelect(page)}
                    onMouseEnter={() => setHoveredPage(page)}
                    onMouseLeave={() => setHoveredPage(null)}
                  >
                    <div className='glow-effect' style={styles.glowEffect} />
                    {page}
                  </button>
                )}
              </div>
            ))}

            {/* Next Button */}
            <button
              style={{
                ...styles.pageButton,
                ...(currentPage === pagesCount
                  ? styles.pageButtonDisabled
                  : {}),
              }}
              onClick={
                currentPage < pagesCount
                  ? () => handleSelect(currentPage + 1)
                  : undefined
              }
              disabled={currentPage === pagesCount}
              onMouseEnter={(e) => {
                if (currentPage < pagesCount) {
                  Object.assign(e.currentTarget.style, styles.pageButtonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage < pagesCount) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Items Per Page */}
          <div className='d-flex align-items-center gap-2'>
            <span
              style={{
                ...styles.infoText,
                marginBottom: 0,
                fontSize: '0.75rem',
              }}
            >
              Per page:
            </span>
            <div className='d-flex gap-1'>
              {options.map((option) => (
                <button
                  key={option}
                  style={{
                    ...styles.perPageButton,
                    ...(option === itemsPerPage
                      ? styles.perPageButtonActive
                      : {}),
                    ...(hoveredPerPage === option && option !== itemsPerPage
                      ? styles.perPageButtonHover
                      : {}),
                  }}
                  onClick={() => handlePerPageChange(option)}
                  onMouseEnter={() => setHoveredPerPage(option)}
                  onMouseLeave={() => setHoveredPerPage(null)}
                  disabled={option === itemsPerPage}
                >
                  <div className='glow-effect' style={styles.glowEffect} />
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-4px) rotate(1deg);
          }
        }
        
        .glow-effect {
          pointer-events: none;
        }
        
        button:hover .glow-effect {
          left: 100% !important;
        }
      `}</style>
    </div>
  );
}

export default PaginationComponent;
