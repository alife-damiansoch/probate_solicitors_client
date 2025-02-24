import { formatNumberWithDots } from '../Functions/helpers';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TbCoinEuroFilled } from 'react-icons/tb'; // Importing Euro Coin icon

const HowMuch = () => {
  const [totalEstateValue, setTotalEstateValue] = useState('');
  const [maxLoan, setMaxLoan] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [readableValue, setReadableValue] = useState('');

  const calculateMaxLoan = (e) => {
    e.preventDefault();

    // Convert to float and validate
    const estateValue = parseFloat(totalEstateValue);
    setMaxLoan('');
    if (isNaN(estateValue)) {
      setMaxLoan('error');
      return;
    }

    // Show loading effect for 1 second before displaying the result
    setIsCalculating(true);
    setTimeout(() => {
      setMaxLoan(estateValue * 0.6);
      setIsCalculating(false);
    }, 2000);
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
                      id='estateValue'
                      placeholder='Total Value Of The Estate'
                      value={totalEstateValue}
                      onChange={(e) => {
                        setTotalEstateValue(e.target.value);
                        setReadableValue(formatNumberWithDots(e.target.value));
                      }}
                      className='form-control text-center'
                      style={{
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#2c3e50',
                        textAlign: 'center',
                        letterSpacing: '1px',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    />
                    <button className='btn btn-outline-primary' type='submit'>
                      Calculate
                    </button>
                  </div>
                </div>
              </div>
            </form>
            {/* 🎉 Enhanced Coin Drop Animation with Randomized Drop Positions */}
            {isCalculating && (
              <div className='text-center mt-3'>
                <div
                  className='coin-container'
                  style={{ position: 'relative', height: '80px' }}
                >
                  {[...Array(5)].map((_, index) => {
                    const randomOffset = (Math.random() - 0.5) * 20; // ±5% from center
                    return (
                      <motion.div
                        key={index}
                        style={{
                          position: 'absolute',
                          top: '-30px',
                          left: `calc(50% + ${randomOffset}%)`, // Randomized within ±5%
                          fontSize: '35px',
                          color: '#FFD700', // Gold color for coins
                        }}
                        initial={{ y: -60, opacity: 0, scale: 1.3 }}
                        animate={{
                          y: [0, 20, -0.5, 60], // Falls down, bounces up, then drops completely
                          opacity: [0, 1, 1, 0],
                          scale: [1, 1.1, 1, 1], // Slight pop effect
                        }}
                        transition={{
                          duration: 1.5,
                          delay: index * 0.2,
                          ease: 'easeInOut',
                        }}
                      >
                        <TbCoinEuroFilled />
                      </motion.div>
                    );
                  })}
                </div>

                {/* 🟦 Smooth Animated Progress Bar */}
                <motion.div
                  className='progress-bar bg-warning mt-4 mx-auto'
                  style={{
                    height: '12px',
                    width: '50%',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <motion.div
                    className='progress-bar-fill'
                    style={{
                      height: '100%',
                      background: 'linear-gradient(to right, #ffcc00, #ff5e00)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                  />
                </motion.div>
                <h5 className='text-muted mt-2'>Calculating...</h5>
              </div>
            )}
          </div>
          {maxLoan !== '' && maxLoan !== 0 && maxLoan !== 'error' ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <div className='alert text-center bg-white text-dark-emphasis mt-md-0 mt-1'>
                <h5>The maximum amount of money that can be advanced </h5>
                <h1 className='text-warning'>
                  €{formatNumberWithDots(maxLoan)}
                </h1>
              </div>
            </motion.div>
          ) : (
            <div></div>
          )}
          {maxLoan === 'error' ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <div className='alert text-center alert-danger mt-3 w-50 mx-auto'>
                <p>Please enter a valid number</p>
              </div>
            </motion.div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowMuch;
