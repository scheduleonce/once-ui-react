import React, {
  FC,
  useRef,
  useEffect,
  CSSProperties,
  useState,
  useCallback,
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';
import { Combobox, ComboboxInput, ComboboxButton } from '@headlessui/react';
import { IOption } from '../../interfaces/select.type';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
import { createPortal } from 'react-dom';
import styles from './auto-complete.module.scss';
import { AutoCompleteOption } from './auto-complete-options';
import { AutoCompleteVirtualContext, RenderVirtualOption } from './auto-complete-virtual-context';

interface Props {
  children: any;
  selected: IOption | null;
  onSelect: (obj: IOption | null) => void;
  setQuery?: (query: string) => void;
  disable?: boolean;
  clearSearch?: boolean;
  themeColor?: string;
}

const VIRTUALIZATION_THRESHOLD = 100;
const EMPTY_VIRTUAL_OPTION: IOption = { label: '', value: '' };

interface VirtualOptions {
  values: IOption[];
  disabledValues: Set<unknown>;
  elementByValue: Map<unknown, ReactElement>;
  isEmpty: boolean;
}

const collectOptionElements = (node: ReactNode, elements: ReactElement<any>[] = []): ReactElement<any>[] => {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === AutoCompleteOption) {
      elements.push(child);
    } else {
      collectOptionElements((child.props as { children?: ReactNode }).children, elements);
    }
  });
  return elements;
};

const getVirtualOptions = (elements: ReactElement<any>[]): VirtualOptions => {
  const virtualOptions: VirtualOptions = {
    values: [],
    disabledValues: new Set(),
    elementByValue: new Map(),
    isEmpty: elements.length === 0,
  };
  elements.forEach((element) => {
    const value = element.props.value;
    virtualOptions.values.push(value);
    virtualOptions.elementByValue.set(value, element);
    if (element.props.disable) virtualOptions.disabledValues.add(value);
  });
  // Headless UI renders nothing for an empty virtual list, so a placeholder row carries the "nothing found" content
  if (virtualOptions.isEmpty) {
    virtualOptions.values.push(EMPTY_VIRTUAL_OPTION);
    virtualOptions.disabledValues.add(EMPTY_VIRTUAL_OPTION);
  }
  return virtualOptions;
};

// Keeps the previous array while its items are unchanged so Headless UI does not re-key virtual items on every render.
const useStableArray = <T,>(items: T[]): T[] => {
  const ref = useRef(items);
  if (ref.current.length !== items.length || ref.current.some((item, index) => item !== items[index])) {
    ref.current = items;
  }
  return ref.current;
};

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
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; opensUp: boolean }>({
    top: 0,
    left: 0,
    opensUp: false,
  });
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);
  const [isVirtualized, setIsVirtualized] = useState(false);
  const windowHeight = useRef<number>(0);
  const pageScrollHeight = useRef<number>(0);

  let OptionStyleObj: CSSProperties = {};

  const optionElements = collectOptionElements(children);
  // Headless UI cannot drop its virtual list in place, so stay virtualized once the threshold has been exceeded
  if (!isVirtualized && optionElements.length > VIRTUALIZATION_THRESHOLD) setIsVirtualized(true);
  const virtualOptions = isVirtualized ? getVirtualOptions(optionElements) : null;
  const virtualValues = useStableArray(virtualOptions?.values ?? []);
  const lastVirtualElements = useRef<Map<unknown, ReactElement>>(new Map());

  useEffect(() => {
    if (virtualOptions) lastVirtualElements.current = virtualOptions.elementByValue;
  });

  // Headless UI can ask for an option from the previous list before the current one is committed
  const renderVirtualOption: RenderVirtualOption | null = virtualOptions
    ? (option, emptyContent) => {
        // Rendered as a disabled option so Headless UI measures its real height. Headless UI updates its option list one
        // commit late, so the empty content is shown only when this render has no options (otherwise the new options would be nested here)
        if (option === EMPTY_VIRTUAL_OPTION) {
          return (
            <AutoCompleteOption value={option} className="" disable={true}>
              {virtualOptions.isEmpty ? emptyContent : null}
            </AutoCompleteOption>
          );
        }
        return (
          virtualOptions.elementByValue.get(option) ??
          lastVirtualElements.current.get(option) ?? (
            <AutoCompleteOption value={option} className="" disable={true}>
              {null}
            </AutoCompleteOption>
          )
        );
      }
    : null;

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

  useEffect(() => {
    // The list unmounts on close, so its leave transition never resets the search; clear it here to match the input
    if (!isOpen) setQuery('');
  }, [isOpen]);

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
          // Decide the direction with the list's maximum height: its content can grow after opening (for example after a search)
          const listbox = selectDropdownRef?.current?.querySelector<HTMLElement>('[role="listbox"]');
          const listMaxHeight = listbox ? parseFloat(getComputedStyle(listbox).maxHeight) : NaN;
          const dropdownHeight = Number.isNaN(listMaxHeight) ? selectDropdownRect.height : listMaxHeight;
          const selectTop = selectRect.top;
          const noSpaceAbove = dropdownHeight >= selectTop + window.scrollY;
          const opensDown =
            (dropdownHeight >= selectTop &&
              (noSpaceAbove || remainingScroll >= dropdownHeight || remainingSpace >= dropdownHeight)) ||
            (selectTop >= dropdownHeight && remainingSpace >= dropdownHeight);
          // Upward dropdowns are anchored by their bottom edge (translateY below), so they stay attached to the input when their height changes
          const inputTop = viewport ? selectRect.top + viewport.offsetTop : selectRect.top;
          setDropdownPosition({
            left,
            top: opensDown ? top : inputTop,
            opensUp: !opensDown,
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

  const handleInputClick = () => {
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
    <Combobox
      value={selected}
      onChange={onSelect}
      disabled={disable}
      virtual={
        virtualOptions
          ? { options: virtualValues, disabled: (option) => virtualOptions.disabledValues.has(option) }
          : undefined
      }
    >
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
                            transform: dropdownPosition.opensUp ? 'translateY(-100%)' : undefined,

                            zIndex: 1000,
                          }}
                        >
                          <AutoCompleteVirtualContext.Provider value={renderVirtualOption}>
                            {children}
                          </AutoCompleteVirtualContext.Provider>
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
