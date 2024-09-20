import React, { FC, Fragment, forwardRef } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import styles from './auto-complete.module.scss';

interface Props {
  children: any;
  setQuery: (query: any) => void;
}

export const AutoCompleteOptions: FC<Props> = ({ children, setQuery }) => {
  return (
    <Transition
      as={Fragment}
      leave={styles.leave}
      leaveFrom={styles.leaveFrom}
      leaveTo={styles.leaveTo}
      afterLeave={() => setQuery('')}
    >
      <Combobox.Options className={styles.autocompleteOptions}>{children}</Combobox.Options>
    </Transition>
  );
};

type ComboboxOptionProps = { children: React.ReactNode; value: any; className: any; disable: boolean };
export type ComboboxRef = HTMLLIElement;
export const AutoCompleteOption = forwardRef<ComboboxRef, ComboboxOptionProps>((props, ref) => (
  <Combobox.Option ref={ref} className={props.className} value={props.value} disabled={props.disable}>
    {props.children}
  </Combobox.Option>
));

AutoCompleteOption.displayName = 'AutoCompleteOption';
