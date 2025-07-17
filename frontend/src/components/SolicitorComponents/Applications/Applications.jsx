import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { FaFileAlt, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
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

  // Component-level styles
  const styles = {
    mainContainer: {
      backgroundColor: '#1F2049',
      minHeight: '100vh',
    },
    headerCard: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      borderRadius: '16px',
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      color: 'white',
    },
    headerCardMobile: {
      borderRadius: '12px',
      margin: '0 8px 16px 8px',
    },
    iconCircle: {
      width: '48px',
      height: '48px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '50%',
    },
    iconCircleMobile: {
      width: '40px',
      height: '40px',
    },
    addButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)',
      color: 'white',
    },
    addButtonHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      transform: 'translateY(-2px)',
    },
    clearFiltersButton: {
      fontSize: '0.9rem',
      opacity: '0.75',
      transition: 'opacity 0.2s ease',
    },
    errorAlert: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(239, 68, 68, 0.1)',
      fontWeight: '500',
    },
    emptyStateCard: {
      borderRadius: '16px',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      backgroundColor: '#ffffff',
      padding: '3rem 2rem',
    },
    emptyStateIcon: {
      width: '80px',
      height: '80px',
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
      borderRadius: '50%',
    },
    emptyStateButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      transition: 'all 0.2s ease',
      padding: '0.5rem 1rem',
    },
    emptyStateButtonHover: {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)',
    },
    paginationCard: {
      borderRadius: '12px',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      backgroundColor: '#ffffff',
    },
  };

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
      <div className='min-vh-100 d-flex justify-content-center align-items-center bg-light'>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <div className='container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-4'>
        {/* Header Section */}
        <div
          className='card border-0 mb-3 mb-md-4'
          style={{
            ...styles.headerCard,
            ...(window.innerWidth <= 768 ? styles.headerCardMobile : {}),
          }}
        >
          <div className='card-body p-3 p-sm-4 p-md-5'>
            <div className='row align-items-center g-0'>
              <div className='col-12 col-md-8'>
                <div className='d-flex flex-column flex-sm-row align-items-sm-center align-items-center text-center text-sm-start mb-2'>
                  <div
                    className='d-flex align-items-center justify-content-center mb-2 mb-sm-0 me-sm-3'
                    style={{
                      ...styles.iconCircle,
                      ...(window.innerWidth <= 768
                        ? styles.iconCircleMobile
                        : {}),
                    }}
                  >
                    <FaFileAlt size={window.innerWidth <= 768 ? 16 : 20} />
                  </div>
                  <div>
                    <h2
                      className='mb-0 fw-bold fs-2 fs-md-1'
                      dangerouslySetInnerHTML={{ __html: pagerTitle }}
                    />
                    <p className='mb-0 opacity-75 fs-6 fs-md-5 mt-1'>
                      <span className='fw-semibold'>{totalItems}</span> total
                      applications
                    </p>
                  </div>
                </div>

                {isFiltered && (
                  <button
                    className='btn btn-link text-white text-decoration-underline p-0 fw-medium'
                    style={styles.clearFiltersButton}
                    onClick={handleClearAllFilters}
                    onMouseOver={(e) => (e.target.style.opacity = '1')}
                    onMouseOut={(e) => (e.target.style.opacity = '0.75')}
                  >
                    <FaTimes className='me-1' size={12} />
                    Clear all filters
                  </button>
                )}
              </div>

              <div className='col-12 col-md-4 text-center text-md-end mt-3 mt-md-0'>
                <button
                  className='btn fw-semibold w-100 w-sm-auto'
                  style={styles.addButton}
                  onClick={addApplicationHandler}
                  onMouseOver={(e) => {
                    Object.assign(e.target.style, styles.addButtonHover);
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <FaPlus className='me-2' size={14} />
                  Add Application
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className='mb-3 mb-md-4'>
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
        </div>

        {/* Error Messages */}
        {errors && (
          <div
            className='alert border-0 text-center mb-3 mb-md-4'
            style={styles.errorAlert}
            role='alert'
          >
            <div className='d-flex align-items-center justify-content-center'>
              <i className='fas fa-exclamation-triangle me-2' />
              {renderErrors(errors)}
            </div>
          </div>
        )}

        {/* Applications Content */}
        {applications ? (
          <>
            {applications.length > 0 ? (
              <div className='row'>
                <div className='col-12'>
                  {/* Applications List */}
                  <div className='mb-3 mb-md-4'>
                    {applications.map((application) => (
                      <Application
                        key={application.id}
                        application={application}
                        onDelete={refreshApplications}
                      />
                    ))}
                  </div>

                  {/* Pagination */}

                  <PaginationComponent
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                </div>
              </div>
            ) : (
              /* Empty State */
              <div
                className='card border-0 text-center'
                style={styles.emptyStateCard}
              >
                <div
                  className='d-flex align-items-center justify-content-center mx-auto mb-4'
                  style={styles.emptyStateIcon}
                >
                  <FaSearch size={32} />
                </div>
                <h4 className='fw-bold text-slate-700 mb-3'>
                  No Applications Found
                </h4>
                <p
                  className='text-muted mb-4 mx-auto'
                  style={{ maxWidth: '400px' }}
                >
                  There are no applications matching the current search
                  criteria. Please adjust your filters and try again.
                </p>
                {isFiltered && (
                  <button
                    className='btn fw-medium px-4 py-2'
                    style={styles.emptyStateButton}
                    onClick={handleClearAllFilters}
                    onMouseOver={(e) => {
                      Object.assign(
                        e.target.style,
                        styles.emptyStateButtonHover
                      );
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#3b82f6';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <FaTimes className='me-2' size={14} />
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className='d-flex justify-content-center'>
            <LoadingComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
