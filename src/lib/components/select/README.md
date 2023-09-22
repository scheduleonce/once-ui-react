Reference (https://headlessui.com/react/combobox).

## Usage of Dropdown

- Dummy people object to create Drop down

```ts
const people = [
  {
    value: '1',
    label: 'Wade Cooper',
    avatar:
      'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    value: '2',
    label: 'Arlene Mccoy',
    avatar:
      'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    value: '3',
    label: 'Devon Webb',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
  },
  {
    value: '4',
    label: 'Tom Cook',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];
```

# Dropdown without search

```ts
const [selected, setSelected] = useState<IOption | null>(people.length ? people[0] : null);
return (
	<>
		<span>Drop down without search</span>
		<Select selected={selected} onSelect={onSelectDropDown}>
			<SelectOptions setQuery={() => {}}>
				{people.map((option) => (
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
							<>
								<div className="tw-flex tw-items-center">
									{option.avatar && (
										<img
											src={option.avatar}
											alt=""
											className="tw-mr-2 tw-h-5 tw-w-5 tw-flex-shrink-0 tw-rounded-full"
										/>
									)}
									<span className={`tw-block tw-truncate ${selected ? 'tw-font-medium' : 'tw-font-normal'}`}>
										{option.label}
									</span>
								</div>
							</>
						)}
					</SelectOption>
				))}
			</SelectOptions>
		</Select>
	</>
);
```

# Dropdown with search

```ts
const [selected, setSelected] = useState<IOption | null>(people.length ? people[0] : null);
const [searchQuery, setSearchQuery] = useState('');
const onSelectDropDown = (object: any) => {
	setSelected(object);
};
const filteredOptions =
	searchQuery === ''
		? people
		: people.filter((person) =>
				person.label.toLowerCase().replace(/\s+/g, '').includes(searchQuery.toLowerCase().replace(/\s+/g, ''))
		  );

return (
	<>
		<span>Drop down with search</span>
		<AutoComplete selected={selected} onSelect={onSelectDropDown} setQuery={setSearchQuery} disable={false}>
			<Options setQuery={setSearchQuery}>
				{filteredOptions.length === 0 && searchQuery !== '' ? (
					<div className="tw-relative tw-cursor-default tw-select-none tw-px-4 tw-py-2 tw-text-[#333333]">
						Nothing found.
					</div>
				) : (
					filteredOptions.map((option) => (
						<Option
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
								<>
									<div className="tw-flex tw-items-center">
										{option.avatar && (
											<img
												src={option.avatar.src}
												alt=""
												className="tw-mr-2 tw-h-5 tw-w-5 tw-flex-shrink-0 tw-rounded-full"
											/>
										)}
										<span className={`tw-block tw-truncate ${selected ? 'tw-font-medium' : 'tw-font-normal'}`}>
											{option.label}
										</span>
									</div>
								</>
							)}
						</Option>
					))
				)}
			</Options>
		</AutoComplete>
	</>
);
```
