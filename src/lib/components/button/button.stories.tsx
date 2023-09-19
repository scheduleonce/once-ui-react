import type { Meta, StoryObj } from '@storybook/react';

import Button from './button';

const meta: Meta<typeof Button> = {
  title: 'Basic/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
    shape: {
      options: ['rounded', 'squared'],
      control: { type: 'radio' },
      table: {
        defaultValue: { summary: 'rounded' },
        type: { summary: 'union' },
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
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: 'secondary',
  },
};
