import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AutoComplete } from './auto-complete';
import { AutoCompleteOptions, AutoCompleteOption } from './options';
import { IOption } from '../../interfaces/select.type';

const meta: Meta<typeof AutoComplete> = {
  title: 'Basic/AutoComplete',
  component: AutoComplete,
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
    setQuery: {
      description: 'Use to search options',
      control: { type: 'text' },
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      },
    },
    disable: {
      description: 'Disable the dropdown',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
    clearSearch: {
      description: 'Clear search query',
      control: { type: 'boolean' },
      table: {
        defaultValue: { summary: false },
        type: { summary: 'boolean' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AutoComplete>;

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
  <AutoCompleteOptions setQuery={() => {}}>
    {options.map((option) => (
      <AutoCompleteOption
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
      </AutoCompleteOption>
    ))}
  </AutoCompleteOptions>
);

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
