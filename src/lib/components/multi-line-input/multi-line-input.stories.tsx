import type { Meta, StoryObj } from '@storybook/react';

import MultiLineInput from './multi-line-input';

const meta: Meta<typeof MultiLineInput> = {
  title: 'Basic/MultiLineInput',
  component: MultiLineInput,
  tags: ['autodocs'],
  argTypes: {
    onSubmit: {
      description: 'A callback function triggered when the "Enter" key is pressed on non-mobile devices.',
      type: 'string',
      table: {
        defaultValue: { summary: 'undefined' },
        type: { summary: 'string' },
      },
    },
    themeColor: {
      description: 'A custom theme color for the input bottom border. Optional.',
      control: { type: 'color', presetColors: ['#006bb1'] },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiLineInput>;

const handleSubmit = () => {};

export const WithoutTheme: Story = {
  args: {
    onSubmit: handleSubmit,
  },
};

export const WithTheme: Story = {
  args: {
    ...WithoutTheme.args,
    themeColor: '#ff0000',
  },
};
