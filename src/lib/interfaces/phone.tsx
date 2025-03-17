import { IPhoneData } from './phone.types';

interface PhoneOptions {
  countryShortName: string;
  required?: boolean;
  themeColor?: string;
  onUpdate: (obj: IPhoneData) => void;
  placeholder?: string;
  showConsent?: boolean;
  error?: boolean;
  validate?: boolean;
  id?: string;
}
