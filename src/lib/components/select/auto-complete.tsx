import { FC, useRef, useEffect, CSSProperties, useState } from 'react';
import { Combobox } from '@headlessui/react';
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
  setQuery: (query: any) => void;
  disable?: boolean;
  clearSearch?: boolean;
  themeColor?: string;
}

export const AutoComplete: FC<Props> = ({
  children,
  selected,
  onSelect,
  setQuery,
  disable,
  clearSearch = false,
  themeColor,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputButton = useRef<HTMLButtonElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectDropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setdropdownPosition] = useState({ left: 0, top: 0 });
  const windowHeight = useRef<number>(0);
  const pageScrollHeight = useRef<number>(0);
  let OptionStyleObj: CSSProperties = {};

  useEffect(() => {
    if (inputRef.current && selected) {
      inputRef.current.value = selected.label || '';
    }
  }, [selected]);

  const handleOnResize = () => {
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

  const calculateRemainingScroll = () => {
    return pageScrollHeight.current - (windowHeight.current + window.scrollY);
  };

  const getDropdownPosition = () => {
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

          setdropdownPosition({
            left: selectRect.left,
            top: topPosition ?? selectRect.top,
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
  }, []);

  const onSelection = (option: IOption) => {
    onSelect(option);
    handlingCursorPosition();
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
        setQuery('');
      }
      inputButton.current.click();
    }
  };

  const displayInputValue = (option: IOption) => {
    // handlingCursorPosition();
    return option?.label;
  };

  const handlingCursorPosition = () => {
    const input = inputRef.current;
    if (input) {
      input.setSelectionRange(input.value.length, input.value.length);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }
    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, [handleFocus, handleBlur]);

  if (themeColor) {
    const theme = luminance(themeColor);
    themeColor = ColorsService.convert3HexTo6(themeColor);
    const borderColor = themeColor === '#ffffff' ? '#c8c8c8' : isFocused ? themeColor : '#333333';
    if (theme === 'dark' || theme === 'light') {
      OptionStyleObj = {
        borderBottomColor: borderColor,
      };
    }
  }

  return (
    <Combobox value={selected} onChange={onSelection} disabled={disable}>
      {({ open }) => (
        <div className={styles.autocomplete}>
          <div ref={selectRef} className={`${styles.autocompleteContainer} ${disable ? styles.disable : ''}`}>
            <Combobox.Input
              ref={inputRef}
              data-testid={'select-input'}
              className={styles.autocompleteInput}
              displayValue={displayInputValue}
              onChange={(event) => {
                setQuery(event.target.value);
                getDropdownPosition();
              }}
              onClick={handleInputClick}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(event) => {
                if (event.key === ' ' || event.code === 'Space') {
                  getDropdownPosition();
                }
              }}
              style={{ ...OptionStyleObj }}
              placeholder="Select your option"
              autoComplete="off"
            />
            <Combobox.Button
              className={styles.autocompleteButton}
              data-testid={'select-button'}
              ref={inputButton}
              onClick={getDropdownPosition}
            >
              <ChevronDownIcon
                className={`${styles.chevronDownIcon} ${disable ? styles.disable : ''}`}
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          {isMounted
            ? createPortal(
                <>
                  {open && (
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
                          width: selectRef.current ? selectRef.current.clientWidth : 'auto',
                          left: dropdownPosition.left,
                          top: dropdownPosition.top,
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
      )}
    </Combobox>
  );
};
