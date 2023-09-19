## Button Component

### The Button component is a primary UI component for user interaction. It provides a customizable button element with various styles, sizes, and rounded corners.

## Usage

```tsx
import Button from '../once-ui-react/button/button';

<Button variant="primary" size="small" shape="rounded">
	Click me
</Button>;
```

## Props

| Name         | Default value | Description                                                                 |
| ------------ | ------------- | --------------------------------------------------------------------------- |
| `variant`    | `primary`     | The style of the button. Can be `primary` or `secondary`                    |
| `size`       | `small`       | The size of the button. Can be `small`, `medium` or `large`                 |
| `shape`      | `rounded`     | Determines the shape of the button's corners. Can be `rounded` or `squared` |
| `themeColor` | `#006bb1`     | A color scheme to use for the button. Usually taken from theme context      |

You can use any other prop that is supported by the native HTML / React button such as `disabled` and `className` / `style` to apply additional CSS classes and properties.

## Examples

### Primary button with medium size

```tsx
<Button variant="primary" size="medium">
	Submit
</Button>
```

### Secondary button with large size and custom class name

```tsx
<Button variant="secondary" size="large" className="custom-button">
	Cancel
</Button>
```

### Secondary button with custom style

```tsx
<Button variant="secondary" size="large" className="custom-button" style={{ color: '#000000' }}>
	Cancel
</Button>
```
