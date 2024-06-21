import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Select } from './select';
import { SelectOption, SelectOptions } from './select-options';
import { IOption } from './select.types';

const meta: Meta<typeof Select> = {
  title: 'Basic/Select',
  component: Select,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '250px' }}>
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
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const options: IOption[] = [
  {
    value: '1',
    label: 'Wade Cooper',
  },
  {
    value: '2',
    label: 'Arlene Mccoy',
  },
  {
    value: '3',
    label: 'Devon Webb',
  },
  {
    value: '4',
    label: 'Tom Cook',
  },
];

const handleSelectionChange = () => {};

const children = () => {
  return (
    <SelectOptions setQuery={() => {}}>
      {options.map((option) => (
        <SelectOption
          disable={false}
          key={option.value}
          className={({ active }: { active: boolean }) =>
            `tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-4 tw-pr-4 ${
              active ? 'tw-bg-[#EEEEEE] tw-text-[#333333]' : ''
            }`
          }
          value={option}
        >
          {({ selected, active }: { selected: boolean; active: boolean }) => (
            <div className="tw-flex tw-items-center">
              <span className={`tw-block ${selected ? 'tw-font-medium' : 'tw-font-normal'}`}>{option.label}</span>
            </div>
          )}
        </SelectOption>
      ))}
    </SelectOptions>
  );
};

export const WithoutTheme: Story = {
  args: {
    selected: options[2],
    onSelect: handleSelectionChange,
    children: children,
  },
};

export const WithTheme: Story = {
  args: {
    ...WithoutTheme.args,
    themeColor: '#ff0000',
  },
};
