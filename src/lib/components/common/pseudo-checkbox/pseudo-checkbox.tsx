import { CSSProperties, ComponentPropsWithRef, FC } from 'react';
import luminance from '@oncehub/relative-luminance';
import styles from './psuedo-checkbox.module.scss';
import { ColorsService } from '../../colors.service';

interface CheckboxProps extends ComponentPropsWithRef<'div'> {
  themeColor?: string;
  checked?: boolean;
  disabled?: boolean;
}
const PseudoCheckbox: FC<CheckboxProps> = ({ checked = false, themeColor = '', disabled = false }) => {
  let checkboxStyleObj: CSSProperties = {};
  let backgroundColor = '#006bb1';
  let checkMarkColor = disabled ? '#9b9b9b' : '#ffffff';
  const checkboxDisabled = disabled ? styles.checkboxDisabled : '';
  const isChecked = checked ? styles.checked : '';
  const checkboxClasses = [styles.pseudoCheckbox, isChecked, checkboxDisabled].filter(Boolean).join(' ');
  let borderColor;
  if (themeColor) {
    const theme = luminance(themeColor);
    themeColor = ColorsService.convert3HexTo6(themeColor);
    if (theme === 'dark' || theme === 'light') {
      if (disabled) {
        checkMarkColor = checked ? '#9b9b9b' : '#f9f9f9';
      } else {
        checkMarkColor = theme == 'light' ? '#333333' : '#ffffff';
      }
      backgroundColor = disabled ? '#f9f9f9' : checked ? themeColor : '#ffffff';
      borderColor = disabled ? '#e4e4e4' : themeColor === '#ffffff' ? '#333333' : themeColor;
      if (checked) {
        checkboxStyleObj = {
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          outlineColor: borderColor,
        };
      }
    } else {
      checkMarkColor = '#9b9b9b';
    }
  }

  return (
    <div
      style={checkboxStyleObj}
      className={checkboxClasses}
      role="checkbox"
      aria-checked={checked}
      aria-hidden="true"
      tabIndex={-1}
      data-testid="checkbox-input"
    >
      <svg version="1.1" focusable="false" className={styles.checkboxCheckMark} viewBox="0 0 24 24">
        <path
          className={styles.checkboxCheckMarkPath}
          fill="none"
          stroke={checkMarkColor}
          d="M4.1,12.7 9,17.6 20.3,6.3"
        />
      </svg>
    </div>
  );
};

PseudoCheckbox.displayName = 'Checkbox';
export default PseudoCheckbox;
