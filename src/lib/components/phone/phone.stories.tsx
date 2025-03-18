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
      description: 'The color theme for the input field.',
      control: { type: 'color', presetColors: ['#006bb1'] },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    countryShortName: {
      description: ' The country code of the phone number input. For example, "IN" for India',
      control: { type: 'text' },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    required: {
      description: 'If set to true, the input field will be marked as required',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'boolean' },
      },
    },
    onUpdate: {
      description:
        'A callback function that is called whenever the phone number is changed. It receives an object of type IPhoneData as an argument.',
      control: { type: 'function' },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'function' },
      },
    },
    placeholder: {
      description: 'The text to display as a placeholder inside the input field.',
      control: { type: 'text' },
      table: {
        defaultValue: { summary: 'Enter phone number' },
        type: { summary: 'string' },
      },
    },
    validate: {
      description: '',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'boolean' },
      },
    },
    id: {
      description: 'Id of a particular phone number',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
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
