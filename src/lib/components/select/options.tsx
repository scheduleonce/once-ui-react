import React, { FC, Fragment, forwardRef } from 'react';
import { Combobox, Transition } from '@headlessui/react';
interface Props {
  children: any;
  setQuery: (query: any) => void;
}

export const Options: FC<Props> = ({ children, setQuery }) => {
  return (
    <Transition
      as={Fragment}
      leave="tw-transition tw-ease-in tw-duration-100"
      leaveFrom="tw-opacity-100"
      leaveTo="tw-opacity-0"
      afterLeave={() => setQuery('')}
    >
      <Combobox.Options className="tw-max-h-[210px] tw-w-full tw-overflow-auto tw-bg-white tw-pb-[10px] tw-pt-[10px] tw-text-base tw-shadow-[0_1px_6px_0_rgba(0,0,0,0.5)] focus:tw-outline-none sm:tw-text-sm [&::-webkit-scrollbar-thumb]:tw-rounded-md [&::-webkit-scrollbar-thumb]:tw-bg-[#a9a9a9] [&::-webkit-scrollbar]:tw-w-[6px]">
        {children}
      </Combobox.Options>
    </Transition>
  );
};

type ComboboxOptionProps = { children: React.ReactNode; value: any; className: any; disable: boolean };
export type ComboboxRef = HTMLLIElement;
export const Option = forwardRef<ComboboxRef, ComboboxOptionProps>((props, ref) => (
  <Combobox.Option ref={ref} className={props.className} value={props.value} disabled={props.disable}>
    {props.children}
  </Combobox.Option>
));

Option.displayName = 'Option';
