# Usage

Import the `QuickMultiSelect` component into your React application:

```jsx
import QuickMultiSelect from '@/once-ui/quick-multi-select/quick-multi-select';
```

## Option Interface

Before using the `QuickMultiSelect` component, define an `Option` interface for representing the available choices. The `Option` interface should have the following properties:

- `id (number)`: A unique identifier for the option.
- `text (string)`: The text or label associated with the option.
- `order (number, optional)`: An optional property that specifies the order of the option in a list or display.
- `disabled (boolean, optional)`: An optional property that specifies whether the option is disabled or not.

Here's an example of how to define the `Option` interface:

```jsx
export interface Option {
	id: number;
	text: string;
	order?: number;
	disbled?: boolean;
}
```

## Props

The `QuickMultiSelect` component accepts the following props:

- `options (Array)`: An array of Option objects representing the available choices.
- `checkedValue (Array)`: An array of numbers representing the initially selected options.
- `onSelectionChange (Function)`: A callback function that is called when the selection changes. It receives an array of selected option values.
- `minOptions?`: Minimum number of options that must be checked;
- `maxOptions?`: Maximum number of option that can be checked;

Example

```jsx
import React, { useState } from 'react';
import MultiSelect from '@/once-ui/multi-select/multi-select';

const options = [
	{ id: 1, text: 'Option 1', order: 1 },
	{ id: 2, text: 'Option 2', order: 2 },
	// Add more options here
];

function App() {
	const [selectedOptions, setSelectedOptions] = useState([]);

	const handleSelectionChange = (newSelection) => {
		setSelectedOptions(newSelection);
	};

	return (
		<div>
			<h1>Quick MultiSelect Example</h1>
			<QuickMultiSelect options={options}
			checkedValue={selectedOptions}
			onSelectionChange={handleSelectionChange}
			minOptions= {0}
			maxOptions= {}
			/>
		</div>
	);
}

export default App;
```

## Author

Kaushal Kumar
