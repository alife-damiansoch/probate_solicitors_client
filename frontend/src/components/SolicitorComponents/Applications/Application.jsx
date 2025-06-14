import ApprovedBadge from '../../GenericComponents/StageBadges.jsx/ApprovedBadge';
import InProgressBadge from '../../GenericComponents/StageBadges.jsx/InProgressBadge';
import RejectedBadge from '../../GenericComponents/StageBadges.jsx/RejectedBadge';
import Stage from './Stage';

import { useNavigate } from 'react-router-dom';
import ApplicationMaturity from '../../GenericComponents/StageBadges.jsx/ApplicationMaturity';
import PaidOutBadge from '../../GenericComponents/StageBadges.jsx/PaidOutBadge';
import SettledBadge from '../../GenericComponents/StageBadges.jsx/SettledBadge';

import Cookies from 'js-cookie';
import { useState } from 'react';
import {
  FaChevronRight,
  FaClock,
  FaMoneyBillWave,
  FaUser,
} from 'react-icons/fa';
import { formatMoney } from '../../GenericFunctions/HelperGenericFunctions';

const Application = ({ application }) => {
  const [rejectedInAnyStage, setRejectedInAnyStage] = useState(false);
  const [approvedInAnyStage, setApprovedInAnyStage] = useState(false);

  const [formData] = useState({ ...application });

  const currency_sign = Cookies.get('currency_sign');

  const navigate = useNavigate();

  const applicationClickHandler = () => {
    navigate(`/applications/${formData.id}`);
  };

  // Get status colors and themes
  const getStatusTheme = () => {
    if (rejectedInAnyStage)
      return {
        gradient: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
        accent: '#ef4444',
        bg: '#fef2f2',
        text: '#991b1b',
      };
    if (approvedInAnyStage)
      return {
        gradient: 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)',
        accent: '#22c55e',
        bg: '#f0fdf4',
        text: '#166534',
      };
    return {
      gradient: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
      accent: '#3b82f6',
      bg: '#eff6ff',
      text: '#1e40af',
    };
  };

  const theme = getStatusTheme();

  return (
    <>
      {formData && (
        <div
          className='position-relative my-3'
          style={{
            borderRadius: '20px',
            background: '#ffffff',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: `3px solid ${theme.accent}`,
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
          onClick={applicationClickHandler}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow =
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow =
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          {/* Status Strip */}
          <div
            style={{
              height: '6px',
              background: theme.gradient,
              width: '100%',
            }}
          />

          {/* Status Badges */}
          <div
            className='position-absolute'
            style={{ top: '12px', right: '16px', zIndex: 3 }}
          >
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
          </div>

          {/* Main Content */}
          <div className='p-4'>
            {/* Header Row */}
            <div className='row align-items-center mb-3'>
              {/* Applicant Info */}
              <div className='col-lg-5 col-md-6'>
                <div className='d-flex align-items-center'>
                  <div
                    className='rounded-circle d-flex align-items-center justify-content-center me-3 position-relative'
                    style={{
                      width: '48px',
                      height: '48px',
                      background: theme.gradient,
                      color: 'white',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <FaUser size={18} />
                    <div
                      className='position-absolute rounded-circle d-flex align-items-center justify-content-center'
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#ffffff',
                        color: theme.accent,
                        fontSize: '10px',
                        fontWeight: 'bold',
                        bottom: '-2px',
                        right: '-2px',
                        border: '2px solid white',
                      }}
                    >
                      {formData.id}
                    </div>
                  </div>
                  <div>
                    <h6
                      className='mb-0 fw-bold text-gray-900'
                      style={{ fontSize: '1.1rem' }}
                    >
                      {application.applicants.length > 0
                        ? `${application.applicants[0].title} ${application.applicants[0].first_name} ${application.applicants[0].last_name}`
                        : 'No applicants added'}
                    </h6>
                    <small className='text-gray-500 fw-medium'>
                      Application #{formData.id}
                    </small>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className='col-lg-4 col-md-4'>
                <div className='row g-2'>
                  <div className='col-6'>
                    <div
                      className='text-center p-2 rounded-xl'
                      style={{
                        backgroundColor: `${theme.accent}10`,
                        border: `1px solid ${theme.accent}30`,
                      }}
                    >
                      <div className='d-flex align-items-center justify-content-center mb-1'>
                        <FaMoneyBillWave
                          className='me-1'
                          size={12}
                          style={{ color: theme.accent }}
                        />
                        <span
                          className='small fw-semibold'
                          style={{ color: theme.text, fontSize: '0.7rem' }}
                        >
                          AMOUNT
                        </span>
                      </div>
                      <div
                        className='fw-bold'
                        style={{ color: theme.text, fontSize: '0.9rem' }}
                      >
                        {formatMoney(formData.amount, currency_sign)}
                      </div>
                    </div>
                  </div>
                  <div className='col-6'>
                    <div
                      className='text-center p-2 rounded-xl'
                      style={{
                        backgroundColor: `${theme.accent}10`,
                        border: `1px solid ${theme.accent}30`,
                      }}
                    >
                      <div className='d-flex align-items-center justify-content-center mb-1'>
                        <FaClock
                          className='me-1'
                          size={12}
                          style={{ color: theme.accent }}
                        />
                        <span
                          className='small fw-semibold'
                          style={{ color: theme.text, fontSize: '0.7rem' }}
                        >
                          TERM
                        </span>
                      </div>
                      <div
                        className='fw-bold'
                        style={{ color: theme.text, fontSize: '0.9rem' }}
                      >
                        {formData.term}m
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions & Maturity */}
              <div className='col-lg-3 col-md-2 text-end'>
                <div className='d-flex flex-column align-items-end'>
                  {approvedInAnyStage &&
                    application.loan !== null &&
                    application.loan.is_paid_out &&
                    !application.loan.is_settled && (
                      <div className='mb-2'>
                        <ApplicationMaturity
                          maturityDate={application.loan.maturity_date}
                        />
                      </div>
                    )}
                  <div
                    className='d-flex align-items-center px-3 py-1 rounded-pill'
                    style={{
                      backgroundColor: `${theme.accent}15`,
                      color: theme.accent,
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}
                  >
                    <span className='me-2'>View</span>
                    <FaChevronRight size={10} />
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Stages */}
            <div
              className='rounded-xl p-2'
              style={{
                backgroundColor: theme.bg,
                border: `1px solid ${theme.accent}20`,
                marginTop: '8px',
              }}
            >
              <div
                className='d-flex flex-wrap justify-content-center'
                style={{ gap: '4px' }}
              >
                {!rejectedInAnyStage && !approvedInAnyStage && (
                  <>
                    <div style={{ transform: 'scale(0.8)' }}>
                      <Stage
                        stage='Applied'
                        completed={true}
                        rejected={formData.is_rejected}
                        advancement={formData.loan}
                        setRejectedInAnyStage={setRejectedInAnyStage}
                        setApprovedInAnyStage={setApprovedInAnyStage}
                      />
                    </div>
                    <div style={{ transform: 'scale(0.8)' }}>
                      <Stage
                        stage='Undertaking Ready'
                        completed={formData.undertaking_ready}
                        rejected={formData.is_rejected}
                        advancement={formData.loan}
                        setRejectedInAnyStage={setRejectedInAnyStage}
                        setApprovedInAnyStage={setApprovedInAnyStage}
                      />
                    </div>
                    <div style={{ transform: 'scale(0.8)' }}>
                      <Stage
                        stage='Agreement Ready'
                        completed={formData.loan_agreement_ready}
                        rejected={formData.is_rejected}
                        advancement={formData.loan}
                        setRejectedInAnyStage={setRejectedInAnyStage}
                        setApprovedInAnyStage={setApprovedInAnyStage}
                      />
                    </div>
                  </>
                )}

                {formData.approved === false &&
                formData.is_rejected === false ? (
                  <div style={{ transform: 'scale(0.8)' }}>
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
                  <div style={{ transform: 'scale(0.8)', width: '100%' }}>
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
                  <div style={{ transform: 'scale(0.8)' }}>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Application;
