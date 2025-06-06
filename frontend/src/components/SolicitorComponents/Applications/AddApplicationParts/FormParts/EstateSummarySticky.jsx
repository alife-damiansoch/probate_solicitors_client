import { toNumber } from './EstatesPart';

export default function EstateSummarySticky({
  netIrishEstate,
  lendableIrishEstate,
  formData,
  currency_sign,
}) {
  const requested = toNumber(formData.amount);
  const limit = lendableIrishEstate * 0.5;
  return (
    <div className='estate-summary-sticky'>
      <div className='estate-summary-sticky-content'>
        <div className='estate-summary-group'>
          <div>
            <span className='fw-bold'>Net Irish Estate: </span>
            <span>
              {currency_sign}
              {netIrishEstate.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div>
            <span className='fw-bold'>
              Lendable Irish Estate<sup>*</sup>:{' '}
            </span>
            <span>
              {currency_sign}
              {lendableIrishEstate.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div>
            <span className='fw-bold'>Maximum Advance (50%): </span>
            <span>
              {currency_sign}
              {(lendableIrishEstate * 0.5).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
        <div
          className='estate-summary-group'
          style={{ minWidth: 250, textAlign: 'right' }}
        >
          {(() => {
            if (lendableIrishEstate <= 0) {
              return (
                <div className='text-danger mt-2 small'>
                  Please enter estate details to calculate advance eligibility.
                </div>
              );
            }
            if (requested <= 0) {
              return (
                <div className='text-danger mt-2 small'>
                  Please enter the requested advance amount above.
                </div>
              );
            }
            if (requested > limit) {
              return (
                <div className='text-danger mt-2 small'>
                  <strong>
                    Requested amount exceeds the maximum allowed advance.
                  </strong>
                  <br />
                  The maximum advance currently offered is{' '}
                  <strong>50% of the Lendable Irish Estate</strong>.<br />
                  Please adjust the requested amount or estate details.
                </div>
              );
            }
            return (
              <div className='text-success mt-2 small'>
                <strong>
                  Requested amount is within the maximum allowed advance.
                </strong>
                <br />
                You can proceed with your application.
              </div>
            );
          })()}
          <small className='form-text mt-2' style={{ display: 'block' }}>
            <sup>*</sup> Only certain estate items are considered lendable.{' '}
            <br /> This may change; ask your agent for more info.
          </small>
        </div>
      </div>
    </div>
  );
}
