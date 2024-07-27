import React, { useEffect, useState } from 'react';
import { FormGroup, FormControlLabel, Checkbox, Tooltip } from '@mui/material';

export interface FilterProps {
	label: string,
	tooltip: string
}
interface CheckboxFilterProps {
	labels: FilterProps[];
	defaultTrue: string[];
	localStorageName: string;
	onChange: (selectedFilters: Record<string, boolean>) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ labels, defaultTrue, localStorageName, onChange }) => {
	const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>(
	labels.reduce((acc, label) => ({ ...acc, [label.label]: defaultTrue.includes(label.label) ? true : false }), {})
	);

	// Load selections from local storage when the component mounts
	useEffect(() => {
		const savedSelections = localStorage.getItem(localStorageName);
		if (savedSelections) {
			setSelectedFilters(JSON.parse(savedSelections));
			onChange(JSON.parse(savedSelections));
			return;
		}
		onChange(selectedFilters);
	}, []);

	// Save selections to local storage whenever 'selected' changes
	useEffect(() => {
		localStorage.setItem(localStorageName, JSON.stringify(selectedFilters));
	}, [selectedFilters]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = event.target;
		const newFilters = {
			...selectedFilters,
			[name]: checked
		};
		setSelectedFilters(newFilters);
		onChange(newFilters);
	};

	return (
	<FormGroup row style={{paddingLeft: '80px'}}>
		{labels.map(label => (
			<Tooltip title={label.tooltip}>
				<FormControlLabel
					key={label.label}
					control={<Checkbox checked={selectedFilters[label.label]} onChange={handleChange} name={label.label} />}
					label={label.label}
				/>
			</Tooltip>
		))}
	</FormGroup>
	);
};

export default CheckboxFilter;
