import React, { useEffect, useMemo, useState } from 'react';
import { List, ListItem, ListItemText, Checkbox, ListSubheader, TextField, Button, Grid } from '@mui/material';

export interface Item {
	id: string;
	label: string;
}

interface MultiSelectListProps {
	items: Item[];
	onChange: (selectedLabels: string[]) => void; // Callback to pass labels instead of IDs
}

const MultiSelectList: React.FC<MultiSelectListProps> = ({ items, onChange }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

	const sortedItems = useMemo(() => {
		const itemsCopy = [...items];
		// Sort items so that selected items come first
		itemsCopy.sort((a, b) => {
			const aSelected = selected.includes(a.id) ? 0 : 1;
			const bSelected = selected.includes(b.id) ? 0 : 1;
			return aSelected - bSelected;
		});
		return itemsCopy;
	}, [items, selected]);

  // Load selections from local storage when the component mounts
	useEffect(() => {
		const savedSelections = localStorage.getItem('selectedItems');
		if (savedSelections) {
			setSelected(JSON.parse(savedSelections));
		}
	}, []);

	// Save selections to local storage whenever 'selected' changes
	useEffect(() => {
		localStorage.setItem('selectedItems', JSON.stringify(selected));
		const selectedLabels = selected.map(id => items.find(item => item.id === id)?.label || '');
		onChange(selectedLabels);
	}, [selected]);

	const handleToggle = (value: string) => () => {
		const currentIndex = selected.indexOf(value);
		const newChecked = [...selected];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setSelected(newChecked);
		// Convert selected item IDs to their corresponding labels
		const selectedLabels = newChecked.map(id => items.find(item => item.id === id)?.label || '');
		onChange(selectedLabels); // Trigger the callback with the new selected labels
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const handleClearAll = () => {
		const confirmed = window.confirm("Are you sure you want to clear all selections?");
		if (confirmed) {
			setSelected([]);
			onChange([]);
		}

	};

	const filteredAndSortedItems = useMemo(() => {
		return sortedItems.filter((item) =>
			item.label.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [sortedItems, searchTerm]);

	return (
		<div>
			<TextField
				placeholder="Search materials..."
				value={searchTerm}
				onChange={handleSearchChange}
				variant="outlined"
				fullWidth
				margin="normal"
			/>
			<Button onClick={handleClearAll} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
				Clear All
			</Button>
			<List subheader={<ListSubheader>Material List</ListSubheader>} dense>
				{filteredAndSortedItems.map((item) => (
					<ListItem
					key={item.id}
					button
					onClick={handleToggle(item.id)}
					>
					<Checkbox
						edge="start"
						checked={selected.indexOf(item.id) !== -1}
						tabIndex={-1}
						disableRipple
					/>
					<ListItemText primary={item.label} />
					</ListItem>
				))}
			</List>
		</div>
	);
};

export default MultiSelectList;