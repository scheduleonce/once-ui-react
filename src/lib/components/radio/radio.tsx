import { FC } from 'react';
import { IOption } from '../../interfaces';
import styles from './radio.module.scss';

interface RadioProps {
  themeColor?: string;
  name: string;
  checked?: boolean;
  onChange: (option: any) => void;
  option: IOption;
}

export const Radio: FC<RadioProps> = ({ themeColor, name, checked, onChange, option }) => {
  const effectiveThemeColor = themeColor?.toLowerCase() === '#ffffff' ? '#c8c8c8' : themeColor;

  const handleChange = (option: IOption) => {
    onChange(option);
  };

  return (
    <div className={styles.radioWrapper}>
      <div className={styles.radioBtnBox}>
        <label htmlFor={option.value} className={styles.radioBtnLabel}>
          <div className={styles.radioBtnInsideLabel}>
            <input
              type="radio"
              id={option.value}
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => handleChange(option)}
              className={styles.radioBtnInput}
            />
            <span
              className={`${styles.radioBtnCircle} ${checked ? styles.radioBtnChecked : ''}`}
              style={{
                borderColor: checked ? effectiveThemeColor : '#C8C8C8',
              }}
            >
              {checked && (
                <span className={styles.radioBtnCircleInside} style={{ backgroundColor: effectiveThemeColor }}></span>
              )}
            </span>
          </div>
          {option.avatar && (
            <div className={styles.radioBtnAvatar}>
              <img
                aria-hidden={true}
                src={option.avatar}
                width={20}
                height={20}
                alt="Location icon"
                className={styles.radioBtnAvatarImg}
              />
            </div>
          )}
          <div className={styles.radioBtnText}>{option.label}</div>
        </label>
      </div>
    </div>
  );
};

export default Radio;
