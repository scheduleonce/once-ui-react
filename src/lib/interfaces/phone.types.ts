export interface IPhoneData {
  phoneNumber: string;
  countryCode: string;
  error: undefined | 'invalid' | 'required';
}
