import { MdDoneAll } from 'react-icons/md';
import { TbFaceIdError } from 'react-icons/tb';
import { MdOutlineBookmarkAdded } from 'react-icons/md';
import { GrDocumentUpdate } from 'react-icons/gr';
import { LiaExclamationTriangleSolid } from 'react-icons/lia';
import { IoDocumentsOutline } from 'react-icons/io5';
import { BsExclamationOctagon } from 'react-icons/bs';
import { FcApproval } from 'react-icons/fc';
import { TbArrowMoveDown } from 'react-icons/tb';
import { PiDotDuotone } from 'react-icons/pi';
import { FaArrowsDownToPeople } from 'react-icons/fa6';
import { MdPersonAddAlt } from 'react-icons/md';

import { formatDate } from '../../../GenericFunctions/HelperGenericFunctions';

import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import Popover from './Popover';
import {
  advancementAgreementsInfo,
  approvedByCommitteeInfo,
  approvedInfo,
  awaitingCommitteeDecisionInfo,
  awaitingDecissionInfo,
  documentsInfo,
  rejectedByCommitteeInfo,
  rejectedInfo,
  solicitorInfo,
  submittedInfo,
  undertakingAgreementsInfo,
} from './StagesPopoverInfo';

import { motion } from 'framer-motion';

