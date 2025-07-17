import {
  AlertTriangle,
  CheckCircle,
  Clock,
  EuroIcon,
  FileCheck,
  XCircle,
  Zap,
} from 'lucide-react';

const StatusBadge = ({ type }) => {
  // Component-level styles with cutting-edge condensed design
  const styles = {
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      fontSize: '0.7rem',
      fontWeight: '600',
      borderRadius: '8px',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      userSelect: 'none',
      position: 'relative',
      overflow: 'hidden',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      letterSpacing: '0.01em',
      gap: '4px',
      textTransform: 'uppercase',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      boxShadow:
        '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      color: '#ffffff',
      whiteSpace: 'nowrap',
    },
    glowEffect: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      transition: 'left 0.4s ease',
    },
    icon: {
      fontSize: '0.8rem',
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
    },
  };

  // Condensed badge configurations
  const badgeConfigs = {
    success: {
      background:
        'linear-gradient(135deg, rgba(22, 163, 74, 0.9) 0%, rgba(21, 128, 61, 0.8) 50%, rgba(20, 83, 45, 0.9) 100%)',
      borderColor: '#16a34a',
      hoverBackground:
        'linear-gradient(135deg, rgba(22, 163, 74, 1) 0%, rgba(21, 128, 61, 0.95) 50%, rgba(20, 83, 45, 1) 100%)',
      hoverBorderColor: '#4ade80',
      hoverGlow: 'rgba(22, 163, 74, 0.4)',
      icon: FileCheck,
      text: 'Approved',
    },
    warning: {
      background:
        'linear-gradient(135deg, rgba(234, 88, 12, 0.9) 0%, rgba(194, 65, 12, 0.8) 50%, rgba(154, 52, 18, 0.9) 100%)',
      borderColor: '#ea580c',
      hoverBackground:
        'linear-gradient(135deg, rgba(234, 88, 12, 1) 0%, rgba(194, 65, 12, 0.95) 50%, rgba(154, 52, 18, 1) 100%)',
      hoverBorderColor: '#fb923c',
      hoverGlow: 'rgba(234, 88, 12, 0.4)',
      icon: Clock,
      text: 'In Progress',
    },
    danger: {
      background:
        'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.8) 50%, rgba(153, 27, 27, 0.9) 100%)',
      borderColor: '#dc2626',
      hoverBackground:
        'linear-gradient(135deg, rgba(220, 38, 38, 1) 0%, rgba(185, 28, 28, 0.95) 50%, rgba(153, 27, 27, 1) 100%)',
      hoverBorderColor: '#f87171',
      hoverGlow: 'rgba(220, 38, 38, 0.4)',
      icon: XCircle,
      text: 'Rejected',
    },
    purple: {
      background:
        'linear-gradient(135deg, rgba(126, 34, 206, 0.9) 0%, rgba(107, 33, 168, 0.8) 50%, rgba(88, 28, 135, 0.9) 100%)',
      borderColor: '#7e22ce',
      hoverBackground:
        'linear-gradient(135deg, rgba(126, 34, 206, 1) 0%, rgba(107, 33, 168, 0.95) 50%, rgba(88, 28, 135, 1) 100%)',
      hoverBorderColor: '#a855f7',
      hoverGlow: 'rgba(126, 34, 206, 0.4)',
      icon: Zap,
      text: 'Processing',
    },
    purpleReview: {
      background:
        'linear-gradient(135deg, rgba(126, 34, 206, 0.9) 0%, rgba(107, 33, 168, 0.8) 50%, rgba(88, 28, 135, 0.9) 100%)',
      borderColor: '#7e22ce',
      hoverBackground:
        'linear-gradient(135deg, rgba(126, 34, 206, 1) 0%, rgba(107, 33, 168, 0.95) 50%, rgba(88, 28, 135, 1) 100%)',
      hoverBorderColor: '#a855f7',
      hoverGlow: 'rgba(126, 34, 206, 0.4)',
      icon: AlertTriangle,
      text: 'Under Review',
    },
    blue: {
      background:
        'linear-gradient(135deg, rgba(29, 78, 216, 0.9) 0%, rgba(30, 64, 175, 0.8) 50%, rgba(30, 58, 138, 0.9) 100%)',
      borderColor: '#1d4ed8',
      hoverBackground:
        'linear-gradient(135deg, rgba(29, 78, 216, 1) 0%, rgba(30, 64, 175, 0.95) 50%, rgba(30, 58, 138, 1) 100%)',
      hoverBorderColor: '#3b82f6',
      hoverGlow: 'rgba(29, 78, 216, 0.4)',
      icon: CheckCircle,
      text: 'Settled',
    },
    gold: {
      background:
        'linear-gradient(135deg, rgba(202, 138, 4, 0.9) 0%, rgba(161, 98, 7, 0.8) 50%, rgba(133, 77, 14, 0.9) 100%)',
      borderColor: '#ca8a04',
      hoverBackground:
        'linear-gradient(135deg, rgba(202, 138, 4, 1) 0%, rgba(161, 98, 7, 0.95) 50%, rgba(133, 77, 14, 1) 100%)',
      hoverBorderColor: '#fbbf24',
      hoverGlow: 'rgba(202, 138, 4, 0.4)',
      icon: EuroIcon,
      text: 'Paid Out',
    },
  };

  const config = badgeConfigs[type];
  if (!config) {
    console.error(`Invalid badge type: ${type}`);
    return null;
  }

  const IconComponent = config.icon;

  return (
    <div
      style={{
        ...styles.badge,
        background: config.background,
        borderColor: config.borderColor,
      }}
      className='d-inline-flex align-items-center'
      onMouseEnter={(e) => {
        e.currentTarget.style.background = config.hoverBackground;
        e.currentTarget.style.borderColor = config.hoverBorderColor;
        e.currentTarget.style.boxShadow = `0 4px 12px ${config.hoverGlow}, inset 0 1px 0 rgba(255, 255, 255, 0.3)`;
        e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
        const glowEffect = e.currentTarget.querySelector('.glow-effect');
        if (glowEffect) {
          glowEffect.style.left = '100%';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = config.background;
        e.currentTarget.style.borderColor = config.borderColor;
        e.currentTarget.style.boxShadow =
          '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        const glowEffect = e.currentTarget.querySelector('.glow-effect');
        if (glowEffect) {
          glowEffect.style.left = '-100%';
        }
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
      }}
    >
      {/* Glow effect */}
      <div className='glow-effect' style={styles.glowEffect} />

      {/* Icon */}
      <IconComponent style={styles.icon} size={12} />

      {/* Text */}
      <span>{config.text}</span>
    </div>
  );
};

export default StatusBadge;
