import React, { CSSProperties, useRef, useState } from 'react';
import { Checkbox } from '../checkbox/checkbox';
import styles from './quick-multi-select.module.scss';
import { IOption } from '../../interfaces/select.type';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';

interface Props {
  options: IOption[];
  checkedValue: string[];
  onSelectionChange: (val: string[]) => void;
  maxOptions?: number;
  themeColor?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
}
export const QuickMultiSelect: React.FC<Props> = ({
  options,
  checkedValue,
  onSelectionChange,
  maxOptions,
  themeColor,
  className = '',
  style = {},
  id = '',
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(checkedValue);
  const checkboxRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  let quickMultiSelectStyleObj: CSSProperties = {};
  let theme: string;

  const handleLiClick = (id: string): void => {
    const clickedOption = options.find((option) => option.value === id);
    if (!clickedOption || clickedOption.disable) {
      return;
    }
    const checkbox = checkboxRefs.current[id];
    checkbox?.click();
    const isSelected = selectedOptions.includes(id);
    const newSelectedValues = isSelected ? selectedOptions.filter((val) => val !== id) : [...selectedOptions, id];
    const isWithinLimit = maxOptions === undefined || newSelectedValues.length <= maxOptions;
    if (isWithinLimit) {
      setSelectedOptions(newSelectedValues);
      onSelectionChange(newSelectedValues);
    }
  };

  if (themeColor) {
    theme = luminance(themeColor);
    themeColor = ColorsService.convert3HexTo6(themeColor);
    const borderColor = themeColor === '#ffffff' ? '#333333' : themeColor;
    if (theme === 'dark' || theme === 'light') {
      quickMultiSelectStyleObj = {
        outlineColor: borderColor,
        borderColor: borderColor,
        color: themeColor === '#ffffff' || theme === 'light' ? '#333333' : themeColor,
      };
    }
  }

  return (
    <div className={styles.multiSelectContainer} role="group">
      <ul className={styles.quickOptionsWrap} id={id}>
        {options.map((option) => (
          <li
            style={{ ...quickMultiSelectStyleObj, ...style }}
            key={option.value}
            className={`${className} ${
              option.disable ||
              (maxOptions !== undefined &&
                selectedOptions.length >= maxOptions &&
                !selectedOptions.includes(option.value))
                ? styles.disabled
                : ''
            } ${selectedOptions.includes(option.value) ? styles.selected : ''}`}
            tabIndex={option.disable ? -1 : 0}
            onClick={() => handleLiClick(option.value)}
            onKeyPress={(event) => {
              if (event.key === ' ' || event.code === 'Space') {
                event.preventDefault();
                handleLiClick(option.value);
              }
            }}
            data-testid={'option-box'}
          >
            <Checkbox
              id={option.value}
              checkboxSize="large"
              tabIndex={-1}
              themeColor={themeColor}
              ref={(checkbox) => {
                checkboxRefs.current[option.value] = checkbox; // Store checkbox reference
              }}
              checked={selectedOptions.includes(option.value)}
              disabled={
                option.disable ||
                (maxOptions !== undefined &&
                  selectedOptions.length >= maxOptions &&
                  !selectedOptions.includes(option.value))
              }
            >
              <span
                style={{
                  color:
                    (themeColor && (themeColor === '#ffffff' || theme === 'light')) ||
                    option.disable ||
                    (maxOptions !== undefined &&
                      selectedOptions.length >= maxOptions &&
                      !selectedOptions.includes(option.value))
                      ? '#333333'
                      : themeColor && (themeColor !== '#ffffff' || theme !== 'light')
                      ? themeColor
                      : '#006bb1',
                }}
              >
                {option.label}
              </span>
            </Checkbox>
          </li>
        ))}
      </ul>
    </div>
  );
};
