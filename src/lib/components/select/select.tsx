import { FC, useEffect, useRef, useState } from 'react';
import { Listbox, ListboxButton } from '@headlessui/react';
import { IOption } from '../../interfaces/select.type';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
import { createPortal } from 'react-dom';
import styles from './select.module.scss';

interface Props {
  children: any;
  selected: IOption | null;
  onSelect: (obj: IOption) => void;
  themeColor?: string;
  placeholder?: string;
}

interface IDropdownPosition {
  left: number;
  top: number;
}

export const Select: FC<Props> = ({ children, selected, onSelect, themeColor, placeholder }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const selectDropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<IDropdownPosition>({ left: 0, top: 0 });
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);
  const windowHeight = useRef<number>(0);
  const pageScrollHeight = useRef<number>(0);

  let borderColor = '#333333';

  const handleOnResize = (): void => {
    windowHeight.current = window.innerHeight;
    pageScrollHeight.current = document.body.scrollHeight;
    setIsMounted(true);
  };

  useEffect(() => {
    handleOnResize();
    window.addEventListener('resize', handleOnResize);
    return () => {
      window.removeEventListener('resize', handleOnResize);
    };
  }, []);

  const calculateRemainingScroll = (): number => {
    return pageScrollHeight.current - (windowHeight.current + window.scrollY);
  };

  const getDropdownPosition = (): void => {
    if (selectRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();

      // Reset position calculation state
      setIsPositionCalculated(false);

      setTimeout(() => {
        const dropdownRect = selectDropdownRef?.current?.getBoundingClientRect();
        const remainingScroll = calculateRemainingScroll();
        const remainingSpace = windowHeight.current - selectRect.bottom;

        if (dropdownRect) {
          const dropdownHeight = dropdownRect.height;
          const selectTop = selectRect.top;
          const noSpaceAbove = dropdownHeight >= selectTop + window.scrollY;

          const top =
            (dropdownHeight >= selectTop &&
              (noSpaceAbove || remainingScroll >= dropdownHeight || remainingSpace >= dropdownHeight)) ||
            (selectTop >= dropdownHeight && remainingSpace >= dropdownHeight)
              ? selectRect.y + selectRect.height
              : selectRect.y - dropdownHeight;

          setDropdownPosition({
            left: selectRect.left,
            top: top ?? selectRect.top,
          });

          // Mark position as calculated
          setIsPositionCalculated(true);
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

  if (themeColor) {
    themeColor = ColorsService.convert3HexTo6(themeColor);
    const theme = luminance(themeColor);
    if (theme === 'dark' || theme === 'light') {
      borderColor = themeColor === '#ffffff' ? '#c8c8c8' : themeColor;
    }
  }

  const handleSelect = (option: any) => {
    onSelect(option);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <Listbox value={selected} onChange={handleSelect}>
      {({ open: headlessOpen }) => {
        // Sync Headless UI's open state with our local state
        if (headlessOpen !== open) {
          setOpen(headlessOpen);
          if (headlessOpen) {
            getDropdownPosition();
          } else {
            // Reset position calculation when dropdown closes
            setIsPositionCalculated(false);
          }
        }

        return (
          <div className={styles.select}>
            <div className={styles.selectContainer} ref={selectRef}>
              <ListboxButton
                ref={selectButtonRef}
                data-testid="select-options"
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={`${styles.selectButton} ${headlessOpen ? styles.open : ''}`}
                style={{
                  borderBottomColor: themeColor && (isFocused || headlessOpen) ? borderColor : '',
                }}
              >
                {selected ? (
                  <span className={styles.selectValue}>
                    {selected.avatar && <img src={selected.avatar} alt="" className={styles.seletIcon} />}
                    <span className={styles.selectText}>{selected.label}</span>
                  </span>
                ) : (
                  placeholder && <span className={`${styles.selectValue} ${styles.placeholder}`}>{placeholder}</span>
                )}
                <span className={styles.chevronDownIconSpan}>
                  <ChevronDownIcon
                    className={styles.chevronDownIcon}
                    aria-hidden="true"
                    data-open={open ? true : undefined}
                  />
                </span>
              </ListboxButton>
            </div>

            {isMounted &&
              createPortal(
                headlessOpen && (
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
                        width: selectRef.current?.clientWidth ?? 'auto',
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
        );
      }}
    </Listbox>
  );
};
