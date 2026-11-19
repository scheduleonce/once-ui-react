import { createContext, ReactElement, ReactNode } from 'react';

export type RenderVirtualOption = (option: unknown, emptyContent: ReactNode) => ReactElement;

export const AutoCompleteVirtualContext = createContext<RenderVirtualOption | null>(null);
