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

  const handleSelect = (pageNum) => {
    onPageChange(pageNum);
  };

  const options = [2, 50, 100, 200];
  const pagesCount = Math.ceil(totalItems / itemsPerPage);
  let pages = [];
  for (let number = 1; number <= pagesCount; number++) {
    pages.push(
      <li
        className={`page-item ${number === currentPage ? 'active' : ''}`}
        key={number}
        role='presentation'
      >
        <button
          className='page-link'
          style={{
            backgroundColor: hoveredPage === number ? '#f0f0f0' : 'white',
            color: hoveredPage === number ? 'black' : 'blue',
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem',
          }}
          onMouseEnter={() => setHoveredPage(number)}
          onMouseLeave={() => setHoveredPage(null)}
          onClick={() => handleSelect(number)}
        >
          {number}
        </button>
      </li>
    );
  }

  const handleClick = (value) => {
    if (value !== itemsPerPage) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  return (
    <div
      className='position-relative'
      style={{
        background: `
          linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(248, 250, 252, 0.08)),
          radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.15), transparent 50%),
          radial-gradient(circle at 70% 90%, rgba(59, 130, 246, 0.1), transparent 50%)
        `,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        boxShadow: `
          0 8px 24px rgba(0, 0, 0, 0.2),
          0 4px 8px rgba(0, 0, 0, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `,
        backdropFilter: 'blur(20px)',
        padding: '1.5rem',
      }}
    >
      {/* Animated Background Pattern */}
      <div
        className='position-absolute w-100 h-100'
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)
          `,
          opacity: 0.6,
          animation: 'float 6s ease-in-out infinite',
          borderRadius: '20px',
        }}
      />

      <div className='position-relative'>
        <hr />
        <div className='row justify-content-center'>
          <nav
            aria-label='Page navigation example'
            className='col-12 col-md-auto mx-auto'
          >
            <ul className='pagination pagination-sm flex-wrap justify-content-center'>
              <li
                className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
              >
                <button
                  className='page-link'
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  onClick={
                    currentPage > 1
                      ? () => handleSelect(currentPage - 1)
                      : undefined
                  }
                >
                  Previous
                </button>
              </li>
              {pages}
              <li
                className={`page-item ${
                  currentPage === pagesCount ? 'disabled' : ''
                }`}
              >
                <button
                  className='page-link'
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  onClick={
                    currentPage < pagesCount
                      ? () => handleSelect(currentPage + 1)
                      : undefined
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>

          <div className='col-12 text-center mt-2'>
            <div
              className='btn-group btn-group-sm'
              role='group'
              aria-label='Items per page'
            >
              {options.map((option) => (
                <button
                  key={option}
                  type='button'
                  className={`btn btn-link p-1 ${
                    option === itemsPerPage ? 'disabled' : 'text-info'
                  }`}
                  onClick={() => handleClick(option)}
                  style={{ cursor: 'pointer' }}
                >
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
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-4px) rotate(1deg);
          }
        }
      `}</style>
    </div>
  );
}

export default PaginationComponent;
