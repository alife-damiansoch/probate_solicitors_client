import { getStepIcon } from './StageIcons';
import { getStepTheme } from './StageTheme.jsx';

const StagesTimeline = ({
  steps,
  hoveredStep,
  setHoveredStep,
  setHighlightedSectionId,
  highlitedSectionId,
}) => {
  // Pre-calculate step accessibility: a step is enabled if ALL previous steps have issueCount === 0
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
            'linear-gradient(180deg, rgba(59, 130, 246, 0.3) 0%, transparent 100%)',
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
              // Apply pointer events and visual effect if disabled
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
            {/* Compact Timeline Connector */}
            {!isLastStep && (
              <div
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '42px',
                  width: '2px',
                  height: '16px',
                  background: step.completed
                    ? 'linear-gradient(180deg, #10b981, rgba(16, 185, 129, 0.3))'
                    : 'linear-gradient(180deg, rgba(107, 114, 128, 0.3), rgba(107, 114, 128, 0.1))',
                  borderRadius: '1px',
                  boxShadow: step.completed
                    ? '0 0 6px rgba(16, 185, 129, 0.3)'
                    : 'none',
                }}
              />
            )}

            {/* Compact Step Icon */}
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
                boxShadow: `${theme.glow}, 0 3px 10px rgba(0, 0, 0, 0.2)`,
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

              {/* Compact Issue Count Badge */}
              {hasIssues && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '18px',
                    height: '18px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.6rem',
                    fontWeight: '800',
                    border: '2px solid #0a0f1c',
                    animation: 'criticalPulse 1.5s infinite',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
                  }}
                >
                  {step.issueCount}
                </div>
              )}

              {/* Compact Step Number */}
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
                  border: '2px solid #0a0f1c',
                  boxShadow: `0 0 6px ${theme.accent}40`,
                }}
              >
                {index + 1}
              </div>
            </div>

            {/* Compact Step Content */}
            <div
              className='ms-3 flex-grow-1'
              style={{ minWidth: 0, position: 'relative' }}
            >
              {/* 3D Floating Progress Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  zIndex: 3,
                  background: hasIssues
                    ? 'linear-gradient(145deg, #ef4444, #dc2626, #b91c1c)'
                    : `linear-gradient(145deg, ${theme.accent}, ${
                        theme.accentLight || theme.accent
                      }, ${theme.accent}cc)`,
                  border: hasIssues
                    ? '2px solid rgba(239, 68, 68, 0.6)'
                    : `2px solid ${theme.accent}60`,
                  borderRadius: '12px',
                  padding: '4px 8px',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  letterSpacing: '0.3px',
                  boxShadow: hasIssues
                    ? '0 4px 12px rgba(239, 68, 68, 0.4), 0 8px 24px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    : `0 4px 12px ${theme.accent}40, 0 8px 24px ${theme.accent}20, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
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
                  // 3D effect
                  background: hasIssues
                    ? `linear-gradient(145deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%),
                       linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
                    : `linear-gradient(145deg, ${theme.accent} 0%, ${
                        theme.accentLight || theme.accent
                      } 50%, ${theme.accent}cc 100%),
                       linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
                  backgroundBlendMode: 'overlay',
                }}
              >
                {step.progress}%
              </div>

              <div
                style={{
                  background: `linear-gradient(145deg, 
                    rgba(15, 23, 42, 0.95) 0%, 
                    rgba(30, 41, 59, 0.95) 25%, 
                    rgba(51, 65, 85, 0.95) 50%, 
                    rgba(30, 41, 59, 0.95) 75%, 
                    rgba(15, 23, 42, 0.95) 100%)`,
                  border: hasIssues
                    ? '1px solid rgba(239, 68, 68, 0.5)'
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
                      ? `0 8px 25px rgba(0, 0, 0, 0.3), 
                       0 16px 40px rgba(0, 0, 0, 0.15), 
                       0 0 20px ${theme.accent}20,
                       inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                      : `0 4px 15px rgba(0, 0, 0, 0.2), 
                       0 8px 25px rgba(0, 0, 0, 0.1),
                       inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
                  cursor: enabled ? 'pointer' : 'not-allowed',
                  // 3D depth effect
                  borderImage: hasIssues
                    ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.2)) 1'
                    : `linear-gradient(145deg, ${theme.accent}60, ${theme.accent}20) 1`,
                  filter: enabled
                    ? 'none'
                    : 'blur(1px) grayscale(0.4) brightness(0.7) saturate(0.5)',
                }}
              >
                {/* Enhanced 3D Shimmer Effect */}
                {step.actionRequired && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: `linear-gradient(90deg, 
                          transparent, 
                          ${hasIssues ? '#ef4444' : theme.accent}80, 
                          rgba(255, 255, 255, 0.4),
                          ${hasIssues ? '#ef4444' : theme.accent}80,
                          transparent)`,
                        animation: 'progressShimmer 2s infinite',
                        borderRadius: '16px 16px 0 0',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        right: '2px',
                        height: '1px',
                        background:
                          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                        animation: 'progressShimmer 3s infinite reverse',
                      }}
                    />
                  </>
                )}

                {/* 3D Title with Action Indicator */}
                <div className='d-flex align-items-center gap-2 mb-2'>
                  <h6
                    style={{
                      color: 'white',
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      textShadow: `0 0 10px ${theme.accent}40, 0 2px 4px rgba(0, 0, 0, 0.3)`,
                      letterSpacing: '0.2px',
                      lineHeight: '1.3',
                      flex: 1,
                      minWidth: 0,
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      background:
                        'linear-gradient(145deg, #ffffff, #e2e8f0, #cbd5e1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
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
                          ? 'linear-gradient(145deg, #ef4444, #dc2626, #b91c1c)'
                          : `linear-gradient(145deg, ${theme.accent}, ${
                              theme.accentLight || theme.accent
                            })`,
                        boxShadow: hasIssues
                          ? '0 0 8px #ef4444, 0 2px 4px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          : `0 0 8px ${theme.accent}, 0 2px 4px ${theme.accent}40, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                        animation: hasIssues
                          ? 'criticalPulse 1s infinite'
                          : 'warningPulse 2s infinite',
                        flexShrink: 0,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    />
                  )}
                </div>

                {/* Enhanced 3D Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '4px',
                    background:
                      'linear-gradient(145deg, rgba(107, 114, 128, 0.3), rgba(107, 114, 128, 0.1))',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginBottom: '10px',
                    position: 'relative',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(107, 114, 128, 0.2)',
                  }}
                >
                  <div
                    style={{
                      width: `${step.progress}%`,
                      height: '100%',
                      background: hasIssues
                        ? 'linear-gradient(145deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)'
                        : `linear-gradient(145deg, ${theme.accent} 0%, ${
                            theme.accentLight || theme.accent
                          } 50%, ${theme.accent}cc 100%)`,
                      borderRadius: '2px',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: hasIssues
                        ? '0 0 8px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                        : `0 0 8px ${theme.accent}50, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                      position: 'relative',
                      border: hasIssues
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : `1px solid ${theme.accent}30`,
                    }}
                  >
                    {/* Enhanced progress shimmer with 3D effect */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.4), transparent)',
                        animation:
                          step.progress > 0
                            ? 'progressShimmer 2s infinite'
                            : 'none',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>

                {/* Enhanced 3D Description */}
                <div>
                  <p
                    style={{
                      color: hasIssues ? '#fca5a5' : '#e2e8f0',
                      margin: 0,
                      fontSize: '0.75rem',
                      lineHeight: '1.4',
                      fontWeight: hasIssues ? '600' : '500',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Enhanced 3D Action Button */}
                {step.actionText && step.actionRequired && (
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      background: hasIssues
                        ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15), rgba(185, 28, 28, 0.1))'
                        : `linear-gradient(145deg, ${theme.accent}20, ${theme.accent}15, ${theme.accent}08)`,
                      border: hasIssues
                        ? '1px solid rgba(239, 68, 68, 0.4)'
                        : `1px solid ${theme.accent}30`,
                      borderRadius: '10px',
                      cursor: enabled ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      boxShadow: hasIssues
                        ? '0 2px 8px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : `0 2px 8px ${theme.accent}15, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
                      backdropFilter: 'blur(10px)',
                      filter: enabled
                        ? 'none'
                        : 'blur(1.2px) grayscale(0.4) brightness(0.8) saturate(0.6)',
                      pointerEvents: enabled ? 'auto' : 'none',
                    }}
                    onClick={(e) => {
                      if (!enabled) return;
                      e.stopPropagation();
                      setHighlightedSectionId &&
                        setHighlightedSectionId(step.sectionId);
                    }}
                    onMouseEnter={(e) => {
                      if (!enabled) return;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = hasIssues
                        ? '0 4px 12px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                        : `0 4px 12px ${theme.accent}25, inset 0 1px 0 rgba(255, 255, 255, 0.15)`;
                    }}
                    onMouseLeave={(e) => {
                      if (!enabled) return;
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = hasIssues
                        ? '0 2px 8px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : `0 2px 8px ${theme.accent}15, inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
                    }}
                  >
                    <div className='d-flex align-items-center justify-content-between'>
                      <span
                        style={{
                          color: hasIssues ? '#ef4444' : theme.accent,
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          textShadow: hasIssues
                            ? '0 1px 2px rgba(239, 68, 68, 0.3)'
                            : `0 1px 2px ${theme.accent}30`,
                        }}
                      >
                        {step.actionText}
                      </span>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: hasIssues
                            ? 'linear-gradient(145deg, #ef4444, #dc2626)'
                            : `linear-gradient(145deg, ${theme.accent}, ${
                                theme.accentLight || theme.accent
                              })`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: hasIssues
                            ? '0 2px 6px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                            : `0 2px 6px ${theme.accent}30, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <svg
                          width='6'
                          height='6'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='white'
                          strokeWidth='3'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          style={{
                            filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))',
                          }}
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

      {/* Scroll Indicator Gradient at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '8px',
          background:
            'linear-gradient(0deg, rgba(59, 130, 246, 0.3) 0%, transparent 100%)',
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
              background: 'rgba(59, 130, 246, 0.4)',
              borderRadius: '2px',
              animation: `scrollIndicator 2s infinite ${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Additional CSS for scroll indicators */}
      <style jsx>{`
        @keyframes scrollIndicator {
          0%,
          100% {
            opacity: 0.3;
            transform: scaleY(0.5);
          }
          50% {
            opacity: 1;
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

export default StagesTimeline;
