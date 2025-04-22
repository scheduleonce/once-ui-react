// components/ProgressBar.tsx
import React, { useMemo } from 'react';
import styles from './progress-bar.module.scss';

export type ProgressBarProps = {
  /** 0–100 percent (if set, mode becomes "determinate") */
  value?: number;
  /** Override mode; if omitted, determinate when `value` is set */
  mode?: 'determinate' | 'indeterminate';
  /** Thickness of the bar in pixels */
  strokeWidth?: number;
  /** CSS color for the filled bar */
  barColor?: string;
  /** CSS color for the track (background) */
  trackColor?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  mode: propMode,
  strokeWidth = 4,
  barColor = '#1976d2', // default to a primary‑blue
  trackColor = 'rgba(25,118,210,0.3)', // semi‑transparent blue
}) => {
  const mode = propMode ?? (value != null ? 'determinate' : 'indeterminate');
  const pct = useMemo(() => {
    if (mode === 'determinate' && value != null) {
      return Math.max(0, Math.min(100, value));
    }
    return 0;
  }, [mode, value]);

  return (
    <>
      <div
        className={styles.progress}
        role="progressbar"
        aria-valuemin={mode === 'determinate' ? 0 : undefined}
        aria-valuemax={mode === 'determinate' ? 100 : undefined}
        aria-valuenow={mode === 'determinate' ? pct : undefined}
        style={{
          height: strokeWidth,
          backgroundColor: trackColor,
        }}
      >
        <div
          className={styles['progress-bar']}
          style={{
            height: strokeWidth,
            width: mode === 'determinate' ? `${pct}%` : undefined,
            backgroundColor: barColor,
            animationName: mode === 'indeterminate' ? 'loading' : undefined,
            left: mode === 'indeterminate' ? -200 : 0,
          }}
        />
      </div>
      <style>{`
        @keyframes loading {
          0% {
            left: -200px;
            width: 200px;
          }
          50% {
            width: 200px;
          }
          70% {
            width: 70%;
          }
          80% {
            left: 50%;
          }
          95% {
            left: 120%;
          }
          to {
            left: 100%;
          }
        }
      `}</style>
    </>
  );
};
