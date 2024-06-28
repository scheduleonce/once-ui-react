import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MultiSelect } from './multi-select';
import { IOption } from '../../interfaces/select.type';

const meta: Meta<typeof MultiSelect> = {
  title: 'Basic/MultiSelect',
  component: MultiSelect,
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
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

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
  },
};

export const WithTheme: Story = {
  args: {
    ...WithoutTheme.args,
    themeColor: '#ff0000',
  },
};
