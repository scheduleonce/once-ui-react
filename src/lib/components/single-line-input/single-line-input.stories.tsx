import type { Meta, StoryObj } from '@storybook/react';

import { SingleLineInput } from './single-line-input';

const meta: Meta<typeof SingleLineInput> = {
  title: 'Basic/SingleLineInput',
  component: SingleLineInput,
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
  },
};

export default meta;
type Story = StoryObj<typeof SingleLineInput>;

export const WithoutTheme: Story = {
  args: {},
};

export const WithTheme: Story = {
  args: {
    ...WithoutTheme.args,
    themeColor: '#ff0000',
  },
};
