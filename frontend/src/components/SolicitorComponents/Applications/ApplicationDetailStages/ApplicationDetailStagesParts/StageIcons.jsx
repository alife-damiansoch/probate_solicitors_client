// ApplicationDetailStagesParts/StageIcons.js

export const getStepIcon = (iconType, theme, isCompleted) => {
  const iconProps = {
    width: '20',
    height: '20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  if (isCompleted) {
    return (
      <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
        <path d='M20 6L9 17l-5-5' strokeWidth='3' />
      </svg>
    );
  }

  switch (iconType) {
    case 'document':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
          <polyline points='14,2 14,8 20,8' />
          <line x1='16' y1='13' x2='8' y2='13' />
          <line x1='16' y1='17' x2='8' y2='17' />
          <polyline points='10,9 9,9 8,9' />
        </svg>
      );
    case 'userPlus':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <path d='M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
          <circle cx='8.5' cy='7' r='4' />
          <line x1='20' y1='8' x2='20' y2='14' />
          <line x1='23' y1='11' x2='17' y2='11' />
        </svg>
      );
    case 'user':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
          <circle cx='12' cy='7' r='4' />
        </svg>
      );
    case 'home':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
          <polyline points='9,22 9,12 15,12 15,22' />
        </svg>
      );
    case 'money':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z' />
        </svg>
      );
    case 'check':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <path d='M9 11l3 3L22 4' />
          <path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' />
        </svg>
      );
    case 'upload':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
          <polyline points='7,10 12,5 17,10' />
          <line x1='12' y1='5' x2='12' y2='15' />
        </svg>
      );
    case 'signature':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <path d='M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' />
        </svg>
      );
    case 'clock':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <circle cx='12' cy='12' r='10' />
          <polyline points='12,6 12,12 16,14' />
        </svg>
      );
    case 'search':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <circle cx='11' cy='11' r='8' />
          <path d='M21 21l-4.35-4.35' />
        </svg>
      );
    case 'checkCircle':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
          <polyline points='22,4 12,14.01 9,11.01' />
        </svg>
      );
    case 'x':
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <circle cx='12' cy='12' r='10' />
          <line x1='15' y1='9' x2='9' y2='15' />
          <line x1='9' y1='9' x2='15' y2='15' />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} viewBox='0 0 24 24' style={{ color: '#ffffff' }}>
          <circle cx='12' cy='12' r='10' />
        </svg>
      );
  }
};
