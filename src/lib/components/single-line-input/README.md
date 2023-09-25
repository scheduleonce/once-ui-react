## Single Line Input Component

The `SingleLineInput` component is a custom React textarea component that allows users to input text in single lines with optional features such as custom theme color.

### Usage

```ts
import SingleLineInput from '@/once-ui/single-line-input/single-line-input';

<SingleLineInput label={'Testing'} maxLength={15}></Input>;
```

### Props

The `SingleLineInput` component accepts the following props:

| Name         | Default value | Description                                                   |
| ------------ | ------------- | ------------------------------------------------------------- |
| `themeColor` | ''            | A custom theme color for the input's bottom border. Optional. |

You can use any other prop that is supported by the native HTML / React button such as `disabled` and `className` / `style` to apply additional CSS classes and properties.

### Examples

#### Example 1: Basic Usage

```tsx
<SingleLineInput label="Enter your text" />
```

#### Example 2: Input with Character Limit

```tsx
<SingleLineInput label="Short description" maxLength={100} />
```

#### Example 3: Disabled Input

```tsx
<SingleLineInput label="Read-only input" Disabled={true} />
```

#### Example 4: When using with form

```ts
<SingleLineInput
	label="fullName"
	id="fullName"
	maxLength={200}
	{...register('fullName', {
		required: true,
		validate: (value) => {
			return !!value.trim();
		},
	})}
/>
```
