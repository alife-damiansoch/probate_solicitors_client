// ApplicationDetailStagesParts/StagesHeader.js

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
        padding: '24px 20px',
        borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
        background:
          'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
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
          background:
            'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1), transparent 50%), radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.1), transparent 50%)',
          animation: 'progressShimmer 8s infinite',
        }}
      />

      {/* Enhanced Overall Progress Ring */}
      <div className='d-flex align-items-center justify-content-center mb-4 position-relative'>
        <div
          className='position-relative'
          style={{ width: '90px', height: '90px' }}
        >
          {/* Multiple glow rings */}
          <div
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              top: '-5px',
              left: '-5px',
              borderRadius: '50%',
              background:
                totalIssues > 0
                  ? `conic-gradient(from 0deg, rgba(239, 68, 68, 0.3), transparent, rgba(239, 68, 68, 0.3))`
                  : `conic-gradient(from 0deg, rgba(59, 130, 246, 0.3), transparent, rgba(59, 130, 246, 0.3))`,
              animation:
                totalIssues > 0
                  ? 'criticalPulse 2s infinite'
                  : 'neonPulse 3s infinite',
            }}
          />

          <div
            style={{
              position: 'absolute',
              width: '110px',
              height: '110px',
              top: '-10px',
              left: '-10px',
              borderRadius: '50%',
              background:
                totalIssues > 0
                  ? `conic-gradient(from 180deg, rgba(239, 68, 68, 0.1), transparent, rgba(239, 68, 68, 0.1))`
                  : `conic-gradient(from 180deg, rgba(59, 130, 246, 0.1), transparent, rgba(59, 130, 246, 0.1))`,
              animation:
                totalIssues > 0
                  ? 'criticalPulse 3s infinite reverse'
                  : 'neonPulse 4s infinite reverse',
            }}
          />

          <svg width='90' height='90' className='position-absolute'>
            {/* Background circle */}
            <circle
              cx='45'
              cy='45'
              r='36'
              fill='none'
              stroke='rgba(59, 130, 246, 0.2)'
              strokeWidth='5'
            />
            {/* Progress circle */}
            <circle
              cx='45'
              cy='45'
              r='36'
              fill='none'
              stroke={totalIssues > 0 ? '#ef4444' : '#3b82f6'}
              strokeWidth='5'
              strokeDasharray={`${(overallProgress / 100) * 226.19} 226.19`}
              strokeLinecap='round'
              transform='rotate(-90 45 45)'
              style={{
                transition: 'stroke-dasharray 0.8s ease, stroke 0.3s ease',
                filter: `drop-shadow(0 0 15px ${
                  totalIssues > 0
                    ? 'rgba(239, 68, 68, 0.7)'
                    : 'rgba(59, 130, 246, 0.7)'
                })`,
              }}
            />
            {/* Inner glow circle */}
            <circle
              cx='45'
              cy='45'
              r='30'
              fill='none'
              stroke={
                totalIssues > 0
                  ? 'rgba(239, 68, 68, 0.3)'
                  : 'rgba(59, 130, 246, 0.3)'
              }
              strokeWidth='1'
              style={{
                animation:
                  totalIssues > 0
                    ? 'criticalPulse 2s infinite'
                    : 'neonPulse 3s infinite',
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
              color: totalIssues > 0 ? '#ef4444' : '#3b82f6',
              fontSize: '1.1rem',
              fontWeight: '800',
              textShadow: `0 0 15px ${
                totalIssues > 0
                  ? 'rgba(239, 68, 68, 0.5)'
                  : 'rgba(59, 130, 246, 0.5)'
              }`,
            }}
          >
            <span style={{ fontSize: '1.4rem', lineHeight: '1' }}>
              {Math.round(overallProgress)}%
            </span>
            <span
              style={{
                fontSize: '0.6rem',
                opacity: 0.9,
                fontWeight: '600',
                letterSpacing: '1px',
              }}
            >
              COMPLETE
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Status Summary */}
      <div className='text-center mb-4'>
        <h5
          style={{
            color: 'white',
            margin: 0,
            fontSize: '1.3rem',
            fontWeight: '800',
            marginBottom: '6px',
            background: 'linear-gradient(135deg, #ffffff, #e2e8f0, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            letterSpacing: '0.5px',
          }}
        >
          Application #{application.id}
        </h5>

        {/* Critical Issues Alert */}
        {totalIssues > 0 && (
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.25))',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '16px',
              padding: '10px 14px',
              marginBottom: '12px',
              animation: 'issueAlert 2s infinite',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.2)',
            }}
          >
            <div className='d-flex align-items-center justify-content-center gap-3'>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  boxShadow: '0 0 12px #ef4444',
                  animation: 'criticalPulse 1s infinite',
                }}
              />
              <span
                style={{
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                ⚠️ {totalIssues} Critical Issue
                {totalIssues !== 1 ? 's' : ''} Detected
              </span>
            </div>
          </div>
        )}

        {/* Enhanced Current Status */}
        <div
          style={{
            background: nextActionStep
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))'
              : completedSteps === totalSteps
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
            border: nextActionStep
              ? '1px solid rgba(245, 158, 11, 0.4)'
              : completedSteps === totalSteps
              ? '1px solid rgba(16, 185, 129, 0.4)'
              : '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '14px',
            padding: '8px 16px',
            boxShadow: nextActionStep
              ? '0 4px 20px rgba(245, 158, 11, 0.2)'
              : completedSteps === totalSteps
              ? '0 4px 20px rgba(16, 185, 129, 0.2)'
              : '0 4px 20px rgba(59, 130, 246, 0.2)',
          }}
        >
          <div
            style={{
              color: nextActionStep
                ? '#f59e0b'
                : completedSteps === totalSteps
                ? '#10b981'
                : '#3b82f6',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textAlign: 'center',
            }}
          >
            {nextActionStep
              ? `🔥 Action Required: ${nextActionStep.title}`
              : completedSteps === totalSteps
              ? '✅ All Stages Complete'
              : `⏳ In Progress`}
          </div>
        </div>
      </div>

      {/* Enhanced Progress Stats */}
      <div className='d-flex justify-content-between'>
        <div className='text-center' style={{ flex: 1 }}>
          <div
            style={{
              color: '#10b981',
              fontSize: '1.4rem',
              fontWeight: '800',
              textShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
            }}
          >
            {completedSteps}
          </div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}
          >
            Complete
          </div>
        </div>
        <div className='text-center' style={{ flex: 1 }}>
          <div
            style={{
              color: '#f59e0b',
              fontSize: '1.4rem',
              fontWeight: '800',
              textShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
            }}
          >
            {totalSteps - completedSteps}
          </div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}
          >
            Pending
          </div>
        </div>
        <div className='text-center' style={{ flex: 1 }}>
          <div
            style={{
              color: totalIssues > 0 ? '#ef4444' : '#6b7280',
              fontSize: '1.4rem',
              fontWeight: '800',
              textShadow:
                totalIssues > 0 ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none',
            }}
          >
            {totalIssues}
          </div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}
          >
            Issues
          </div>
        </div>
      </div>
    </div>
  );
};

export default StagesHeader;
