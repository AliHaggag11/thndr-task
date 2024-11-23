import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, Step } from 'react-joyride';

const steps: Step[] = [
  {
    target: '.stock-card:nth-child(5)',
    content: 'Click on any stock card to view detailed information and price charts',
    disableBeacon: true,
  },
  {
    target: '.market-status',
    content: 'This shows the current market status and trading hours',
    disableBeacon: true,
  },
  {
    target: '.search-bar',
    content: 'Search for stocks by name or ticker symbol',
    disableBeacon: true,
  },
  {
    target: '.theme-toggle',
    content: 'Switch between light and dark mode for better viewing',
    disableBeacon: true,
  }
];

interface TourProps {
  run: boolean;
  onFinish: () => void;
}

export const Tour = ({ run, onFinish }: TourProps) => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleCallback = (data: CallBackProps) => {
    if (data.status === 'finished' || data.status === 'skipped') {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      spotlightPadding={8}
      callback={handleCallback}
      floaterProps={{
        disableAnimation: true,
      }}
      styles={{
        options: {
          primaryColor: isDark ? '#3b82f6' : '#4f46e5',
          textColor: isDark ? '#e5e7eb' : '#1f2937',
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          arrowColor: isDark ? '#1f2937' : '#ffffff',
          overlayColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        },
        spotlight: {
          borderRadius: '12px',
          backgroundColor: 'transparent',
        },
        overlay: {
          mixBlendMode: 'normal',
        },
        tooltip: {
          padding: '16px',
          borderRadius: '12px',
          ...(isDark && {
            border: '1px solid rgba(75, 85, 99, 0.5)',
          }),
        },
        buttonNext: {
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          backgroundColor: isDark ? '#3b82f6' : '#4f46e5',
        },
        buttonBack: {
          marginRight: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          color: isDark ? '#e5e7eb' : '#4f46e5',
        },
        buttonSkip: {
          color: isDark ? '#9ca3af' : '#6b7280',
          fontSize: '14px',
        },
      }}
    />
  );
}; 