const ApplicationDetailStages = ({ application, setHighlightedSectionId }) => {
  // Define the animation variants for the pulsing effect

  const stageArrow = () => {
    return (
      <div className='flex-grow-1 d-flex align-items-center justify-content-center icon-shadow'>
        <TbArrowMoveDown size={30} color='white' className=' icon-shadow' />
      </div>
    );
  };
  const stageDot = () => {
    return (
      <div className='flex-grow-1 d-flex align-items-center justify-content-center icon-shadow'>
        <PiDotDuotone size={30} color='white' className=' icon-shadow' />
      </div>
    );
  };
  const renderInputWithIcon = (
    label,
    value,
    condition,
    icon,
    html_info_text = 'No info provided',
    html_info_text_header = 'No header provided'
  ) => {
    if (label !== 'Rejected') {
      return (
        <div className='my-3 w-100 mx-0 text-center p-2 border-top border-bottom border-2 border-info rounded shadow'>
          <div className='flex-grow-1 d-flex align-items-center text-center justify-content-center'>
            <Popover content={html_info_text} header={html_info_text_header}>
              <label
                style={{ cursor: 'pointer' }}
                className='form-label w-100 mt-3'
              >
                <div>{icon}</div>
                <small
                  className='text-nowrap text-light'
                  dangerouslySetInnerHTML={{ __html: label }}
                ></small>

                <div
                  className='input-icon-wrapper mt-3 w-100'
                  id='input-icon-wrapper'
                >
                  <div
                    id='input-field'
                    className={`form-control rounded-bottom-pill text-center text-light shadow w-100 ${
                      condition ? 'bg-success' : 'bg-danger'
                    }`}
                    dangerouslySetInnerHTML={{ __html: value }}
                  ></div>
                  {condition ? (
                    <MdDoneAll
                      size={30}
                      color='darkgreen'
                      className='icon icon-shadow'
                      id='input-icon'
                    />
                  ) : (
                    <LiaExclamationTriangleSolid
                      size={30}
                      color='red'
                      className='icon icon-shadow'
                      id='input-icon'
                    />
                  )}
                </div>
              </label>
            </Popover>
          </div>
        </div>
      );
    }

    return (
      <div className='my-3 w-100 text-center p-2 border-top border-bottom border-2 border-info rounded shadow'>
        <div className='flex-grow-1 d-flex align-items-center text-center justify-content-center '>
          <Popover content={html_info_text} header={html_info_text_header}>
            <label
              style={{ cursor: 'pointer' }}
              className='form-label text-center align-items-center justify-content-center w-100 mt-3'
            >
              <div>{icon}</div>
              <small
                className='text-nowrap text-light'
                dangerouslySetInnerHTML={{ __html: label }}
              ></small>
              <div
                className='input-icon-wrapper mt-3 w-100'
                id='input-icon-wrapper'
              >
                <div
                  id='input-field'
                  className={`form-control rounded-bottom-pill text-center text-light shadow w-100 ${
                    condition ? 'bg-danger' : 'bg-warning'
                  }`}
                  dangerouslySetInnerHTML={{ __html: value }}
                ></div>
                {condition && (
                  <TbFaceIdError
                    size={30}
                    color='darkred'
                    className='icon icon-shadow'
                    id='input-icon'
                  />
                )}
              </div>
            </label>
          </Popover>
        </div>
      </div>
    );
  };

  return (
    <>
      {application ? (
        <div className=' hide-on-mobile col-lg-3'>
          <div
            className='card rounded bg-transparent my-2 mx-auto
                           px-4 border-0 shadow position-relative h-100'
          >
            <div className=' card-header text-center text-light w-100'>
              <h5 className=' icon-shadow'>
                Application
                <br />
                <br /> Journey
              </h5>
            </div>

            <div className='d-flex flex-column w-100 h-100  align-items-center my-5 '>
              {/* SUBMITTED PART */}
              <div
                className='col-12'
                onClick={() => {
                  setHighlightedSectionId('Basic Details'); // Replace with your current section ID
                }}
              >
                {renderInputWithIcon(
                  'Submitted',
                  formatDate(application.date_submitted),
                  application.amount &&
                    application.term &&
                    application.deceased?.first_name &&
                    application.deceased?.last_name &&
                    application.applicants?.length > 0 &&
                    application.estates?.length > 0,
                  <MdOutlineBookmarkAdded
                    size={30}
                    color={
                      application.amount &&
                      application.term &&
                      application.deceased?.first_name &&
                      application.deceased?.last_name &&
                      application.applicants?.length > 0 &&
                      application.estates?.length > 0
                        ? 'green'
                        : 'red'
                    }
                    className='icon-shadow'
                  />,
                  submittedInfo.message,
                  submittedInfo.header
                )}
              </div>

              <div className='d-flex flex-grow-1 flex-column w-100  justify-content-evenly align-items-center'>
                {stageDot()}
                {stageArrow()}
                {stageDot()}
              </div>

              {/* SOLICITOR PART */}
              <div
                className='col-12'
                onClick={() => {
                  setHighlightedSectionId('Solicitor Part'); // Replace with your current section ID
                }}
              >
                {renderInputWithIcon(
                  'Solicitor selected',
                  application.solicitor !== null
                    ? 'OK'
                    : 'Select solicitor ...',
                  application.solicitor !== null,
                  <MdPersonAddAlt
                    size={30}
                    color={application.solicitor !== null ? 'green' : 'red'}
                    className='icon-shadow'
                  />,
                  solicitorInfo.message,
                  solicitorInfo.header
                )}
              </div>

              <div className='d-flex flex-grow-1 flex-column w-100  justify-content-evenly align-items-center'>
                {stageDot()}
                {stageArrow()}
                {stageDot()}
              </div>

              {/* UNDERTAKING PART */}
              <div
                className='col-12'
                onClick={() => {
                  setHighlightedSectionId('Uploaded Documents'); // Replace with your current section ID
                }}
              >
                {renderInputWithIcon(
                  'Undertaking<wbr /> uploaded',
                  application.undertaking_ready ? 'Uploaded' : 'Waiting ...',
                  application.undertaking_ready,
                  <GrDocumentUpdate
                    size={30}
                    color={application.undertaking_ready ? 'green' : 'red'}
                    className='icon-shadow'
                  />,
                  undertakingAgreementsInfo.message,
                  undertakingAgreementsInfo.header
                )}
              </div>

              <div className='d-flex flex-grow-1 flex-column w-100  justify-content-evenly align-items-center'>
                {stageDot()}
                {stageArrow()}
                {stageDot()}
              </div>

              {/* ADVANCEMENT PART */}
              <div
                className='col-12'
                onClick={() => {
                  setHighlightedSectionId('Uploaded Documents'); // Replace with your current section ID
                }}
              >
                {renderInputWithIcon(
                  'Advancement<wbr /> Agreement<wbr /> uploaded',
                  application.loan_agreement_ready ? 'Uploaded' : 'Waiting ...',
                  application.loan_agreement_ready,
                  <GrDocumentUpdate
                    size={30}
                    color={application.loan_agreement_ready ? 'green' : 'red'}
                    className='icon-shadow'
                  />,
                  advancementAgreementsInfo.message,
                  advancementAgreementsInfo.header
                )}
              </div>
              <div className='d-flex flex-grow-1 flex-column w-100  justify-content-evenly align-items-center'>
                {stageDot()}
                {stageArrow()}
                {stageDot()}
              </div>

              {/* GENERAL DOC PART */}
              <div
                className='col-12'
                onClick={() => {
                  setHighlightedSectionId('Uploaded Documents'); // Replace with your current section ID
                }}
              >
                {renderInputWithIcon(
                  'Documents<wbr /> Uploaded',
                  application.documents.length > 0 ||
                    application.signed_documents.length > 0
                    ? 'Uploaded'
                    : 'Waiting ...',
                  application.documents.length > 0 ||
                    application.signed_documents.length > 0,
                  <IoDocumentsOutline
                    size={30}
                    color={
                      application.documents.length > 0 ||
                      application.signed_documents.length > 0
                        ? 'green'
                        : 'red'
                    }
                    className='icon-shadow'
                  />,
                  documentsInfo.message,
                  documentsInfo.header
                )}
              </div>
              <div className='d-flex flex-grow-1 flex-column w-100  justify-content-evenly align-items-center'>
                {stageDot()}
                {stageArrow()}
                {stageDot()}
              </div>

              <div
                className='col-12'
                onClick={() => setHighlightedSectionId('')}
              >
                {/* APPROVED NEW STAGES */}
                {application.approved &&
                  application.loan &&
                  application.loan.needs_committee_approval === false &&
                  renderInputWithIcon(
                    'Approved',
                    'Approved',
                    application.approved,
                    <FcApproval
                      size={30}
                      color={'darkgreen'}
                      className='icon-shadow'
                    />,
                    approvedInfo.message,
                    approvedInfo.header
                  )}
                {application.approved &&
                  application.loan &&
                  application.loan.needs_committee_approval === true &&
                  application.loan.is_committee_approved === true &&
                  renderInputWithIcon(
                    'Approved',
                    'Approved<wbr /> by<wbr /> committee',
                    application.approved,
                    <FcApproval
                      size={30}
                      color={'darkgreen'}
                      className='icon-shadow'
                    />,
                    approvedByCommitteeInfo.message,
                    approvedByCommitteeInfo.header
                  )}

                {/* REJECTED NEW STAGES */}
                {application.is_rejected &&
                  renderInputWithIcon(
                    'Rejected',
                    'Rejected',
                    application.is_rejected,
                    <BsExclamationOctagon
                      size={30}
                      color={'red'}
                      className='icon-shadow'
                    />,
                    rejectedInfo.message,
                    rejectedInfo.header
                  )}
                {application.approved &&
                  application.loan &&
                  application.loan.needs_committee_approval === true &&
                  application.loan.is_committee_approved === false &&
                  renderInputWithIcon(
                    'Rejected',
                    'Rejected<wbr /> by<wbr /> committee',
                    true,
                    <BsExclamationOctagon
                      size={30}
                      color={'red'}
                      className='icon-shadow'
                    />,
                    rejectedByCommitteeInfo.message,
                    rejectedByCommitteeInfo.header
                  )}

                {/* AWAITIND DECISION NEW STAGES */}
                {application.is_rejected === false &&
                  application.approved === false &&
                  renderInputWithIcon(
                    'Status',
                    'Awaiting decision ...',
                    false,
                    <FaArrowsDownToPeople
                      size={30}
                      color={'red'}
                      className='icon-shadow'
                    />,
                    awaitingDecissionInfo.message,
                    awaitingDecissionInfo.header
                  )}

                {application.is_rejected === false &&
                  application.approved === true &&
                  application.loan &&
                  application.loan.needs_committee_approval === true &&
                  application.loan.is_committee_approved === null &&
                  renderInputWithIcon(
                    'Status',
                    'Awaiting<wbr /> committee<wbr /> decision ...',
                    false,
                    <FaArrowsDownToPeople
                      size={30}
                      color={'red'}
                      className='icon-shadow'
                    />,
                    awaitingCommitteeDecisionInfo.message,
                    awaitingCommitteeDecisionInfo.header
                  )}

                {/* Reason for rejection */}
                {application.is_rejected && (
                  <div className='col-12'>
                    <div className='alert  text-center rounded mt-5 text-white-50 shadow'>
                      <h6> Reason for rejection</h6>
                      <small>{application.rejected_reason}</small>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/*ANIMATED BACKGROUNG DIV */}
            <motion.div
              className='position-absolute shadow-lg'
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: '100% 50%' }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: 'mirror',
              }}
              style={{
                padding: '4px', // Ensure there's space for the border effect
                borderRadius: '12px',
                backgroundImage:
                  'linear-gradient(90deg,  #16222a, #044297,#16222a)',
                backgroundPosition: '0% 50%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '200% 200%',
                top: '0',
                left: '0',
                width: `100%`,
                height: `100%`,
                zIndex: -1,
              }}
            ></motion.div>
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default ApplicationDetailStages;
