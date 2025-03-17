### Introduction

This is a React component that provides an input field for entering phone numbers. It is accompanied by a function onUpdate, which is called whenever the phone number is changed. The component uses the Phone component, which allows users to input phone numbers with a country code and additional features.

## Usage

Import the component and use it within your desired component. Here's an example of how to use it:

```ts
import Phone from '@/shared/ui/phone/phone';
import { IPhoneData } from '@/shared/ui/phone/phone.types';

const onUpdate = (object: IPhoneData) => {
	console.log('Phone Object ', object);
};

const PhoneNumberInput = () => {
	return (
		<>
			<span>Phone Number</span>
			<Phone
				countryShortName="IN"
				placeholder="Enter phone number"
				required={true}
				themeColor=""
				onUpdate={onUpdate}
			></Phone>
		</>
	);
};

export default PhoneNumberInput;
```

## Props

The Phone component accepts the following props:

- `countryShortName` (string, required): The country code of the phone number input. For example, "IN" for India.

- `placeholder` (string, optional): The text to display as a placeholder inside the input field.

- `required` (boolean, optional): If set to true, the input field will be marked as required.

- `themeColor` (string, optional): The color theme for the input field.

- `showConsent` (boolean, optional): If set to true, it indicates that the user gives consent to receive communication on the provided phone number.

- `onUpdate` (function, required): A callback function that is called whenever the phone number is changed. It receives an object of type IPhoneData as an argument.

## Callback Function

The `onUpdate` callback function is triggered whenever the user makes changes to the phone number input. The function receives an object of type `IPhoneData`, which contains the following properties:

- `phoneNumber` (string): The phone number entered by the user.

- `countryCode` (string): The country code derived from the phone number input.

- `error` (undefined | 'invalid' | 'required'): Indicates whether there is an error with the phone number input. It can be undefined if there is no error, 'invalid' if the phone number is invalid, or 'required' if the field is required but empty.

- `consentChecked` (boolean): Indicates whether the user has given consent to receive communication on the provided phone number.
