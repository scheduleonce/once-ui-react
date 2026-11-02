import React, { FC, Fragment, forwardRef } from 'react';
import { Transition, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import styles from './auto-complete.module.scss';
import type { IOption } from '../../interfaces/select.type';

type VirtualOptionRenderer = (option: IOption) => React.ReactElement;

type Props =
  | { children: React.ReactNode; setQuery: (query: string) => void; virtual?: false }
  | { children: VirtualOptionRenderer; setQuery: (query: string) => void; virtual: true };

export const AutoCompleteOptions: FC<Props> = (props) => {
  const optionsContent: React.ComponentProps<typeof ComboboxOptions>['children'] = props.virtual
    ? ({ option }: { open: boolean; option: any }) => (props.children as VirtualOptionRenderer)(option as IOption)
    : props.children;

  return (
    <Transition
      as={Fragment}
      leave={styles.leave}
      leaveFrom={styles.leaveFrom}
      leaveTo={styles.leaveTo}
      afterLeave={() => props.setQuery('')}
    >
      <ComboboxOptions className={styles.autocompleteOptions}>{optionsContent}</ComboboxOptions>
    </Transition>
  );
};

type ComboboxOptionProps = Omit<React.ComponentProps<typeof ComboboxOption>, 'disabled'> & { disable?: boolean };
export type ComboboxRef = HTMLElement;
export const AutoCompleteOption = forwardRef<ComboboxRef, ComboboxOptionProps>(({ disable, ...props }, ref) => (
  <ComboboxOption ref={ref} {...props} disabled={disable} />
));

AutoCompleteOption.displayName = 'AutoCompleteOption';
