import { useEffect, useState } from 'react';

import { FaFileAlt, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import Application from './Application';

import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../../store/userSlice';
import PaginationComponent from '../../GenericComponents/PaginationComponent';
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
      <div
        className='min-vh-100 d-flex justify-content-center align-items-center'
        style={{ backgroundColor: '#f8fafc' }}
      >
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className='min-vh-100' style={{ backgroundColor: '#1F2049' }}>
      <div className='container-fluid px-4 py-4'>
        {/* Header Section */}
        <div
          className='card border-0 mb-4'
          style={{
            borderRadius: window.innerWidth <= 768 ? '12px' : '16px',
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            overflow: 'hidden',
            margin: window.innerWidth <= 768 ? '0 8px 16px 8px' : undefined,
          }}
        >
          <div
            className='card-body'
            style={{
              padding: window.innerWidth <= 768 ? '16px 12px' : '24px',
            }}
          >
            <div className='row align-items-center' style={{ margin: '0' }}>
              <div
                className='col-12 col-md-8'
                style={{
                  paddingLeft: window.innerWidth <= 768 ? '0' : undefined,
                  paddingRight: window.innerWidth <= 768 ? '0' : undefined,
                }}
              >
                <div
                  className='d-flex align-items-center mb-2'
                  style={{
                    flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
                    textAlign: window.innerWidth <= 480 ? 'center' : 'left',
                  }}
                >
                  <div
                    className='rounded-circle d-flex align-items-center justify-content-center'
                    style={{
                      width: window.innerWidth <= 768 ? '40px' : '48px',
                      height: window.innerWidth <= 768 ? '40px' : '48px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      marginRight: window.innerWidth <= 480 ? '0' : '12px',
                      marginBottom: window.innerWidth <= 480 ? '8px' : '0',
                    }}
                  >
                    <FaFileAlt size={window.innerWidth <= 768 ? 16 : 20} />
                  </div>
                  <div>
                    <h2
                      className='mb-0 fw-bold'
                      style={{
                        fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
                        lineHeight: window.innerWidth <= 768 ? '1.3' : '1.2',
                      }}
                      dangerouslySetInnerHTML={{ __html: pagerTitle }}
                    ></h2>
                    <p
                      className='mb-0 opacity-75'
                      style={{
                        fontSize: window.innerWidth <= 768 ? '0.85rem' : '1rem',
                        marginTop: window.innerWidth <= 768 ? '2px' : '0',
                      }}
                    >
                      <span className='fw-semibold'>{totalItems}</span> total
                      applications
                    </p>
                  </div>
                </div>

                {isFiltered && (
                  <button
                    className='btn btn-link text-white text-decoration-underline p-0 fw-medium opacity-75'
                    style={{
                      fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.9rem',
                      marginTop: window.innerWidth <= 480 ? '8px' : '0',
                    }}
                    onClick={handleClearAllFilters}
                    onMouseOver={(e) => {
                      e.target.style.opacity = '1';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.opacity = '0.75';
                    }}
                  >
                    <FaTimes
                      className='me-1'
                      size={window.innerWidth <= 768 ? 10 : 12}
                    />
                    Clear all filters
                  </button>
                )}
              </div>

              <div
                className='col-12 col-md-4'
                style={{
                  textAlign: window.innerWidth <= 768 ? 'center' : 'right',
                  marginTop: window.innerWidth <= 768 ? '16px' : '0',
                  paddingLeft: window.innerWidth <= 768 ? '0' : undefined,
                  paddingRight: window.innerWidth <= 768 ? '0' : undefined,
                }}
              >
                <button
                  className='btn fw-semibold'
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: window.innerWidth <= 768 ? '10px' : '12px',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    fontSize: window.innerWidth <= 768 ? '0.9rem' : '1rem',
                    padding:
                      window.innerWidth <= 768 ? '12px 20px' : '12px 16px',
                    width: window.innerWidth <= 480 ? '100%' : 'auto',
                    minWidth:
                      window.innerWidth <= 768 && window.innerWidth > 480
                        ? '140px'
                        : 'auto',
                  }}
                  onClick={addApplicationHandler}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <FaPlus
                    className='me-2'
                    size={window.innerWidth <= 768 ? 14 : 16}
                  />
                  Add Application
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className='mb-4'>
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
            className='alert border-0 text-center mb-4'
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(239, 68, 68, 0.1)',
              fontWeight: '500',
            }}
            role='alert'
          >
            <div className='d-flex align-items-center justify-content-center'>
              <i className='fas fa-exclamation-triangle me-2'></i>
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
                  <div className='mb-4'>
                    {applications.map((application) => (
                      <Application
                        key={application.id}
                        application={application}
                        onDelete={refreshApplications}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div
                    className='card border-0'
                    style={{
                      borderRadius: '12px',
                      boxShadow:
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div className='card-body p-3'>
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
                </div>
              </div>
            ) : (
              /* Empty State */
              <div
                className='card border-0 text-center'
                style={{
                  borderRadius: '16px',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  backgroundColor: '#ffffff',
                  padding: '3rem 2rem',
                }}
              >
                <div
                  className='rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4'
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                  }}
                >
                  <FaSearch size={32} />
                </div>
                <h4 className='fw-bold text-slate-700 mb-2'>
                  No Applications Found
                </h4>
                <p
                  className='text-slate-500 mb-4'
                  style={{ maxWidth: '400px', margin: '0 auto' }}
                >
                  There are no applications matching the current search
                  criteria. Please adjust your filters and try again.
                </p>
                {isFiltered && (
                  <button
                    className='btn px-4 py-2 fw-medium'
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={handleClearAllFilters}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#2563eb';
                      e.target.style.transform = 'translateY(-1px)';
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
