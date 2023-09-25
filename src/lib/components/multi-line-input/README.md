## Multi Line Input Component

The `MultiLineInput` component is a custom React textarea component that allows users to input text in multiple lines with optional features such as custom theme color.

### Usage

```ts
import MultiLineInput from '@/once-ui/multi-line-input/multi-line-input';

<MultiLineInput label={'Testing'} maxLength={15}></Input>;
```

### Props

The `MultiLineInput` component accepts the following props:

| Name         | Type       | Default value | Description                                                                                    |
| ------------ | ---------- | ------------- | ---------------------------------------------------------------------------------------------- |
| `themeColor` | string     | ''            | A custom theme color for the input's bottom border. Optional.                                  |
| `onSubmit`   | () => void | undefined     | A callback function triggered when the "Enter" key is pressed on non-mobile devices. Optional. |

You can use any other prop that is supported by the native HTML / React button such as `disabled` and `className` / `style` to apply additional CSS classes and properties.

### Examples

#### Example 1: Basic Usage

```tsx
<MultiLineInput label="Enter your text" />
```

#### Example 2: Input with Character Limit

```tsx
<MultiLineInput label="Short description" maxLength={100} />
```

#### Example 3: Disabled Input

```tsx
<MultiLineInput label="Read-only input" Disabled={true} />
```

#### Example 4: When using with form

```ts
<MultiLineInput
	data-testid={'text-box'}
	aria-labelledby="text-box"
	id="multiline"
	maxLength={200}
	onSubmit={handleSubmit(onSubmit)}
	{...register('textbox', {
		required: true,
		validate: (value) => {
			return !!value.trim();
		},
	})}
/>
```
