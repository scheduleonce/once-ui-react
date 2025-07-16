import { FC, useRef, useEffect, CSSProperties, useState, useCallback } from 'react';
import { Combobox, ComboboxInput, ComboboxButton } from '@headlessui/react';
import { IOption } from '../../interfaces/select.type';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
import { createPortal } from 'react-dom';
import styles from './auto-complete.module.scss';

interface Props {
  children: any;
  selected: IOption | null;
  onSelect: (obj: IOption) => void;
  setQuery?: (query: string) => void;
  disable?: boolean;
  clearSearch?: boolean;
  themeColor?: string;
}

export const AutoComplete: FC<Props> = ({
  children,
  selected,
  onSelect,
  setQuery = () => {},
  disable,
  clearSearch = false,
  themeColor,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputButton = useRef<HTMLButtonElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectDropdownRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>(selected?.label || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const windowHeight = useRef<number>(0);
  const pageScrollHeight = useRef<number>(0);

  let OptionStyleObj: CSSProperties = {};

  useEffect(() => {
    windowHeight.current = window.innerHeight;
    pageScrollHeight.current = document.body.scrollHeight;
    setIsMounted(true);
  }, []);

  const calculateRemainingScroll = () => {
    return pageScrollHeight.current - (windowHeight.current + window.scrollY);
  };

  const getDropdownPosition = useCallback(() => {
    if (selectRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();
      setTimeout(() => {
        const selectDropdownRect = selectDropdownRef?.current?.getBoundingClientRect();
        const remainingScroll = calculateRemainingScroll();
        const remainingSpace = windowHeight.current - selectRect.bottom;
        let topPosition;
        if (selectDropdownRect) {
          const selectHeight = selectRect.height;
          const selectTopPosition = selectRect.top;
          const selectDropdownHeight = selectDropdownRect.height;
          const noSpaceAvailableAbove = selectDropdownHeight > selectTopPosition + window.scrollY;
          if (
            (selectTopPosition < selectDropdownHeight &&
              (noSpaceAvailableAbove ||
                (noSpaceAvailableAbove && remainingSpace < selectDropdownHeight) ||
                remainingScroll > selectDropdownHeight ||
                remainingSpace > selectDropdownHeight)) ||
            (selectTopPosition > selectDropdownHeight && remainingSpace > selectDropdownHeight)
          ) {
            topPosition = selectRect.y + selectHeight;
          } else {
            topPosition = selectRect.y - selectDropdownHeight;
          }

          setDropdownPosition({
            left: selectRect.left,
            top: topPosition ?? selectRect.top,
          });
        }
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      getDropdownPosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true); // true = capture phase
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, getDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !selectRef.current?.contains(event.target as Node) &&
        !selectDropdownRef.current?.contains(event.target as Node)
      ) {
        closeDropdown(); // ← Closes the dropdown when you try to inspect
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (selected?.label) {
      setInputValue(selected.label);
    }
  }, [selected]);

  const safeSetQuery = useCallback(
    (query: string) => {
      if (typeof setQuery === 'function') {
        setQuery(query);
      }
    },
    [setQuery],
  );

  const onSelection = (option: IOption) => {
    if (!option) return;
    onSelect(option);
    setInputValue(option.label || '');
    safeSetQuery('');
    handlingCursorPosition();
    closeDropdown();
  };

  const handlingCursorPosition = useCallback(() => {
    const input = inputRef.current;
    if (input) {
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    if (selected?.label && inputValue !== selected.label) {
      setInputValue(selected.label);
    }
    closeDropdown();
  }, [selected, inputValue]);

  const openDropdown = useCallback(
    (triggeredByKeyboard = false) => {
      if (!isOpen) {
        setIsOpen(true);
        getDropdownPosition();
        if (!triggeredByKeyboard && inputRef.current) {
          inputRef.current.focus();
          const event = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            bubbles: true,
          });
          inputRef.current.dispatchEvent(event);
        }
      }
    },
    [isOpen, getDropdownPosition],
  );

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleInputClick = () => {
    getDropdownPosition();
    setIsFocused(true);
    if (inputRef.current && selected) {
      inputRef.current.value = selected.label || '';
    }
    if (inputRef.current && inputButton.current) {
      if (clearSearch) {
        inputRef.current.value = '';
        setInputValue('');
        safeSetQuery('');
      }
      inputButton.current.click();
    }
  };

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      closeDropdown();
    } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !isOpen) {
      openDropdown(true);
    } else if (event.key === ' ' || event.code === 'Space') {
      getDropdownPosition();
    }
  };

  if (themeColor) {
    const theme = luminance(themeColor);
    themeColor = ColorsService.convert3HexTo6(themeColor);
    let borderColor;
    if (themeColor === '#ffffff') {
      borderColor = '#c8c8c8';
    } else if (isFocused) {
      borderColor = themeColor;
    } else {
      borderColor = '#333333';
    }
    if (theme === 'dark' || theme === 'light') {
      OptionStyleObj = {
        borderBottomColor: borderColor,
      };
    }
  }

  return (
    <Combobox value={selected} onChange={onSelection} disabled={disable}>
      <div className={styles.autocomplete}>
        <div ref={selectRef} className={`${styles.autocompleteContainer} ${disable ? styles.disable : ''}`}>
          <ComboboxInput
            ref={inputRef}
            data-testid={'select-input'}
            className={styles.autocompleteInput}
            value={inputValue}
            onChange={(event) => {
              const value = event.target.value;
              setInputValue(value);
              safeSetQuery(value);
              getDropdownPosition();
              if (!isOpen) {
                openDropdown(true);
              }
            }}
            onClick={handleInputClick}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            style={{ ...OptionStyleObj }}
            placeholder="Select your option"
            autoComplete="off"
          />
          <ComboboxButton
            className={styles.autocompleteButton}
            data-testid={'select-button'}
            ref={inputButton}
            onClick={() => {
              getDropdownPosition();
              toggleDropdown();
            }}
          >
            <ChevronDownIcon
              className={`${styles.chevronDownIcon} ${disable ? styles.disable : ''}`}
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>

        {isMounted &&
          createPortal(
            isOpen && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(255,255,255,0)',
                  zIndex: 1000,
                }}
              >
                <div
                  ref={selectDropdownRef}
                  style={{
                    position: 'absolute',
                    opacity: dropdownPosition.left ? 1 : 0,
                    width: selectRef.current?.clientWidth || 'auto',
                    left: dropdownPosition.left,
                    top: dropdownPosition.top,
                  }}
                >
                  {children}
                </div>
              </div>
            ),
            document.body,
          )}
      </div>
    </Combobox>
  );
};
