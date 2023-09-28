import { FC, useRef, useEffect, CSSProperties } from 'react';
import { Combobox } from '@headlessui/react';
import { IOption } from './select.types';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';

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
  let OptionStyleObj: CSSProperties = {};

  useEffect(() => {
    if (inputRef.current && selected) {
      inputRef.current.value = selected.label || '';
    }
  }, [selected]);

  const onSelection = (option: IOption) => {
    onSelect(option);
    handlingCursorPosition();
  };

  const handleInputClick = () => {
    if (inputRef.current && inputButton.current) {
      if (clearSearch) {
        inputRef.current.value = '';
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
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  };

  if (themeColor) {
    const theme = luminance(themeColor);
    themeColor = themeColor.length === 4 ? themeColor.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3') : themeColor;
    const borderColor = themeColor === '#ffffff' ? '#333333' : themeColor;
    if (theme === 'dark' || theme === 'light') {
      OptionStyleObj = {
        borderBottomColor: borderColor,
      };
    }
  }

  return (
    <Combobox value={selected} onChange={onSelection} disabled={disable}>
      <div className="tw-relative ">
        <div
          className={`tw-relative tw-h-10 tw-w-full tw-cursor-default tw-overflow-hidden tw-bg-white tw-text-left focus:tw-outline-none focus-visible:tw-ring-1 focus-visible:tw-ring-[#DFDFDF] focus-visible:tw-ring-offset-2 focus-visible:tw-ring-offset-[#DFDFDF] sm:tw-text-sm ${
            disable ? 'tw-text-[#A7A7A7]' : 'tw-text-[#333333]'
          }`}
        >
          <Combobox.Input
            ref={inputRef}
            data-testid={'select-input'}
            className="tw-h-full tw-w-full tw-border-0 tw-border-b-[1px] tw-border-b-[#333333] tw-py-2 tw-pl-3 tw-pr-10 tw-text-base tw-leading-5 tw-shadow-none focus:tw-border-b-2 focus:tw-border-b-[#006bb1] focus:tw-outline-none focus:tw-ring-[0px] focus-visible:tw-ring-[0px]"
            displayValue={displayInputValue}
            onChange={(event) => setQuery(event.target.value)}
            onClick={handleInputClick}
            style={{ ...OptionStyleObj }}
          />
          <Combobox.Button
            className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2"
            data-testid={'select-button'}
            ref={inputButton}
          >
            <ChevronDownIcon
              className={`tw-h-5 tw-w-5 ${disable ? 'tw-text-[#A7A7A7]' : 'tw-text-[#333333]'}`}
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        {children}
      </div>
    </Combobox>
  );
};
