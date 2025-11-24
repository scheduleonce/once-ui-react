import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MultiSelectWithCount } from './multi-select-with-count';
import { IOption } from '../../interfaces/select.type';

const meta: Meta<typeof MultiSelectWithCount> = {
  title: 'Basic/MultiSelectWithCount',
  component: MultiSelectWithCount,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '250px', width: '400px' }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
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
      description: 'An array of IOption objects representing the available choices.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    checkedValue: {
      description: 'An array of numbers representing the initially selected options.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    onSelectionChange: {
      description: 'An array of numbers representing the initially selected options.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    maxOptions: {
      description: 'Maximum number of options that can be selected',
      type: 'number',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'number' },
      },
    },
    categoryName: {
      description: 'Dynamic category name to display when more than one option is selected',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    variant: {
      description: 'Visual variant of the component',
      control: { type: 'select' },
      options: ['default', 'rounded'],
      table: {
        defaultValue: { summary: 'default' },
        type: { summary: "'default' | 'rounded'" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelectWithCount>;

const options: IOption[] = [
  { value: '1', label: 'Option 1', order: 1 },
  { value: '2', label: 'Option 2', order: 2 },
  { value: '3', label: 'Option 3', order: 3, disable: true },
];
const handleSelectionChange = () => {};

export const WithoutTheme: Story = {
  args: {
    options: options,
    checkedValue: ['2'],
    onSelectionChange: handleSelectionChange,
    maxOptions: 5,
    categoryName: 'Selected Items',
  },
};

export const WithTheme: Story = {
  args: {
    ...WithoutTheme.args,
    themeColor: '#ff0000',
  },
};

export const RoundedVariant: Story = {
  args: {
    ...WithoutTheme.args,
    variant: 'rounded',
  },
};

export const RoundedWithTheme: Story = {
  args: {
    ...WithoutTheme.args,
    variant: 'rounded',
    themeColor: '#ff0000',
  },
};
