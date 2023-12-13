import React, { FC, forwardRef, ComponentPropsWithRef, useState, useEffect } from 'react';
import styles from './multi-line-input.module.scss';
import { isMobile } from 'react-device-detect';
import { ColorsService } from '../colors.service';

interface MultiLineInputProps extends ComponentPropsWithRef<'textarea'> {
  themeColor?: string; // Made themeColor optional
  onSubmit?: () => void; // Submit form function in the parent component
}

export const MultiLineInput: FC<MultiLineInputProps> = React.memo(
  forwardRef<HTMLTextAreaElement, MultiLineInputProps>(
    (
      { themeColor = '', onSubmit, style = {}, className = '', onInput, onFocus, onBlur, ...rest }: MultiLineInputProps,
      ref,
    ) => {
      const [isMobileDevice, setIsMobileDevice] = useState(true);
      const [isFocused, setIsFocused] = useState(false);
      themeColor = ColorsService.convert3HexTo6(themeColor);

      useEffect(() => {
        setIsMobileDevice(isMobile);
      }, []);

      const handleKeyPress = (e: React.KeyboardEvent) => {
        if (!isMobileDevice && e.key === 'Enter') {
          if (!e.shiftKey && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
        }
      };

      const autoGrow = (event: any) => {
        onInput?.(event);
        event.target.style.height = '40px';
        event.target.style.height = 2 + event.target.scrollHeight + 'px';
      };

      let inputStyleObj = {};
      const textInputClasses = [styles.textInput, className].filter(Boolean).join(' ');

      const handleFocus = () => {
        setIsFocused(true);
      };

      const handleBlur = () => {
        setIsFocused(false);
      };

      inputStyleObj = {
        borderBottomColor: isFocused ? (themeColor !== '#ffffff' ? themeColor : '#c8c8c8') : '',
      };

      return (
        <div className={styles.textInputWrapper}>
          <textarea
            data-testid={'textbox-input'}
            ref={ref}
            className={textInputClasses}
            style={{ ...inputStyleObj, ...style }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={(event) => autoGrow(event)}
            onKeyDown={handleKeyPress}
            {...rest}
          />
        </div>
      );
    },
  ),
);
