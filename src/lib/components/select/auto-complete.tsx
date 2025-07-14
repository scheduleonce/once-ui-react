import { FC, useRef, useEffect, CSSProperties, useState, useCallback } from 'react';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions } from '@headlessui/react';
import { IOption } from '../../interfaces/select.type';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
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
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  let OptionStyleObj: CSSProperties = {};

  // Safe function to handle setQuery calls
  const safeSetQuery = useCallback(
    (query: string) => {
      if (typeof setQuery === 'function') {
        setQuery(query);
      }
    },
    [setQuery],
  );

  useEffect(() => {
    if (inputRef.current && selected) {
      inputRef.current.value = selected.label || '';
    }
  }, [selected]);

  const onSelection = (option: IOption) => {
    onSelect(option);
    handlingCursorPosition();
  };

  const displayInputValue = (option: IOption) => {
    return option?.label;
  };

  const handlingCursorPosition = useCallback(() => {
    const input = inputRef.current;
    if (input) {
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const openDropdown = (triggeredByKeyboard = false) => {
    if (!isOpen && inputRef.current) {
      setIsOpen(true);
      if (!triggeredByKeyboard) {
        inputRef.current.focus();
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const handleInputClick = () => {
    if (clearSearch && inputRef.current) {
      inputRef.current.value = '';
      safeSetQuery('');
    }
    toggleDropdown();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      closeDropdown();
    } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !isOpen) {
      openDropdown(true); // Only set open, don't dispatch event
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
        <div className={`${styles.autocompleteContainer} ${disable ? styles.disable : ''}`}>
          <ComboboxInput
            ref={inputRef}
            data-testid={'select-input'}
            className={styles.autocompleteInput}
            displayValue={displayInputValue}
            onChange={(event) => {
              safeSetQuery(event.target.value);
              if (!isOpen) {
                openDropdown(true);
              }
            }}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ ...OptionStyleObj }}
            placeholder="Select your option"
            autoComplete="off"
          />
          <ComboboxButton
            className={styles.autocompleteButton}
            data-testid={'select-button'}
            ref={inputButton}
            onClick={toggleDropdown}
          >
            <ChevronDownIcon
              className={`${styles.chevronDownIcon} ${disable ? styles.disable : ''}`}
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>

        {isOpen && (
          <ComboboxOptions className={styles.autocompleteOptions} static={false}>
            {children}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
};
