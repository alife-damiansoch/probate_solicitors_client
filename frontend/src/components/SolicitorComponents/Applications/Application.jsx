
import Stage from './Stage';
import RejectedBadge from '../../GenericComponents/StageBadges.jsx/RejectedBadge';
import ApprovedBadge from '../../GenericComponents/StageBadges.jsx/ApprovedBadge';
import InProgressBadge from '../../GenericComponents/StageBadges.jsx/InProgressBadge';

import { useNavigate } from 'react-router-dom';
import PaidOutBadge from '../../GenericComponents/StageBadges.jsx/PaidOutBadge';
import SettledBadge from '../../GenericComponents/StageBadges.jsx/SettledBadge';
import ApplicationMaturity from '../../GenericComponents/StageBadges.jsx/ApplicationMaturity';

import Cookies from 'js-cookie';
import {useState} from "react";

const Application = ({ application}) => {
  const [rejectedInAnyStage, setRejectedInAnyStage] = useState(false);
  const [approvedInAnyStage, setApprovedInAnyStage] = useState(false);

  const [formData] = useState({ ...application });

  const currency_sign = Cookies.get('currency_sign');

  const navigate = useNavigate();

  const applicationClickHandler = () => {
    navigate(`/applications/${formData.id}`);
  };

  return (
    <>
      {formData && (
        <div
          className={`application-card card  my-3 position-relative border-3  rounded bg-light shadow ${
            approvedInAnyStage
              ? 'border-success-subtle'
              : rejectedInAnyStage
              ? 'border-danger-subtle'
              : 'border-dark-subtle'
          }`}
        >
          <div className='card-body pb-0' onClick={applicationClickHandler}>
            {rejectedInAnyStage && <RejectedBadge />}
            {approvedInAnyStage &&
              application.loan !== null &&
              application.loan.is_paid_out &&
              !application.loan.is_settled && <PaidOutBadge />}
            {approvedInAnyStage &&
              application.loan !== null &&
              application.loan.is_paid_out &&
              application.loan.is_settled && <SettledBadge />}
            {approvedInAnyStage &&
              application.loan !== null &&
              !application.loan.is_paid_out && <ApprovedBadge />}
            {!approvedInAnyStage && !rejectedInAnyStage && <InProgressBadge />}
            <div className='card-header bg-dark-subtle rounded text-black  py-3 shadow'>
              <div className=' row mx-0'>
                <h4 className=' card-subtitle mt-4 mt-lg-0 mb-1 col-6'>
                  {application.applicants.length > 0
                    ? `${application.applicants[0].title} ${application.applicants[0].first_name} ${application.applicants[0].last_name} `
                    : 'No applicants added'}{' '}
                </h4>
                {approvedInAnyStage &&
                  application.loan !== null &&
                  application.loan.is_paid_out &&
                  !application.loan.is_settled && (
                    <ApplicationMaturity
                      maturityDate={application.loan.maturity_date}
                    />
                  )}
              </div>

              <h5 className=' card-subtitle mt-4 mt-lg-0 text-center'>
                (Application id: {formData.id})
              </h5>
            </div>
            <form className='mt-2'>
              <div className='row mb-2'>
                <div className='col-md-6'>
                  <label className='form-label col-12 text-black mb-1'>
                    Amount:
                    <input
                      type='text'
                      className='form-control form-control-sm rounded shadow'
                      name='amount'
                      value={`${currency_sign} ${formData.amount}`}
                      readOnly
                    />
                  </label>
                </div>
                <div className='col-md-6'>
                  <label className='form-label col-12 text-black mb-1'>
                    Initial Term:
                    <input
                      type='text'
                      className='form-control form-control-sm rounded shadow'
                      name='term'
                      value={`${formData.term} months`}
                      readOnly
                    />
                  </label>
                </div>
              </div>
            </form>
            {/* stages part */}
            <div
              className={`d-flex flex-wrap align-items-center justify-content-evenly  pt-2 rounded shadow mb-2 ${
                rejectedInAnyStage
                  ? 'border bg-danger-subtle border-2 border-danger'
                  : approvedInAnyStage
                  ? 'border bg-success-subtle border-2 border-success'
                  : 'bg-info-subtle'
              }`.trim()}
            >
              {!rejectedInAnyStage && !approvedInAnyStage && (
                <>
                  <div className='col-lg-3 col-md-4 col-sm-6 mb-2'>
                    <Stage
                      stage='Applied'
                      completed={true}
                      rejected={formData.is_rejected}
                      advancement={formData.loan}
                      setRejectedInAnyStage={setRejectedInAnyStage}
                      setApprovedInAnyStage={setApprovedInAnyStage}
                    />
                  </div>
                  <div className='col-lg-3 col-md-4 col-sm-6 mb-2'>
                    <Stage
                      stage='Undertaking Ready'
                      completed={formData.undertaking_ready}
                      rejected={formData.is_rejected}
                      advancement={formData.loan}
                      setRejectedInAnyStage={setRejectedInAnyStage}
                      setApprovedInAnyStage={setApprovedInAnyStage}
                    />
                  </div>
                  <div className='col-lg-3 col-md-4 col-sm-6 mb-2'>
                    <Stage
                      stage='Advancement Agreement Ready'
                      completed={formData.loan_agreement_ready}
                      rejected={formData.is_rejected}
                      advancement={formData.loan}
                      setRejectedInAnyStage={setRejectedInAnyStage}
                      setApprovedInAnyStage={setApprovedInAnyStage}
                    />
                  </div>
                </>
              )}

              {formData.approved === false && formData.is_rejected === false ? (
                <div className='col-lg-3 col-md-4 col-sm-6 mb-2'>
                  <Stage
                    key={`${formData.id}-${formData.loan?.is_committee_approved}`}
                    stage='Approved'
                    completed={formData.approved}
                    rejected={formData.is_rejected}
                    advancement={formData.loan}
                    setRejectedInAnyStage={setRejectedInAnyStage}
                    setApprovedInAnyStage={setApprovedInAnyStage}
                  />
                </div>
              ) : formData.is_rejected === true ? (
                <div className=' col-12 mb-2'>
                  <Stage
                    key={`${formData.id}-${formData.loan?.is_committee_approved}`}
                    stage='Approved'
                    completed={formData.approved}
                    rejected={formData.is_rejected}
                    advancement={formData.loan}
                    setRejectedInAnyStage={setRejectedInAnyStage}
                    setApprovedInAnyStage={setApprovedInAnyStage}
                  />
                </div>
              ) : formData.approved === true && formData.loan !== null ? (
                <div className=' col-lg-3 col-md-4 col-sm-6 mb-2'>
                  <Stage
                    key={`${formData.id}-${formData.loan?.is_committee_approved}`}
                    stage='Approved'
                    completed={formData.approved}
                    rejected={formData.is_rejected}
                    advancement={formData.loan}
                    setRejectedInAnyStage={setRejectedInAnyStage}
                    setApprovedInAnyStage={setApprovedInAnyStage}
                  />
                </div>
              ) : null}
            </div>
            {/* <div className=' d-flex flex-wrap align-items-center justify-content-evenly  rounded py-2'>
              <div className='col-lg-3 col-md-4 col-sm-6 mb-3'>
                <Stage stage='Applied' completed={true} />
              </div>

              <div className='col-lg-3 col-md-4 col-sm-6 mb-3'>
                <Stage
                  stage='Undertaking Uploaded'
                  completed={formData.undertaking_ready}
                />
              </div>

              <div className='col-lg-3 col-md-4 col-sm-6 mb-3'>
                <Stage
                  stage={`${application.applicants.length} Advancement ${
                    application.applicants.length > 1
                      ? 'Agreements'
                      : 'Agreement'
                  } Uploaded`}
                  completed={formData.loan_agreement_ready}
                />
              </div>

              <div className='col-lg-3 col-md-4 col-sm-6 mb-3'>
                <Stage stage='Approved' completed={formData.approved} />
              </div>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Application;
