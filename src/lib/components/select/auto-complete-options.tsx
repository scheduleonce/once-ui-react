import React, { FC, Fragment, forwardRef } from 'react';
import { ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react';
import styles from './auto-complete.module.scss';

// Since we're using ComboboxOptions directly in the main component,
// this wrapper can be simplified or removed entirely in future versions
// export const AutoCompleteOptions: FC<{ children: React.ReactNode }> = ({ children }) => {
//   return <>{children}</>;
// };

interface Props {
  children: any;
  setQuery: (query: any) => void;
}

type ComboboxOptionProps = {
  children: React.ReactNode;
  value: any;
  className?: any;
  disable?: boolean;
};

export const AutoCompleteOptions: FC<Props> = ({ children, setQuery }) => {
  return (
    <Transition
      as={Fragment}
      leave={styles.leave}
      leaveFrom={styles.leaveFrom}
      leaveTo={styles.leaveTo}
      afterLeave={() => setQuery('')}
    >
      <ComboboxOptions
        anchor="bottom start"
        className={styles.autocompleteOptions}
        style={{ width: 'var(--input-width)' }}
      >
        {children}
      </ComboboxOptions>
    </Transition>
  );
};

export type ComboboxRef = HTMLDivElement;

export const AutoCompleteOption = forwardRef<ComboboxRef, ComboboxOptionProps>((props, ref) => (
  <ComboboxOption ref={ref} className={props.className} value={props.value} disabled={props.disable}>
    {props.children}
  </ComboboxOption>
));

AutoCompleteOption.displayName = 'AutoCompleteOption';
