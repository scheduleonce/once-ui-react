import { FC, useRef, useState, CSSProperties, useEffect } from 'react';
import { IOption } from '../../interfaces/select.type';
import { Combobox, ComboboxInput, ComboboxButton } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { createPortal } from 'react-dom';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  let OptionStyleObj: CSSProperties = {};

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputClick = (isOpen: boolean) => {
    setIsFocused(true);
    if (isOpen) {
      // If dropdown is open, restore selected value and close it
      if (inputRef.current && selected) {
        inputRef.current.value = selected.label || '';
      }
      if (inputRef.current) {
        const escapeEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
          bubbles: true,
          cancelable: true,
        });
        inputRef.current.dispatchEvent(escapeEvent);
      }
      return;
    }

    // If dropdown is closed, clear search if needed and open it
    if (inputRef.current && clearSearch) {
      inputRef.current.value = '';
      setQuery('');
    }

    if (inputRef.current) {
      inputRef.current.focus();
      const arrowDownEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      });
      inputRef.current.dispatchEvent(arrowDownEvent);
    }
  };

  const handleButtonClick = (isOpen: boolean) => {
    if (!isOpen) {
      // If dropdown is currently open, it will close - so restore selected value
      if (inputRef.current && selected) {
        inputRef.current.value = selected.label || '';
      }
      return;
    }

    // If dropdown is currently closed, it will open - so clear search if needed
    if (inputRef.current && clearSearch) {
      inputRef.current.value = '';
      setQuery('');
    }
  };

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
    <Combobox value={selected} onChange={onSelect} disabled={disable}>
      {({ open }) => (
        <div className={styles.autocomplete}>
          <div ref={selectRef} className={`${styles.autocompleteContainer} ${disable ? styles.disable : ''}`}>
            <ComboboxInput
              ref={inputRef}
              data-testid="select-input"
              className={styles.autocompleteInput}
              displayValue={(o: any) => o?.label || ''}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => handleInputClick(open)}
              style={{ ...OptionStyleObj }}
              placeholder="Select your option"
              autoComplete="off"
            />
            <ComboboxButton
              ref={buttonRef}
              className={styles.autocompleteButton}
              data-testid="select-button"
              onClick={() => handleButtonClick(open)}
            >
              <ChevronDownIcon
                className={`${styles.chevronDownIcon} ${disable ? styles.disable : ''} ${open ? styles.open : ''}`}
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          {isMounted &&
            createPortal(
              open && (
                <div
                  style={{
                    position: 'fixed',
                    left: selectRef.current?.getBoundingClientRect().left || 0,
                    top: (selectRef.current?.getBoundingClientRect().bottom || 0) + 2,
                    width: selectRef.current?.clientWidth || 'auto',
                    zIndex: 1000,
                  }}
                >
                  {children}
                </div>
              ),
              document.body,
            )}
        </div>
      )}
    </Combobox>
  );
};
