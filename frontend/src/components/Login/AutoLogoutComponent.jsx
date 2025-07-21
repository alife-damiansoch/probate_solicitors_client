import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { clearUser } from '../../store/userSlice';
import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import useApiKeyExpiration from '../GenericFunctions/CustomHooks/useApiKeyExpiration';

// TimeoutWarning Component (inline)
const TimeoutWarning = ({ remainingTime, stayLoggedIn }) => {
  // Theme-aware styles similar to ForgotPassword
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    animation: 'fadeIn 0.3s ease-out',
  };

  const cardStyle = {
    borderRadius: '20px',
    background: 'var(--gradient-surface)',
    boxShadow: `
      0 16px 50px rgba(0, 0, 0, 0.12),
      0 8px 32px var(--primary-10),
      0 4px 16px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 var(--white-10)
    `,
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    overflow: 'hidden',
    border: '1px solid var(--border-secondary)',
    transition: 'all 0.3s ease',
    maxWidth: '420px',
    width: '90%',
    textAlign: 'center',
  };

  const headerStyle = {
    background: `
      linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 80%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
    backgroundBlendMode: 'overlay',
    borderBottom: 'none',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    color: '#ffffff',
    boxShadow: `
      0 8px 32px var(--primary-20),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    position: 'relative',
    overflow: 'hidden',
    padding: '24px 32px',
  };

  const iconContainerStyle = {
    width: '64px',
    height: '64px',
    background: `
      linear-gradient(145deg, var(--primary-blue), var(--primary-blue-dark)),
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent)
    `,
    color: '#ffffff',
    boxShadow: `
      0 8px 24px var(--primary-30),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `,
    border: '1px solid var(--primary-40)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    animation: 'warningPulse 2s infinite',
  };

  const bodyStyle = {
    padding: '24px 32px',
    background: 'var(--surface-primary)',
  };

  const countdownStyle = {
    color: 'var(--error-primary)',
    fontWeight: '800',
    fontSize: '1.4rem',
    textShadow: '0 0 10px var(--error-20)',
    animation: 'countdownPulse 1s infinite',
    display: 'inline-block',
  };

  const buttonStyle = {
    background: `
      linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
    `,
    backgroundBlendMode: 'overlay',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '14px 28px',
    boxShadow: `
      0 8px 24px var(--primary-30),
      0 4px 12px var(--primary-20),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: '100%',
    marginTop: '20px',
  };

  const messageStyle = {
    color: 'var(--text-primary)',
    margin: '0 0 20px 0',
    fontSize: '1rem',
    lineHeight: '1.5',
    fontWeight: '500',
  };

  const titleStyle = {
    color: '#ffffff',
    margin: '0 0 8px 0',
    fontSize: '1.4rem',
    fontWeight: '800',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.9rem',
    margin: '0',
  };

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 30% 30%, var(--warning-10), transparent 60%),
                radial-gradient(circle at 70% 70%, var(--warning-05), transparent 60%)
              `,
              animation: 'float 6s ease-in-out infinite',
            }}
          />

          {/* Warning Icon */}
          <div style={iconContainerStyle}>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
              <line x1='12' y1='9' x2='12' y2='13' />
              <line x1='12' y1='17' x2='12.01' y2='17' />
            </svg>
          </div>

          <h4 style={titleStyle}>Session Timeout Warning</h4>
          <p style={subtitleStyle}>Your session is about to expire</p>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          <p style={messageStyle}>
            You will be logged out in{' '}
            <span style={countdownStyle}>{remainingTime}</span> seconds due to
            inactivity.
          </p>

          <button
            onClick={stayLoggedIn}
            style={buttonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = `
                0 12px 32px var(--primary-40),
                0 6px 16px var(--primary-30),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
              `;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = `
                0 8px 24px var(--primary-30),
                0 4px 12px var(--primary-20),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `;
            }}
          >
            {/* Button shimmer effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                animation: 'shimmer 2s infinite',
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>
              Stay Logged In
            </span>
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }

        @keyframes warningPulse {
          0%, 100% {
            transform: scale(1);
            boxShadow: 0 8px 24px var(--primary-30), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.1);
          }
          50% {
            transform: scale(1.05);
            boxShadow: 0 12px 35px var(--primary-40), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1);
          }
        }

        @keyframes countdownPulse {
          0%, 100% {
            transform: scale(1);
            textShadow: 0 0 10px var(--error-20);
          }
          50% {
            transform: scale(1.1);
            textShadow: 0 0 20px var(--error-30);
          }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

const AutoLogoutComponent = () => {
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiration
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expirationTime = useApiKeyExpiration();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  // Function to log out the user
  const logoutUser = async () => {
    setShowWarning(false);
    dispatch(logout());
    dispatch(clearUser());
    navigate('/');
  };

  // Function to reset warning state
  const stayLoggedIn = async () => {
    const endpoint = '/api/user/refresh-api-key/';
    const res = await postData('token', endpoint, {});
    if (res.status === 200) {
      setShowWarning(false);
    }
  };

  useEffect(() => {
    if (!expirationTime) return;

    const expiresAt = expirationTime.getTime();
    const now = Date.now();
    const timeRemaining = expiresAt - now;
    setRemainingTime(timeRemaining);

    if (timeRemaining <= 0) {
      logoutUser();
    } else if (timeRemaining <= WARNING_TIME) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = expiresAt - now;
      setRemainingTime(timeRemaining);

      if (timeRemaining <= 0) {
        logoutUser();
      } else if (timeRemaining <= WARNING_TIME) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime, WARNING_TIME]);

  return (
    <div>
      {/* Comprehensive Debug Timer Display - Top Right Corner */}
      {/* <div
        style={{
          position: 'fixed',
          top: '170px',
          right: '20px',
          background: 'var(--surface-primary)',
          border: '2px solid var(--border-secondary)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: `
            0 8px 24px rgba(0, 0, 0, 0.1),
            0 4px 12px var(--primary-10),
            inset 0 1px 0 var(--white-10)
          `,
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          zIndex: 9999,
          fontSize: '0.8rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          minWidth: '220px',
          fontFamily: 'monospace',
        }}
      >
        
        <div
          style={{
            color: 'var(--primary-blue)',
            fontSize: '0.85rem',
            marginBottom: '12px',
            textAlign: 'center',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '8px',
          }}
        >
          🔍 AUTO-LOGOUT DEBUG
        </div>

        
        <div style={{ marginBottom: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Expiration Time:
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.75rem' }}>
            {expirationTime ? expirationTime.toLocaleTimeString() : 'Not Set'}
          </div>
        </div>

        
        <div style={{ marginBottom: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Current Time:
          </div>
          <div style={{ color: 'var(--text-primary)', fontSize: '0.75rem' }}>
            {new Date().toLocaleTimeString()}
          </div>
        </div>

       
        <div style={{ marginBottom: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Total Time Left:
          </div>
          <div
            style={{
              color:
                remainingTime && remainingTime <= WARNING_TIME
                  ? 'var(--error-primary)'
                  : 'var(--success-primary)',
              fontSize: '0.85rem',
              fontWeight: '700',
            }}
          >
            {remainingTime
              ? `${Math.floor(remainingTime / 1000 / 60)}:${String(
                  Math.floor((remainingTime / 1000) % 60)
                ).padStart(2, '0')}`
              : 'No Data'}
          </div>
        </div>

        
        <div style={{ marginBottom: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Time Until Warning:
          </div>
          <div
            style={{
              color:
                remainingTime && remainingTime <= WARNING_TIME
                  ? 'var(--error-primary)'
                  : 'var(--warning-primary)',
              fontSize: '0.85rem',
              fontWeight: '700',
            }}
          >
            {remainingTime
              ? remainingTime > WARNING_TIME
                ? `${Math.floor(
                    (remainingTime - WARNING_TIME) / 1000 / 60
                  )}:${String(
                    Math.floor(((remainingTime - WARNING_TIME) / 1000) % 60)
                  ).padStart(2, '0')}`
                : 'WARNING NOW!'
              : 'No Data'}
          </div>
        </div>

       
        <div style={{ marginBottom: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Warning Threshold:
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            {Math.floor(WARNING_TIME / 1000 / 60)} minutes
          </div>
        </div>

        
        <div style={{ marginBottom: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Current Status:
          </div>
          <div style={{ fontSize: '0.75rem' }}>
            {!remainingTime && (
              <span style={{ color: 'var(--text-disabled)' }}>
                🔍 No Timer Data
              </span>
            )}
            {remainingTime && remainingTime > WARNING_TIME && (
              <span style={{ color: 'var(--success-primary)' }}>
                ✅ Normal Operation
              </span>
            )}
            {remainingTime &&
              remainingTime <= WARNING_TIME &&
              remainingTime > 0 && (
                <span style={{ color: 'var(--error-primary)' }}>
                  ⚠️ Warning Active
                </span>
              )}
            {remainingTime && remainingTime <= 0 && (
              <span style={{ color: 'var(--error-primary)' }}>
                💀 Should Logout
              </span>
            )}
          </div>
        </div>

        
        <div style={{ marginBottom: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            Warning Modal:
          </div>
          <div style={{ fontSize: '0.75rem' }}>
            <span
              style={{
                color: showWarning
                  ? 'var(--error-primary)'
                  : 'var(--text-disabled)',
              }}
            >
              {showWarning ? '🚨 VISIBLE' : '🔇 Hidden'}
            </span>
          </div>
        </div>

        
        <div
          style={{
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            lineHeight: '1.3',
          }}
        >
          <div>📋 Testing Steps:</div>
          <div>1. Wait for warning to show</div>
          <div>2. Test "Stay Logged In" button</div>
          <div>3. Let timer run to 0:00</div>
        </div>
      </div> */}

      {/* Original Warning Modal */}
      {showWarning && (
        <TimeoutWarning
          remainingTime={Math.floor(remainingTime / 1000)}
          stayLoggedIn={stayLoggedIn}
        />
      )}
    </div>
  );
};

export default AutoLogoutComponent;
