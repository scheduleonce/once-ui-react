import type { Meta, StoryFn } from '@storybook/react';
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
    selected: {
      description: 'The currently selected option. This prop helps maintain the state of the selected option.',
      control: { type: 'text' },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    onSelect: {
      description:
        'A callback function that gets called when an option is selected. It takes the selected option as an argument.',
      control: { type: 'function' },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'function' },
      },
    },
  },
};

export default meta;

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
const children = (
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
            <span className={`tw-block tw-truncate ${selected ? 'tw-font-medium' : 'tw-font-normal'}`}>
              {option.label}
            </span>
          </div>
        )}
      </SelectOption>
    ))}
  </SelectOptions>
);
const Template: StoryFn<typeof Select> = (args) => {
  return (
    <Select {...args} selected={options[2]} onSelect={handleSelectionChange}>
      {children}
    </Select>
  );
};

export const WithoutTheme = Template.bind({});
WithoutTheme.args = {
  selected: options[2],
  onSelect: handleSelectionChange,
};

export const WithTheme = Template.bind({});
WithTheme.args = {
  ...WithoutTheme.args,
  themeColor: '#ff0000',
};
