const TimeoutWarning = ({ remainingTime, stayLoggedIn, show }) => {
  // Only render if explicitly shown or if remainingTime exists
  if (!show && !remainingTime) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Main Warning Container */}
      <div
        style={{
          background: `
            linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 25%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.95) 75%, rgba(30, 41, 59, 0.95) 100%),
            radial-gradient(circle at 30% 10%, rgba(239, 68, 68, 0.15), transparent 50%),
            radial-gradient(circle at 70% 90%, rgba(245, 158, 11, 0.12), transparent 50%)
          `,
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '24px',
          padding: '32px 40px',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 8px 16px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 60px rgba(239, 68, 68, 0.2)
          `,
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '400px',
          width: '90%',
          transform: 'scale(1)',
          animation: 'modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Animated Border Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            borderRadius: '24px',
            background:
              'linear-gradient(45deg, transparent, rgba(239, 68, 68, 0.6), transparent, rgba(245, 158, 11, 0.6), transparent)',
            animation: 'rotateGlow 3s linear infinite',
            zIndex: -1,
          }}
        />

        {/* Warning Icon */}
        <div
          style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #ef4444, #dc2626, #b91c1c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow:
              '0 8px 25px rgba(239, 68, 68, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            animation: 'warningPulse 2s infinite',
          }}
        >
          <svg
            width='28'
            height='28'
            viewBox='0 0 24 24'
            fill='none'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
          >
            <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
            <line x1='12' y1='9' x2='12' y2='13' />
            <line x1='12' y1='17' x2='12.01' y2='17' />
          </svg>
        </div>

        {/* Title */}
        <h5
          style={{
            color: 'white',
            margin: '0 0 16px 0',
            fontSize: '1.4rem',
            fontWeight: '800',
            background: 'linear-gradient(145deg, #ffffff, #e2e8f0, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.5px',
          }}
        >
          Session Timeout Warning
        </h5>

        {/* Message */}
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            margin: '0 0 24px 0',
            fontSize: '1rem',
            lineHeight: '1.5',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            fontWeight: '500',
          }}
        >
          You will be logged out in{' '}
          <span
            style={{
              color: '#ef4444',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
              animation: 'countdownPulse 1s infinite',
            }}
          >
            {remainingTime}
          </span>{' '}
          seconds due to inactivity.
        </p>

        {/* Action Button */}
        <button
          onClick={stayLoggedIn}
          style={{
            background:
              'linear-gradient(145deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            padding: '14px 28px',
            fontSize: '1rem',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow:
              '0 6px 20px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow =
              '0 12px 35px rgba(34, 197, 94, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow =
              '0 6px 20px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)';
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
              animation: 'buttonShimmer 3s infinite',
            }}
          />
          <span style={{ position: 'relative', zIndex: 1 }}>
            Stay Logged In
          </span>
        </button>
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes warningPulse {
          0%, 100% {
            transform: scale(1);
            boxShadow: 0 8px 25px rgba(239, 68, 68, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2);
          }
          50% {
            transform: scale(1.05);
            boxShadow: 0 12px 35px rgba(239, 68, 68, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.3);
          }
        }

        @keyframes countdownPulse {
          0%, 100% {
            transform: scale(1);
            textShadow: 0 0 10px rgba(239, 68, 68, 0.5);
          }
          50% {
            transform: scale(1.1);
            textShadow: 0 0 20px rgba(239, 68, 68, 0.8);
          }
        }

        @keyframes buttonShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default TimeoutWarning;
