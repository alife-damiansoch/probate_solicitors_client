
import { formatNumberWithDots } from '../Functions/helpers';
import {useState} from "react";

const HowMuch = () => {
  const [totalEstateValue, setTotalEstateValue] = useState('');
  const [maxLoan, setMaxLoan] = useState('');

  const calculateMaxLoan = (e) => {
    e.preventDefault();
    setMaxLoan(totalEstateValue * 0.6);
  };

  return (
    <div>
      <div className='card border-0'>
        <div className='card-header bg-white border-0 text-center'>
          <h5 className='title text-primary-emphasis mt-5 text-center text-decoration-underline'>
            How much can I release early?
          </h5>
        </div>
        <div className='card-body bg-white'>
          <div className=''>
            <form onSubmit={calculateMaxLoan}>
              <div className='row'>
                <div className='mb-3 mx-auto col-12 col-md-7'>
                  <div className='input-group input-group-sm border border-2 border-dark-subtle'>
                    <input
                      type='text'
                      className='form-control text-center'
                      id='estateValue'
                      placeholder='Total Value Of The Estate'
                      value={totalEstateValue}
                      onChange={(e) => setTotalEstateValue(e.target.value)}
                    />
                    <button className='btn btn-outline-primary' type='submit'>
                      Calculate
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {maxLoan !== '' && maxLoan !== 0 ? (
            <div>
              <div className='alert text-center bg-white text-dark-emphasis mt-md-0 mt-1'>
                <h5>The maximum amount of money that can be advanced </h5>
                <h1 className='text-warning'>
                  €{formatNumberWithDots(maxLoan)}
                </h1>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowMuch;
