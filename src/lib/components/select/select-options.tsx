import React, { FC, Fragment, forwardRef } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import styles from './select.module.scss';
interface Props {
  children: any;
  setQuery: (query: any) => void;
}

export const SelectOptions: FC<Props> = ({ children, setQuery }) => {
  return (
    <Transition
      as={Fragment}
      leave={styles.leave}
      leaveFrom={styles.leaveFrom}
      leaveTo={styles.leaveTo}
      afterLeave={() => setQuery('')}
    >
      <Listbox.Options className={styles.selectOptions}>{children}</Listbox.Options>
    </Transition>
  );
};

type SelectOptionProps = { children: React.ReactNode; value: any; className: any; disable: boolean };
export type SelectRef = HTMLLIElement;
export const SelectOption = forwardRef<SelectRef, SelectOptionProps>((props, ref) => (
  <Listbox.Option ref={ref} className={props.className} value={props.value} disabled={props.disable}>
    {props.children}
  </Listbox.Option>
));

SelectOption.displayName = 'SelectOption';
