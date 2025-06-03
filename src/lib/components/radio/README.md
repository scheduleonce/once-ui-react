## Radio Component

### The Radio is a primary React UI functional component that represents a customizable radio button input with a label. It allows users to select one option from a set, and it provides theming options through a `themeColor` prop. It supports all of the functionality of an HTML5 radio button, and exposes a similar API.

## Usage

```tsx
import Radio from '@/once-ui/radio/radio';

<Radio
  name="example"
  option={{ label: 'Option 1', value: 'option1' }}
  checked={false}
  onChange={(option) => console.log(option)}
  themeColor="#000000"
/>
```

## Props

| Name         | Default value | Description                                                                                                 |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------- |
| `name`       | `No Default`  | The name for the radio input element. Used to group radio buttons.                                          |
| `option`     | `No Default`  | The option object for the radio button. Should contain at least `label` and `value` properties.             |
| `checked`    | `false`       | Whether the radio button is selected.                                                                       |
| `onChange`   |               | Event handler function called when the radio state changes. Receives the selected option as parameter.      |
| `themeColor` | `#006bb1`     | A color scheme to use for the radio button. Usually taken from theme context.                               |

### Accessibility

The Radio component has good accessibility support:

- The radio button has a focus state and can be easily identified when focused.
- Properly uses `name` and `id` for grouping and labeling.

## Examples

```tsx
import React, { useState } from 'react';
import Radio from './Radio';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2', avatar: 'https://example.com/avatar.png' },
  { label: 'Option 3', value: 'option3' },
];

function App() {
  const [selected, setSelected] = useState('option1');

  const handleRadioChange = (option) => {
    setSelected(option.value);
    console.log('Selected option:', option);
  };

  return (
    <div>
      {options.map((option) => (
        <Radio
          key={option.value}
          name="example"
          option={option}
          checked={selected === option.value}
          onChange={handleRadioChange}
          themeColor="#007bff"
        />
      ))}
    </div>
  );
}

export default App;
```
