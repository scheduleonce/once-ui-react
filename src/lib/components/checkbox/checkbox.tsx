import { CSSProperties, ComponentPropsWithRef, FC, ReactNode, forwardRef, useState } from 'react';
import styles from './checkbox.module.scss';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';

interface CheckboxProps extends ComponentPropsWithRef<'input'> {
  children?: ReactNode;
  themeColor?: string;
  checkboxSize?: string;
}
const generateRandomId = () => `checkbox_${Math.random().toString(36).substring(2, 11)}`;
export const Checkbox: FC<CheckboxProps> = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      children,
      themeColor = '',
      checkboxSize = 'medium',
      id = generateRandomId(),
      checked = false,
      disabled = false,
      className = '',
      onChange,
      style = {},
      tabIndex,
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
      themeColor = ColorsService.convert3HexTo6(themeColor);
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
        borderColor = disabled ? '#e4e4e4' : themeColor == '#ffffff' ? '#333333' : themeColor;
        if (isChecked) {
          checkboxStyleObj = {
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            outlineColor: borderColor,
          };
        }
      }
    }

    const checkboxDisabled = disabled ? styles.checkboxDisabled : '';
    const checkboxClasses = [styles.checkboxLayout, styles[checkboxSize], checkboxDisabled, className]
      .filter(Boolean)
      .join(' ');

    const toggleCheckbox = (event: any) => {
      if (event.key != 'Enter') {
        event.preventDefault();
        onChange?.(event.target.checked);
        setIsChecked(!isChecked);
      }
    };

    return (
      <>
        <div className={checkboxClasses} data-testid="checkbox">
          <label className={styles.checkboxLabel} htmlFor={id} onClick={(event) => toggleCheckbox(event)}>
            <div
              className={styles.checkboxInnerContainer}
              tabIndex={tabIndex || disabled ? -1 : 0}
              onKeyPress={(event) => toggleCheckbox(event)}
              data-testid="checkbox-inner-container"
            >
              <input
                className={styles.checkboxInput}
                onChange={(event) => toggleCheckbox(event)}
                type="checkbox"
                checked={isChecked}
                disabled={disabled}
                id={id}
                ref={ref}
                {...rest}
                tabIndex={-1}
                data-testid="checkbox-input"
              />
              <div
                className={styles.checkboxFrame}
                style={{ ...checkboxStyleObj, ...style }}
                data-testid="checkbox-frame"
              >
                <svg
                  version="1.1"
                  focusable="false"
                  className={styles.checkboxCheckMark}
                  viewBox="0 0 24 24"
                  data-testid="check-mark-svg"
                >
                  <path
                    className={styles.checkboxCheckMarkPath}
                    fill="none"
                    stroke={checkMarkColor}
                    d="M4.1,12.7 9,17.6 20.3,6.3"
                  />
                </svg>
              </div>
            </div>
            {children && <span data-testid="checkbox-label">{children}</span>}
          </label>
        </div>
      </>
    );
  },
);

Checkbox.displayName = 'Checkbox';
