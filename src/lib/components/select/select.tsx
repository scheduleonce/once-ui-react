import { FC, useEffect, useRef, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { IOption } from './select.types';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
import { createPortal } from 'react-dom';
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
  const selectDropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setdropdownPosition] = useState<IDropdownPosition>({ left: 0, top: 0 });
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

  if (themeColor) {
    themeColor = ColorsService.convert3HexTo6(themeColor);
    const theme = luminance(themeColor);
    if (theme === 'dark' || theme === 'light') {
      borderColor = themeColor === '#ffffff' ? '#c8c8c8' : themeColor;
    }
  }

  return (
    <Listbox value={selected} onChange={onSelection}>
      {({ open }) => (
        <div className={'tw-relative'}>
          <div className="tw-relative" ref={selectRef}>
            <Listbox.Button
              data-testid={'select-options'}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={getDropdownPosition}
              onKeyDown={(event) => {
                if (event.key === ' ' || event.code === 'Space' || event.code === 'Enter') {
                  getDropdownPosition();
                }
              }}
              style={{ borderBottomColor: themeColor && (isFocused || open) ? borderColor : '' }}
              className={
                `tw-border-x-0 tw-relative tw-h-10 tw-w-full tw-cursor-pointer tw-border-b tw-border-t tw-border-t-transparent tw-bg-white tw-py-1.5 tw-pl-[10px] tw-pr-8 tw-text-left tw-text-base tw-text-[#333333] focus:tw-border-b-2 focus:tw-border-t-2 focus:tw-border-b-[#006bb1] focus:tw-py-[5px] focus:tw-outline-none focus:tw-ring-0` +
                (open ? ' tw-border-b-2 tw-border-t-2 tw-border-b-[#006bb1]' : ' tw-border-b-[#333333]')
              }
            >
              {selected && (
                <span className="tw-flex tw-items-center">
                  {selected.avatar && (
                    <img src={selected.avatar} alt="" className="tw-mr-2 tw-h-5 tw-w-5 tw-flex-shrink-0" />
                  )}
                  <span className="tw-block tw-truncate">{selected.label}</span>
                </span>
              )}
              <span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                <ChevronDownIcon className={'tw-h-5 tw-w-5 tw-text-[#333333]'} aria-hidden="true" />
              </span>
            </Listbox.Button>
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
                        className="tw-absolute"
                        style={{
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
    </Listbox>
  );
};
