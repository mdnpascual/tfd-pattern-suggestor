import React, { useCallback, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box, Button, Typography } from '@mui/material';
import DropListOverlay from './DropListOverlay';
import { DropList, patternNameToRemove } from '../data/constants';
import CharacterRawData from '../data/characters.json';
import WeaponRawData from '../data/weapons.json';
import EnhancementRawData from '../data/enhancements.json';
import InitializeCategoryData from '../utils/InitializeCategoryData';
import { CategoryData } from './CategoryList';
import WarningIcon from '@mui/icons-material/Warning';

export interface TableItem {
	id: string;
	name: string;
	score: string;
	count: number;
	priorityScore: number;
	drops: DropList[];
	dropsFrom: string;
	useIn: string;
	shardRequirements: JSX.Element;
}

type Order = 'asc' | 'desc' | undefined;

interface HeadCell {
	disablePadding: boolean;
	id: keyof TableItem;
	label: string;
}

const headCells: HeadCell[] = [
	{ id: 'name', disablePadding: true, label: 'Pattern' },
	{ id: 'priorityScore', disablePadding: true, label: 'Priority(Count)' },
	{ id: 'score', disablePadding: false, label: 'Percentage' },
	{ id: 'dropsFrom', disablePadding: false, label: 'Drops From' },
	{ id: 'useIn', disablePadding: false, label: 'Use In' },
];

const initializeData = () => {
	const character = InitializeCategoryData(CharacterRawData, 'characterStatus', 'materialCount');
	for (const key in character.categoryStatus) {
		character.materialCount[key] = character.categoryStatus[key] ? 0 : 1;
	}
	const weapon = InitializeCategoryData(WeaponRawData, 'weaponStatus', 'materialCount');
	const enhancement = InitializeCategoryData(EnhancementRawData, 'enhancementStatus', 'materialCount');

	return {
		materialCount: { ...character.materialCount, ...weapon.materialCount, ...enhancement.materialCount },
		materialMapping: { ...mapPartsList(CharacterRawData), ...mapPartsList(WeaponRawData), ...mapPartsList(EnhancementRawData) }
	};
}

const mapPartsList = (data: Record<string, CategoryData>): Record<string, string> => {
	const partToCategoryMap: Record<string, string> = {};

	for (const [categoryKey, category] of Object.entries(data)) {
		category.parts.forEach(part => {
			partToCategoryMap[part.name] = categoryKey;
			part.mats?.forEach(mat => {
				if (mat.name === part.name) {
					const words = part.name.trim().split(' ');
					words.pop()
					partToCategoryMap[mat.name] = words.join(' ')
				} else {
					partToCategoryMap[mat.name] = part.name
				}
			})
		});
	}

	return partToCategoryMap;
}

