import type { Meta, StoryFn } from '@storybook/react';
import React, { useState } from 'react';
import { AutoComplete } from './auto-complete';
import { AutoCompleteOptions, AutoCompleteOption } from './options';
import { IOption } from './select.types';

const meta: Meta<typeof AutoComplete> = {
  title: 'Basic/AutoComplete',
  component: AutoComplete,
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

const Template: StoryFn<typeof AutoComplete> = (args) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions =
    searchQuery === ''
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().replace(/\s+/g, '').includes(searchQuery.toLowerCase().replace(/\s+/g, '')),
        );

  const handleSelectionChange = () => {};

  const children = (
    <AutoCompleteOptions setQuery={setSearchQuery}>
      {filteredOptions.length === 0 && searchQuery !== '' ? (
        <div className="tw-relative tw-cursor-default tw-select-none tw-px-4 tw-py-2 tw-text-[#333333]">
          Nothing found.
        </div>
      ) : (
        filteredOptions.map((option) => (
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
        ))
      )}
    </AutoCompleteOptions>
  );

  return (
    <AutoComplete {...args} selected={args.selected} onSelect={handleSelectionChange} setQuery={setSearchQuery}>
      {children}
    </AutoComplete>
  );
};

export const WithoutTheme = Template.bind({});
WithoutTheme.args = {
  selected: options[2],
  themeColor: '',
  disable: false,
  clearSearch: false,
};

export const WithTheme = Template.bind({});
WithTheme.args = {
  ...WithoutTheme.args,
  themeColor: '#ff0000',
};
