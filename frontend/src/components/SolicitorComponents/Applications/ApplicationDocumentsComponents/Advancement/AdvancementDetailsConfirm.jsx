import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackToApplicationsIcon from '../../../../GenericComponents/BackToApplicationsIcon';
import LoadingComponent from '../../../../GenericComponents/LoadingComponent';
import {
  fetchData,
  postPdfRequest,
} from '../../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors, {
  getEstates,
} from '../../../../GenericFunctions/HelperGenericFunctions';
import ApplicationSummaryCard from './ApplicationSummaryCard';

const AdvancementDetailsConfirm = () => {
  const token = Cookies.get('auth_token');
  const [application, setApplication] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(0);
  const [feeCounted, setFeeCounted] = useState(false);
  const [applicationErrors, setApplicationErrors] = useState([]);
  const [isGeneratingDocuments, setIsGeneratingDocuments] = useState(false);
  const [estates, setEstates] = useState([]);

  const { id } = useParams();

  // fetching application data
  useEffect(() => {
    const fetchApplication = async () => {
      if (token && id) {
        const { access } = token;
        const endpoint = `/api/applications/solicitor_applications/${id}/`;
        try {
          const response = await fetchData(access, endpoint);
          console.log('Application: ', response.data);
          setApplication(response.data);
          if (response.status !== 200) {
            console.log(response.data);
          }
        } catch (error) {
          console.error('Error fetching application details:', error);
        }
      }
    };

    fetchApplication();
  }, [token, id]);

  // setting up the default fee
  useEffect(() => {
    if (application) {
      let yearMultiplier = Math.ceil(application.term / 12);
      const calculatedFee =
        Math.round(application.amount * 0.15 * yearMultiplier * 100) / 100;
      setFee(calculatedFee);
      setFeeCounted(true);
    }
  }, [application]);

  //check application for errors
  useEffect(() => {
    const errors = [];

    // Fee validation
    if (feeCounted && fee <= 0) {
      errors.push('Fee must be greater than 0.');
    }

    // Application validations
    if (application && estates) {
      if (!application.amount || parseFloat(application.amount) <= 0) {
        errors.push('Amount must be a positive value.');
      }

      if (!application.applicants || application.applicants.length === 0) {
        errors.push('At least one applicant is required.');
      }

      if (
        !application.deceased ||
        !application.deceased.first_name ||
        !application.deceased.last_name
      ) {
        errors.push("Deceased person's first and last name must be provided.");
      }

      if (!estates || estates.length === 0) {
        errors.push('At least one estate is required.');
      }

      if (!application.solicitor) {
        errors.push('A solicitor must be assigned to the application.');
      }

      if (
        !application.term ||
        isNaN(application.term) ||
        application.term <= 0 ||
        application.term > 36
      ) {
        errors.push('Term must be an integer between 1 and 36.');
      }
    }

    // Update the application errors state
    // console.log(errors);
    setApplicationErrors(errors);
  }, [application, fee, feeCounted, estates]);

  const generateUndertakingHandler = async () => {
    setLoading(true); // Set loading to true when request starts

    const requestData = {
      application_id: application.id,
      fee_agreed_for_undertaking: fee,
    };

    try {
      setIsGeneratingDocuments(true);
      const response = await postPdfRequest(
        token,
        '/api/generate_undertaking_pdf/',
        requestData
      );

      if (response && response.status === 200) {
        // Handle PDF download
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/pdf' })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `undertaking_${application.id}.pdf`); // Set the file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.remove(); // Clean up the link after download
      } else {
        alert('Failed to generate PDF. Please check your input and try again.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      setIsGeneratingDocuments(false);
      setLoading(false); // Set loading to false when request completes
    }
  };

  // Fetch estates when application.estate_summary changes
  useEffect(() => {
    const fetchEstates = async () => {
      setLoading(true);
      try {
        const estatesData = await getEstates(application);
        console.log('Estates data fetched:', estatesData);
        setEstates(estatesData);
      } catch (error) {
        console.error('Error fetching estates:', error);
        setEstates([]);
      }
      setLoading(false);
    };

    if (application && application.estate_summary) {
      fetchEstates();
    }
  }, [application]);

  const generateAdvanceAggreementHandler = async () => {
    setLoading(true); // Set loading to true when request starts

    const requestData = {
      application_id: application.id,
      fee_agreed_for_undertaking: fee,
    };

    try {
      setIsGeneratingDocuments(true);
      const response = await postPdfRequest(
        token,
        '/api/generate_advancement_agreement_pdf/',
        requestData
      );

      if (response && response.status === 200) {
        // Determine the content type from the response headers
        const contentType = response.headers['content-type'];

        let fileExtension = '';
        let mimeType = '';

        if (contentType === 'application/pdf') {
          fileExtension = 'pdf';
          mimeType = 'application/pdf';
        } else if (contentType === 'application/zip') {
          fileExtension = 'zip';
          mimeType = 'application/zip';
        }

        // Create the download URL
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: mimeType })
        );

        // Create the download link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `advancement_agreement_${application.id}.${fileExtension}`
        ); // Set the file name with correct extension
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.remove(); // Clean up the link after download
      } else {
        alert(
          'Failed to generate file. Please check your input and try again.'
        );
      }
    } catch (error) {
      console.error('Error generating file:', error);
      alert('An error occurred while generating the file. Please try again.');
    } finally {
      setIsGeneratingDocuments(false);
      setLoading(false); // Set loading to false when request completes
    }
  };

  if (applicationErrors.length > 0) {
    console.log('Errors should be displayed');
    return (
      <>
        <BackToApplicationsIcon backUrl={-1} />
        <div className=' col-md-8 mx-auto'>
          <div className=' alert alert-danger text-center'>
            <h6>
              Before proceeding, please review the application details and
              correct the following errors:
            </h6>
            {renderErrors(applicationErrors)}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      <div className='card bg-dark-subtle shadow'>
        <div className='card-header  my-2'>
          <h4 className=' card-subtitle text-info-emphasis'>
            Check details for advancement
          </h4>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-12 col-md-8'>
              <div className='card shadow '>
                <div className='card-body '>
                  <form id='undertakingForm'>
                    <div className='form-group'>
                      <label htmlFor='fees'>Advancement fee:</label>
                      <input
                        type='number'
                        className='form-control form-control-sm'
                        id='fees'
                        name='fees'
                        placeholder='Enter Fees'
                        value={fee}
                        required
                        onChange={(e) => setFee(e.target.value)}
                        disabled={true}
                      />
                    </div>

                    <div className=' alert alert-info shadow my-2 text-center'>
                      <p>Fee is calculated: 15% of the advance per annum</p>
                    </div>
                    <div className='row my-4'>
                      {isGeneratingDocuments ? (
                        <LoadingComponent message='Generating document' />
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              generateUndertakingHandler(e);
                            }}
                            className='btn btn-primary btn-block mx-auto col-md-5'
                            disabled={loading}
                          >
                            {loading
                              ? 'Please wait...'
                              : 'Generate Undertaking Document'}
                          </button>
                          <button
                            onClick={(e) => {
                              generateAdvanceAggreementHandler(e);
                            }}
                            className='btn btn-primary btn-block mx-auto col-md-5'
                            disabled={loading}
                          >
                            {loading
                              ? 'Please wait...'
                              : 'Generate Advancement Agreement Document(s)'}
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-4 text-center mx-auto'>
              <ApplicationSummaryCard
                application={application}
                issues={issues}
                setIssues={setIssues}
                estates={estates}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancementDetailsConfirm;
