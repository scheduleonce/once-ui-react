import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Option } from './multi-select.type';
import { Checkbox } from '../checkbox/checkbox';
import { Button } from '../button/button';
import styles from './multi-select.module.scss';
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

export const MultiSelect: React.FC<Props> = ({
  options,
  checkedValue,
  onSelectionChange,
  minOptions = 0,
  maxOptions,
  themeColor,
  className = '',
  style = {},
}) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOptions, setSelectedOptions] = useState<number[]>(checkedValue);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const checkboxRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const optionsListRef = useRef<HTMLUListElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1); // -1 means no focus
  const [dropdownPosition, setDropdownPosition] = useState('bottom');
  let multiSelectStyleObj: CSSProperties = {};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (dropdownRect.bottom + 280 > windowHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [dropdownOpen]);

  useEffect(() => {
    const filtered = options.filter((option) => option.text.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredOptions(filtered);
  }, [options, searchTerm]);

  const handleCheckboxClick = (id: number) => {
    const isSelected = selectedOptions.includes(id);
    const newSelectedValues = isSelected ? selectedOptions.filter((val) => val !== id) : [...selectedOptions, id];
    const isWithinLimit = maxOptions === undefined || newSelectedValues.length <= maxOptions;

    if (isWithinLimit) {
      setSelectedOptions(newSelectedValues);
      onSelectionChange(newSelectedValues);
    }
  };
  /* istanbul ignore next */
  const selectedText = selectedOptions
    .map((id) => {
      const selectedOption = options.find((option) => option.id === id);
      return selectedOption && selectedOption.text !== null ? selectedOption.text : '';
    })
    .filter((text) => text !== '')
    .join(', ');

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

  const toggleDropDown = (open: boolean) => {
    setDropdownOpen(open);
    if (!dropdownOpen && filteredOptions.length > 6) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      setTimeout(() => {
        const firstOption = optionsListRef.current?.querySelector(`.${styles.optionsList}`) as HTMLElement;
        if (firstOption) {
          firstOption.focus();
        }
      }, 0);
    }
  };
  /* istanbul ignore next */
  const handleSearchInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      let newFocusedIndex = focusedIndex;
      if (key === 'ArrowDown') {
        newFocusedIndex = Math.min(focusedIndex + 1, filteredOptions.length - 1);
      } else if (key === 'ArrowUp') {
        newFocusedIndex = Math.max(focusedIndex - 1, 0);
      }
      setFocusedIndex(newFocusedIndex);
      if (optionsListRef.current && newFocusedIndex >= 0) {
        const focusedOption = optionsListRef.current.querySelectorAll(`.${styles.optionsList}`)[newFocusedIndex];
        if (focusedOption) {
          focusedOption.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
          });
        }
      }
    } else if (key === 'Enter') {
      if (focusedIndex !== -1) {
        handleLiClick(filteredOptions[focusedIndex].id);
      }
    }
  };

  if (themeColor) {
    const theme = luminance(themeColor);
    themeColor = themeColor.length === 4 ? themeColor.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3') : themeColor;
    const borderColor = themeColor === '#ffffff' ? '#333333' : themeColor;
    if (theme === 'dark' || theme === 'light') {
      multiSelectStyleObj = {
        borderBottomColor: borderColor,
      };
    }
  }

  return (
    <div className={styles.multiSelectContainer}>
      <div className={styles.listOptionsWrap} ref={dropdownRef}>
        <div className={`${className} ${styles.selectedValuesWrap}`}>
          <input
            type="text"
            className={`${styles.selectedValues} ${dropdownOpen ? styles.focused : ''}`}
            value={selectedText}
            readOnly
            onClick={() => toggleDropDown(!dropdownOpen)}
            onKeyPress={(event) => {
              if (event.key === ' ' || event.code === 'Space') {
                event.preventDefault();
                toggleDropDown(!dropdownOpen);
              }
            }}
            data-testid={'selected-input'}
            placeholder="Please select"
            style={{ ...multiSelectStyleObj, ...style }}
          />
          <span
            className={styles.dropDownIcon}
            onClick={() => toggleDropDown(!dropdownOpen)}
            data-testid={'arrow-button'}
          >
            <svg width="12px" height="7px" viewBox="0 0 12 7" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(-2360.000000, -295.000000)" fill="#666666">
                  <g transform="translate(2006.000000, 248.000000)">
                    <path
                      d="M358.027356,44.3431458 L358.027146,50.6581458 L364.343146,50.6589352 L364.343146,52.3431458 L358.027146,52.3421458 L358.027356,52.3431458 L356.343146,52.3431458 L356.343146,44.3431458 L358.027356,44.3431458 Z"
                      transform="translate(360.343146, 48.343146) scale(-1, -1) rotate(-225.000000) translate(-360.343146, -48.343146)"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          </span>
        </div>
        {dropdownOpen && (
          <div className={` ${styles.optionsListContainer} ${dropdownPosition === 'top' ? styles.top : ''}`}>
            <div className={styles.optionsListWrap}>
              {options.length >= 6 && (
                <div className={styles.searchInputWrap}>
                  <input
                    type="text"
                    placeholder="Type to filter"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    data-testid={'search-input'}
                    onKeyDown={handleSearchInputKeyDown}
                    ref={searchInputRef}
                  />
                </div>
              )}
              <ul ref={optionsListRef}>
                {filteredOptions.map((option, index) => (
                  <li
                    key={option.id}
                    className={`${styles.optionsList} ${index === focusedIndex ? styles.focused : ''}`}
                    onClick={() => handleLiClick(option.id)}
                    onKeyPress={(event) => {
                      if (event.key === ' ' || event.code === 'Space') {
                        event.preventDefault();
                        handleLiClick(option.id);
                      }
                    }}
                    aria-selected={index === focusedIndex}
                  >
                    <Checkbox
                      className={styles.optionsListCheckbox}
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
                      {option.text}
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.btnContainer}>
              <Button
                themeColor={themeColor}
                variant="primary"
                size="medium"
                onClick={() => {
                  setDropdownOpen(false);
                  setSearchTerm('');
                  onSelectionChange(selectedOptions);
                }}
                data-testid={'done-button'}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
