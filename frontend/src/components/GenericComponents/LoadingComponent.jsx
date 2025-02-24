import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingComponent = ({ message = 'Loading...' }) => {
  const colors = [
    '#ff4757',
    '#ffa502',
    '#2ed573',
    '#1e90ff',
    '#3742fa',
    '#a29bfe',
  ]; // Color cycle
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const hideCursor = () => {
      document.documentElement.style.cursor = 'none'; // Hide cursor on the whole document
      document.body.style.cursor = 'none'; // Hide cursor on body
      const elements = document.querySelectorAll(
        'button, a, input, textarea, select'
      );
      elements.forEach((el) => (el.style.cursor = 'none')); // Hide cursor on all interactive elements
    };

    hideCursor(); // Ensure the cursor is hidden when loading starts

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mousemove', hideCursor); // Keep hiding cursor on movement

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousemove', hideCursor);
      document.documentElement.style.cursor = 'default'; // Restore cursor when component unmounts
      document.body.style.cursor = 'default';
      const elements = document.querySelectorAll(
        'button, a, input, textarea, select'
      );
      elements.forEach((el) => (el.style.cursor = 'default')); // Reset cursor on interactive elements
    };
  }, []);

  return (
    <>
      {/* 🖱 Mini Cursor Animation (Bouncing Dots + Message) */}
      <motion.div
        style={{
          position: 'fixed',
          top: cursorPos.y + 15, // Slight offset from cursor
          left: cursorPos.x + 15,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          pointerEvents: 'none',
          zIndex: 9999, // Always on top
        }}
      >
        {/* Mini Bouncing Dots */}
        <motion.div className='d-flex'>
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={i}
              style={{
                width: '8px',
                height: '8px',
                margin: '0 4px',
                borderRadius: '50%',
                display: 'inline-block',
                backgroundColor: colors[i % colors.length],
              }}
              animate={{
                y: [0, -8, 0], // Bouncing effect
                backgroundColor: colors[(i + 1) % colors.length], // Color transition
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* Mini Animated Loading Text */}
        <motion.p
          style={{
            fontWeight: 'bold',
            fontSize: '12px',
            color: colors[0],
            marginTop: '4px',
            textShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
          }}
          animate={{
            color: colors, // Cycle through colors
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {message}
        </motion.p>
      </motion.div>

      <div className='row'>
        <div
          className='d-flex justify-content-center align-items-center my-5'
          style={{ position: 'relative' }}
        >
          {/* Main Loading Dots */}
          <motion.div
            className='d-flex'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                style={{
                  width: '14px',
                  height: '14px',
                  margin: '0 6px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  background: `linear-gradient(145deg, ${
                    colors[i % colors.length]
                  } 30%, rgba(255, 255, 255, 0.4) 70%)`,
                  boxShadow:
                    '0 2px 5px rgba(0, 0, 0, 0.2), inset 2px 2px 5px rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(5px)',
                }}
                animate={{
                  y: [0, -15, 0], // Bouncing effect
                  backgroundColor: colors[(i + 1) % colors.length], // Color transition
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          {/* 🔁 Reflection of Dots (just below) */}
          <motion.div
            className='d-flex'
            style={{
              position: 'absolute',
              top: '28px',
              transform: 'scaleY(-1)', // Flipped version
              opacity: 0.2, // Faint reflection effect
              filter: 'blur(2px)',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={`reflection-${i}`}
                style={{
                  width: '14px',
                  height: '14px',
                  margin: '0 6px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  background: `linear-gradient(145deg, ${
                    colors[i % colors.length]
                  } 30%, rgba(255, 255, 255, 0.4) 70%)`,
                }}
                animate={{
                  y: [0, -15, 0],
                  backgroundColor: colors[(i + 1) % colors.length],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Animated Rainbow Text */}
        <motion.p
          className='col text-center'
          style={{
            fontWeight: 'bold',
            fontSize: '18px',
            padding: '10px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            textShadow: '0px 2px 5px rgba(0, 0, 0, 0.3)',
          }}
          animate={{
            color: colors, // Cycle through colors
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {message}
        </motion.p>
      </div>
    </>
  );
};

export default LoadingComponent;
