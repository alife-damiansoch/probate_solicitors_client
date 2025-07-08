// ApplicationDetailStagesParts/StageThemes.js

export const getStepTheme = (step) => {
  if (step.completed) {
    return {
      bg: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
      accent: '#10b981',
      accentLight: '#34d399',
      glow: '0 0 20px rgba(16, 185, 129, 0.4)',
      iconBg: '#10b981',
      borderColor: '#047857',
    };
  }
  if (step.actionRequired) {
    return {
      bg: 'linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%)',
      accent: '#f59e0b',
      accentLight: '#fbbf24',
      glow: '0 0 20px rgba(245, 158, 11, 0.5)',
      iconBg: '#f59e0b',
      borderColor: '#b45309',
    };
  }
  return {
    bg: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
    accent: '#6b7280',
    accentLight: '#9ca3af',
    glow: 'none',
    iconBg: '#6b7280',
    borderColor: '#374151',
  };
};
