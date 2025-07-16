import type { Meta, StoryObj } from '@storybook/react';

import { Radio } from './radio';

const meta: Meta<typeof Radio> = {
  title: 'Basic/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Set the state to checked. Defaults to `false`',
      type: 'boolean',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    name: {
      control: 'string',
      description: 'Name of the radio group. This is required for the radio to work properly.',
      type: 'string',
      table: {
        defaultValue: { summary: 'radio-btn' },
        type: { summary: 'string' },
      },
    },
    themeColor: {
      control: { type: 'color', presetColors: ['#006bb1'] },
    },
    onChange: {
      description:
        'A callback function that is called whenever the radio button is changed. It receives the selected option as an argument.',
      control: { type: 'function' },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'function' },
      },
    },
    option: {
      description: 'The option object that contains the value, label, and avatar for the radio button.',
      control: { type: 'object' },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'IOption' },
      },
    },
    // we want to hide className from the doc as it doesn't contribute much for the storybook doc
    // we use this hack to hide it
    // https://storybook.js.org/docs/react/api/arg-types#if
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Primary: Story = {
  args: {
    name: 'radio-btn',
    checked: true,
    themeColor: '#006bb1',
    onChange: (option) => console.log('Selected option:', option),
    option: {
      value: 'Radio_value',
      label: 'Radio',
      avatar: '', // Example avatar URL
    },
  },
};

export const Secondary: Story = {
  args: {
    name: 'radio-btn',
    checked: true,
    themeColor: '#006bb1',
    onChange: (option) => console.log('Selected option:', option),
    option: {
      value: 'Radio_value',
      label: 'Radio',
      avatar: 'https://cdn.oncehub.com/dist-oh-userfront/assets/oh/images/ui-meet.svg', // Example avatar URL
    },
  },
};
