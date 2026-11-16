import React, { CSSProperties, FC, Fragment, forwardRef, useContext } from 'react';
import { Transition, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import styles from './auto-complete.module.scss';
import { AutoCompleteVirtualContext } from './auto-complete-virtual-context';

interface Props {
  children: any;
  setQuery: (query: any) => void;
}

export const AutoCompleteOptions: FC<Props> = ({ children, setQuery }) => {
  const renderVirtualOption = useContext(AutoCompleteVirtualContext);

  return (
    <Transition
      as={Fragment}
      leave={styles.leave}
      leaveFrom={styles.leaveFrom}
      leaveTo={styles.leaveTo}
      afterLeave={() => setQuery('')}
    >
      <ComboboxOptions className={styles.autocompleteOptions}>
        {/* An undefined option indicates Headless UI has not activated virtual mode yet. */}
        {renderVirtualOption
          ? (slot: { option?: unknown }) =>
              slot.option !== undefined ? renderVirtualOption(slot.option, children) : children
          : children}
      </ComboboxOptions>
    </Transition>
  );
};

type ComboboxOptionProps = {
  children: React.ReactNode;
  value: any;
  className: any;
  disable: boolean;
  style?: CSSProperties;
  'data-index'?: number;
  'aria-setsize'?: number;
  'aria-posinset'?: number;
};
export type ComboboxRef = HTMLLIElement;
export const AutoCompleteOption = forwardRef<ComboboxRef, ComboboxOptionProps>((props, ref) => (
  <ComboboxOption
    ref={ref}
    className={props.className}
    value={props.value}
    disabled={props.disable}
    style={props.style}
    data-index={props['data-index']}
    aria-setsize={props['aria-setsize']}
    aria-posinset={props['aria-posinset']}
  >
    {props.children}
  </ComboboxOption>
));

AutoCompleteOption.displayName = 'AutoCompleteOption';
