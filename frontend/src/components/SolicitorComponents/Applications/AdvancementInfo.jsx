import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../GenericFunctions/HelperGenericFunctions';

const AdvancementInfo = ({ advancement }) => {
  console.log(advancement);
  return (
    <div key={advancement.id} className='card my-3 shadow'>
      <div className='card-body bg-dark-subtle'>
        <div className=' card-header text-center'>
          <h4 className='card-title '>Advancement ID: {advancement.id}</h4>
        </div>

        <div className='row mt-1 text-end'>
          <div className=' col-auto'>
            <span
              className={`badge shadow ${
                !advancement.is_settled ? 'bg-warning' : 'bg-success'
              }`}
            >
              {' '}
              <strong>Is Settled:</strong>{' '}
              {advancement.is_settled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className=' col-auto'>
            <span className='badge bg-info shadow'>
              {' '}
              <strong>Settled Date:</strong>{' '}
              {advancement.settled_date ? advancement.settled_date : 'N/A'}
            </span>
          </div>
        </div>
        <div className='row mt-3'>
          {/* IDs Column */}
          <div className='col-md-6'>
            <table className='table table-sm table-striped table-hover shadow'>
              <tbody>
                <tr>
                  <td>
                    <strong>Approved Date:</strong>{' '}
                    {formatDate(advancement.approved_date)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Term agreed:</strong> {advancement.term_agreed}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Maturity Date:</strong>{' '}
                    {formatDate(advancement.maturity_date)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amounts Column */}
          <div className='col-md-6'>
            <table className='table table-sm table-striped table-hover shadow'>
              <tbody>
                <tr>
                  <td>
                    <strong>Amount Agreed:</strong> {advancement.currency_sign}{' '}
                    {advancement.amount_agreed}
                  </td>
                </tr>
                <tr className=' border border-2 border-warning'>
                  <td>
                    <strong>Fee Agreed:</strong> {advancement.currency_sign}{' '}
                    {advancement.fee_agreed}
                  </td>
                </tr>
                {advancement.extension_fees_total > 0 && (
                  <tr className=' border border-2 border-warning'>
                    <td>
                      <strong>Extension Fees Total:</strong>{' '}
                      {advancement.currency_sign}{' '}
                      {advancement.extension_fees_total}
                    </td>
                  </tr>
                )}
                {advancement.amount_paid > 0 && (
                  <tr>
                    <td>
                      <strong>Amount Paid:</strong> {advancement.currency_sign}{' '}
                      {advancement.amount_paid}
                    </td>
                  </tr>
                )}

                <tr className=' border border-2 border-info'>
                  <td>
                    <strong>Current Balance:</strong>{' '}
                    {advancement.currency_sign} {advancement.current_balance}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancementInfo;
