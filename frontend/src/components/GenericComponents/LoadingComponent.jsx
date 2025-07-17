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

  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center'
      style={{
        background: `
          linear-gradient(135deg, #1F2049 0%, #2a2d6b 25%, #1F2049 50%, #1a1d42 75%, #1F2049 100%),
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 70%)
        `,
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className='position-absolute'
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: 'rgba(59, 130, 246, 0.6)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            animation: `floatParticle ${particle.duration}s infinite ${particle.delay}s ease-in-out`,
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
          }}
        />
      ))}

      {/* Main Loading Container */}
      <div
        className='position-relative d-flex flex-column align-items-center'
        style={{
          background:
            'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 50%, rgba(30, 41, 59, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '60px 80px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 0 60px rgba(59, 130, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          zIndex: 10,
        }}
      >
        {/* Animated Glow Ring */}
        <div
          className='position-absolute'
          style={{
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            borderRadius: '24px',
            background:
              'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.5), transparent, rgba(139, 92, 246, 0.5), transparent)',
            animation: 'rotateGlow 3s linear infinite',
            zIndex: -1,
          }}
        />

        {/* Central Loading Rings */}
        <div
          className='position-relative mb-4'
          style={{ width: '120px', height: '120px' }}
        >
          {/* Outer Ring */}
          <div
            className='position-absolute'
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor:
                activeRing === 0 ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)',
              borderRightColor:
                activeRing === 0 ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)',
              animation: 'spinRing 2s linear infinite',
              filter: `drop-shadow(0 0 10px ${
                activeRing === 0 ? '#3b82f6' : 'rgba(59, 130, 246, 0.3)'
              })`,
              transition: 'all 0.3s ease',
            }}
          />

          {/* Middle Ring */}
          <div
            className='position-absolute'
            style={{
              width: '80%',
              height: '80%',
              top: '10%',
              left: '10%',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor:
                activeRing === 1 ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
              borderLeftColor:
                activeRing === 1 ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
              animation: 'spinRing 1.5s linear infinite reverse',
              filter: `drop-shadow(0 0 8px ${
                activeRing === 1 ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)'
              })`,
              transition: 'all 0.3s ease',
            }}
          />

          {/* Inner Ring */}
          <div
            className='position-absolute'
            style={{
              width: '60%',
              height: '60%',
              top: '20%',
              left: '20%',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor:
                activeRing === 2 ? '#10b981' : 'rgba(16, 185, 129, 0.3)',
              borderBottomColor:
                activeRing === 2 ? '#10b981' : 'rgba(16, 185, 129, 0.3)',
              animation: 'spinRing 1s linear infinite',
              filter: `drop-shadow(0 0 6px ${
                activeRing === 2 ? '#10b981' : 'rgba(16, 185, 129, 0.3)'
              })`,
              transition: 'all 0.3s ease',
            }}
          />

          {/* Central Pulsing Dot */}
          <div
            className='position-absolute'
            style={{
              width: '20px',
              height: '20px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #3b82f6, #1d4ed8)',
              boxShadow:
                '0 0 20px rgba(59, 130, 246, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
              animation: 'pulseDot 2s ease-in-out infinite',
            }}
          />

          {/* Orbiting Dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className='position-absolute'
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: `linear-gradient(145deg, ${
                  i === 0 ? '#3b82f6' : i === 1 ? '#8b5cf6' : '#10b981'
                }, ${i === 0 ? '#1d4ed8' : i === 1 ? '#7c3aed' : '#059669'})`,
                boxShadow: `0 0 10px ${
                  i === 0
                    ? 'rgba(59, 130, 246, 0.8)'
                    : i === 1
                    ? 'rgba(139, 92, 246, 0.8)'
                    : 'rgba(16, 185, 129, 0.8)'
                }`,
                animation: `orbitDot ${2 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.3}s`,
                transformOrigin: '50px 50px',
                left: 'calc(50% - 4px)',
                top: 'calc(50% - 4px)',
              }}
            />
          ))}
        </div>

        {/* Modern Loading Text */}
        <div className='text-center'>
          <h4
            style={{
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '700',
              marginBottom: '8px',
              background: 'linear-gradient(145deg, #ffffff, #e2e8f0, #cbd5e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.5px',
              animation: 'textGlow 3s ease-in-out infinite',
            }}
          >
            {message}
          </h4>

          {/* Progress Indicator */}
          <div
            style={{
              width: '200px',
              height: '4px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                height: '100%',
                background:
                  'linear-gradient(90deg, #3b82f6, #8b5cf6, #10b981, #3b82f6)',
                borderRadius: '2px',
                animation: 'progressFlow 2s linear infinite',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
              }}
            />
          </div>

          {/* Status Dots */}
          <div className='d-flex justify-content-center gap-2 mt-3'>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background:
                    activeRing === i
                      ? 'linear-gradient(145deg, #3b82f6, #1d4ed8)'
                      : 'rgba(59, 130, 246, 0.3)',
                  boxShadow:
                    activeRing === i
                      ? '0 0 8px rgba(59, 130, 246, 0.8)'
                      : 'none',
                  transition: 'all 0.3s ease',
                  animation:
                    activeRing === i ? 'statusPulse 0.6s ease-in-out' : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes rotateGlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes spinRing {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseDot {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8),
              inset 0 2px 4px rgba(255, 255, 255, 0.3);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            box-shadow: 0 0 30px rgba(59, 130, 246, 1),
              inset 0 2px 4px rgba(255, 255, 255, 0.5);
          }
        }

        @keyframes orbitDot {
          0% {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
          }
        }

        @keyframes textGlow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.6),
              0 0 40px rgba(59, 130, 246, 0.4);
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

        @keyframes statusPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes floatParticle {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingComponent;
