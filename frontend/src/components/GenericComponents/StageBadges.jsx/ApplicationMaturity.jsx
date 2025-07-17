const ApplicationMaturity = ({ maturityDate }) => {
  const currentDate = new Date(); // Get current date
  const maturity = new Date(maturityDate); // Parse the maturity date string

  // Calculate the difference in months
  const monthsUntilMaturity =
    (maturity.getFullYear() - currentDate.getFullYear()) * 12 +
    maturity.getMonth() -
    currentDate.getMonth();

  // Component-level styles with cutting-edge design
  const styles = {
    maturityBadge: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '8px 16px',
      fontSize: '0.75rem',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative',
      overflow: 'hidden',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
      letterSpacing: '0.02em',
    },
    maturityBadgeInfo: {
      background:
        'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(29, 78, 216, 0.9) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.4)',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    },
    maturityBadgeWarning: {
      background:
        'linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(217, 119, 6, 0.9) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.4)',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
    },
    maturityBadgeDanger: {
      background:
        'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.9) 100%)',
      borderColor: 'rgba(239, 68, 68, 0.4)',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    },
    maturityBadgeHover: {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    },
    glowEffect: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      transition: 'left 0.6s ease',
    },
    icon: {
      fontSize: '12px',
      opacity: 0.9,
    },
    text: {
      margin: 0,
      whiteSpace: 'nowrap',
      fontWeight: '600',
      letterSpacing: '0.02em',
    },
  };

  // Determine the badge styling and icon
  const getBadgeConfig = () => {
    if (monthsUntilMaturity <= 3 && maturity > currentDate) {
      return {
        style: { ...styles.maturityBadge, ...styles.maturityBadgeDanger },
        icon: '🚨',
        urgency: 'danger',
      };
    }
    if (maturity.getFullYear() === currentDate.getFullYear()) {
      return {
        style: { ...styles.maturityBadge, ...styles.maturityBadgeWarning },
        icon: '⚠️',
        urgency: 'warning',
      };
    }
    return {
      style: { ...styles.maturityBadge, ...styles.maturityBadgeInfo },
      icon: '📅',
      urgency: 'info',
    };
  };

  const badgeConfig = getBadgeConfig();

  // Format the date in a readable way (e.g., "February 05, 2026")
  const formattedDate = maturity.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {maturityDate && (
        <div className='d-flex justify-content-end'>
          <div
            style={badgeConfig.style}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, styles.maturityBadgeHover);
              const glowEffect = e.currentTarget.querySelector('.glow-effect');
              if (glowEffect) {
                glowEffect.style.left = '100%';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = badgeConfig.style.boxShadow;
              const glowEffect = e.currentTarget.querySelector('.glow-effect');
              if (glowEffect) {
                glowEffect.style.left = '-100%';
              }
            }}
          >
            {/* Glow effect */}
            <div className='glow-effect' style={styles.glowEffect} />

            {/* Icon */}
            <span style={styles.icon}>{badgeConfig.icon}</span>

            {/* Text */}
            <span style={styles.text}>
              <span className='d-none d-sm-inline'>Maturity date - </span>
              <span className='d-inline d-sm-none'>Due </span>
              {formattedDate}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationMaturity;
