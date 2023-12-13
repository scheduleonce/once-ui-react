import React, { CSSProperties, useRef, useState } from 'react';
import { Checkbox } from '../checkbox/checkbox';
import styles from './quick-multi-select.module.scss';
import { Option } from './quick-multi-select.type';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';

interface Props {
  options: Option[];
  checkedValue: string[];
  onSelectionChange: (val: string[]) => void;
  minOptions?: number;
  maxOptions?: number;
  themeColor?: string;
  className?: string;
  style?: CSSProperties;
}
export const QuickMultiSelect: React.FC<Props> = ({
  options,
  checkedValue,
  onSelectionChange,
  minOptions = 0,
  maxOptions,
  themeColor,
  className = '',
  style = {},
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(checkedValue);
  const checkboxRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  let quickMultiSelectStyleObj: CSSProperties = {};
  let theme: string;

  const handleCheckboxClick = (id: string) => {
    const isSelected = selectedOptions.includes(id);
    const newSelectedValues = isSelected ? selectedOptions.filter((val) => val !== id) : [...selectedOptions, id];
    const isWithinLimit = maxOptions === undefined || newSelectedValues.length <= maxOptions;

    if (isWithinLimit) {
      setSelectedOptions(newSelectedValues);
      onSelectionChange(newSelectedValues);
    }
  };

  const handleLiClick = (id: string) => {
    const clickedOption = options.find((option) => option.id === id);
    if (
      clickedOption &&
      !clickedOption.disabled &&
      (maxOptions === undefined || selectedOptions.length <= maxOptions)
    ) {
      const checkbox = checkboxRefs.current[id];
      checkbox?.click();
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
    <div className={styles.multiSelectContainer}>
      <ul className={styles.quickOptionsWrap}>
        {options.map((option) => (
          <li
            style={{ ...quickMultiSelectStyleObj, ...style }}
            key={option.id}
            className={`${className} ${styles.quickOption}  ${
              option.disabled ||
              (maxOptions !== undefined && selectedOptions.length >= maxOptions && !selectedOptions.includes(option.id))
                ? styles.disabled
                : ''
            } ${selectedOptions.includes(option.id) ? styles.selected : ''}`}
            tabIndex={option.disabled ? -1 : 0}
            onClick={() => handleLiClick(option.id)}
            onKeyPress={(event) => {
              if (event.key === ' ' || event.code === 'Space') {
                event.preventDefault();
                handleLiClick(option.id);
              }
            }}
            data-testid={'option-box'}
          >
            <Checkbox
              checkboxSize="large"
              tabIndex={-1}
              themeColor={themeColor}
              ref={(checkbox) => {
                checkboxRefs.current[option.id] = checkbox; // Store checkbox reference
              }}
              checked={selectedOptions.includes(option.id)}
              onClick={(event) => {
                event.stopPropagation();
                handleCheckboxClick(option.id);
              }}
              disabled={
                option.disabled ||
                (maxOptions !== undefined &&
                  selectedOptions.length >= maxOptions &&
                  !selectedOptions.includes(option.id))
              }
            >
              <span
                style={{
                  color:
                    (themeColor && (themeColor === '#ffffff' || theme === 'light')) ||
                    option.disabled ||
                    (maxOptions !== undefined &&
                      selectedOptions.length >= maxOptions &&
                      !selectedOptions.includes(option.id))
                      ? '#333333'
                      : themeColor && (themeColor !== '#ffffff' || theme !== 'light')
                      ? themeColor
                      : '#006bb1',
                }}
              >
                {option.text}
              </span>
            </Checkbox>
          </li>
        ))}
      </ul>
    </div>
  );
};
