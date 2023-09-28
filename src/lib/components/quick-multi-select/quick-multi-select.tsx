import React, { CSSProperties, useRef, useState } from 'react';
import { Checkbox } from '../checkbox/checkbox';
import styles from './quick-multi-select.module.scss';
import { Option } from './quick-multi-select.type';
import luminance from '@oncehub/relative-luminance';

interface Props {
  options: Option[];
  checkedValue: number[];
  onSelectionChange: (val: number[]) => void;
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
  const [selectedOptions, setSelectedOptions] = useState<number[]>(checkedValue);
  const checkboxRefs = useRef<(HTMLInputElement | null)[]>([]);
  let quickMultiSelectStyleObj: CSSProperties = {};

  const handleCheckboxClick = (id: number) => {
    const isSelected = selectedOptions.includes(id);
    const newSelectedValues = isSelected ? selectedOptions.filter((val) => val !== id) : [...selectedOptions, id];
    const isWithinLimit = maxOptions === undefined || newSelectedValues.length <= maxOptions;

    if (isWithinLimit) {
      setSelectedOptions(newSelectedValues);
      onSelectionChange(newSelectedValues);
    }
  };

  const handleLiClick = (id: number) => {
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
    const theme = luminance(themeColor);
    themeColor = themeColor.length === 4 ? themeColor.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3') : themeColor;
    const borderColor = themeColor === '#ffffff' ? '#333333' : themeColor;
    if (theme === 'dark' || theme === 'light') {
      quickMultiSelectStyleObj = {
        outlineColor: borderColor,
        borderColor: borderColor,
        color: '#333333',
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
            }`}
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
                    themeColor ||
                    option.disabled ||
                    (maxOptions !== undefined &&
                      selectedOptions.length >= maxOptions &&
                      !selectedOptions.includes(option.id))
                      ? '#333333'
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
