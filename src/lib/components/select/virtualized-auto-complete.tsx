import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from '@headlessui/react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
import { IOption } from '../../interfaces/select.type';
import styles from './auto-complete.module.scss';

export interface VirtualizedAutoCompleteOptionState {
  active: boolean;
  selected: boolean;
}

export interface VirtualizedAutoCompleteProps<T extends IOption> {
  options: T[];
  selected: T | null;
  onSelect: (option: T | null) => void;
  renderOption: (option: T, state: VirtualizedAutoCompleteOptionState) => ReactElement;
  optionClassName?: (option: T, state: VirtualizedAutoCompleteOptionState) => string;
  getOptionKey?: (option: T) => string;
  emptyState?: ReactNode;
  setQuery?: (query: string) => void;
  disable?: boolean;
  clearSearch?: boolean;
  themeColor?: string;
}

const VirtualizedAutoCompleteContent = <T extends IOption>({
  options,
  selected,
  renderOption,
  optionClassName,
  getOptionKey = (option: T) => option.value,
  emptyState,
  setQuery,
  disable,
  clearSearch,
  themeColor,
  open,
}: VirtualizedAutoCompleteProps<T> & { open: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryRef = useRef('');
  const pointerPosition = useRef<Pick<PointerEvent, 'clientX' | 'clientY' | 'pointerType'> | null>(null);
  const hoverSyncFrame = useRef<number | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectDropdownRef = useRef<HTMLDivElement>(null);
  const positionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);
  const queryChanged = useCallback(
    (query: string) => {
      queryRef.current = query;
      setQuery?.(query);
    },
    [setQuery],
  );

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (positionTimer.current) clearTimeout(positionTimer.current);
      if (hoverSyncFrame.current !== null) cancelAnimationFrame(hoverSyncFrame.current);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current && selected) inputRef.current.value = selected.label || '';
  }, [selected]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    pointerPosition.current = { clientX: event.clientX, clientY: event.clientY, pointerType: event.pointerType };
  }, []);

  const handleOptionsScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (!pointerPosition.current || hoverSyncFrame.current !== null) return;

    hoverSyncFrame.current = requestAnimationFrame(() => {
      hoverSyncFrame.current = null;
      const pointer = pointerPosition.current;
      const options = event.currentTarget;
      if (!pointer || !options.isConnected) return;

      const hit = document.elementFromPoint(pointer.clientX, pointer.clientY);
      const option = hit instanceof Element ? hit.closest<HTMLElement>('[role="option"]') : null;
      if (!option || option.closest('[role="listbox"]') !== options) return;

      option.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          pointerType: pointer.pointerType,
          clientX: pointer.clientX,
          clientY: pointer.clientY,
          screenY: pointer.clientY + options.scrollTop,
        }),
      );
    });
  }, []);

  const getDropdownPosition = useCallback(() => {
    if (!selectRef.current || !open) return;

    if (positionTimer.current) clearTimeout(positionTimer.current);
    setIsPositionCalculated(false);
    const selectRect = selectRef.current.getBoundingClientRect();
    positionTimer.current = setTimeout(() => {
      const dropdownRect = selectDropdownRef.current?.getBoundingClientRect();
      if (!dropdownRect) return;

      const viewport = window.visualViewport;
      const left = viewport ? selectRect.left + viewport.offsetLeft : selectRect.left;
      const top = viewport
        ? selectRect.top + selectRect.height + viewport.offsetTop
        : selectRect.top + selectRect.height;
      const remainingSpace = viewport
        ? viewport.height - (selectRect.bottom - viewport.offsetTop)
        : window.innerHeight - selectRect.bottom;
      const remainingScroll = viewport
        ? document.body.scrollHeight - (viewport.height + viewport.pageTop)
        : document.body.scrollHeight - (window.innerHeight + window.scrollY);
      const dropdownHeight = dropdownRect.height;
      const openTop =
        (dropdownHeight >= selectRect.top &&
          (dropdownHeight >= selectRect.top + window.scrollY ||
            remainingScroll >= dropdownHeight ||
            remainingSpace >= dropdownHeight)) ||
        (selectRect.top >= dropdownHeight && remainingSpace >= dropdownHeight)
          ? top
          : (viewport ? selectRect.top + viewport.offsetTop : selectRect.top) - dropdownHeight;

      setDropdownPosition({ left, top: openTop });
      setIsPositionCalculated(true);
    }, 0);
  }, [open]);

  useEffect(() => {
    if (open) getDropdownPosition();
    else setIsPositionCalculated(false);
  }, [open, getDropdownPosition]);

  useEffect(() => {
    const updatePosition = () => getDropdownPosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [getDropdownPosition]);

  let optionStyle: CSSProperties = {};
  if (themeColor) {
    const theme = luminance(themeColor);
    const normalizedThemeColor = ColorsService.convert3HexTo6(themeColor);
    const borderColor = normalizedThemeColor === '#ffffff' ? '#c8c8c8' : isFocused ? normalizedThemeColor : '#333333';
    if (theme === 'dark' || theme === 'light') optionStyle = { borderBottomColor: borderColor };
  }

  const handleInputClick = () => {
    if (!open && inputRef.current) {
      getDropdownPosition();
      setIsFocused(true);
      inputRef.current.value = clearSearch ? '' : queryRef.current;
      if (clearSearch) queryChanged('');
      inputRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    } else if (open) {
      inputRef.current?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      setIsFocused(false);
    }
  };

  return (
    <div className={styles.autocomplete}>
      <div ref={selectRef} className={`${styles.autocompleteContainer} ${disable ? styles.disable : ''}`}>
        <ComboboxInput
          ref={inputRef}
          data-testid="select-input"
          className={styles.autocompleteInput}
          displayValue={(option: T | null) => option?.label || ''}
          onChange={(event) => queryChanged(event.target.value)}
          onClick={handleInputClick}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={optionStyle}
          placeholder="Select your option"
          autoComplete="off"
        />
        <ComboboxButton
          className={styles.autocompleteButton}
          data-testid="select-button"
          onClick={() => {
            if (!open) getDropdownPosition();
          }}
        >
          <ChevronDownIcon
            className={`${styles.chevronDownIcon} ${disable ? styles.disable : ''}`}
            aria-hidden="true"
            data-open={open ? true : undefined}
          />
        </ComboboxButton>
      </div>

      {isMounted
        ? createPortal(
            open ? (
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0)', zIndex: 1000 }}>
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
                  <Transition leave={styles.leave} leaveFrom={styles.leaveFrom} leaveTo={styles.leaveTo}>
                    {options.length === 0 ? (
                      <div className={styles.autocompleteOptions}>{emptyState}</div>
                    ) : (
                      <ComboboxOptions
                        className={styles.autocompleteOptions}
                        aria-label="Options"
                        unmount={false}
                        onScroll={handleOptionsScroll}
                        onPointerMove={handlePointerMove}
                      >
                        {({ option }: { option: T }) => (
                          <ComboboxOption
                            key={getOptionKey(option)}
                            value={option}
                            disabled={Boolean(option.disable)}
                            className={({ focus, selected: isSelected }) => {
                              const optionState = { active: focus, selected: isSelected };
                              const customClassName = optionClassName?.(option, optionState) ?? '';
                              return `${styles.virtualizedAutocompleteOption} ${customClassName}`.trim();
                            }}
                          >
                            {(slot) => renderOption(option, { active: slot.focus, selected: slot.selected })}
                          </ComboboxOption>
                        )}
                      </ComboboxOptions>
                    )}
                  </Transition>
                </div>
              </div>
            ) : null,
            document.body,
          )
        : null}
    </div>
  );
};

export const VirtualizedAutoComplete = <T extends IOption>(props: VirtualizedAutoCompleteProps<T>) => (
  <Combobox<T>
    value={props.selected as T}
    onChange={props.onSelect}
    disabled={props.disable}
    by={useCallback(
      (first: T | null, second: T | null) => {
        if (first === null || second === null) return first === second;
        const getKey = props.getOptionKey ?? ((option: T) => option.value);
        return getKey(first) === getKey(second);
      },
      [props.getOptionKey],
    )}
    virtual={useMemo(
      () => ({ options: props.options, disabled: (option: T) => Boolean(option.disable) }),
      [props.options],
    )}
  >
    {({ open }) => <VirtualizedAutoCompleteContent {...props} open={open} />}
  </Combobox>
);
