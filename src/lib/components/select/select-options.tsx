import React, { FC, forwardRef } from 'react';
import { ListboxOption } from '@headlessui/react';

interface Props {
  children: any;
  setQuery: (query: any) => void;
}

export const SelectOptions: FC<Props> = ({ children }) => {
  // In HeadlessUI v2.2, this is just a wrapper that passes through children
  // The actual ListboxOptions is handled in the main Select component
  return <>{children}</>;
};

type SelectOptionProps = { children: React.ReactNode; value: any; className: any; disable: boolean };
export type SelectRef = HTMLDivElement;
export const SelectOption = forwardRef<SelectRef, SelectOptionProps>((props, ref) => (
  <ListboxOption ref={ref} className={props.className} value={props.value} disabled={props.disable}>
    {props.children}
  </ListboxOption>
));

SelectOption.displayName = 'SelectOption';
