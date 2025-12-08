import React, { useState, useEffect, useRef, CSSProperties, KeyboardEvent } from 'react';
import { IOption } from '../../interfaces/select.type';
import { Button } from '../button/button';
import styles from './multi-select-with-count.module.scss';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
import { createPortal } from 'react-dom';
import PseudoCheckbox from '../common/pseudo-checkbox/pseudo-checkbox';

interface Props {
  options: IOption[];
  checkedValue: string[];
  onSelectionChange: (val: string[]) => void;
  maxOptions?: number;
  themeColor?: string;
  className?: string;
  style?: CSSProperties;
  categoryName?: string;
  variant?: 'default' | 'rounded';
  placeholder?: string;
}

export const MultiSelectWithCount: React.FC<Props> = ({
  options,
  checkedValue,
  onSelectionChange,
  maxOptions,
  themeColor,
  className = '',
  style = {},
  categoryName = '',
  variant = 'default',
  placeholder = 'Select your option',
}) => {
  const filteredOptions = useRef(options);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(checkedValue);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectDropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const hiddenButtonRef = useRef<HTMLInputElement | null>(null);
  const doneButtonRef = useRef<HTMLButtonElement | null>(null);
  const optionsListRef = useRef<HTMLUListElement | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1); // -1 means no focus
  const windowHeight = useRef<number>(0);
  const pageScrollHeight = useRef<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  let multiSelectStyleObj: CSSProperties = {};
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const shiftKeyPressedRef = useRef(false);
  const multiSelectRef = useRef<HTMLDivElement | null>(null);

  // Sync selectedOptions with checkedValue prop changes
  useEffect(() => {
    setSelectedOptions(checkedValue);
  }, [checkedValue]);

  const setfocusOnDropdownClose = () => {
    setTimeout(() => {
      const selectFocusElement = selectRef.current?.children[0] as HTMLElement;
      selectFocusElement.focus();
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectDropdownRef.current && !selectDropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setSearchTerm('');
        setfocusOnDropdownClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOnResize = (): void => {
    windowHeight.current = window.innerHeight;
    pageScrollHeight.current = document.body.scrollHeight;
    setIsMounted(true);
  };

  useEffect(() => {
    handleOnResize();
    window.addEventListener('resize', handleOnResize);
    return () => {
      window.addEventListener('resize', handleOnResize);
    };
  }, []);

  const announceOption = (text: any): void => {
    const announcement = document.getElementById('announcement');
    if (announcement) {
      announcement.textContent = text;
      announcement.setAttribute('aria-live', 'assertive');
      setTimeout(() => {
        announcement.textContent = '';
        announcement.setAttribute('aria-live', 'off');
      }, 1000); // Announce and clear after 1 second (adjust as needed)
    }
  };

  useEffect(() => {
    const filtered = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
    filteredOptions.current = filtered;
  }, [options, searchTerm]);

  /* istanbul ignore next */
  const selectedText =
    selectedOptions.length > 1 && categoryName
      ? categoryName
      : selectedOptions.length > 0
        ? selectedOptions
            .map((value) => {
              const selectedOption = options.find((option) => option.value === value);
              return selectedOption?.label !== null ? selectedOption?.label : '';
            })
            .filter((label) => label !== '')
            .join(', ')
        : placeholder;

  const handleLiClick = (id: string) => {
    const clickedOption = options.find((option) => option.value === id);
    if (clickedOption && !clickedOption.disable && (maxOptions === undefined || selectedOptions.length <= maxOptions)) {
      const isSelected = selectedOptions.includes(id);
      const newSelectedValues = isSelected ? selectedOptions.filter((val) => val !== id) : [...selectedOptions, id];
      const isWithinLimit = maxOptions === undefined || newSelectedValues.length <= maxOptions;
      if (isWithinLimit && dropdownOpen) {
        setSelectedOptions(newSelectedValues);
        onSelectionChange(newSelectedValues);
        setTimeout(() => {
          getDropdownPosition();
        }, 100);
        announceOption(`${clickedOption?.label} ${newSelectedValues.includes(id) ? 'selected' : 'not selected'}`);
      }
    }
  };

  const toggleDropDown = (open: boolean) => {
    getDropdownPosition();
    setDropdownOpen(open);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current?.focus();
      } else {
        hiddenButtonRef.current?.focus();
      }
      announceOption('use up and down arrow keys to navigate');
    }, 0);
  };

  const getDropdownPosition = () => {
    if (selectRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();
      setTimeout(() => {
        const selectDropdownRect = selectDropdownRef?.current?.getBoundingClientRect();

        if (selectDropdownRect) {
          const selectDropdownHeight = selectDropdownRect.height;
          const selectDropdownWidth = selectDropdownRect.width;
          const viewportWidth = window.innerWidth;

          // Vertical positioning logic
          const spaceBelow = windowHeight.current - selectRect.bottom;
          const spaceAbove = selectRect.top;

          let topPosition: number;

          // Try to position below first (preferred)
          if (spaceBelow >= selectDropdownHeight) {
            // Enough space below - position dropdown below the select
            topPosition = selectRect.bottom;
          } else if (spaceAbove >= selectDropdownHeight) {
            // Not enough space below but enough above - position above the select
            topPosition = selectRect.top - selectDropdownHeight;
          } else {
            // Not enough space in either direction - choose the side with more space
            if (spaceBelow >= spaceAbove) {
              topPosition = selectRect.bottom;
            } else {
              topPosition = selectRect.top - selectDropdownHeight;
            }
          }

          // Horizontal positioning logic
          const spaceRight = viewportWidth - selectRect.left;
          const spaceLeft = selectRect.right;

          let leftPosition: number;

          // Try to align with select left edge first (preferred)
          if (spaceRight >= selectDropdownWidth) {
            // Enough space to the right - align with select left edge
            leftPosition = selectRect.left;
          } else if (spaceLeft >= selectDropdownWidth) {
            // Not enough space to the right but enough to the left - align with select right edge
            leftPosition = selectRect.right - selectDropdownWidth;
          } else {
            // Not enough space in either direction - position to stay within viewport
            if (spaceRight >= spaceLeft) {
              // More space to the right - align with left edge but constrain to viewport
              leftPosition = Math.max(0, viewportWidth - selectDropdownWidth);
            } else {
              // More space to the left - align with right edge but constrain to viewport
              leftPosition = Math.max(0, selectRect.right - selectDropdownWidth);
            }
          }

          setDropdownPosition({
            left: leftPosition,
            top: topPosition + 1, // Adding 1px to avoid overlap with select border
          });
        }
      }, 0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', getDropdownPosition);
    window.addEventListener('resize', getDropdownPosition);

    return () => {
      window.removeEventListener('scroll', getDropdownPosition);
      window.removeEventListener('resize', getDropdownPosition);
    };
  }, [dropdownOpen]);

  const doneButtonKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    event.preventDefault();
    if (event.key === 'Shift') {
      shiftKeyPressedRef.current = true;
    } else if ((event.shiftKey && shiftKeyPressedRef.current && event.key === 'Tab') || event.key === 'Tab') {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current?.focus();
        } else {
          hiddenButtonRef.current?.focus();
        }
      }, 0);
      shiftKeyPressedRef.current = false;
    } else if (event.key === 'Escape' || event.key === 'Enter' || event.key === 'Space' || event.key === ' ') {
      toggleDropDown(false);
      setfocusOnDropdownClose();
    } else {
      shiftKeyPressedRef.current = false;
    }
  };

  /* istanbul ignore next */
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const { key } = event;
    if (key === 'Tab' || (event.shiftKey && key === 'Tab')) {
      setTimeout(() => {
        doneButtonRef.current?.focus();
      }, 0);
    } else if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      setTimeout(() => {
        hiddenButtonRef.current?.focus();
      }, 0);
      let newFocusedIndex = focusedIndex;
      if (key === 'ArrowDown') {
        newFocusedIndex = Math.min(focusedIndex + 1, filteredOptions.current.length - 1);
      } else if (key === 'ArrowUp') {
        newFocusedIndex = Math.max(focusedIndex - 1, 0);
      }
      // If focus is on the first option and the Up arrow is pressed, move focus to the last option
      if (focusedIndex === 0 && event.key === 'ArrowUp') {
        newFocusedIndex = filteredOptions.current.length - 1;
      }
      // If focus is on the last option and the Down arrow is pressed, move focus to the first option
      else if (focusedIndex === filteredOptions.current.length - 1 && event.key === 'ArrowDown') {
        newFocusedIndex = 0;
      }
      setFocusedIndex(newFocusedIndex);
      if (optionsListRef.current && newFocusedIndex >= 0) {
        const focusedOption = optionsListRef.current.querySelectorAll(`.${styles.optionsList}`)[
          newFocusedIndex
        ] as HTMLElement;
        const isFocusedOptionSelected = focusedOption.children[0].getAttribute('aria-checked');
        const textToAnnounced = `${focusedOption.textContent} ${
          isFocusedOptionSelected === 'true' ? 'selected' : 'not selected'
        } ${newFocusedIndex + 1} out of ${filteredOptions.current.length}`;
        announceOption(textToAnnounced);
        if (focusedOption) {
          focusedOption.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
          });
        }
      }
    } else if (key === 'Enter' || key === 'Space' || key === ' ') {
      if (focusedIndex !== -1) {
        handleLiClick(filteredOptions.current[focusedIndex].value);
      }
    } else if (key === 'Escape') {
      toggleDropDown(false);
      setfocusOnDropdownClose();
    }
  };

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      const filteredResults = filteredOptions.current.length
        ? `${filteredOptions.current.length} results are available, use up and down arrow keys to navigate`
        : 'No results available';
      if (dropdownOpen) {
        announceOption(filteredResults);
      }
    }, 500);
    setTypingTimeout(timeout);
  }, [searchTerm]);

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    const multiSelect = multiSelectRef.current;
    if (multiSelect) {
      multiSelect.addEventListener('focus', handleFocus);
      multiSelect.addEventListener('blur', handleBlur);
    }
    return () => {
      if (multiSelect) {
        multiSelect.removeEventListener('focus', handleFocus);
        multiSelect.removeEventListener('blur', handleBlur);
      }
    };
  }, [handleFocus, handleBlur]);

  if (themeColor) {
    const theme = luminance(themeColor);
    themeColor = ColorsService.convert3HexTo6(themeColor);
    if (theme === 'dark' || theme === 'light') {
      // For default variant we use bottom border only, for rounded we use full border.
      multiSelectStyleObj = {
        ['--theme-color' as any]: themeColor,
      };
    }
  }

  const closeOverlay = () => {
    setDropdownOpen(false);
  };

  const handleDoneButtonClick = () => {
    setDropdownOpen(false);
    setSearchTerm('');
    setfocusOnDropdownClose();
    onSelectionChange(selectedOptions);
  };

  return (
    <div className={styles.multiSelectContainer}>
      <div className={styles.listOptionsWrap}>
        <div className={`${className} ${styles.selectedValuesWrap}`} ref={selectRef}>
          <div
            className={`${styles.selectedValues} ${dropdownOpen ? styles.focused : ''} ${selectedOptions.length > 0 ? styles.selected : ''} ${selectedOptions.length > 1 ? styles.countShow : ''}  ${
              selectedOptions.length === 0 ? styles.placeholder : ''
            } ${variant === 'rounded' ? styles.rounded : ''}`}
            ref={multiSelectRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={() => toggleDropDown(!dropdownOpen)}
            onKeyPress={(event) => {
              if (event.key === ' ' || event.code === 'Space' || event.code === 'Enter') {
                event.preventDefault();
                toggleDropDown(!dropdownOpen);
              }
            }}
            tabIndex={0}
            data-testid={'selected-input'}
            style={{ ...multiSelectStyleObj, ...style }}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            aria-multiselectable="true"
            aria-autocomplete="list"
            role="combobox"
          >
            {selectedText}
          </div>
          {selectedOptions.length > 1 && (
            <span
              className={styles.selectedCount}
              data-testid={'selected-count'}
              style={{ backgroundColor: themeColor }}
            >
              {selectedOptions.length}
            </span>
          )}
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
        <div id="announcement" aria-live="assertive" role="alert" className={styles.announcement}></div>
        {isMounted
          ? createPortal(
              <>
                {dropdownOpen && selectRef && (
                  <div
                    onClick={closeOverlay}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      backgroundColor: 'rgba(255,255,255,0)',
                      zIndex: 1000,
                    }}
                  >
                    <div
                      className={`${styles.optionsListContainer}`}
                      ref={selectDropdownRef}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        opacity: dropdownPosition.left ? 1 : 0,
                        left: dropdownPosition.left,
                        top: dropdownPosition.top,
                      }}
                    >
                      <div className={styles.optionsListWrap}>
                        {options.length >= 6 && (
                          <div className={styles.searchInputWrap}>
                            <input
                              type="text"
                              ref={searchInputRef}
                              placeholder="Type to filter"
                              className={styles.searchInput}
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              data-testid={'search-input'}
                              onKeyDown={(event) => {
                                handleKeyDown(event);
                              }}
                            />
                          </div>
                        )}
                        <ul ref={optionsListRef} role="listbox">
                          {filteredOptions.current.map((option, index) => (
                            // eslint-disable-next-line jsx-a11y/role-supports-aria-props
                            <li
                              key={option.value}
                              className={`${styles.optionsList} ${index === focusedIndex ? styles.focused : ''}`}
                              onClick={() => handleLiClick(option.value)}
                              aria-selected={index === focusedIndex}
                              role="option"
                            >
                              <PseudoCheckbox
                                themeColor={themeColor}
                                checked={selectedOptions.includes(option.value)}
                                disabled={
                                  option.disable ||
                                  (maxOptions !== undefined &&
                                    selectedOptions.length >= maxOptions &&
                                    !selectedOptions.includes(option.value))
                                }
                              />
                              <span>{option.label}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.btnContainer}>
                        <input
                          ref={hiddenButtonRef}
                          onKeyDown={(event) => {
                            handleKeyDown(event);
                          }}
                          className={styles.hiddenButton}
                        />
                        <Button
                          themeColor={themeColor}
                          variant="primary"
                          size="medium"
                          onClick={handleDoneButtonClick}
                          data-testid={'done-button'}
                          onKeyDown={(event) => {
                            doneButtonKeyDown(event);
                          }}
                          ref={doneButtonRef}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>,
              document.body,
            )
          : null}
      </div>
    </div>
  );
};
