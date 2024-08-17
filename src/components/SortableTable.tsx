import React, { useCallback, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Tooltip } from '@mui/material';
import DropListOverlay from './DropListOverlay';
import { DropList } from '../data/constants';
import CharacterRawData from '../data/characters.json';
import WeaponRawData from '../data/weapons.json';
import EnhancementRawData from '../data/enhancements.json';
import InitializeCategoryData from '../utils/InitializeCategoryData';
import { CategoryData } from './CategoryList';

export interface TableItem {
	id: string;
	name: string;
	score: string;
	count: number;
	priorityScore: number;
	drops: DropList[];
	dropsFrom: string;
	useIn: string;
	tooltip: JSX.Element;
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

const SortableTable = ({ data }: { data: TableItem[] }) => {
	const [order, setOrder] = useState<Order>(undefined);
	const [orderBy, setOrderBy] = useState<keyof TableItem>('priorityScore');
	const [overlayOpen, setOverlayOpen] = useState(false);
	const [selectedDataItem, setSelectedDataItem] = useState<TableItem | null>(null);

	const { materialCount: initialMaterialCount, materialMapping: initialMaterialMapping } = useMemo(() => initializeData(), []);
	const [materialCount, setMaterialCount] = useState<Record<string, number>>(initialMaterialCount);
	const [materialMapping, setMaterialMapping] = useState<Record<string, string>>(initialMaterialMapping);


	const sortedData = useMemo(() => {
		const sortKey = orderBy;
		if (order === undefined) return data
		const sorted = [...data].sort((a, b) => {
			let aValue = a[sortKey];
			let bValue = b[sortKey];

			if (sortKey === 'score') {
				aValue = parseFloat(a.score);
				bValue = parseFloat(b.score);
			} else if (sortKey === 'name') {
				aValue = (aValue as string).replace(" AA", "");
				bValue = (bValue as string).replace(" AA", "");
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
	}, [materialCount]);

	const tableCellStyle = { padding: '8px 8px' };

	return (
		<div>
			<TableContainer component={Paper}>
				<Table aria-label="sortable table">
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
							<Tooltip title={row.tooltip} key={row.id} placement="top">
								<TableRow onClick={() => handleRowClick(row)}>
									<TableCell style={tableCellStyle} align="center">{row.name}</TableCell>
									<TableCell id={`${row.name.replaceAll(" ", "-")}-priority-score-entry`} style={tableCellStyle} align="center">{row.priorityScore}({row.count})</TableCell>
									<TableCell style={tableCellStyle} align="center">{row.score}</TableCell>
									<TableCell style={tableCellStyle} align="left">{row.dropsFrom}</TableCell>
									<TableCell style={tableCellStyle} align="left">{row.useIn}</TableCell>
								</TableRow>
							</Tooltip>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{overlayOpen && selectedDataItem && (
				<div className="category-list-overlay">
					<button
						className="overlay-close-button"
						onClick={() => setOverlayOpen(false)}>
						X
					</button>
					<DropListOverlay
						dropTable={selectedDataItem}
						materialCount={materialCount}
						materialMapping={materialMapping}
						onMatCountChange={handleMatCountChange}
						shardRequirements={selectedDataItem.shardRequirements} />
				</div>
			)}
		</div>
	);
}

export default React.memo(SortableTable);