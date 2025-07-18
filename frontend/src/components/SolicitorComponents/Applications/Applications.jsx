import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import {
  FaChartLine,
  FaLayerGroup,
  FaRocket,
  FaSearch,
  FaStar,
  FaTimes,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../../store/userSlice';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import PaginationComponent from '../../GenericComponents/PaginationComponent';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import Application from './Application';
import StatusFilter from './FilterringApplication.jsx/StatusFilter';

const Applications = () => {
  const token = Cookies.get('auth_token');
  const [applications, setApplications] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [errors, setErrors] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  //status to filter applications
  const [status, setStatus] = useState('');
  const [searchId, setSearchId] = useState(null);
  const [applicantDetailSearch, setApplicantDetailSearch] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [pagerTitle, setPageTitle] = useState('All applications');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser);
  }, [token, dispatch]);

  // fetching all applications when component renders
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setErrors('');
      if (token) {
        let endpoint = `/api/applications/solicitor_applications/?page_size=${itemsPerPage}&page=${currentPage}`;
        // Prioritize `searchId` over `status`
        if (searchId) {
          endpoint += `&search_id=${searchId}`;
        } else if (status !== '' || applicantDetailSearch !== '') {
          if (status !== '') {
            endpoint += `&status=${status}`;
          }
          if (applicantDetailSearch !== '') {
            endpoint += `&search_term=${applicantDetailSearch}`;
          }
        }
        const response = await fetchData(token, endpoint);

        if (response && response.status === 200) {
          setApplications(response.data.results);
          setTotalItems(response.data.count);
          setIsLoading(false);
        } else {
          // Transforming errors into an array of objects
          setErrors([
            {
              message:
                response?.message === 'Network Error'
                  ? 'Unable to connect to server. Please try again later.'
                  : response?.data || 'An unknown error occurred',
            },
          ]);
          setIsLoading(false);
        }
      }
    };

    fetchApplications();
  }, [
    token,
    refresh,
    currentPage,
    itemsPerPage,
    status,
    searchId,
    applicantDetailSearch,
  ]);

  const handleClearAllFilters = () => {
    setStatus('');
    setSearchId(null);
    setApplicantDetailSearch('');
    setIsFiltered(false);
    setPageTitle('All applications');
  };

  const addApplicationHandler = () => {
    navigate('/addApplication');
  };

  const refreshApplications = () => {
    setRefresh((prev) => !prev);
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <motion.div
        className='min-vh-100 d-flex justify-content-center align-items-center'
        style={{ background: 'var(--gradient-main-bg)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingComponent />
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        background: 'var(--gradient-main-bg)',
        minHeight: '100vh',
        paddingTop: '120px',
        position: 'relative',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, var(--primary-10) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, var(--success-20) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, var(--primary-20) 0%, transparent 40%)
          `,
          animation: 'backgroundFloat 20s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      <div
        className='container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-4 position-relative'
        style={{ zIndex: 1 }}
      >
        {/* Compact Modern Header Section */}
        <motion.div
          className='mb-4'
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
        >
          <div
            className='card border-0'
            style={{
              background: `
                var(--gradient-surface),
                linear-gradient(135deg, var(--primary-20) 0%, var(--success-20) 50%, var(--primary-30) 100%)
              `,
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderRadius: '24px',
              border: '1px solid var(--border-primary)',
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.2),
                0 10px 20px var(--primary-20),
                0 5px 10px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 var(--white-10)
              `,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Animated Header Background */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  linear-gradient(45deg, transparent, var(--primary-20), transparent, var(--success-20), transparent),
                  radial-gradient(circle at 30% 20%, var(--primary-30), transparent 50%),
                  radial-gradient(circle at 70% 80%, var(--success-30), transparent 50%)
                `,
                animation: 'headerGlow 8s ease-in-out infinite',
                opacity: 0.6,
              }}
            />

            <div className='card-body p-3 p-md-4 position-relative'>
              <div className='row align-items-center g-0'>
                <div className='col-12 col-lg-8'>
                  <div className='d-flex flex-column flex-sm-row align-items-sm-center mb-2'>
                    {/* Compact Floating Icon */}
                    <motion.div
                      className='d-flex align-items-center justify-content-center mb-2 mb-sm-0 me-sm-3'
                      style={{
                        width: '56px',
                        height: '56px',
                        background: `
                          linear-gradient(145deg, var(--primary-blue) 0%, var(--success-primary) 100%),
                          radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent)
                        `,
                        borderRadius: '18px',
                        boxShadow: `
                          0 12px 24px var(--primary-40),
                          0 6px 12px rgba(0, 0, 0, 0.15),
                          inset 0 2px 4px rgba(255, 255, 255, 0.3)
                        `,
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                      }}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
                      whileHover={{
                        scale: 1.05,
                        rotate: 5,
                      }}
                    >
                      <FaLayerGroup size={24} style={{ color: '#ffffff' }} />
                    </motion.div>

                    <div className='text-center text-sm-start flex-grow-1'>
                      <motion.h1
                        className='mb-1 fw-bold'
                        style={{
                          fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                          background: `
                            linear-gradient(135deg, var(--text-primary) 0%, var(--primary-blue) 50%, var(--success-primary) 100%)
                          `,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          letterSpacing: '-0.01em',
                          lineHeight: '1.2',
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        dangerouslySetInnerHTML={{ __html: pagerTitle }}
                      />

                      <motion.div
                        className='d-flex align-items-center justify-content-center justify-content-sm-start gap-2 flex-wrap'
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      >
                        <div
                          className='px-2 py-1 rounded-pill d-flex align-items-center'
                          style={{
                            background: 'var(--success-20)',
                            border: '1px solid var(--success-30)',
                            backdropFilter: 'blur(10px)',
                            fontSize: '0.8rem',
                          }}
                        >
                          <FaChartLine
                            className='me-1'
                            style={{ color: 'var(--success-primary)' }}
                            size={12}
                          />
                          <span
                            style={{
                              color: 'var(--text-primary)',
                              fontWeight: '600',
                            }}
                          >
                            {totalItems} Total
                          </span>
                        </div>

                        <div
                          className='px-2 py-1 rounded-pill d-flex align-items-center'
                          style={{
                            background: 'var(--primary-20)',
                            border: '1px solid var(--primary-30)',
                            backdropFilter: 'blur(10px)',
                            fontSize: '0.8rem',
                          }}
                        >
                          <FaStar
                            className='me-1'
                            style={{ color: 'var(--primary-blue)' }}
                            size={12}
                          />
                          <span
                            style={{
                              color: 'var(--text-primary)',
                              fontWeight: '600',
                            }}
                          >
                            Active
                          </span>
                        </div>

                        {/* Clear Filters - Inline */}
                        <AnimatePresence>
                          {isFiltered && (
                            <motion.button
                              className='btn btn-link p-1 d-flex align-items-center'
                              style={{
                                color: 'var(--error-primary)',
                                textDecoration: 'none',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                background: 'var(--error-20)',
                                border: '1px solid var(--error-30)',
                                borderRadius: '12px',
                                paddingLeft: '8px',
                                paddingRight: '8px',
                              }}
                              onClick={handleClearAllFilters}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaTimes className='me-1' size={10} />
                              Clear filters
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Compact Add Button */}
                <div className='col-12 col-lg-4 text-center text-lg-end mt-3 mt-lg-0'>
                  <motion.button
                    className='btn fw-semibold d-flex align-items-center justify-content-center mx-auto mx-lg-0 ms-lg-auto'
                    style={{
                      background: `
                        linear-gradient(135deg, var(--primary-blue) 0%, var(--success-primary) 100%),
                        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent)
                      `,
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      padding: '12px 24px',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      boxShadow: `
                        0 10px 20px var(--primary-40),
                        0 5px 10px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3)
                      `,
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      position: 'relative',
                      overflow: 'hidden',
                      minWidth: '180px',
                    }}
                    onClick={addApplicationHandler}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: `
                        0 14px 28px var(--primary-50),
                        0 7px 14px rgba(0, 0, 0, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.4)
                      `,
                    }}
                    whileTap={{ scale: 0.98 }}
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
                          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                        animation: 'buttonShimmer 3s infinite',
                      }}
                    />
                    <FaRocket className='me-2' size={14} />
                    Add Application
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Error Messages */}
        <AnimatePresence>
          {errors && (
            <motion.div
              className='alert border-0 mb-4'
              style={{
                background: 'var(--error-20)',
                color: 'var(--error-primary)',
                borderRadius: '16px',
                border: '1px solid var(--error-30)',
                boxShadow: `
                  0 8px 16px var(--error-20),
                  0 4px 8px rgba(0, 0, 0, 0.1)
                `,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              role='alert'
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className='d-flex align-items-center justify-content-center fw-semibold'>
                <i className='fas fa-exclamation-triangle me-3' />
                {renderErrors(errors)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Applications Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          {applications ? (
            <>
              {applications.length > 0 ? (
                <div className='row'>
                  <div className='col-12'>
                    {/* Applications List */}
                    <motion.div
                      className='mb-4'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    >
                      {applications.map((application, index) => (
                        <motion.div
                          key={application.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 1.3 + index * 0.05,
                            duration: 0.4,
                          }}
                        >
                          <Application
                            application={application}
                            onDelete={refreshApplications}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Enhanced Pagination */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                    >
                      <PaginationComponent
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setItemsPerPage={setItemsPerPage}
                      />
                    </motion.div>
                  </div>
                </div>
              ) : (
                /* Compact Empty State */
                <motion.div
                  className='card border-0 text-center'
                  style={{
                    background: 'var(--gradient-surface)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    borderRadius: '20px',
                    border: '1px solid var(--border-secondary)',
                    boxShadow: `
                      0 16px 32px rgba(0, 0, 0, 0.1),
                      0 8px 16px var(--primary-10),
                      inset 0 1px 0 var(--white-10)
                    `,
                    padding: '3rem 1.5rem',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
                >
                  <motion.div
                    className='d-flex align-items-center justify-content-center mx-auto mb-3'
                    style={{
                      width: '80px',
                      height: '80px',
                      background: `
                        linear-gradient(145deg, var(--primary-20) 0%, var(--success-20) 100%)
                      `,
                      borderRadius: '24px',
                      border: '2px solid var(--border-muted)',
                      boxShadow: `
                        0 12px 24px var(--primary-20),
                        inset 0 2px 4px var(--white-10)
                      `,
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.4, duration: 0.8, type: 'spring' }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                  >
                    <FaSearch
                      size={32}
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </motion.div>

                  <motion.h4
                    className='fw-bold mb-2'
                    style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    No Applications Found
                  </motion.h4>

                  <motion.p
                    className='mb-3 mx-auto'
                    style={{
                      color: 'var(--text-muted)',
                      maxWidth: '350px',
                      lineHeight: '1.5',
                      fontSize: '0.95rem',
                    }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                  >
                    No applications match your current search criteria. Please
                    adjust your filters and try again.
                  </motion.p>

                  {isFiltered && (
                    <motion.button
                      className='btn fw-medium'
                      style={{
                        background: `
                          linear-gradient(135deg, var(--primary-blue) 0%, var(--success-primary) 100%)
                        `,
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '14px',
                        color: '#ffffff',
                        padding: '10px 24px',
                        fontSize: '0.9rem',
                        boxShadow: `
                          0 6px 12px var(--primary-30),
                          inset 0 1px 0 rgba(255, 255, 255, 0.3)
                        `,
                      }}
                      onClick={handleClearAllFilters}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.7, duration: 0.5 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: `
                          0 8px 16px var(--primary-40),
                          inset 0 1px 0 rgba(255, 255, 255, 0.4)
                        `,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaTimes className='me-2' size={12} />
                      Clear All Filters
                    </motion.button>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            <div className='d-flex justify-content-center'>
              <LoadingComponent />
            </div>
          )}
        </motion.div>
      </div>
      <StatusFilter
        status={status}
        setStatus={setStatus}
        searchId={searchId}
        setSearchId={setSearchId}
        applicantDetailSearch={applicantDetailSearch}
        setApplicantDetailSearch={setApplicantDetailSearch}
        setIsFiltered={setIsFiltered}
        setPageTitle={setPageTitle}
      />

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes backgroundFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          33% { 
            transform: translateY(-20px) rotate(120deg);
            opacity: 0.8;
          }
          66% { 
            transform: translateY(10px) rotate(240deg);
            opacity: 0.7;
          }
        }
        
        @keyframes headerGlow {
          0%, 100% { 
            opacity: 0.4;
            transform: translateX(0%) rotate(0deg);
          }
          50% { 
            opacity: 0.8;
            transform: translateX(10%) rotate(180deg);
          }
        }
        
        @keyframes buttonShimmer {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }

        /* Responsive improvements */
        @media (max-width: 576px) {
          .card-body {
            padding: 1rem !important;
          }
        }
        
        /* Smooth glassmorphism effects */
        .card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card:hover {
          transform: translateY(-1px);
        }
        
        /* Enhanced focus states */
        .btn:focus {
          outline: none;
          box-shadow: 
            0 0 0 4px var(--primary-20),
            0 8px 16px var(--primary-30) !important;
        }
      `}</style>
    </motion.div>
  );
};

export default Applications;
