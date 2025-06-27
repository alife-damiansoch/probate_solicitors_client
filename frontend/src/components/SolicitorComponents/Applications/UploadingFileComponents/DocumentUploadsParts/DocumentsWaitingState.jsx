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

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
        borderRadius: '24px',
        border: '1px solid rgba(59,130,246,0.2)',
        overflow: 'hidden',
        position: 'relative',
        padding: '20px',
        boxShadow:
          '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(59, 130, 246, 0.1)',
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
            0% { transform: translate(-50%, -50%) rotate(0deg) translateX(45px) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg) translateX(45px) rotate(-360deg); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3); }
          }
        `}
      </style>

      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
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
        style={{
          flex: '0 0 120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: '100%',
        }}
      >
        <div style={{ position: 'relative', width: 100, height: 100 }}>
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              background:
                'conic-gradient(from 0deg, #3b82f6, #10b981, #f59e0b, #3b82f6)',
              animation: 'glow 3s ease-in-out infinite',
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '3px solid rgba(59,130,246,0.3)',
              background:
                'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FaHourglassHalf
              size={32}
              style={{
                color: '#3b82f6',
                animation: 'pulse 2s ease-in-out infinite',
                filter: 'drop-shadow(0 0 15px rgba(59,130,246,0.6))',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '6px',
              height: '6px',
              background: '#10b981',
              borderRadius: '50%',
              animation: 'orbit 4s linear infinite',
              boxShadow: '0 0 8px #10b981',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '4px',
              height: '4px',
              background: '#f59e0b',
              borderRadius: '50%',
              animation: 'orbit 6s linear infinite reverse',
              boxShadow: '0 0 6px #f59e0b',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
      </div>

      {/* Right Content */}
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '30px',
          zIndex: 1,
        }}
      >
        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #ffffff, #e2e8f0, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255,255,255,0.1)',
          }}
        >
          Waiting for Agent Setup
        </h3>

        <p style={{ color: '#94a3b8', fontWeight: 500, marginBottom: '16px' }}>
          {getStatusMessage()}
        </p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background:
                  animationStep === index
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    : 'rgba(59,130,246,0.3)',
                transition: 'all 0.3s ease',
                boxShadow:
                  animationStep === index
                    ? '0 0 15px rgba(59,130,246,0.6)'
                    : 'none',
              }}
            />
          ))}
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.8))',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '14px',
            padding: '12px 16px',
            backdropFilter: 'blur(10px)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)',
              animation: 'shimmer 2s infinite',
            }}
          />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: 6,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 0 12px rgba(59,130,246,0.4)',
              }}
            >
              <FaFileAlt size={14} color='white' />
            </div>
            <div>
              <h6
                style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                Application #{application.id}
              </h6>
              <p
                style={{
                  color: '#94a3b8',
                  margin: 0,
                  fontSize: '0.8rem',
                }}
              >
                Awaiting agent configuration
              </p>
            </div>
          </div>
          <ul
            style={{
              marginTop: 8,
              paddingLeft: 20,
              color: '#64748b',
              fontSize: '0.75rem',
              marginBottom: 0,
            }}
          >
            <li>Agent reviewing your application details</li>
            <li>Document requirements being configured</li>
            <li>Templates and workflows being set up</li>
          </ul>
        </div>

        <p
          style={{
            marginTop: 12,
            fontSize: '0.85rem',
            color: '#64748b',
            fontStyle: 'italic',
          }}
        >
          Your assigned agent will configure the required documents. You'll be
          notified once ready.
        </p>
      </div>
    </div>
  );
};
