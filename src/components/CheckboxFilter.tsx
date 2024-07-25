import React, { useEffect, useState } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';

interface CheckboxFilterProps {
	labels: string[];
	defaultTrue: string[];
	onChange: (selectedFilters: Record<string, boolean>) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ labels, defaultTrue, onChange }) => {
	const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>(
	labels.reduce((acc, label) => ({ ...acc, [label]: defaultTrue.includes(label) ? true : false }), {})
	);

	// Load selections from local storage when the component mounts
	useEffect(() => {
		const savedSelections = localStorage.getItem('selectedFilters');
		if (savedSelections) {
			setSelectedFilters(JSON.parse(savedSelections));
			onChange(JSON.parse(savedSelections));
			return;
		}
		onChange(selectedFilters);
	}, []);

	// Save selections to local storage whenever 'selected' changes
	useEffect(() => {
		localStorage.setItem('selectedFilters', JSON.stringify(selectedFilters));
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
	<FormGroup row>
		{labels.map(label => (
		<FormControlLabel
			key={label}
			control={<Checkbox checked={selectedFilters[label]} onChange={handleChange} name={label} />}
			label={label}
		/>
		))}
	</FormGroup>
	);
};

export default CheckboxFilter;
