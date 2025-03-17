import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Phone } from './phone';

const meta: Meta<typeof Phone> = {
  title: 'Basic/Phone',
  component: Phone,
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
    countryShortName: {
      description: 'An array of IOption objects representing the available choices.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    required: {
      description: 'An array of numbers representing the initially selected options.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    onUpdate: {
      description: 'An array of numbers representing the initially selected options.',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    placeholder: {
      description: 'Maximum number of options that can be selected',
      type: 'number',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'number' },
      },
    },
    validate: {
      description: 'Maximum number of options that can be selected',
      type: 'number',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'number' },
      },
    },
    id: {
      description: 'Maximum number of options that can be selected',
      type: 'number',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'number' },
      },
      style: {
        description: 'Maximum number of options that can be selected',
        type: 'number',
        table: {
          defaultValue: { summary: '' },
          type: { summary: 'number' },
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Phone>;

const onUpdate = () => {};

export const WithoutTheme: Story = {
  args: {
    onUpdate: onUpdate,
    countryShortName: 'IN',
    placeholder: 'Enter phone number',
    themeColor: '',
    required: true,
  },
};

export const WithTheme: Story = {
  args: {
    ...WithoutTheme.args,
    themeColor: '#ff0000',
  },
};
