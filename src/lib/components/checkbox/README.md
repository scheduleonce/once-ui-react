## Checkbox Component

### The Checkbox is a primary React UI functional component that represents a customizable checkbox input with a label. It allows users to select or deselect a checkbox, and it provides theming options through a themeColor prop. It supports all of the functionality of an HTML5 checkbox, and exposes a similar API.

## Usage

```tsx
import Checkbox from '@/once-ui/checkbox/checkbox';

<Checkbox themeColor="#000000" checked={false}>
	This is checkbox
</Checkbox>;
```

## Props

| Name         | Default value | Description                                                                                                              |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `children`   | `No Default`  | The label or content to be displayed next to the checkbox.                                                               |
| `checked`    | `false`       | The checked property of the checkbox. Can be `true` or `false`                                                           |
| `disabled`   | `false`       | To disabled the checkbox.                                                                                                |
| `id`         | `random ID`   | The ID for the checkbox input element. If not provided, a random ID will be generated.                                   |
| `onChange`   |               | Event handler function to be called when the checkbox state changes. It will receive the new checked state as parameter. |
| `themeColor` | `#006bb1`     | A color scheme to use for the checkbox. Usually taken from theme context                                                 |

You can use any other prop that is supported by the native HTML / React button such as `className`, `style` to apply additional CSS classes and properties.

### Accessibility

The Checkbox component have a good accessibility support:

- Checkbox component have a focus state and can be easily identified if the checkbox get focus.
- Space key press: If checkbox has focus, user can toggle the checkbox's state when the Space key is pressed (unless the checkbox is disabled).

## Examples

```tsx
import React from 'react';
import Checkbox from './Checkbox';

function App() {
	const handleCheckboxChange = (isChecked) => {
		console.log('Checkbox checked:', isChecked);
	};

	// or as below

	const [isChecked, setIsChecked] = useState(false);
	const handleCheck = () => {
		setIsChecked(!isChecked);
	};

	return (
		<div>
			<Checkbox themeColor="#007bff" checked onChange={handleCheckboxChange}>
				Option 1
			</Checkbox>
			<Checkbox className="texting" name="checkbox2" onChange={handleCheck} checked={isChecked}>
				Option 2
			</Checkbox>
			<Checkbox themeColor="#ff5500" disabled>
				Option 3 (Disabled)
			</Checkbox>
		</div>
	);
}

export default App;
```
