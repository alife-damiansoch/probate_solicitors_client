import { getStepIcon } from './StageIcons';
import { getStepTheme } from './StageTheme.jsx';

const StagesTimeline = ({
  steps,
  hoveredStep,
  setHoveredStep,
  setHighlightedSectionId,
  highlitedSectionId,
}) => {
  // Step accessibility: a step is enabled if ALL previous steps have issueCount === 0
  const stepEnabled = steps.map((step, i) =>
    steps.slice(0, i).every((prev) => prev.issueCount === 0)
  );

  return (
    <div style={{ padding: '12px 18px', position: 'relative' }}>
      {/* Scroll Indicator Gradient at Top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background:
            'linear-gradient(180deg, var(--primary-30) 0%, transparent 100%)',
          borderRadius: '0 0 8px 8px',
          zIndex: 1,
        }}
      />

      {/* Timeline Steps */}
      {steps.map((step, index) => {
        const theme = getStepTheme(step);
        const isLastStep = index === steps.length - 1;
        const hasIssues = step.issueCount > 0;
        const enabled = stepEnabled[index];

        return (
          <div
            key={step.id}
            className='position-relative d-flex'
            style={{
              marginBottom: isLastStep ? '0' : '16px',
              pointerEvents: enabled ? 'auto' : 'none',
              filter: enabled
                ? 'none'
                : 'blur(1.5px) grayscale(0.3) brightness(0.7) saturate(0.4)',
              opacity: enabled ? 1 : 0.55,
              transition: 'filter 0.3s, opacity 0.3s',
              position: 'relative',
            }}
            onMouseEnter={() => enabled && setHoveredStep(step.id)}
            onMouseLeave={() => enabled && setHoveredStep(null)}
            onClick={() =>
              enabled &&
              setHighlightedSectionId &&
              setHighlightedSectionId(step.sectionId)
            }
            role={enabled ? 'button' : undefined}
            tabIndex={enabled ? 0 : -1}
          >
            {/* Timeline Connector */}
            {!isLastStep && (
              <div
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '42px',
                  width: '2px',
                  height: '16px',
                  background: step.completed
                    ? 'linear-gradient(180deg, var(--success-primary) 0%, var(--success-30))'
                    : 'linear-gradient(180deg, var(--border-muted) 0%, var(--border-subtle))',
                  borderRadius: '1px',
                  boxShadow: step.completed
                    ? '0 0 6px var(--success-30)'
                    : 'none',
                }}
              />
            )}

            {/* Step Icon */}
            <div
              style={{
                width: '42px',
                height: '42px',
                background: theme.bg,
                borderRadius: '50%',
                border: `2px solid ${theme.accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                boxShadow: `${theme.glow}, 0 3px 10px var(--bg-quaternary)`,
                animation: step.actionRequired
                  ? hasIssues
                    ? 'criticalPulse 2s infinite'
                    : 'warningPulse 2s infinite'
                  : 'none',
                position: 'relative',
                zIndex: 2,
                flexShrink: 0,
                transform: hoveredStep === step.id ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: enabled ? 'pointer' : 'not-allowed',
                filter: enabled
                  ? 'none'
                  : 'blur(1px) grayscale(0.4) brightness(0.7) saturate(0.4)',
              }}
            >
              {getStepIcon(step.icon, theme, step.completed)}

              {/* Issue Count Badge */}
              {hasIssues && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '18px',
                    height: '18px',
                    background:
                      'linear-gradient(135deg, var(--error-primary), var(--error-dark))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.6rem',
                    fontWeight: '800',
                    border: '2px solid var(--bg-quaternary)',
                    animation: 'criticalPulse 1.5s infinite',
                    boxShadow: '0 0 10px var(--error-30)',
                  }}
                >
                  {step.issueCount}
                </div>
              )}

              {/* Step Number */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '16px',
                  background: `linear-gradient(135deg, ${theme.accent}, ${
                    theme.accentLight || theme.accent
                  })`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.6rem',
                  fontWeight: '800',
                  border: '2px solid var(--bg-quaternary)',
                  boxShadow: `0 0 6px ${theme.accent}40`,
                }}
              >
                {index + 1}
              </div>
            </div>

            {/* Step Content */}
            <div
              className='ms-3 flex-grow-1'
              style={{ minWidth: 0, position: 'relative' }}
            >
              {/* Progress Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  zIndex: 3,
                  background: hasIssues
                    ? 'linear-gradient(145deg, var(--error-primary), var(--error-dark))'
                    : `linear-gradient(145deg, ${theme.accent}, ${
                        theme.accentLight || theme.accent
                      }, ${theme.accent}cc)`,
                  border: hasIssues
                    ? '2px solid var(--error-30)'
                    : `2px solid ${theme.accent}60`,
                  borderRadius: '12px',
                  padding: '4px 8px',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  letterSpacing: '0.3px',
                  boxShadow: hasIssues
                    ? '0 4px 12px var(--error-20), 0 8px 24px var(--error-10), inset 0 1px 0 var(--white-10)'
                    : `0 4px 12px ${theme.accent}40, 0 8px 24px ${theme.accent}20, inset 0 1px 0 var(--white-10)`,
                  transform:
                    hoveredStep === step.id
                      ? 'translateY(-2px) scale(1.05)'
                      : 'translateY(0) scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(10px)',
                  animation: step.actionRequired
                    ? hasIssues
                      ? 'criticalPulse 2s infinite'
                      : 'warningPulse 2s infinite'
                    : 'none',
                  backgroundBlendMode: 'overlay',
                }}
              >
                {step.progress}%
              </div>

              <div
                style={{
                  background: 'var(--gradient-surface)',
                  border: hasIssues
                    ? '1px solid var(--error-30)'
                    : `1px solid ${theme.accent}50`,
                  borderRadius: '16px',
                  padding: '14px 18px',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform:
                    hoveredStep === step.id
                      ? 'translateX(4px) translateY(-2px) scale(1.02)'
                      : 'translateX(0) translateY(0) scale(1)',
                  boxShadow:
                    hoveredStep === step.id
                      ? `0 8px 25px var(--bg-quaternary), 0 16px 40px var(--primary-10), 0 0 20px ${theme.accent}20, inset 0 1px 0 var(--white-10)`
                      : `0 4px 15px var(--bg-quaternary), 0 8px 25px var(--primary-10), inset 0 1px 0 var(--white-05)`,
                  cursor: enabled ? 'pointer' : 'not-allowed',
                  borderImage: hasIssues
                    ? 'linear-gradient(145deg, var(--error-30), var(--error-10)) 1'
                    : `linear-gradient(145deg, ${theme.accent}60, ${theme.accent}20) 1`,
                  filter: enabled
                    ? 'none'
                    : 'blur(1px) grayscale(0.4) brightness(0.7) saturate(0.5)',
                }}
              >
                {/* Shimmer for action step */}
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
                          hasIssues ? 'var(--error-primary)' : theme.accent
                        }80, var(--white-10), ${
                          hasIssues ? 'var(--error-primary)' : theme.accent
                        }80, transparent)`,
                        animation: 'progressShimmer 2s infinite',
                        borderRadius: '16px 16px 0 0',
                      }}
                    />
                  </>
                )}

                {/* Step Title & Action Indicator */}
                <div className='d-flex align-items-center gap-2 mb-2'>
                  <h6
                    style={{
                      color: 'var(--text-primary)',
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      textShadow: `0 0 10px ${theme.accent}40, 0 2px 4px var(--bg-quaternary)`,
                      letterSpacing: '0.2px',
                      lineHeight: '1.3',
                      flex: 1,
                      minWidth: 0,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      background:
                        'linear-gradient(145deg, var(--text-primary), var(--text-secondary), var(--text-tertiary))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 1px 2px var(--bg-quaternary))',
                    }}
                  >
                    {step.title}
                  </h6>
                  {step.actionRequired && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: hasIssues
                          ? 'linear-gradient(145deg, var(--error-primary), var(--error-dark))'
                          : `linear-gradient(145deg, ${theme.accent}, ${
                              theme.accentLight || theme.accent
                            })`,
                        boxShadow: hasIssues
                          ? '0 0 8px var(--error-primary), 0 2px 4px var(--error-20), inset 0 1px 0 var(--white-10)'
                          : `0 0 8px ${theme.accent}, 0 2px 4px ${theme.accent}40, inset 0 1px 0 var(--white-10)`,
                        animation: hasIssues
                          ? 'criticalPulse 1s infinite'
                          : 'warningPulse 2s infinite',
                        flexShrink: 0,
                        border: '1px solid var(--white-10)',
                      }}
                    />
                  )}
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    background:
                      'linear-gradient(145deg, var(--border-muted), var(--border-subtle))',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginBottom: '10px',
                    position: 'relative',
                    boxShadow: 'inset 0 1px 2px var(--bg-quaternary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: `${step.progress}%`,
                      height: '100%',
                      background: hasIssues
                        ? 'linear-gradient(145deg, var(--error-primary) 0%, var(--error-dark) 100%)'
                        : `linear-gradient(145deg, ${theme.accent} 0%, ${
                            theme.accentLight || theme.accent
                          } 100%)`,
                      borderRadius: '2px',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: hasIssues
                        ? '0 0 8px var(--error-20), inset 0 1px 0 var(--white-10)'
                        : `0 0 8px ${theme.accent}50, inset 0 1px 0 var(--white-10)`,
                      position: 'relative',
                      border: hasIssues
                        ? '1px solid var(--error-20)'
                        : `1px solid ${theme.accent}30`,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'linear-gradient(90deg, transparent, var(--white-10), var(--white-15), var(--white-10), transparent)',
                        animation:
                          step.progress > 0
                            ? 'progressShimmer 2s infinite'
                            : 'none',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>

                {/* Step Description */}
                <div>
                  <p
                    style={{
                      color: hasIssues
                        ? 'var(--error-light)'
                        : 'var(--text-secondary)',
                      margin: 0,
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                      fontWeight: hasIssues ? '600' : '500',
                      textShadow: '0 1px 2px var(--bg-quaternary)',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Scroll Indicator Gradient at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '8px',
          background:
            'linear-gradient(0deg, var(--primary-30) 0%, transparent 100%)',
          borderRadius: '8px 8px 0 0',
          zIndex: 1,
        }}
      />

      {/* Floating Scroll Indicators */}
      <div
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 2,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '3px',
              height: '12px',
              background: 'var(--primary-30)',
              borderRadius: '2px',
              animation: `scrollIndicator 2s infinite ${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Additional CSS for scroll indicators */}
      <style>{`
        @keyframes scrollIndicator {
          0%,100% { opacity: 0.3; transform: scaleY(0.5);}
          50% { opacity: 1; transform: scaleY(1);}
        }
        @keyframes progressShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes criticalPulse {
          0%,100% { box-shadow: 0 4px 15px var(--error-40), 0 0 30px var(--error-20);}
          50% { box-shadow: 0 6px 25px var(--error-primary), 0 0 40px var(--error-40);}
        }
        @keyframes warningPulse {
          0%,100% { box-shadow: 0 4px 15px var(--warning-40), 0 0 30px var(--warning-20);}
          50% { box-shadow: 0 6px 25px var(--warning-primary), 0 0 40px var(--warning-40);}
        }
      `}</style>
    </div>
  );
};

export default StagesTimeline;
