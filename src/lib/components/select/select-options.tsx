import React, { FC, Fragment, forwardRef } from 'react';
import { Listbox, Transition } from '@headlessui/react';
interface Props {
  children: any;
  setQuery: (query: any) => void;
}

const SelectOptions: FC<Props> = ({ children, setQuery }) => {
  return (
    <>
      <Transition
        as={Fragment}
        leave="tw-transition tw-ease-in tw-duration-100"
        leaveFrom="tw-opacity-100"
        leaveTo="tw-opacity-0"
        afterLeave={() => setQuery('')}
      >
        <Listbox.Options className="tw-absolute tw-z-10 tw-max-h-[200px] tw-w-full tw-overflow-auto tw-border-[1px] tw-border-[#979797] tw-bg-white tw-pb-[10px] tw-pt-[10px] tw-text-base focus:tw-outline-none sm:tw-text-sm">
          {children}
        </Listbox.Options>
      </Transition>
    </>
  );
};

export default SelectOptions;

type SelectOptionProps = { children: React.ReactNode; value: any; className: any; disable: boolean };
export type SelectOptionRef = HTMLLIElement;
export const SelectOption = forwardRef<SelectOptionRef, SelectOptionProps>((props, ref) => (
  <Listbox.Option ref={ref} className={props.className} value={props.value} disabled={props.disable}>
    {props.children}
  </Listbox.Option>
));
