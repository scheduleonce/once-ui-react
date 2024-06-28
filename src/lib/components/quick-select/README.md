# Usage

Import the `QuickSelect` component into your React application:

```jsx
import QuickSelect from '@/once-ui/quick-select/quick-select';
```

## IOption Interface

Before using the `QuickSelect` component, define an `IOption` interface for representing the available choices. The `IOption` interface should have the following properties:

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

```ts
interface Props {
  options: IOption[];
  onSelect: (option: IOption) => void;
  selected: IOption | null;
  themeColor?: string;
  className?: string;
  style?: CSSProperties;
  showLoader?: boolean;
}
```

The `QuickMultiSelect` component accepts the following props:

1. `options` (Required): An array of option objects, each containing an `value`, `label`, `order`, `avatar` and `disable`.

2. `onSelect` (Required): A callback function that gets called when an option is selected. It takes the selected option as an argument.

3. `selected` (Required): The currently selected option. This prop helps maintain the state of the selected option.

4. `themeColor` (Optional): A string representing the theme color to be applied to the component. This color will influence the styling of the component elements.

5. `className` (Optional): Additional CSS class names to be added to the component wrapper.

6. `style` (Optional): Additional CSS styles to be applied to the component wrapper.

7. `showLoader` (Optional): A boolean flag indicating whether a loading indicator should be shown when an option is selected.

Example

```jsx
import React, { useState } from 'react';
import QuickSelect from '@/once-ui/quick-select/quick-select';

const options: IOption[] = [
  { value: '1', label: 'Option 1', order: 1 },
  { value: '2', label: 'Option 2', order: 2 },
  { value: '3', label: 'Option 3', order: 3, disable: true },
  // Add more options
];

function App() {
  const [selectedOption, setSelectedOption] =
    (useState < Option) | (null > null);

  const handleSelect = (option: IOption) => {
    setSelectedOption(option);
  };
  return (
    <div>
      <h1>Single-Select Quick Option</h1>
     <h1 className="tw-my-4">Single-Select Quick-option</h1>
    <QuickSelect
    options={options}
    selected={options[1]}
    themeColor="#ff0000"
    onSelect={handleSelect}
    showLoader={true}
   />
  );
}

export default App;
```

## Author

Shashank Mishra
