import { useEffect } from 'react';
import LoadingComponent from '../../../../GenericComponents/LoadingComponent';
import AnimatedWrapper from '../../../../GenericFunctions/AnimationFuctions';
import { formatCategoryName } from '../../../../GenericFunctions/HelperGenericFunctions';

const ApplicationSummaryCard = ({ application, setIssues, estates }) => {
  useEffect(() => {
    if (application) {
      if (!application.loan_agreement_ready) {
        const newIssues = [];

        if (!application.loan_agreement_ready) {
          newIssues.push('Advancement agreement is not ready.');
        }

        if (!application.undertaking_ready) {
          newIssues.push('Undertaking is not ready.');
        }

        if (application.signed_documents.length === 0) {
          newIssues.push('No signed documents available.');
        }

        if (
          application.value_of_the_estate_after_expenses * 0.6 <
          application.amount
        ) {
          newIssues.push(
            'Check the amounts. 60% of the total value after expenses is less than requested advancement amount.'
          );
        }

        // Update the issues state with any new issues found
        setIssues(newIssues);
      }
    }
  }, [application, setIssues]);
  console.log(application);
  return (
    <>
      {application ? (
        <AnimatedWrapper>
          <div
            className='card text-white bg-dark mb-3 mx-auto shadow'
            style={{ maxWidth: '18rem', fontSize: '0.8rem' }}
          >
            <div className='card-header'>Application Summary</div>
            <div className='card-body'>
              <h5 className='card-title'>Application ID: {application.id}</h5>
              <p className='card-text'>
                <strong>Amount:</strong> €{application.amount}
              </p>
              <p className='card-text'>
                <strong>Date Submitted:</strong>{' '}
                {new Date(application.date_submitted).toLocaleDateString()}
              </p>
              <p className='card-text'>
                <strong>Term:</strong> {application.term} months
              </p>
              <p className='card-text'>
                <strong>Deceased:</strong> {application.deceased.first_name}{' '}
                {application.deceased.last_name}
              </p>
              <p className='card-text'>
                <strong>Dispute:</strong> {application.dispute.details}
              </p>

              <div
                className='card-group p-2 mb-2'
                style={{ border: '0.5px solid grey' }}
              >
                <h6 className='card-subtitle mb-2'>Applicants</h6>
                <ul className='list-group list-group-flush'>
                  {application.applicants.map((applicant, index) => (
                    <li
                      key={index}
                      className='list-group-item bg-dark text-white'
                    >
                      <strong>{applicant.title}:</strong> {applicant.first_name}{' '}
                      {applicant.last_name} <br />
                      <strong>PPS Number:</strong> {applicant.pps_number}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className='card-group p-2 mb-2'
                style={{ border: '0.5px solid grey' }}
              >
                <h6 className='card-subtitle mb-2'>Estates</h6>
                <ul className='list-group list-group-flush'>
                  {estates &&
                    estates.map((estate, index) => (
                      <li
                        key={index}
                        className='list-group-item bg-dark text-white'
                      >
                        <strong>{formatCategoryName(estate.category)}:</strong>{' '}
                        ${estate.value}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </AnimatedWrapper>
      ) : (
        <LoadingComponent message='Liading application summary...' />
      )}
    </>
  );
};

export default ApplicationSummaryCard;
