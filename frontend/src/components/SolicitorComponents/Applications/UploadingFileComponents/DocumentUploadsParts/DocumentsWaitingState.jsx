import { useEffect, useState } from 'react';
import { FaFileAlt, FaHourglassHalf } from 'react-icons/fa';

export const DocumentsWaitingState = ({ application }) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusMessage = () => {
    const messages = [
      'Waiting for agent to configure documents...',
      'Agent is setting up your requirements...',
      'Document templates being prepared by your agent...',
    ];
    return messages[animationStep];
  };

  const getMobileStatusMessage = () => {
    const messages = [
      'Configuring documents...',
      'Setting up requirements...',
      'Preparing templates...',
    ];
    return messages[animationStep];
  };

  return (
    <div
      className='h-100 d-flex flex-column flex-md-row align-items-center justify-content-between position-relative overflow-hidden p-3 p-md-4 rounded-3 rounded-lg-4'
      style={{
        background: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
        border: '1px solid rgba(59,130,246,0.2)',
        boxShadow:
          '0 10px 25px rgba(0, 0, 0, 0.15), 0 0 20px rgba(59, 130, 246, 0.1)',
      }}
    >
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(2deg); }
            66% { transform: translateY(-5px) rotate(-1deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes orbit {
            0% { transform: translate(-50%, -50%) rotate(0deg) translateX(35px) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg) translateX(35px) rotate(-360deg); }
          }
          @keyframes orbitMobile {
            0% { transform: translate(-50%, -50%) rotate(0deg) translateX(25px) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg) translateX(25px) rotate(-360deg); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3); }
          }
          @keyframes glowMobile {
            0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.3); }
          }
          @media (max-width: 768px) {
            .orbit-animation { animation: orbitMobile 4s linear infinite !important; }
            .orbit-animation-reverse { animation: orbitMobile 6s linear infinite reverse !important; }
            .glow-animation { animation: glowMobile 3s ease-in-out infinite !important; }
          }
        `}
      </style>

      {/* Background Glow */}
      <div
        className='position-absolute w-100 h-100'
        style={{
          top: 0,
          left: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(59,130,246,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(16,185,129,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(245,158,11,0.1) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* Left Animated Ring */}
      <div
        className='flex-shrink-0 d-flex align-items-center justify-content-center position-relative mb-3 mb-md-0 me-0 me-md-4'
        style={{
          width: '80px',
          height: '80px',
        }}
      >
        <div
          className='position-relative'
          style={{ width: '70px', height: '70px' }}
        >
          <div
            className='position-absolute rounded-circle glow-animation'
            style={{
              top: '-6px',
              left: '-6px',
              right: '-6px',
              bottom: '-6px',
              background:
                'conic-gradient(from 0deg, #3b82f6, #10b981, #f59e0b, #3b82f6)',
              opacity: 0.6,
            }}
          />
          <div
            className='position-absolute w-100 h-100 rounded-circle d-flex align-items-center justify-content-center'
            style={{
              border: '2px solid rgba(59,130,246,0.3)',
              background:
                'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
              backdropFilter: 'blur(20px)',
            }}
          >
            <FaHourglassHalf
              size={24}
              className='d-block d-md-none'
              style={{
                color: '#3b82f6',
                animation: 'pulse 2s ease-in-out infinite',
                filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.6))',
              }}
            />
            <FaHourglassHalf
              size={28}
              className='d-none d-md-block'
              style={{
                color: '#3b82f6',
                animation: 'pulse 2s ease-in-out infinite',
                filter: 'drop-shadow(0 0 15px rgba(59,130,246,0.6))',
              }}
            />
          </div>
          <div
            className='position-absolute rounded-circle orbit-animation'
            style={{
              top: '50%',
              left: '50%',
              width: '5px',
              height: '5px',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            className='position-absolute rounded-circle orbit-animation-reverse'
            style={{
              top: '50%',
              left: '50%',
              width: '3px',
              height: '3px',
              background: '#f59e0b',
              boxShadow: '0 0 4px #f59e0b',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </div>

      {/* Right Content */}
      <div className='flex-grow-1 d-flex flex-column justify-content-center text-center text-md-start position-relative'>
        <h3
          className='fw-bold mb-2 mb-md-3 fs-5 fs-md-4'
          style={{
            background: 'linear-gradient(135deg, #ffffff, #e2e8f0, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255,255,255,0.1)',
          }}
        >
          <span className='d-none d-sm-inline'>Waiting for Agent Setup</span>
          <span className='d-inline d-sm-none'>Agent Setup</span>
        </h3>

        <p
          className='text-muted fw-medium mb-3 fs-6'
          style={{ color: '#94a3b8' }}
        >
          <span className='d-none d-sm-inline'>{getStatusMessage()}</span>
          <span className='d-inline d-sm-none'>{getMobileStatusMessage()}</span>
        </p>

        <div className='d-flex gap-2 justify-content-center justify-content-md-start mb-3'>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className='rounded-circle'
              style={{
                width: '10px',
                height: '10px',
                background:
                  animationStep === index
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    : 'rgba(59,130,246,0.3)',
                transition: 'all 0.3s ease',
                boxShadow:
                  animationStep === index
                    ? '0 0 10px rgba(59,130,246,0.6)'
                    : 'none',
              }}
            />
          ))}
        </div>

        <div
          className='p-3 rounded-3 position-relative'
          style={{
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.8))',
            border: '1px solid rgba(59,130,246,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            className='position-absolute w-100'
            style={{
              top: 0,
              left: 0,
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)',
              animation: 'shimmer 2s infinite',
            }}
          />
          <div className='d-flex gap-2 gap-md-3 align-items-center mb-2'>
            <div
              className='d-flex justify-content-center align-items-center rounded-2 flex-shrink-0'
              style={{
                width: '24px',
                height: '24px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                boxShadow: '0 0 8px rgba(59,130,246,0.4)',
              }}
            >
              <FaFileAlt
                size={12}
                color='white'
                className='d-block d-md-none'
              />
              <FaFileAlt
                size={14}
                color='white'
                className='d-none d-md-block'
              />
            </div>
            <div className='text-start'>
              <h6
                className='mb-0 fw-semibold text-white'
                style={{ fontSize: '0.85rem' }}
              >
                Application #{application.id}
              </h6>
              <p
                className='mb-0'
                style={{
                  color: '#94a3b8',
                  fontSize: '0.7rem',
                }}
              >
                <span className='d-none d-sm-inline'>
                  Awaiting agent configuration
                </span>
                <span className='d-inline d-sm-none'>Awaiting setup</span>
              </p>
            </div>
          </div>
          <ul
            className='mb-0 ps-3'
            style={{
              color: '#64748b',
              fontSize: '0.7rem',
              lineHeight: 1.3,
            }}
          >
            <li className='d-none d-md-list-item'>
              Agent reviewing your application details
            </li>
            <li className='d-none d-md-list-item'>
              Document requirements being configured
            </li>
            <li className='d-none d-md-list-item'>
              Templates and workflows being set up
            </li>
            <li className='d-list-item d-md-none'>Reviewing application</li>
            <li className='d-list-item d-md-none'>Configuring documents</li>
            <li className='d-list-item d-md-none'>Setting up workflows</li>
          </ul>
        </div>

        <p
          className='mt-2 mt-md-3 mb-0 fst-italic text-center text-md-start'
          style={{
            fontSize: '0.75rem',
            color: '#64748b',
            lineHeight: 1.4,
          }}
        >
          <span className='d-none d-sm-inline'>
            Your assigned agent will configure the required documents. You'll be
            notified once ready.
          </span>
          <span className='d-inline d-sm-none'>
            Agent will configure documents. You'll be notified when ready.
          </span>
        </p>
      </div>
    </div>
  );
};
