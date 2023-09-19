import type { Meta, StoryObj } from '@storybook/react';

import Checkbox from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Basic/Checkbox',
  component: Checkbox,
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
    disabled: {
      control: 'boolean',
      description: 'Disable the button. Defaults to `false`',
      type: 'boolean',
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    themeColor: {
      control: { type: 'color', presetColors: ['#006bb1'] },
    },
    style: {
      description: 'Override or add any additional style the component',
      type: 'string',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    // we want to hide className from the doc as it doesn't contribute much for the storybook doc
    // we use this hack to hide it
    // https://storybook.js.org/docs/react/api/arg-types#if
    className: {
      if: { arg: 'doesntexist', exists: true },
    },
    ref: {
      if: { arg: 'doesntexist', exists: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {
  args: {
    children: 'Checkbox',
  },
};
