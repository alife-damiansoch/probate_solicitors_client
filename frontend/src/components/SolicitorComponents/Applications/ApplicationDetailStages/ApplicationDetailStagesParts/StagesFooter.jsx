// ApplicationDetailStagesParts/StagesFooter.js

const StagesFooter = ({
  nextActionStep,
  completedSteps,
  totalSteps,
  application,
}) => {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        background:
          'linear-gradient(180deg, transparent, rgba(10, 15, 28, 0.95), rgba(10, 15, 28, 1))',
        backdropFilter: 'blur(20px)',
        padding: '20px 20px 24px',
        borderTop: '1px solid rgba(59, 130, 246, 0.3)',
      }}
    >
      {/* Next Action Alert */}
      {nextActionStep && (
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.25))',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.2)',
          }}
        >
          <div className='d-flex align-items-center gap-3 mb-2'>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#f59e0b',
                boxShadow: '0 0 12px #f59e0b',
                animation: 'warningPulse 2s infinite',
              }}
            />
            <span
              style={{
                color: '#f59e0b',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
              }}
            >
              🚀 Next Action Required
            </span>
          </div>
          <div
            style={{
              color: '#fbbf24',
              fontSize: '0.85rem',
              fontWeight: '600',
              lineHeight: '1.3',
            }}
          >
            {nextActionStep.title}
          </div>
          {nextActionStep.actionText && (
            <div
              style={{
                color: '#fed7aa',
                fontSize: '0.7rem',
                marginTop: '4px',
                fontWeight: '500',
              }}
            >
              Action: {nextActionStep.actionText}
            </div>
          )}
        </div>
      )}

      {/* Enhanced Quick Stats */}
      <div className='d-flex justify-content-between align-items-center'>
        <div
          style={{
            color: '#94a3b8',
            fontSize: '0.75rem',
            fontWeight: '500',
          }}
        >
          {completedSteps}/{totalSteps} stages completed
        </div>

        {application.solicitor && (
          <div
            style={{
              color: '#10b981',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
              }}
            >
              👨‍💼
            </div>
            <span>{application.solicitor.name || 'Assigned'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StagesFooter;
