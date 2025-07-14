import React, { FC, forwardRef } from 'react';
import { ComboboxOption } from '@headlessui/react';

// Since we're using ComboboxOptions directly in the main component,
// this wrapper can be simplified or removed entirely in future versions
export const AutoCompleteOptions: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

type ComboboxOptionProps = {
  children: React.ReactNode;
  value: any;
  className?: any;
  disable?: boolean;
};

export type ComboboxRef = HTMLDivElement;

export const AutoCompleteOption = forwardRef<ComboboxRef, ComboboxOptionProps>((props, ref) => (
  <ComboboxOption ref={ref} className={props.className} value={props.value} disabled={props.disable}>
    {props.children}
  </ComboboxOption>
));

AutoCompleteOption.displayName = 'AutoCompleteOption';
