import React, { ComponentPropsWithRef, FC, forwardRef } from 'react';
import styles from './scrollbar.module.scss';

interface ScrollbarProps extends ComponentPropsWithRef<'div'> {
  children: any;
}

export const Scrollbar: FC<ScrollbarProps> = forwardRef<HTMLDivElement, ComponentPropsWithRef<'div'> & ScrollbarProps>(
  ({ children, className = '', style = {}, ...rest }: ScrollbarProps, ref) => {
    const scrollbarClass = [styles.scrollbarContainer, className].filter(Boolean).join(' ');
    return (
      <>
        <div ref={ref} style={{ ...style }} className={scrollbarClass} {...rest}>
          {children}
        </div>
      </>
    );
  },
);

Scrollbar.displayName = 'Scrollbar';
