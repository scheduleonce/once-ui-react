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
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);
  const windowHeight = useRef<number>(0);
  const pageScrollHeight = useRef<number>(0);

  let OptionStyleObj: CSSProperties = {};

  useEffect(() => {
    if (inputRef.current && selected) {
      inputRef.current.value = selected.label || '';
    }
  }, [selected]);

  useEffect(() => {
    windowHeight.current = window.innerHeight;
    pageScrollHeight.current = document.body.scrollHeight;
    setIsMounted(true);
  }, []);

  const getDropdownPosition = useCallback(() => {
    if (selectRef.current) {
      // Use visualViewport for zoom-aware positioning if available
      const viewport = window.visualViewport;
      const selectRect = selectRef.current.getBoundingClientRect();
      setIsPositionCalculated(false);
      setTimeout(() => {
        const selectDropdownRect = selectDropdownRef?.current?.getBoundingClientRect();
        let left = selectRect.left;
        let top = selectRect.y + selectRect.height;
        let remainingSpace = window.innerHeight - selectRect.bottom;
        let remainingScroll = document.body.scrollHeight - (window.innerHeight + window.scrollY);
        if (viewport) {
          // Adjust for zoom and scroll offset
          left = selectRect.left + viewport.offsetLeft;
          top = selectRect.top + selectRect.height + viewport.offsetTop;
          remainingSpace = viewport.height - (selectRect.bottom - viewport.offsetTop);
          remainingScroll = document.body.scrollHeight - (viewport.height + viewport.pageTop);
        }
        if (selectDropdownRect) {
          const dropdownHeight = selectDropdownRect.height;
          const selectTop = selectRect.top;
          const noSpaceAbove = dropdownHeight >= selectTop + window.scrollY;
          const openTop =
            (dropdownHeight >= selectTop &&
              (noSpaceAbove || remainingScroll >= dropdownHeight || remainingSpace >= dropdownHeight)) ||
            (selectTop >= dropdownHeight && remainingSpace >= dropdownHeight)
              ? top
              : (viewport ? selectRect.top + viewport.offsetTop : selectRect.y) - dropdownHeight;
          setDropdownPosition({
            left,
            top: openTop ?? (viewport ? selectRect.top + viewport.offsetTop : selectRect.top),
          });
          setIsPositionCalculated(true);
        }
      }, 0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', getDropdownPosition);
    window.addEventListener('resize', getDropdownPosition);

    return () => {
      window.removeEventListener('scroll', getDropdownPosition);
      window.removeEventListener('resize', getDropdownPosition);
    };
  }, []);

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (typeof isOpen !== 'undefined' && inputRef.current) {
      if (!isOpen) {
        getDropdownPosition();
        setIsFocused(true);
        if (selected) {
          inputRef.current.value = selected.label || '';
        }
        if (clearSearch) {
          inputRef.current.value = '';
          setQuery('');
        }
        inputRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      } else {
        // If open, close it (toggle behavior)
        inputRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        setIsFocused(false);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
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
    <Combobox value={selected} onChange={onSelect} disabled={disable}>
      {({ open: headlessOpen }) => {
        // Sync Headless UI's open state with our local state and trigger positioning
        if (headlessOpen !== isOpen) {
          setIsOpen(headlessOpen);
          if (headlessOpen) {
            // Calculate positioning when dropdown opens
            getDropdownPosition();
          } else {
            // Reset position calculation when dropdown closes
            setIsPositionCalculated(false);
          }
        }

        return (
          <div className={styles.autocomplete}>
            <div ref={selectRef} className={`${styles.autocompleteContainer} ${disable ? styles.disable : ''}`}>
              <ComboboxInput
                ref={inputRef}
                data-testid={'select-input'}
                className={styles.autocompleteInput}
                displayValue={(o: any) => o?.label || ''}
                onChange={(event) => {
                  setQuery(event.target.value);
                  // Remove getDropdownPosition call to prevent jerk during typing
                }}
                onClick={handleInputClick}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ ...OptionStyleObj }}
                placeholder="Select your option"
                autoComplete="off"
              />
              <ComboboxButton className={styles.autocompleteButton} data-testid={'select-button'} ref={inputButton}>
                <ChevronDownIcon
                  className={`${styles.chevronDownIcon} ${disable ? styles.disable : ''}`}
                  aria-hidden="true"
                  data-open={headlessOpen ? true : undefined}
                />
              </ComboboxButton>
            </div>

            {isMounted
              ? createPortal(
                  <>
                    {headlessOpen && (
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
                            opacity: isPositionCalculated ? 1 : 0,
                            width: selectRef.current ? selectRef.current.clientWidth : 'auto',
                            left: dropdownPosition.left,
                            top: dropdownPosition.top,

                            zIndex: 1000,
                          }}
                        >
                          {children}
                        </div>
                      </div>
                    )}
                  </>,
                  document.body,
                )
              : null}
          </div>
        );
      }}
    </Combobox>
  );
};
