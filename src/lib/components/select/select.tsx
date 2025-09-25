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
}
interface IDropdownPosition {
  left: number;
  top: number;
}

export const Select: FC<Props> = ({ children, selected, onSelect, themeColor }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const selectDropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setdropdownPosition] = useState<IDropdownPosition>({ left: 0, top: 0 });
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);
  const windowHeight = useRef<number>(0);
  const pageScrollHeight = useRef<number>(0);

  let borderColor = '#333333';
  const onSelection = (option: IOption): void => {
    onSelect(option);
  };
  const handleFocus = (): void => {
    setIsFocused(true);
  };
  const handleBlur = (): void => {
    setIsFocused(false);
  };

  useEffect(() => {
    const selectButton = selectButtonRef.current;
    if (selectButton) {
      selectButton.addEventListener('focus', handleFocus);
      selectButton.addEventListener('blur', handleBlur);
    }
    return () => {
      if (selectButton) {
        selectButton.removeEventListener('focus', handleFocus);
        selectButton.removeEventListener('blur', handleBlur);
      }
    };
  }, [handleFocus, handleBlur]);

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

  const calculateRemainingScroll = (): number => {
    return pageScrollHeight.current - (windowHeight.current + window.scrollY);
  };

  const getDropdownPosition = (): void => {
    if (selectRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect();

      // Set initial position immediately to make dropdown visible
      setdropdownPosition({
        left: selectRect.left,
        top: selectRect.y + selectRect.height,
      });
      setIsPositionCalculated(true);

      setTimeout(() => {
        const selectDropdownRect = selectDropdownRef?.current?.getBoundingClientRect();
        const remainingScroll = calculateRemainingScroll();
        const remainingSpace = windowHeight.current - selectRect.bottom;
        let topPosition;
        /* istanbul ignore next */
        if (selectDropdownRect) {
          const selectHeight = selectRect.height;
          const selectTopPosition = selectRect.top;
          const selectDropdownHeight = selectDropdownRect.height;
          const noSpaceAvailableAbove = selectDropdownHeight >= selectTopPosition + window.scrollY;
          if (
            (selectDropdownHeight >= selectTopPosition &&
              (noSpaceAvailableAbove ||
                (noSpaceAvailableAbove && remainingSpace <= selectDropdownHeight) ||
                remainingScroll >= selectDropdownHeight ||
                remainingSpace >= selectDropdownHeight)) ||
            (selectTopPosition >= selectDropdownHeight && remainingSpace >= selectDropdownHeight)
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

  if (themeColor) {
    themeColor = ColorsService.convert3HexTo6(themeColor);
    const theme = luminance(themeColor);
    if (theme === 'dark' || theme === 'light') {
      borderColor = themeColor === '#ffffff' ? '#c8c8c8' : themeColor;
    }
  }

  return (
    <Listbox value={selected} onChange={onSelection}>
      {({ open }) => {
        // Calculate position when dropdown opens
        if (open && !isPositionCalculated) {
          getDropdownPosition();
        }

        return (
          <div className={styles.select}>
            <div className={styles.selectContainer} ref={selectRef}>
              <ListboxButton
                data-testid={'select-options'}
                ref={selectButtonRef}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onClick={getDropdownPosition}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.code === 'Space' || event.code === 'Enter') {
                    getDropdownPosition();
                  }
                }}
                style={{ borderBottomColor: themeColor && (isFocused || open) ? borderColor : '' }}
                className={`${styles.selectButton} ${open ? styles.open : ''}`}
                tabIndex={0}
              >
                {selected && (
                  <span className={styles.selectValue}>
                    {selected.avatar && <img src={selected.avatar} alt="" className={styles.seletIcon} />}
                    <span className={styles.selectText}>{selected.label}</span>
                  </span>
                )}
                <span className={styles.chevronDownIconSpan}>
                  <ChevronDownIcon className={styles.chevronDownIcon} aria-hidden="true" />
                </span>
              </ListboxButton>
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
                            opacity: isPositionCalculated ? 1 : 0,
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
        );
      }}
    </Listbox>
  );
};
