import { CSSProperties, FC, useState } from 'react';
import styles from './quick-select.module.scss';
import luminance from '@oncehub/relative-luminance';
import { IOption } from '../../interfaces/select.type';
import { ColorsService } from '../colors.service';

interface Props {
  options: IOption[];
  onSelect: (option: IOption | undefined) => void;
  selected?: IOption;
  themeColor?: string;
  className?: string;
  style?: CSSProperties;
  showLoader?: boolean;
  id?: string;
}

export const QuickSelect: FC<Props> = ({
  options,
  onSelect,
  selected,
  themeColor,
  className = '',
  style = {},
  showLoader = false,
  id = '',
}: Props) => {
  const [selectedOption, setSelected] = useState(selected);
  let quickOptionStyleObj: CSSProperties = {};
  let quickOptionTriangleStyleObj: CSSProperties = {};
  let checkmarkColor: string = '#ffffff';
  const selectOption = (option: any) => {
    if (selectedOption?.value === option?.value) {
      setSelected(undefined);
      onSelect(undefined);
      return;
    }
    onSelect(option);
    setSelected(option);
  };

  if (themeColor) {
    const theme = luminance(themeColor);
    themeColor = ColorsService.convert3HexTo6(themeColor);
    const borderColor = themeColor === '#ffffff' ? '#333333' : themeColor;
    if (theme === 'dark' || theme === 'light') {
      checkmarkColor = themeColor === '#ffffff' || theme === 'dark' ? '#ffffff' : '#333333';
      quickOptionStyleObj = {
        outlineColor: borderColor,
        borderColor: borderColor,
        color: themeColor === '#ffffff' || theme === 'light' ? '#333333' : themeColor,
      };
      quickOptionTriangleStyleObj = {
        borderRightColor: borderColor,
        borderTopColor: borderColor,
      };
    }
  }

  return (
    <div className={styles.singleSelectWrapper}>
      <div className={styles.quickOption}>
        <ul className={styles.quickOption} role="radiogroup" id={id}>
          {options.map((option: IOption) => (
            <li
              tabIndex={option.disable ? -1 : 0}
              className={`${className} ${selectedOption?.value === option.value ? styles.selected : ''} ${
                option.disable ? styles.disabled : ''
              }`}
              style={{ ...quickOptionStyleObj, ...style }}
              key={option.value}
              onClick={() => selectOption(option)}
              onKeyPress={(event) => {
                if (event.key === ' ' || event.code === 'Space') {
                  event.preventDefault();
                  selectOption(option);
                }
              }}
              data-testid={'checkbox-input'}
              role="radio"
              aria-checked={selectedOption?.value === option.value}
            >
              {option.label}
              {selectedOption?.value === option.value && !option.disable && (
                <div className={styles.triangle} style={{ ...quickOptionTriangleStyleObj }}>
                  {showLoader && (
                    <div className={styles.loader} style={{ borderRightColor: themeColor ?? '#006bb1' }}></div>
                  )}
                  {!showLoader && (
                    <div className={styles.checkmarkWrap}>
                      <svg
                        className={styles.checkmark}
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="9"
                        viewBox="0 0 11 9"
                        fill="none"
                      >
                        <path
                          className={styles.checkmarkCheck}
                          stroke={checkmarkColor}
                          d="M2.1 4.34286L4.12857 6.40001L8.9 1.60001"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
