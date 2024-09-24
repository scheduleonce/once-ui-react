# Usage

Import the `QuickMultiSelect` component into your React application:

```jsx
import QuickMultiSelect from '@/once-ui/quick-multi-select/quick-multi-select';
```

## IOption Interface

Before using the `QuickMultiSelect` component, define an `IOption` interface for representing the available choices. The `IOption` interface should have the following properties:

- `value (string)`: A unique identifier for the option.
- `label (string)`: The text or label associated with the option.
- `order (number, optional)`: An optional property that specifies the order of the option in a list or display.
- `disabled (boolean, optional)`: An optional property that specifies whether the option is disabled or not.
- `avatar (string, optional)`: An optional property that specifies the image path.

Here's an example of how to define the `IOption` interface:

```jsx
export interface IOption {
  value: string;
  label: string;
  order?: number;
  avatar?: string;
  disable?: boolean;
}
```

## Props

The `QuickMultiSelect` component accepts the following props:

- `options (Array)`: An array of IOption objects representing the available choices.
- `checkedValue (Array)`: An array of numbers representing the initially selected options.
- `onSelectionChange (Function)`: A callback function that is called when the selection changes. It receives an array of selected option values.
- `maxOptions?`: Maximum number of option that can be checked;

Example

```jsx
import React, { useState } from 'react';
import MultiSelect from '@/once-ui/multi-select/multi-select';

const options: IOption[] = [
  { value: '1', label: 'Option 1', order: 1 },
  { value: '2', label: 'Option 2', order: 2 },
  { value: '3', label: 'Option 3', order: 3, disable: true },
	// Add more options here
];

function App() {
	const [selectedOptions, setSelectedOptions] = useState(['2']);

	const handleSelectionChange = (newSelection) => {
		setSelectedOptions(newSelection);
	};

	return (
		<div>
			<h1>Quick MultiSelect Example</h1>
			<QuickMultiSelect options={options}
			checkedValue={selectedOptions}
			onSelectionChange={handleSelectionChange}
			maxOptions= {}
			/>
		</div>
	);
}

export default App;
```

## Author

Kaushal Kumar
