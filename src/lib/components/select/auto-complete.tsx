import { FC, useRef, useEffect, CSSProperties, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { IOption } from './select.types';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
import { createPortal } from 'react-dom';

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
    handlingCursorPosition();
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
        <div className="tw-relative ">
          <div
            ref={selectRef}
            className={`tw-relative tw-h-10 tw-w-full tw-cursor-default tw-overflow-hidden tw-bg-white tw-text-left focus:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-[#DFDFDF] focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-[#DFDFDF] ${
              disable ? 'tw-text-[#A7A7A7]' : 'tw-text-[#333333]'
            }`}
          >
            <Combobox.Input
              ref={inputRef}
              data-testid={'select-input'}
              className="tw-h-full tw-w-full tw-border-0 tw-border-b-[1px] tw-border-b-[#333333] tw-pb-2 tw-pl-[10px] tw-pr-10 tw-pt-2 tw-text-base tw-leading-5 tw-placeholder-[#666666] tw-shadow-none focus:tw-border-b-2 focus:tw-border-b-[#006bb1] focus:tw-pb-[7px] focus:tw-outline-none focus:tw-ring-[0px] focus-visible:tw-ring-[0px]"
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
              className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2"
              data-testid={'select-button'}
              ref={inputButton}
              onClick={getDropdownPosition}
            >
              <ChevronDownIcon
                className={`tw-h-5 tw-w-5 ${disable ? 'tw-text-[#A7A7A7]' : 'tw-text-[#333333]'}`}
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
    </Combobox>
  );
};
