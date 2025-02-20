import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import DeleteApplication from './DeleteApplication';
import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';

import ExpensesComponent from './ExpensesComponent';

import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import Cookies from 'js-cookie';
import RequiredDetailsPart from '../ApplicationDetailsParts/RequiredDetailsPart';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import AdvancementInfo from './AdvancementInfo';

import ApplicationDetailStages from './ApplicationDetailStages/ApplicationDetailStages';

const ApplicationDetails = () => {
  const { id } = useParams();
  const token = Cookies.get('auth_token');
  const [application, setApplication] = useState(null);
  const [advancement, setAdvancement] = useState(null);

  const [deleteAppId, setDeleteAppId] = useState('');
  const [refresh, setRefresh] = useState(false);

  const [highlitedSectionId, setHighlightedSectionId] = useState('');

  useEffect(() => {
    if (highlitedSectionId !== '') {
      // Scroll to the section with the given ID
      const targetElement = document.getElementById(highlitedSectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [highlitedSectionId]);

  useEffect(() => {
    const fetchApplication = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/applications/solicitor_applications/${id}/`;
        try {
          const response = await fetchData(access, endpoint);
          setApplication(response.data);
        } catch (error) {
          console.error('Error fetching application details:', error);
        }
      }
    };

    fetchApplication();
  }, [token, id, refresh]);
  useEffect(() => {
    const fetchAdvancementForApplication = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/loans/loans/by-application/${id}/`;
        try {
          const response = await fetchData(access, endpoint);
          if (response.status && response.status === 200) {
            setAdvancement(response.data);
          }
        } catch (error) {
          console.error('Error fetching advancement details:', error);
        }
      }
    };

    fetchAdvancementForApplication();
  }, [token, id, refresh]);

  if (!application) {
    return <LoadingComponent />;
  }

  // console.log(application);

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      <div className='row'>
        <div className='card border-0 shadow col-lg-9'>
          <div className=' card-header row mx-0 my-2 text-center bg-dark rounded-top'>
            <div className=' col-md-10 card-title text-white '>
              <h2>
                <span>
                  <strong>Application {application.id} details</strong>
                </span>
              </h2>
              {advancement && (
                <h6 className=' '>Advancement id: {advancement.id}</h6>
              )}
            </div>
            <div className='col-12 col-md-2 text-end'>
              <button
                className='btn btn-sm btn-danger shadow w-100'
                onClick={() => {
                  setDeleteAppId(id);
                }}
                disabled={application.approved || application.is_rejected}
              >
                Delete Application
              </button>
            </div>
          </div>
          {/* If advancement then advancements read only details */}
          {advancement && (
            <>
              <div className=' card-header  bg-primary-subtle'>
                <div className='card-subtitle my-2'>
                  <h3>Advancement details</h3>
                </div>
              </div>
              <div className='card-body'>
                <AdvancementInfo advancement={advancement} />
              </div>
            </>
          )}

          <div className=' card-header  bg-primary-subtle'>
            <div className='card-subtitle my-2'>
              <h3>Application details</h3>
            </div>
          </div>
          <div className='card-body p-0 p-md-2'>
            <div className='card rounded bg-light border-0 shadow'>
              <div className='card-header  rounded-top '>
                <h4 className=' card-subtitle text-info-emphasis'>
                  Required details
                </h4>
              </div>
              <div className=' card-body'>
                {deleteAppId !== '' && (
                  <div className='card-footer'>
                    <DeleteApplication
                      applicationId={deleteAppId}
                      setDeleteAppId={setDeleteAppId}
                    />
                  </div>
                )}

                {(application.approved || application.is_rejected) && (
                  <div className=' alert alert-info text-center shadow'>
                    {`On ${
                      application.approved ? 'approved' : 'rejected'
                    } applications editing is turned off. `}
                  </div>
                )}

                <RequiredDetailsPart
                  application={application}
                  setApplication={setApplication}
                  id={id}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  highlitedSectionId={highlitedSectionId}
                  setHighlightedSectionId={setHighlightedSectionId}
                />
              </div>
            </div>
            <div className='card mt-3 border-0 rounded shadow'>
              <div className='card-header  py-3  rounded-top'>
                <h3 className='card-subtitle text-black'>Optional details</h3>
              </div>
              <ExpensesComponent
                application={application}
                applicationId={id}
                existingExpenses={application.expenses}
              />
            </div>
          </div>
        </div>
        {/* detailed stages part */}

        <ApplicationDetailStages
          application={application}
          setHighlightedSectionId={setHighlightedSectionId}
        />
      </div>
    </>
  );
};

export default ApplicationDetails;
