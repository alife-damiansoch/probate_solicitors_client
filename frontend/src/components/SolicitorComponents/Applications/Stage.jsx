import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  XCircle,
  Zap,
} from 'lucide-react';
import { useEffect } from 'react';

const Stage = ({
  stage,
  completed,
  rejected,
  advancement,
  setRejectedInAnyStage,
  setApprovedInAnyStage,
}) => {
  // Component-level styles with cutting-edge design
  const styles = {
    stageContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '8px 12px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      minWidth: '80px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    stageContainerHover: {
      transform: 'translateY(-2px) scale(1.02)',
      background: 'rgba(255, 255, 255, 0.12)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      marginBottom: '4px',
      transition: 'all 0.2s ease',
      position: 'relative',
    },
    iconContainerSuccess: {
      background:
        'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.1) 100%)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
    },
    iconContainerDanger: {
      background:
        'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.1) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    iconContainerWarning: {
      background:
        'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.1) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    icon: {
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
      transition: 'all 0.2s ease',
    },
    iconHover: {
      transform: 'scale(1.1)',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))',
    },
    text: {
      fontSize: '0.7rem',
      fontWeight: '600',
      textAlign: 'center',
      lineHeight: '1.2',
      color: 'rgba(255, 255, 255, 0.9)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100px',
    },
    textSuccess: {
      color: '#22c55e',
    },
    textDanger: {
      color: '#ef4444',
    },
    textWarning: {
      color: '#f59e0b',
    },
    glowEffect: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
      transition: 'left 0.6s ease',
    },
    pulseAnimation: {
      animation: 'pulse 2s infinite',
    },
    mobileStyles: {
      padding: '6px 8px',
      minWidth: '60px',
    },
    mobileText: {
      fontSize: '0.6rem',
      maxWidth: '80px',
    },
    mobileIcon: {
      width: '24px',
      height: '24px',
    },
  };

  // Use a single useEffect to handle all state updates
  useEffect(() => {
    if (rejected === true) {
      setRejectedInAnyStage(true);
    } else {
      if (rejected === false && completed !== undefined && advancement) {
        if (
          completed === true &&
          advancement !== null &&
          advancement.needs_committee_approval === true &&
          advancement.is_committee_approved === false
        ) {
          setRejectedInAnyStage(true);
        }

        if (
          completed === true &&
          advancement !== null &&
          advancement.needs_committee_approval === false
        ) {
          setApprovedInAnyStage(true);
        }

        if (
          completed === true &&
          advancement !== null &&
          advancement.needs_committee_approval === true &&
          advancement.is_committee_approved === true
        ) {
          setApprovedInAnyStage(true);
        }
      }
    }
  }, [
    completed,
    rejected,
    advancement,
    setRejectedInAnyStage,
    setApprovedInAnyStage,
  ]);

  const getStageConfig = () => {
    if (stage === 'Approved') {
      if (!completed && !rejected) {
        return {
          icon: Clock,
          iconColor: '#f59e0b',
          text: 'Awaiting decision',
          textStyle: styles.textWarning,
          iconContainerStyle: styles.iconContainerWarning,
          pulseAnimation: true,
        };
      }

      if (!completed && rejected) {
        return {
          icon: XCircle,
          iconColor: '#ef4444',
          text: 'Rejected',
          textStyle: styles.textDanger,
          iconContainerStyle: styles.iconContainerDanger,
        };
      }

      if (completed && advancement?.needs_committee_approval === false) {
        return {
          icon: CheckCircle2,
          iconColor: '#22c55e',
          text: 'Approved',
          textStyle: styles.textSuccess,
          iconContainerStyle: styles.iconContainerSuccess,
        };
      }

      if (
        completed &&
        advancement?.needs_committee_approval &&
        advancement?.is_committee_approved
      ) {
        return {
          icon: Shield,
          iconColor: '#22c55e',
          text: 'Committee approved',
          textStyle: styles.textSuccess,
          iconContainerStyle: styles.iconContainerSuccess,
        };
      }

      if (
        completed &&
        advancement?.needs_committee_approval &&
        advancement?.is_committee_approved === false
      ) {
        return {
          icon: AlertTriangle,
          iconColor: '#ef4444',
          text: 'Committee rejected',
          textStyle: styles.textDanger,
          iconContainerStyle: styles.iconContainerDanger,
        };
      }

      if (
        completed &&
        advancement?.needs_committee_approval &&
        advancement?.is_committee_approved === null
      ) {
        return {
          icon: Zap,
          iconColor: '#f59e0b',
          text: 'Committee review',
          textStyle: styles.textWarning,
          iconContainerStyle: styles.iconContainerWarning,
          pulseAnimation: true,
        };
      }
    }

    // Default rendering for other stages
    if (stage && (completed !== undefined || rejected !== undefined)) {
      return {
        icon: completed ? CheckCircle2 : XCircle,
        iconColor: completed ? '#22c55e' : '#ef4444',
        text: stage,
        textStyle: completed ? styles.textSuccess : styles.textDanger,
        iconContainerStyle: completed
          ? styles.iconContainerSuccess
          : styles.iconContainerDanger,
      };
    }

    // Return null if no meaningful content to display
    return null;
  };

  const config = getStageConfig();

  // Don't render anything if no config or no meaningful content
  if (!config || (!config.text && !config.icon)) {
    return null;
  }
  const IconComponent = config.icon;

  return (
    <div
      className='d-flex flex-column align-items-center'
      style={{
        ...styles.stageContainer,
        ...(window.innerWidth <= 768 ? styles.mobileStyles : {}),
      }}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, styles.stageContainerHover);
        const icon = e.currentTarget.querySelector('.stage-icon');
        if (icon) {
          Object.assign(icon.style, styles.iconHover);
        }
        const glowEffect = e.currentTarget.querySelector('.glow-effect');
        if (glowEffect) {
          glowEffect.style.left = '100%';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        const icon = e.currentTarget.querySelector('.stage-icon');
        if (icon) {
          icon.style.transform = 'scale(1)';
          icon.style.filter = 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))';
        }
        const glowEffect = e.currentTarget.querySelector('.glow-effect');
        if (glowEffect) {
          glowEffect.style.left = '-100%';
        }
      }}
    >
      {/* Glow effect */}
      <div className='glow-effect' style={styles.glowEffect} />

      {/* Icon Container */}
      <div
        style={{
          ...styles.iconContainer,
          ...config.iconContainerStyle,
          ...(window.innerWidth <= 768 ? styles.mobileIcon : {}),
          ...(config.pulseAnimation ? styles.pulseAnimation : {}),
        }}
      >
        <IconComponent
          className='stage-icon'
          color={config.iconColor}
          size={window.innerWidth <= 768 ? 16 : 20}
          style={styles.icon}
          strokeWidth={2.5}
        />
      </div>

      {/* Text */}
      <span
        style={{
          ...styles.text,
          ...config.textStyle,
          ...(window.innerWidth <= 768 ? styles.mobileText : {}),
        }}
        title={config.text} // Tooltip for truncated text
      >
        {config.text}
      </span>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default Stage;
