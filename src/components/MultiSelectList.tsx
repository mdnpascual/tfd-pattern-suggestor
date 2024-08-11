import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ListSubheader, TextField, Button, Checkbox, ListItemText, ListItem } from '@mui/material';
import { FixedSizeList as VirtualizedList, ListChildComponentProps } from 'react-window';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export interface Item {
	id: string;
	label: string;
	priority: number;
}

interface MultiSelectListProps {
	startingItems: Item[];
	onChange: (selectedLabels: string[], labelPriority: number[]) => void;
}

const maxPriority = 1000;

const MultiSelectList: React.FC<MultiSelectListProps> = ({ startingItems, onChange }) => {
	const [selected, setSelected] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [items, setItems] = useState<Item[]>(startingItems);
	const divRef = useRef<HTMLDivElement>(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const sortedItems = useMemo(() => {
		const itemsCopy = [...items];
		itemsCopy.sort((a, b) => {
			const aSelected = selected.includes(a.id) ? 0 : 1;
			const bSelected = selected.includes(b.id) ? 0 : 1;
			return aSelected - bSelected;
		});
		return itemsCopy;
	}, [items, selected]);

	useEffect(() => {
		const savedSelections = localStorage.getItem('selectedItems');
		if (savedSelections) {
			setSelected(JSON.parse(savedSelections));
		}
		const savedPriorities = localStorage.getItem('itemPriority');
		if (savedPriorities && savedSelections) {
			const parsedPriorities = JSON.parse(savedPriorities);
			const newItems = [...items];
			const startingSelection = JSON.parse(savedSelections) as string[];
			startingSelection.forEach((id, idx) => {
				const foundItem = newItems.find(item => item.id === id);
				if (foundItem) {
					foundItem.priority = parseInt(parsedPriorities[idx] ?? 1, 10);
				}
			});
			setItems(newItems);
		}
	}, []);

	useEffect(() => {
		const selectedLabels = selected.map(id => items.find(item => item.id === id)?.label || '');
		const priorities = selected.map(id => items.find(item => item.id === id)?.priority || 1);

		localStorage.setItem('selectedItems', JSON.stringify(selected));
		localStorage.setItem('itemPriority', JSON.stringify(priorities));

		onChange(selectedLabels, priorities);
	}, [selected, items]);

	const handleToggle = (value: string) => () => {
		const currentIndex = selected.indexOf(value);
		const newSelected = [...selected];

		if (currentIndex === -1) {
			newSelected.push(value);
		} else {
			newSelected.splice(currentIndex, 1);
		}

		setSelected(newSelected);
		const selectedLabels = newSelected.map(id => items.find(item => item.id === id)?.label || '');
		onChange(selectedLabels, []);
	};

	const handleIncreasePriority = (id: string, event: React.MouseEvent) => {
		event.stopPropagation();
		setItems(items.map(item =>
			item.id === id ? { ...item, priority: Math.min(item.priority + 1, maxPriority) } : item
		));
	};

	const handleDecreasePriority = (id: string, event: React.MouseEvent) => {
		event.stopPropagation();
		setItems(items.map(item =>
			item.id === id ? { ...item, priority: Math.max(item.priority - 1, 1) } : item
		));
	};

	const handlePriorityChange = (id: string, value: string, event: React.ChangeEvent) => {
		const newPriority = parseInt(value, 10);
		if (isNaN(newPriority)) {
			setItems(items.map(item =>
				item.id === id ? { ...item, priority: 1 } : item
			));
		} else if (newPriority >= 1 && newPriority <= maxPriority) {
			setItems(items.map(item =>
				item.id === id ? { ...item, priority: newPriority } : item
			));
		}
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const handleClearAll = () => {
		const confirmed = window.confirm("Are you sure you want to clear all selections?");
		if (confirmed) {
			setSelected([]);
			onChange([], []);
		}
	};

	const filteredAndSortedItems = useMemo(() => {
		return sortedItems.filter(item =>
			item.label.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [sortedItems, searchTerm]);

	const renderRow = ({ index, style }: ListChildComponentProps) => {
		const item = filteredAndSortedItems[index];
		return (
			<div style={style} key={item.id}>
				<ListItem
					button
					onClick={handleToggle(item.id)}
					style={{ paddingTop: '0px', paddingBottom: '0px' }}
				>
					<Checkbox
						edge="start"
						checked={selected.indexOf(item.id) !== -1}
						tabIndex={-1}
						disableRipple
					/>
					<ListItemText primary={item.label} />
					<div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
						<Button
							size="small"
							onClick={(e) => handleDecreasePriority(item.id, e)}
							style={{ height: '100%', margin: '0', padding: '8px 0' }}>-</Button>
						<TextField
							size="small"
							value={item.priority}
							onChange={(e) => { handlePriorityChange(item.id, e.target.value, e) }}
							onClick={(e) => e.stopPropagation()}
							style={{ width: '60px', height: '100%', overflow: 'hidden' }}
							inputProps={{
								style: { textAlign: 'center', height: '100%' },
								min: 1,
								max: maxPriority,
								type: 'text',
							}}
						/>
						<Button
							size="small"
							onClick={(e) => handleIncreasePriority(item.id, e)}
							style={{ height: '100%', margin: '0', padding: '8px 0' }}>+</Button>
					</div>
				</ListItem>
			</div>
		);
	};

	return (
		<div ref={divRef}>
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
			<ListSubheader component="div" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<span>Materials</span>
				<span>Priority</span>
			</ListSubheader>
			<VirtualizedList
				height={window.innerHeight - 230}
				itemCount={filteredAndSortedItems.length}
				itemSize={isMobile ? 60 : 40}
				width="100%"
			>
				{renderRow}
			</VirtualizedList>
		</div>
	);
};

export default MultiSelectList;
