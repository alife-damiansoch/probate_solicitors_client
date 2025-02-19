import { useEffect, useState } from 'react';

import Application from './Application';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import { useNavigate } from 'react-router-dom';
import { MdAddchart } from 'react-icons/md';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';

import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../../store/userSlice';
import PaginationComponent from '../../GenericComponents/PaginationComponent';
import StatusFilter from './FilterringApplication.jsx/StatusFilter';

const Applications = () => {
  const token = Cookies.get('auth_token');
  const [applications, setApplications] = useState(null);
  // const [filteredApplications, setFilteredApplications] = useState(null);

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
        // console.log(response);

        if (response && response.status === 200) {
          setApplications(response.data.results);
          // setFilteredApplications(response.data.results);
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

  // console.log(applications);

  const addApplicationHandler = () => {
    navigate('/addApplication');
  };

  const refreshApplications = () => {
    setRefresh((prev) => !prev);
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Make request to your API with updated pageNumber
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <div>
        <div className='text-center my-3'>
          <h1
            className='text-center my-3'
            dangerouslySetInnerHTML={{
              __html: `${pagerTitle} <br />(${totalItems})`,
            }}
          ></h1>
          {isFiltered && (
            <button
              className='btn btn-link text-info text-decoration-underline p-0'
              onClick={handleClearAllFilters} // Call your function to clear filters
            >
              Clear all filters
            </button>
          )}
        </div>
        <div className='row'>
          <div className=' col-md-6 mx-auto my-2'>
            <button
              className=' btn btn-info w-100 shadow'
              onClick={addApplicationHandler}
            >
              <MdAddchart size={20} className=' mx-3' />
              Add application
            </button>
          </div>
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

        {errors && (
          <div className='alert alert-danger'>
            <div className={`alert text-center text-danger`} role='alert'>
              {renderErrors(errors)}
            </div>
          </div>
        )}

        {applications ? (
          <>
            {applications.length > 0 ? (
              <>
                {applications.map((application) => (
                  <Application
                    key={application.id}
                    application={application}
                    onDelete={refreshApplications}
                  />
                ))}
                <PaginationComponent
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  setItemsPerPage={setItemsPerPage}
                />
              </>
            ) : (
              <div className='alert alert-info text-center' role='alert'>
                <strong>No Applications Found</strong>
                <br />
                There are no applications matching the current search criteria.
                Please adjust your filters and try again.
              </div>
            )}
          </>
        ) : (
          <LoadingComponent />
        )}
      </div>
    </>
  );
};

export default Applications;
