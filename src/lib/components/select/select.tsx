import { FC, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { IOption } from './select.types';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
interface Props {
  children: any;
  selected: IOption | null;
  onSelect: (obj: IOption) => void;
  themeColor?: string;
}

export const Select: FC<Props> = ({ children, selected, onSelect, themeColor }) => {
  const [isFocused, setIsFocused] = useState(false);
  let borderColor = '#333333';
  const onSelection = (option: IOption) => {
    onSelect(option);
  };
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  if (themeColor) {
    themeColor = ColorsService.convert3HexTo6(themeColor);
    const theme = luminance(themeColor);
    if (theme === 'dark' || theme === 'light') {
      borderColor = themeColor === '#ffffff' ? '#c8c8c8' : themeColor;
    }
  }

  return (
    <>
      <Listbox value={selected} onChange={onSelection}>
        {({ open }) => (
          <div className={'tw-relative'}>
            <div className="tw-relative">
              <Listbox.Button
                data-testid={'select-options'}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ borderBottomColor: themeColor && (isFocused || open) ? borderColor : '' }}
                className={
                  `tw-relative tw-h-10 tw-w-full tw-cursor-pointer tw-border-b tw-border-t tw-border-t-transparent tw-bg-white tw-py-1.5 tw-pl-[10px] tw-pr-10 tw-text-left tw-text-[#333333] focus:tw-border-b-2 focus:tw-border-t-2 focus:tw-border-b-[#006bb1] focus:tw-py-[5px] focus:tw-outline-none focus:tw-ring-0 sm:tw-text-sm sm:tw-leading-6` +
                  (open ? ' tw-border-b-2 tw-border-t-2 tw-border-b-[#006bb1]' : ' tw-border-b-[#333333]')
                }
              >
                {selected && (
                  <span className="tw-flex tw-items-center">
                    {selected.avatar && (
                      <img src={selected.avatar.src} alt="" className="tw-mr-2 tw-h-5 tw-w-5 tw-flex-shrink-0" />
                    )}
                    <span className="tw-block tw-truncate">{selected.label}</span>
                  </span>
                )}
                <span className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                  <ChevronDownIcon className={'tw-h-5 tw-w-5 tw-text-[#333333]'} aria-hidden="true" />
                </span>
              </Listbox.Button>
            </div>
            {children}
          </div>
        )}
      </Listbox>
    </>
  );
};
