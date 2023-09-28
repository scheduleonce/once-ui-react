import React, { FC, forwardRef, ComponentPropsWithRef, useState } from 'react';
import styles from './single-line-input.module.scss';

interface SingleLineInputProps extends ComponentPropsWithRef<'input'> {
  themeColor?: string; // Made themeColor optional
}

export const SingleLineInput: FC<SingleLineInputProps> = React.memo(
  forwardRef<HTMLInputElement, SingleLineInputProps>(
    ({ themeColor = '', style = {}, className = '', onFocus, onBlur, ...rest }: SingleLineInputProps, ref) => {
      const [isFocused, setIsFocused] = useState(false);
      let inputStyleObj = {};
      const textInputClasses = [styles.textInput, className].filter(Boolean).join(' ');

      const handleFocus = () => {
        setIsFocused(true);
      };

      const handleBlur = () => {
        setIsFocused(false);
      };

      inputStyleObj = {
        borderBottomColor: isFocused && themeColor != '#ffffff' ? themeColor : '',
      };

      return (
        <div className={styles.textInputWrapper}>
          <input
            type="text"
            data-testid={'textbox-input'}
            ref={ref}
            className={textInputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ ...inputStyleObj, ...style }}
            {...rest}
          />
        </div>
      );
    },
  ),
);
