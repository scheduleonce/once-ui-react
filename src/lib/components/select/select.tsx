import { FC, useEffect, useRef, useState, useCallback } from 'react';
import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import luminance from '@oncehub/relative-luminance';
import { ColorsService } from '../colors.service';
import styles from './select.module.scss';

interface Props {
  children: any;
  selected: any;
  onSelect: (obj: any) => void;
  themeColor?: string;
}

export const Select: FC<Props> = ({ children, selected, onSelect, themeColor }) => {
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);

  console.log('test phone number');
  let borderColor = '#333333';

  const onSelection = (option: any): void => {
    onSelect(option);
  };

  const handleFocus = useCallback((): void => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback((): void => {
    setIsFocused(false);
  }, []);

  useEffect(() => {
    const selectButton = selectButtonRef.current;
    if (selectButton) {
      selectButton.addEventListener('focus', handleFocus);
      selectButton.addEventListener('blur', handleBlur);
    }
    return () => {
      if (selectButton) {
        selectButton.removeEventListener('focus', handleFocus);
        selectButton.removeEventListener('blur', handleBlur);
      }
    };
  }, [handleFocus, handleBlur]);

  if (themeColor) {
    themeColor = ColorsService.convert3HexTo6(themeColor);
    const theme = luminance(themeColor);
    if (theme === 'dark' || theme === 'light') {
      borderColor = themeColor === '#ffffff' ? '#c8c8c8' : themeColor;
    }
  }

  return (
    <Listbox value={selected} onChange={onSelection}>
      {({ open }) => (
        <div
          className={styles.select}
          // style={
          //   {
          //     '--button-width': selectRef.current?.offsetWidth ? `${selectRef.current.offsetWidth}px` : '100%',
          //   } as React.CSSProperties
          // }
        >
          <div className={styles.selectContainer} ref={selectRef}>
            <ListboxButton
              data-testid={'select-options'}
              ref={selectButtonRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{ borderBottomColor: themeColor && (isFocused || open) ? borderColor : '' }}
              className={`${styles.selectButton} ${open ? styles.open : ''}`}
              tabIndex={0}
            >
              {selected && (
                <span className={styles.selectValue}>
                  {selected.avatar && <img src={selected.avatar} alt="" className={styles.seletIcon} />}
                  <span className={styles.selectText}>{selected.label}</span>
                </span>
              )}
              <span className={styles.chevronDownIconSpan}>
                <ChevronDownIcon className={styles.chevronDownIcon} aria-hidden="true" />
              </span>
            </ListboxButton>
          </div>

          <ListboxOptions
            anchor="bottom start"
            style={{
              width: selectRef.current?.offsetWidth ? `${selectRef.current.offsetWidth}px` : '100%',
              zIndex: 1000,
            }}
            className={styles.selectOptions}
          >
            {children}
          </ListboxOptions>
        </div>
      )}
    </Listbox>
  );
};
