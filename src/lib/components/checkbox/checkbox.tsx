import React, { CSSProperties, ComponentPropsWithRef, FC, ReactNode, forwardRef, useState } from 'react';
import styles from './checkbox.module.scss';
import luminance from '@oncehub/relative-luminance';

interface CheckboxProps extends ComponentPropsWithRef<'input'> {
  /** The label for the checkbox */
  children?: ReactNode;
  /** A color scheme to use for the button, defaults to `#006bb1` */
  themeColor?: string;
}
const generateRandomId = () => `checkbox_${Math.random().toString(36).substring(2, 11)}`;
/** Checkbox component */
const Checkbox: FC<CheckboxProps> = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      children,
      themeColor = '',
      id = generateRandomId(),
      checked = false,
      disabled = false,
      className = '',
      onChange,
      style = {},
      ...rest
    }: CheckboxProps,
    ref,
  ) => {
    const [isChecked, setIsChecked] = useState(checked);
    let checkboxStyleObj: CSSProperties = {};
    let borderColor;
    let checkMarkColor = disabled ? '#9b9b9b' : '#ffffff';
    if (themeColor) {
      const theme = luminance(themeColor);
      if (theme === 'dark' || theme === 'light') {
        switch (theme) {
          case 'dark':
            checkMarkColor = disabled ? (isChecked ? '#9b9b9b' : '#f9f9f9') : '#ffffff';
            break;
          case 'light':
            checkMarkColor = disabled ? (isChecked ? '#9b9b9b' : '#f9f9f9') : isChecked ? '#333333' : '#ffffff';
            break;
          default:
            checkMarkColor = '#9b9b9b';
            break;
        }
        const backgroundColor = disabled ? '#f9f9f9' : isChecked ? themeColor : '#ffffff';
        borderColor = disabled ? '#e4e4e4' : themeColor == '#ffffff' || themeColor == '#fff' ? '#333333' : themeColor;
        checkboxStyleObj = {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          outlineColor: borderColor,
        };
      }
    }

    const checkboxDisabled = disabled ? styles.checkboxDisabled : '';
    const checkboxClasses = [styles.checkboxLayout, checkboxDisabled, className].filter(Boolean).join(' ');

    const toggleCheckbox = (event: any) => {
      if (event.key != 'Enter') {
        event.preventDefault();
        onChange?.(event.target.checked);
        setIsChecked(!isChecked);
      }
    };

    return (
      <>
        <div className={checkboxClasses}>
          <label className={styles.checkboxLabel} htmlFor={id} onClick={(event) => toggleCheckbox(event)}>
            <div
              className={styles.checkboxInnerContainer}
              tabIndex={disabled ? -1 : 0}
              onKeyPress={(event) => toggleCheckbox(event)}
            >
              <input
                className={styles.checkboxInput}
                type="checkbox"
                checked={isChecked}
                id={id}
                ref={ref}
                {...rest}
                tabIndex={-1}
              />
              <div className={styles.checkboxFrame} style={{ ...checkboxStyleObj, ...style }}>
                <svg version="1.1" focusable="false" className={styles.checkboxCheckMark} viewBox="0 0 24 24">
                  <path
                    className={styles.checkboxCheckMarkPath}
                    fill="none"
                    stroke={checkMarkColor}
                    d="M4.1,12.7 9,17.6 20.3,6.3"
                  />
                </svg>
              </div>
            </div>
            {children && <span>{children}</span>}
          </label>
        </div>
      </>
    );
  },
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
