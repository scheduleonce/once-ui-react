import { SelectOption, SelectOptions } from '../select/select-options';
import { Select } from '../select/select';
import { SingleLineInput } from '../single-line-input';
import { IOption } from '../../interfaces/select.type';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './phone.module.scss';
import { isValidPhoneNumber, getCountries, getCountryCallingCode } from 'react-phone-number-input/max';
import { CountryCode } from 'libphonenumber-js';
import en from 'react-phone-number-input/locale/en.json';
import { IPhoneData } from '../../interfaces/phone.types';

interface Props {
  countryShortName: string;
  required?: boolean;
  themeColor?: string;
  onUpdate: (obj: IPhoneData) => void;
  placeholder?: string;
  error?: boolean;
  validate?: boolean;
  id?: string;
  phoneNumberValue?: string | null;
  countryCodeFromURL?: string | null;
  additionalClassName?: string;
}

export const Phone: FC<Props> = ({
  countryShortName,
  required = false,
  themeColor = '',
  onUpdate,
  placeholder = '',
  error = false,
  validate = true,
  id = '',
  phoneNumberValue = '',
  countryCodeFromURL = '',
  additionalClassName = '',
}) => {
  /* Country Dropdown */
  const [validationError, setValidationError] = useState<boolean>(error);
  const DEFAULT_COUNTRY_CODE = 'US';
  const countryCode = useRef<string>(
    countryShortName && countryShortName !== '001' ? countryShortName : DEFAULT_COUNTRY_CODE,
  );

  useEffect(() => {
    if (countryCodeFromURL) {
      const selectedCountry = findCountry(countryCodeFromURL);
      if (selectedCountry) {
        setSelected(selectedCountry);
        countryCode.current = countryCodeFromURL;
      }
    }
  }, [countryCodeFromURL]);

  const isSelected = (obj1: any, obj2: any) => {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return true;
    }
    return false;
  };

  const compareCountryCode = (a: string, b: string) => {
    if (en[a as keyof typeof en] < en[b as keyof typeof en]) {
      return -1;
    }
    if (en[a as keyof typeof en] > en[b as keyof typeof en]) {
      return 1;
    }
    return 0;
  };

  const countryList: IOption[] = getCountries()
    .sort(compareCountryCode)
    .map((country) => {
      const obj: IOption = {
        label: country + ' +' + getCountryCallingCode(country as CountryCode),
        value: country,
      };
      return obj;
    });

  const findCountry = (key: string) => {
    return countryList.find((country) => country.value == key);
  };

  const [selected, setSelected] = useState<any | null>(() => {
    const selectedCountry = findCountry(countryCode.current);
    return selectedCountry ? selectedCountry : null;
  });

  const onSelectDropDown = (value: any) => {
    countryCode.current = value;
    const selectedCountry = findCountry(value);
    setSelected(selectedCountry);
    processPhoneNumberInput(phoneNumber.current);
  };

  /* PhoneNumber input box */
  const phoneNumber = useRef(phoneNumberValue ?? '');

  const validatePhoneNumber = (phoneNumber: string) => {
    const trimmedPhoneNumber = phoneNumber.trim();

    if (trimmedPhoneNumber && countryCode.current) {
      /* Validation for all digits are same */
      const pattern = /^(\d)\1*$/;
      const areAllDigitsSame = pattern.test(phoneNumber.trim());
      if (areAllDigitsSame) return false;

      /* Validation according to country code */
      const phoneNumberWithCountryCode = `+${getCountryCallingCode(
        countryCode.current as CountryCode,
      )}${trimmedPhoneNumber}`;

      return isValidPhoneNumber(phoneNumberWithCountryCode);
    }

    return true;
  };

  const processPhoneNumberInput = (phoneNumber: string) => {
    if (!validate) {
      const phoneObject: IPhoneData = {
        phoneNumber: phoneNumber,
        countryCode: countryCode.current,
        error: undefined,
        id: id,
      };
      onUpdate(phoneObject);
    }
    phoneNumber = phoneNumber.trim();
    const error = phoneNumber
      ? validatePhoneNumber(phoneNumber)
        ? undefined
        : 'invalid'
      : required
      ? 'required'
      : undefined;

    setValidationError(!(!validationError && error !== undefined));

    const phoneObject: IPhoneData = {
      phoneNumber: phoneNumber,
      countryCode: countryCode.current,
      error: error,
      id: id,
    };
    onUpdate(phoneObject);
  };
  /* PhoneNumber input box ends */

  return (
    <>
      {
        <div className={`${styles.phoneWrapper} ${additionalClassName?.trim() || ''}`} data-testid="phone-wrapper">
          <div className={styles.countryCode}>
            <Select selected={selected} onSelect={onSelectDropDown} data-testid="phone-select" themeColor={themeColor}>
              <div className={styles.phonNumberList}>
                <SelectOptions setQuery={() => {}} data-testid="phone-select-options">
                  {countryList.map((country) => (
                    <SelectOption
                      disable={false}
                      key={country.value}
                      value={country.value}
                      className={({ active }: { active: boolean }) =>
                        `${active || isSelected(selected, country) ? styles.active : ''}`
                      }
                      data-testid={`phone-select-option-${country.value}`}
                    >
                      <div className={styles.countryListText}>
                        <span>
                          {en[country.value as CountryCode]} +{getCountryCallingCode(country.value as CountryCode)}
                        </span>
                      </div>
                      {/*  )} */}
                    </SelectOption>
                  ))}
                </SelectOptions>
              </div>
            </Select>
          </div>
          <div className={styles.phoneInputWrap}>
            <SingleLineInput
              type="text"
              aria-labelledby="phone-number"
              placeholder={placeholder}
              className={`${styles.phoneInput} ${validationError && validate ? styles.serverError : ''}`}
              id={id}
              value={phoneNumberValue ?? ''}
              onBlur={(e) => {
                phoneNumber.current = e.target.value.trim();
              }}
              onChange={(e) => {
                phoneNumber.current = e.target.value;
                processPhoneNumberInput(phoneNumber.current);
              }}
              data-testid="phone-input"
              themeColor={themeColor}
            />
          </div>
        </div>
      }
    </>
  );
};
