const StagesHeader = ({
  application,
  overallProgress,
  totalIssues,
  completedSteps,
  totalSteps,
  nextActionStep,
}) => {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-primary)',
        background: 'var(--gradient-header)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 30% 50%, var(--primary-10), transparent 50%),
            radial-gradient(circle at 70% 50%, var(--primary-blue-light), transparent 50%)
          `,
          animation: 'progressShimmer 8s infinite',
        }}
      />

      {/* Compact Header with Progress Ring */}
      <div className='d-flex align-items-center justify-content-between mb-3 position-relative'>
        {/* Left: App Info */}
        <div>
          <h6
            style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: '800',
              marginBottom: '2px',
              background:
                'linear-gradient(135deg, var(--text-primary), var(--text-secondary), var(--text-tertiary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px var(--primary-10)',
              letterSpacing: '0.5px',
            }}
          >
            App #{application.id}
          </h6>
          <div
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: '600',
              letterSpacing: '0.3px',
            }}
          >
            {completedSteps}/{totalSteps} Complete
          </div>
        </div>

        {/* Right: Compact Progress Ring */}
        <div
          className='position-relative'
          style={{ width: '60px', height: '60px' }}
        >
          {/* Glow ring */}
          <div
            style={{
              position: 'absolute',
              width: '70px',
              height: '70px',
              top: '-5px',
              left: '-5px',
              borderRadius: '50%',
              background:
                totalIssues > 0
                  ? `conic-gradient(from 0deg, var(--error-30), transparent, var(--error-30))`
                  : `conic-gradient(from 0deg, var(--primary-30), transparent, var(--primary-30))`,
              animation:
                totalIssues > 0
                  ? 'criticalPulse 2s infinite'
                  : 'neonPulse 3s infinite',
            }}
          />

          <svg width='60' height='60' className='position-absolute'>
            {/* Background circle */}
            <circle
              cx='30'
              cy='30'
              r='24'
              fill='none'
              stroke='var(--primary-20)'
              strokeWidth='4'
            />
            {/* Progress circle */}
            <circle
              cx='30'
              cy='30'
              r='24'
              fill='none'
              stroke={
                totalIssues > 0 ? 'var(--error-primary)' : 'var(--primary-blue)'
              }
              strokeWidth='4'
              strokeDasharray={`${(overallProgress / 100) * 150.8} 150.8`}
              strokeLinecap='round'
              transform='rotate(-90 30 30)'
              style={{
                transition: 'stroke-dasharray 0.8s ease, stroke 0.3s ease',
                filter: `drop-shadow(0 0 10px ${
                  totalIssues > 0 ? 'var(--error-40)' : 'var(--primary-40)'
                })`,
              }}
            />
          </svg>

          {/* Center content */}
          <div
            className='position-absolute d-flex flex-column align-items-center justify-content-center'
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              color:
                totalIssues > 0
                  ? 'var(--error-primary)'
                  : 'var(--primary-blue)',
              fontSize: '0.9rem',
              fontWeight: '800',
              textShadow: `0 0 10px ${
                totalIssues > 0 ? 'var(--error-30)' : 'var(--primary-20)'
              }`,
            }}
          >
            <span style={{ fontSize: '1.1rem', lineHeight: '1' }}>
              {Math.round(overallProgress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Compact Status and Stats Row */}
      <div className='d-flex align-items-center justify-content-between'>
        {/* Status Indicator */}
        <div
          style={{
            background: nextActionStep
              ? 'linear-gradient(135deg, var(--warning-20), var(--warning-30))'
              : completedSteps === totalSteps
              ? 'linear-gradient(135deg, var(--success-20), var(--success-30))'
              : 'linear-gradient(135deg, var(--primary-20), var(--primary-30))',
            border: nextActionStep
              ? '1px solid var(--warning-30)'
              : completedSteps === totalSteps
              ? '1px solid var(--success-30)'
              : '1px solid var(--primary-30)',
            borderRadius: '12px',
            padding: '6px 12px',
            boxShadow: nextActionStep
              ? '0 2px 10px var(--warning-20)'
              : completedSteps === totalSteps
              ? '0 2px 10px var(--success-20)'
              : '0 2px 10px var(--primary-20)',
            flex: 1,
            marginRight: '12px',
          }}
        >
          <div
            style={{
              color: nextActionStep
                ? 'var(--warning-primary)'
                : completedSteps === totalSteps
                ? 'var(--success-primary)'
                : 'var(--primary-blue)',
              fontSize: '0.7rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {nextActionStep
              ? `🔥 Action Required`
              : completedSteps === totalSteps
              ? '✅ Complete'
              : `⏳ In Progress`}
          </div>
        </div>

        {/* Compact Stats */}
        <div className='d-flex gap-4'>
          <div className='text-center'>
            <div
              style={{
                color: 'var(--success-primary)',
                fontSize: '1.1rem',
                fontWeight: '800',
                textShadow: '0 0 8px var(--success-30)',
                lineHeight: '1',
              }}
            >
              {completedSteps}
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.3px',
              }}
            >
              Done
            </div>
          </div>
          <div className='text-center'>
            <div
              style={{
                color: 'var(--warning-primary)',
                fontSize: '1.1rem',
                fontWeight: '800',
                textShadow: '0 0 8px var(--warning-30)',
                lineHeight: '1',
              }}
            >
              {totalSteps - completedSteps}
            </div>
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.3px',
              }}
            >
              Left
            </div>
          </div>
          {totalIssues > 0 && (
            <div className='text-center'>
              <div
                style={{
                  color: 'var(--error-primary)',
                  fontSize: '1.1rem',
                  fontWeight: '800',
                  textShadow: '0 0 8px var(--error-30)',
                  lineHeight: '1',
                  animation: 'criticalPulse 2s infinite',
                }}
              >
                {totalIssues}
              </div>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.6rem',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  letterSpacing: '0.3px',
                }}
              >
                Issues
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Critical Issues Alert - Only show if issues exist */}
      {totalIssues > 0 && (
        <div
          style={{
            background:
              'linear-gradient(135deg, var(--error-20), var(--error-30))',
            border: '1px solid var(--error-30)',
            borderRadius: '10px',
            padding: '6px 10px',
            marginTop: '8px',
            animation: 'issueAlert 2s infinite',
            boxShadow: '0 2px 12px var(--error-20)',
          }}
        >
          <div className='d-flex align-items-center justify-content-center gap-2'>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--error-primary)',
                boxShadow: '0 0 8px var(--error-primary)',
                animation: 'criticalPulse 1s infinite',
              }}
            />
            <span
              style={{
                color: 'var(--error-primary)',
                fontSize: '0.7rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              ⚠️ {totalIssues} Critical Issue{totalIssues !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Cutting-Edge Scroll Indicator */}
      <div
        className='d-flex align-items-center justify-content-center mt-2'
        style={{
          position: 'relative',
          height: '20px',
          overflow: 'hidden',
        }}
      >
        {/* Animated Background Glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, var(--primary-10), transparent)',
            animation: 'scrollGlow 3s infinite',
            borderRadius: '10px',
          }}
        />

        {/* Scroll Hint Container */}
        <div
          className='d-flex align-items-center gap-2'
          style={{
            position: 'relative',
            zIndex: 1,
            opacity: 0.8,
          }}
        >
          {/* Pulsing Dots */}
          <div className='d-flex gap-1'>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: 'var(--primary-blue-light)',
                  animation: `dotPulse 2s infinite ${i * 0.3}s`,
                  boxShadow: '0 0 4px var(--primary-20)',
                }}
              />
            ))}
          </div>
          {/* Scroll Text */}
          <span
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.65rem',
              fontWeight: '600',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              textShadow: '0 0 8px var(--text-muted)',
            }}
          >
            Scroll for Details
          </span>
          {/* Animated Chevron */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'chevronFloat 2s infinite',
            }}
          >
            <svg width='10' height='10' viewBox='0 0 24 24' fill='none'>
              <path
                d='M7 10L12 15L17 10'
                stroke='var(--primary-blue)'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          {/* More Pulsing Dots */}
          <div className='d-flex gap-1'>
            {[0, 1, 2].map((i) => (
              <div
                key={i + 3}
                style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  background: 'var(--primary-blue-light)',
                  animation: `dotPulse 2s infinite ${(i + 3) * 0.3}s`,
                  boxShadow: '0 0 4px var(--primary-20)',
                }}
              />
            ))}
          </div>
        </div>
        {/* Subtle Gradient Fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background:
              'linear-gradient(90deg, transparent, var(--primary-30), transparent)',
            animation: 'fadeGradient 4s infinite',
          }}
        />
      </div>

      {/* Additional CSS for scroll indicator animations */}
      <style>{`
        @keyframes scrollGlow {
          0%,100% { opacity: 0.3; transform: translateX(-50%) scaleX(0.8);}
          50% { opacity: 0.8; transform: translateX(-50%) scaleX(1.2);}
        }
        @keyframes dotPulse {
          0%,100% { opacity: 0.3; transform: scale(0.8);}
          50% { opacity: 1; transform: scale(1.2);}
        }
        @keyframes chevronFloat {
          0%,100% { transform: translateY(0px); opacity: 0.6;}
          50% { transform: translateY(2px); opacity: 1;}
        }
        @keyframes fadeGradient {
          0%,100% { opacity: 0.2;}
          50% { opacity: 0.8;}
        }
        @keyframes progressShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes criticalPulse {
          0%,100% { box-shadow: 0 4px 15px var(--error-40), 0 0 30px var(--error-20);}
          50% { box-shadow: 0 6px 25px var(--error-primary), 0 0 40px var(--error-40);}
        }
        @keyframes neonPulse {
          0%,100% { box-shadow: 0 0 20px var(--primary-40), 0 0 40px var(--primary-20);}
          50% { box-shadow: 0 0 30px var(--primary-blue), 0 0 60px var(--primary-40);}
        }
        @keyframes issueAlert {
          0%,100% { transform: scale(1);}
          50% { transform: scale(1.05);}
        }
      `}</style>
    </div>
  );
};

export default StagesHeader;
