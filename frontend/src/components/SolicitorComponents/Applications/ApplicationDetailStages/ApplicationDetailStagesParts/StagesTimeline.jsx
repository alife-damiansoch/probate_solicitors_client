// ApplicationDetailStagesParts/StagesTimeline.js
import { getStepIcon } from './StageIcons';
import { getStepTheme } from './StageTheme.jsx';

const StagesTimeline = ({
  steps,
  hoveredStep,
  setHoveredStep,
  setHighlightedSectionId,
  highlitedSectionId,
}) => {
  return (
    <div style={{ padding: '24px 18px' }}>
      {steps.map((step, index) => {
        const theme = getStepTheme(step);
        const isLastStep = index === steps.length - 1;
        const hasIssues = step.issueCount > 0;

        return (
          <div
            key={step.id}
            className='position-relative d-flex'
            style={{ marginBottom: isLastStep ? '0' : '28px' }}
            onMouseEnter={() => setHoveredStep(step.id)}
            onMouseLeave={() => setHoveredStep(null)}
            onClick={() =>
              setHighlightedSectionId && setHighlightedSectionId(step.sectionId)
            }
            role='button'
            tabIndex={0}
          >
            {/* Enhanced Timeline Connector */}
            {!isLastStep && (
              <div
                style={{
                  position: 'absolute',
                  left: '25px',
                  top: '56px',
                  width: '3px',
                  height: '28px',
                  background: step.completed
                    ? 'linear-gradient(180deg, #10b981, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.2))'
                    : 'linear-gradient(180deg, rgba(107, 114, 128, 0.3), rgba(107, 114, 128, 0.1))',
                  borderRadius: '2px',
                  boxShadow: step.completed
                    ? '0 0 8px rgba(16, 185, 129, 0.3)'
                    : 'none',
                }}
              />
            )}

            {/* Enhanced Step Icon */}
            <div
              style={{
                width: '52px',
                height: '52px',
                background: theme.bg,
                borderRadius: '50%',
                border: `3px solid ${theme.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                boxShadow: `${theme.glow}, 0 4px 15px rgba(0, 0, 0, 0.3)`,
                animation: step.actionRequired
                  ? hasIssues
                    ? 'criticalPulse 2s infinite'
                    : 'warningPulse 2s infinite'
                  : 'none',
                position: 'relative',
                zIndex: 2,
                flexShrink: 0,
                transform: hoveredStep === step.id ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
              }}
            >
              {getStepIcon(step.icon, theme, step.completed)}

              {/* Enhanced Issue Count Badge */}
              {hasIssues && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '24px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    border: '3px solid #0a0f1c',
                    animation: 'criticalPulse 1.5s infinite',
                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)',
                  }}
                >
                  {step.issueCount}
                </div>
              )}

              {/* Enhanced Step Number */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '20px',
                  background: `linear-gradient(135deg, ${theme.accent}, ${
                    theme.accentLight || theme.accent
                  })`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  border: '3px solid #0a0f1c',
                  boxShadow: `0 0 10px ${theme.accent}40`,
                }}
              >
                {index + 1}
              </div>
            </div>

            {/* Enhanced Step Content */}
            <div className='ms-3 flex-grow-1' style={{ minWidth: 0 }}>
              <div
                style={{
                  background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.9) 100%)`,
                  border: hasIssues
                    ? '1px solid rgba(239, 68, 68, 0.5)'
                    : `1px solid ${theme.accent}50`,
                  borderRadius: '16px',
                  padding: '16px 20px',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform:
                    hoveredStep === step.id
                      ? 'translateX(6px)'
                      : 'translateX(0)',
                  boxShadow:
                    hoveredStep === step.id
                      ? `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px ${theme.accent}30`
                      : '0 4px 20px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                }}
              >
                {/* Enhanced Shimmer Effect */}
                {step.actionRequired && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: `linear-gradient(90deg, transparent, ${
                          hasIssues ? '#ef4444' : theme.accent
                        }80, transparent)`,
                        animation: 'progressShimmer 2s infinite',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${
                          hasIssues ? '#ef4444' : theme.accent
                        }40, transparent)`,
                        animation: 'progressShimmer 3s infinite reverse',
                      }}
                    />
                  </>
                )}

                {/* Title and Status */}
                <div className='d-flex align-items-center justify-content-between mb-3'>
                  <h6
                    style={{
                      color: 'white',
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: '700',
                      textShadow: `0 0 15px ${theme.accent}50`,
                      letterSpacing: '0.3px',
                    }}
                  >
                    {step.title}
                  </h6>

                  {/* Enhanced Status Indicator */}
                  <div className='d-flex align-items-center gap-2'>
                    {step.actionRequired && (
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: hasIssues ? '#ef4444' : theme.accent,
                          boxShadow: `0 0 12px ${
                            hasIssues ? '#ef4444' : theme.accent
                          }`,
                          animation: hasIssues
                            ? 'criticalPulse 1s infinite'
                            : 'warningPulse 2s infinite',
                        }}
                      />
                    )}

                    {/* Progress Percentage Badge */}
                    <div
                      style={{
                        background: `${hasIssues ? '#ef4444' : theme.accent}20`,
                        border: `1px solid ${
                          hasIssues ? '#ef4444' : theme.accent
                        }40`,
                        borderRadius: '8px',
                        padding: '2px 8px',
                        color: hasIssues ? '#ef4444' : theme.accent,
                        fontSize: '0.7rem',
                        fontWeight: '700',
                      }}
                    >
                      {step.progress}%
                    </div>
                  </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    background: 'rgba(107, 114, 128, 0.25)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginBottom: '12px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${step.progress}%`,
                      height: '100%',
                      background: hasIssues
                        ? 'linear-gradient(90deg, #ef4444, #dc2626, #b91c1c)'
                        : `linear-gradient(90deg, ${theme.accent}, ${
                            theme.accentLight || theme.accent
                          }, ${theme.accent})`,
                      borderRadius: '2px',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 0 12px ${
                        hasIssues ? '#ef444460' : theme.accent + '60'
                      }`,
                      position: 'relative',
                    }}
                  >
                    {/* Progress shimmer */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                        animation:
                          step.progress > 0
                            ? 'progressShimmer 2s infinite'
                            : 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Enhanced Description */}
                <div style={{ marginBottom: '8px' }}>
                  <p
                    style={{
                      color: hasIssues ? '#fca5a5' : '#e2e8f0',
                      margin: 0,
                      fontSize: '0.85rem',
                      lineHeight: '1.4',
                      fontWeight: hasIssues ? '600' : '500',
                      marginBottom: '6px',
                    }}
                  >
                    {step.description}
                  </p>

                  {/* Detailed Description */}
                  <p
                    style={{
                      color: '#94a3b8',
                      margin: 0,
                      fontSize: '0.75rem',
                      lineHeight: '1.3',
                      fontWeight: '400',
                    }}
                  >
                    {step.detailDescription}
                  </p>
                </div>

                {/* Action Button */}
                {step.actionText && step.actionRequired && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: hasIssues
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))'
                        : `linear-gradient(135deg, ${theme.accent}20, ${theme.accent}10)`,
                      border: hasIssues
                        ? '1px solid rgba(239, 68, 68, 0.4)'
                        : `1px solid ${theme.accent}30`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHighlightedSectionId &&
                        setHighlightedSectionId(step.sectionId);
                    }}
                  >
                    <div className='d-flex align-items-center justify-content-between'>
                      <span
                        style={{
                          color: hasIssues ? '#ef4444' : theme.accent,
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {step.actionText}
                      </span>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: hasIssues ? '#ef4444' : theme.accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg
                          width='8'
                          height='8'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='white'
                          strokeWidth='3'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <polyline points='9,18 15,12 9,6' />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StagesTimeline;
