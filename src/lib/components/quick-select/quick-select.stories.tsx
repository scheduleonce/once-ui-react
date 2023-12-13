import type { Meta, StoryObj } from '@storybook/react';

import { QuickSelect } from './quick-select';
import { Option } from './quick-select.type';

const meta: Meta<typeof QuickSelect> = {
  title: 'Basic/QuickSelect',
  component: QuickSelect,
  tags: ['autodocs'],
  argTypes: {
    themeColor: {
      description: 'A custom theme color for the input bottom border. Optional.',
      control: { type: 'color', presetColors: ['#006bb1'] },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    options: {
      description: 'An array of option objects, each containing an `id`, `text`, `order`, and `disabled`.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    selected: {
      description: 'The currently selected option. This prop helps maintain the state of the selected option.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    onSelect: {
      description:
        'A callback function that gets called when an option is selected. It takes the selected option as an argument.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    showLoader: {
      control: 'boolean',
      description:
        'A boolean flag indicating whether a loading indicator should be shown when an option is selected. Defaults to `false`',
      type: 'boolean',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    style: {
      description: 'Override or add any additional style the component',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    className: {
      description: 'Additional CSS class names to be added to the component wrapper.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuickSelect>;

const options: Option[] = [
  { id: '1', text: 'Option 1', order: 1 },
  { id: '2', text: 'Option 2', order: 2 },
  { id: '3', text: 'Option 3', order: 3, disabled: true },
  // Add more options here
];
const handleSelectionChange = () => {};

export const WithoutTheme: Story = {
  args: {
    options: options,
    selected: options[1],
    onSelect: handleSelectionChange,
    showLoader: false,
  },
};

export const WithTheme: Story = {
  args: {
    ...WithoutTheme.args,
    themeColor: '#ff0000',
  },
};
