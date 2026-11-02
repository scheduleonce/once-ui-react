import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import { AutoComplete } from './auto-complete';
import { AutoCompleteOptions, AutoCompleteOption } from './auto-complete-options';
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
        {({ selected }: { selected: boolean; active: boolean }) => (
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

const LargeOptionDemo = () => {
  const options = useMemo<IOption[]>(
    () =>
      Array.from({ length: 200 }, (_, index) => ({
        value: `option-${index + 1}`,
        label: `Option ${String(index + 1).padStart(3, '0')}`,
        disable: index === 10,
      })),
    [],
  );
  const [selected, setSelected] = useState<IOption | null>(null);
  const [query, setQuery] = useState('');
  const filteredOptions = useMemo(
    () =>
      query === ''
        ? options
        : options.filter((option) =>
            option.label.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, '')),
          ),
    [options, query],
  );

  return (
    <div style={{ width: 360, padding: 24 }}>
      <p style={{ marginBottom: 8 }}>Searchable dropdown with 200 options (11th option disabled)</p>
      <AutoComplete
        selected={selected}
        onSelect={setSelected}
        setQuery={setQuery}
        disable={false}
        virtualOptions={filteredOptions.length > 0 ? filteredOptions : undefined}
      >
        {filteredOptions.length === 0 && query !== '' ? (
          <AutoCompleteOptions setQuery={setQuery}>
            <div className="tw-relative tw-cursor-default tw-select-none tw-px-4 tw-py-2 tw-text-[#333333]">
              Nothing found.
            </div>
          </AutoCompleteOptions>
        ) : (
          <AutoCompleteOptions setQuery={setQuery} virtual>
            {(option: IOption) => (
              <AutoCompleteOption
                disable={Boolean(option.disable)}
                key={option.value}
                className={({ active }: { active: boolean }) =>
                  `tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-4 tw-pr-4 ${
                    active ? 'tw-bg-[#EEEEEE] tw-text-[#333333]' : ''
                  }`
                }
                value={option}
              >
                {({ selected: isSelected }: { selected: boolean; active: boolean }) => (
                  <span className={isSelected ? 'tw-font-medium' : 'tw-font-normal'}>{option.label}</span>
                )}
              </AutoCompleteOption>
            )}
          </AutoCompleteOptions>
        )}
      </AutoComplete>
      <p style={{ marginTop: 12 }} aria-live="polite">
        Selected: {selected?.label ?? 'None'}
      </p>
      <p style={{ marginTop: 4, fontSize: 12 }}>Filtered options: {filteredOptions.length}</p>
    </div>
  );
};

export const Virtualized200Options: Story = {
  render: () => <LargeOptionDemo />,
};
