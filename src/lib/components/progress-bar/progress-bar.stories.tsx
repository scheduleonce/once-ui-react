import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './progress-bar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Basic/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    /** Percent complete (0–100). If set, mode becomes 'determinate'. */
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Percent complete (0–100).',
      table: { type: { summary: 'number' }, defaultValue: { summary: undefined } },
    },
    /** Override mode; defaults to 'determinate' when `value` is provided */
    mode: {
      options: ['determinate', 'indeterminate'],
      control: { type: 'radio' },
      description: "Progress mode ('determinate' | 'indeterminate')",
      table: { type: { summary: 'string' }, defaultValue: { summary: 'indeterminate' } },
    },
    /** Thickness of the bar in pixels */
    strokeWidth: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Thickness of the bar in pixels',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4' } },
    },
    /** CSS color for the filled bar */
    barColor: {
      control: 'color',
      description: 'CSS color for the filled bar',
      table: { type: { summary: 'string' }, defaultValue: { summary: '#1976d2' } },
    },
    /** CSS color for the track (background) */
    trackColor: {
      control: 'color',
      description: 'CSS color for the track (background)',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'rgba(25,118,210,0.3)' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Indeterminate: Story = {
  args: {
    strokeWidth: 5,
    barColor: '#1976d2',
    trackColor: 'rgba(25,118,210,0.3)',
  },
};

export const Determinate: Story = {
  args: {
    value: 60,
    strokeWidth: 5,
    barColor: '#1976d2',
    trackColor: 'rgba(25,118,210,0.3)',
  },
};
