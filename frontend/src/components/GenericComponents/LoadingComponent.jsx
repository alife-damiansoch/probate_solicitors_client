import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LoadingComponent = ({ message = 'Loading...' }) => {
  const [activeRing, setActiveRing] = useState(0);
  const [particles, setParticles] = useState([]);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2,
        });
      }
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  // Ring animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRing((prev) => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Enhanced theme-aware styles
  const backgroundStyle = {
    background: `
      var(--gradient-main-bg),
      radial-gradient(circle at 20% 30%, var(--primary-10) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, var(--primary-20) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, var(--success-20) 0%, transparent 70%)
    `,
    zIndex: 9999,
    overflow: 'hidden',
  };

  const containerStyle = {
    background: 'var(--gradient-surface)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    borderRadius: '24px',
    padding: '60px 80px',
    border: '1px solid var(--border-primary)',
    boxShadow: `
      0 20px 60px rgba(0, 0, 0, 0.25),
      0 8px 32px var(--primary-20),
      0 4px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 var(--white-10)
    `,
    zIndex: 10,
    position: 'relative',
  };

  const glowRingStyle = {
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    borderRadius: '24px',
    background: `
      linear-gradient(45deg, transparent, var(--primary-50), transparent, var(--primary-40), transparent)
    `,
    animation: 'rotateGlow 3s linear infinite',
    zIndex: -1,
  };

  const getRingColor = (index, isActive) => {
    const colors = [
      { active: 'var(--primary-blue)', inactive: 'var(--primary-30)' },
      { active: 'var(--primary-blue-light)', inactive: 'var(--primary-20)' },
      { active: 'var(--success-primary)', inactive: 'var(--success-30)' },
    ];
    return isActive ? colors[index].active : colors[index].inactive;
  };

  const textStyle = {
    color: 'var(--text-primary)',
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '8px',
    background: `
      linear-gradient(145deg, var(--text-primary), var(--text-secondary), var(--text-tertiary))
    `,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textShadow: '0 0 20px var(--primary-20)',
    letterSpacing: '0.5px',
    animation: 'textGlow 3s ease-in-out infinite',
  };

  const progressBarStyle = {
    width: '200px',
    height: '4px',
    background: 'var(--primary-20)',
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const progressFillStyle = {
    height: '100%',
    background: `
      linear-gradient(90deg, var(--primary-blue), var(--primary-blue-light), var(--success-primary), var(--primary-blue))
    `,
    borderRadius: '2px',
    animation: 'progressFlow 2s linear infinite',
    boxShadow: '0 0 10px var(--primary-50)',
  };

  return (
    <motion.div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center'
      style={backgroundStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Background Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className='position-absolute'
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: 'var(--primary-50)',
              borderRadius: '50%',
              filter: 'blur(1px)',
              boxShadow: '0 0 10px var(--primary-50)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1],
              y: [-20, 0, -20],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Main Loading Container */}
      <motion.div
        className='position-relative d-flex flex-column align-items-center'
        style={containerStyle}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        {/* Animated Glow Ring */}
        <div className='position-absolute' style={glowRingStyle} />

        {/* Central Loading Rings */}
        <motion.div
          className='position-relative mb-4'
          style={{ width: '120px', height: '120px' }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          {/* Outer Ring */}
          <motion.div
            className='position-absolute'
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: getRingColor(0, activeRing === 0),
              borderRightColor: getRingColor(0, activeRing === 0),
              filter: `drop-shadow(0 0 10px ${getRingColor(
                0,
                activeRing === 0
              )})`,
              transition: 'all 0.3s ease',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Middle Ring */}
          <motion.div
            className='position-absolute'
            style={{
              width: '80%',
              height: '80%',
              top: '10%',
              left: '10%',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: getRingColor(1, activeRing === 1),
              borderLeftColor: getRingColor(1, activeRing === 1),
              filter: `drop-shadow(0 0 8px ${getRingColor(
                1,
                activeRing === 1
              )})`,
              transition: 'all 0.3s ease',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner Ring */}
          <motion.div
            className='position-absolute'
            style={{
              width: '60%',
              height: '60%',
              top: '20%',
              left: '20%',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: getRingColor(2, activeRing === 2),
              borderBottomColor: getRingColor(2, activeRing === 2),
              filter: `drop-shadow(0 0 6px ${getRingColor(
                2,
                activeRing === 2
              )})`,
              transition: 'all 0.3s ease',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />

          {/* Central Pulsing Dot */}
          <motion.div
            className='position-absolute'
            style={{
              width: '20px',
              height: '20px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: `linear-gradient(145deg, var(--primary-blue), var(--primary-blue-dark))`,
              boxShadow: `
                0 0 20px var(--primary-50),
                inset 0 2px 4px var(--white-10)
              `,
            }}
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                `0 0 20px var(--primary-50), inset 0 2px 4px var(--white-10)`,
                `0 0 30px var(--primary-blue), inset 0 2px 4px var(--white-20)`,
                `0 0 20px var(--primary-50), inset 0 2px 4px var(--white-10)`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Orbiting Dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className='position-absolute'
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: `linear-gradient(145deg, ${getRingColor(
                  i,
                  true
                )}, ${getRingColor(i, true)})`,
                boxShadow: `0 0 10px ${getRingColor(i, true)}`,
                left: 'calc(50% - 4px)',
                top: 'calc(50% - 4px)',
              }}
              animate={{
                rotate: 360,
                x: [0, 50, 0, -50, 0],
                y: [0, 0, 50, 0, 0],
              }}
              transition={{
                duration: 2 + i * 0.5,
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>

        {/* Modern Loading Text */}
        <div className='text-center'>
          <motion.h4
            style={textStyle}
            animate={{
              textShadow: [
                '0 0 20px var(--primary-20)',
                '0 0 30px var(--primary-30), 0 0 40px var(--primary-40)',
                '0 0 20px var(--primary-20)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {message}
          </motion.h4>

          {/* Progress Indicator */}
          <div style={progressBarStyle}>
            <motion.div
              style={progressFillStyle}
              animate={{
                x: ['-100%', '100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Status Dots */}
          <div className='d-flex justify-content-center gap-2 mt-3'>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background:
                    activeRing === i
                      ? `linear-gradient(145deg, var(--primary-blue), var(--primary-blue-dark))`
                      : 'var(--primary-30)',
                  boxShadow:
                    activeRing === i ? `0 0 8px var(--primary-50)` : 'none',
                  transition: 'all 0.3s ease',
                }}
                animate={
                  activeRing === i ? { scale: [1, 1.3, 1] } : { scale: 1 }
                }
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes textGlow {
          0%, 100% { 
            text-shadow: 0 0 20px var(--primary-20); 
          }
          50% { 
            text-shadow: 
              0 0 30px var(--primary-30),
              0 0 40px var(--primary-40); 
          }
        }

        @keyframes progressFlow {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        /* Theme-aware glow animations */
        [data-theme="light"] .position-absolute {
          filter: brightness(0.8);
        }

        [data-theme="dark"] .position-absolute {
          filter: brightness(1.2);
        }
      `}</style>
    </motion.div>
  );
};

export default LoadingComponent;
