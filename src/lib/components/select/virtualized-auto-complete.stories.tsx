import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import { IOption } from '../../interfaces/select.type';
import { VirtualizedAutoComplete } from './virtualized-auto-complete';

const meta: Meta<typeof VirtualizedAutoComplete> = {
  title: 'Basic/VirtualizedAutoComplete',
  component: VirtualizedAutoComplete,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VirtualizedAutoComplete>;

const options: IOption[] = Array.from({ length: 200 }, (_, index) => ({
  value: String(index + 1),
  label: `Option ${index + 1}`,
  disable: index === 10,
}));

const VirtualizedAutoCompleteDemo = () => {
  const [selected, setSelected] = useState<IOption | null>(options[0]);
  const [query, setQuery] = useState('');
  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div style={{ width: 320, margin: 32 }}>
      <VirtualizedAutoComplete
        options={filteredOptions}
        selected={selected}
        onSelect={setSelected}
        setQuery={setQuery}
        emptyState={<div className="tw-px-2 tw-py-2">Nothing found.</div>}
        optionClassName={(_, { active, selected: isSelected }) =>
          `tw-relative tw-cursor-default tw-select-none tw-px-[10px] tw-py-2 ${
            active || isSelected ? 'tw-bg-[#EEEEEE] tw-text-[#333333]' : ''
          }`
        }
        renderOption={(option) => <span className="tw-block tw-truncate">{option.label}</span>}
      />
    </div>
  );
};

export const TwoHundredOptions: Story = {
  render: () => <VirtualizedAutoCompleteDemo />,
};