const SortableTable = ({
	data,
	onMatCountChange,
	onApplyNormalAndHardFilters,
	formatTooltipContent
}: {
	data: TableItem[],
	onMatCountChange: (itemName: string, newCount: number) => void,
	onApplyNormalAndHardFilters: () => void;
	formatTooltipContent: (drops: DropList[], name: string, useIn: string, dropsFrom: string, children: JSX.Element) => JSX.Element;
}) => {
	const [order, setOrder] = useState<Order>(undefined);
	const [orderBy, setOrderBy] = useState<keyof TableItem>('priorityScore');
	const [overlayOpen, setOverlayOpen] = useState(false);
	const [selectedDataItem, setSelectedDataItem] = useState<TableItem | null>(null);

	const { materialCount: initialMaterialCount, materialMapping: initialMaterialMapping } = useMemo(() => initializeData(), []);
	const [materialCount, setMaterialCount] = useState<Record<string, number>>(initialMaterialCount);
	const [materialMapping, setMaterialMapping] = useState<Record<string, string>>(initialMaterialMapping);

	const isDefaultFilters = localStorage.getItem('selectedFilters') === '{"Normal":true,"Hard":true,"Collosus":false,"Special Ops":false,"Void Reactor":false,"Sharen Exclusive":false}';
	const sortedData = useMemo(() => {
		const sortKey = orderBy;
		if (order === undefined) return data
		const sorted = [...data].sort((a, b) => {
			let aValue = a[sortKey];
			let bValue = b[sortKey];

			if (sortKey === 'score') {
				aValue = parseFloat(a.score);
				bValue = parseFloat(b.score);

				// If same score, use count instead
				if (aValue === bValue) {
					aValue = a.count
					bValue = b.count
				}
			} else if (sortKey === 'name') {
				aValue = (aValue as string).replace(patternNameToRemove, "");
				bValue = (bValue as string).replace(patternNameToRemove, "");
			}

			if (aValue < bValue) return order === 'asc' ? -1 : 1;
			if (aValue > bValue) return order === 'asc' ? 1 : -1;
			return 0;
		});
		return sorted;
	}, [data, order, orderBy]);

	const handleRequestSort = useCallback((property: keyof TableItem) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	}, [orderBy, order]);

	const handleRowClick = useCallback((row: TableItem) => {
		setSelectedDataItem(row);
		setOverlayOpen(true);
	}, []);

	const handleMatCountChange = useCallback((item: string, newCount: number) => {
		const savedMaterialCount = localStorage.getItem('materialCount');
		let newMaterialCount: Record<string, number> = savedMaterialCount
			? JSON.parse(savedMaterialCount)
			: materialCount;
		newMaterialCount[item] = newCount;
		localStorage.setItem('materialCount', JSON.stringify(newMaterialCount));
		// Update only the changed count
		setMaterialCount(prev => ({ ...prev, [item]: newCount }));
		onMatCountChange(item, newCount);
	}, [materialCount]);

	const handleApplyNormalAndHardFilters = () => {
		onApplyNormalAndHardFilters();
	};

	const tableCellStyle = { padding: '8px 8px' };

	return (
		<Box sx={{ display: sortedData.length === 0 && !isDefaultFilters ? 'flex' : 'block', flexDirection: 'column', height: '100%', width: '100%' }}>
			<TableContainer
				component={Paper}
				sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}
			>
				{sortedData.length === 0 && !isDefaultFilters ? (
					<Box
						sx={{
							flexGrow: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							textAlign: 'center',
							minHeight: 0,
						}}
					>
						<Box
							sx={{
								flexGrow: 1,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								textAlign: 'center',
								padding: 4
							}}>
								<WarningIcon color="warning" sx={{ fontSize: 40, mb: 2 }} />
								<Typography variant="h6" gutterBottom>
									No results found.
								</Typography>
								<Typography variant="body1" gutterBottom>
									Make sure you are not filtering too much. Only select "Normal" and "Hard" checkboxes to see all possible results.
								</Typography>
								<Button
									variant="contained"
									color="primary"
									onClick={handleApplyNormalAndHardFilters}
								>
									Apply Normal and Hard Filters
								</Button>
						</Box>
						<Box
							sx={{
								flexGrow: 1,
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								textAlign: 'center',
								padding: 10
							}}></Box>
					</Box>
				) : (
					<Table aria-label="sortable table" sx={{ flexGrow: 1 }}>
						<TableHead>
							<TableRow id="list-header">
								{headCells.map((headCell) => (
									<TableCell key={headCell.id} align={'center'}>
										<TableSortLabel
											active={orderBy === headCell.id}
											direction={order === undefined ? 'desc' : orderBy === headCell.id ? order : 'asc'}
											onClick={() => handleRequestSort(headCell.id)}
										>
											{headCell.label}
										</TableSortLabel>
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{sortedData.map((row) => (
								formatTooltipContent(row.drops, row.name, row.useIn, row.dropsFrom, (
									<TableRow onClick={() => handleRowClick(row)}>
										<TableCell style={tableCellStyle} align="center">{row.name}</TableCell>
										<TableCell id={`p${row.name.replaceAll(" ", "-")}-priority-score-entry`} style={tableCellStyle} align="center">{row.priorityScore}({row.count})</TableCell>
										<TableCell style={tableCellStyle} align="center">{row.score}</TableCell>
										<TableCell style={tableCellStyle} align="left">{row.dropsFrom}</TableCell>
										<TableCell style={tableCellStyle} align="left">{row.useIn}</TableCell>
									</TableRow>))
							))}
						</TableBody>
					</Table>
				)}
			</TableContainer>

			{overlayOpen && selectedDataItem && (
				<div className="category-list-overlay">
					<div className="category-list-content">
						<button
							className="overlay-close-button"
							id="material-overlay-close-button"
							onClick={() => setOverlayOpen(false)}>
							X
						</button>
						<DropListOverlay
							dropTable={selectedDataItem}
							materialCount={materialCount}
							materialMapping={materialMapping}
							onMatCountChange={handleMatCountChange}
							shardRequirements={selectedDataItem.shardRequirements}
						/>
					</div>
				</div>
			)}
		</Box>
	);
}

export default React.memo(SortableTable);