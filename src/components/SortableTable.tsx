import React, { useEffect, useState } from 'react';
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

const mergeMaterialCount = (...objs: { materialCount: Record<string, number> }[]) => {
	return objs.reduce((acc, obj) => {
		for (const [key, value] of Object.entries(obj.materialCount)) {
			if (acc[key] !== undefined && acc[key] !== value) {
				throw new Error(`Conflict detected for key "${key}": ${acc[key]} vs ${value}`);
			}
			acc[key] = value;
		}
		return acc;
	}, {} as Record<string, number>);
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

const initializeData = () => {
	const character = InitializeCategoryData(CharacterRawData, 'characterStatus', 'materialCount');
		let character2 = character
		for (const key in character2.categoryStatus) {
			character2.materialCount[key] = character2.categoryStatus[key] ? 0 : 1
		}

		const weapon = InitializeCategoryData(WeaponRawData, 'weaponStatus', 'materialCount');
		const enhancement = InitializeCategoryData(EnhancementRawData, 'enhancementStatus', 'materialCount');

		return mergeMaterialCount(character2, weapon, enhancement);
}

function SortableTable({ data }: { data: TableItem[] }) {
	const [order, setOrder] = useState<Order>(undefined);
	const [orderBy, setOrderBy] = useState<keyof TableItem>('name');
	const [overlayOpen, setOverlayOpen] = useState(false);
	const [selectedDataItem, setSelectedDataItem] = useState<TableItem>();

	const [materialCount, setMaterialCount] = useState<Record<string, number>>({"": 0});
	const [materialMapping, setMaterialMapping] = useState<Record<string, string>>({"": ""});

	useEffect(() => {
		const characterData = CharacterRawData as Record<string, CategoryData>
		const weaponData = WeaponRawData as Record<string, CategoryData>
		const enhancementData = EnhancementRawData as Record<string, CategoryData>

		setMaterialCount(initializeData());
		setMaterialMapping({...mapPartsList(characterData), ...mapPartsList(weaponData), ...mapPartsList(enhancementData)})
	}, []);

	const handleMatCountChange = (item: string, newCount: number) => {
		const savedMaterialCount = localStorage.getItem('materialCount');
		let newMaterialCount: Record<string, number> = savedMaterialCount
			? JSON.parse(savedMaterialCount)
			: materialCount;
		newMaterialCount[item] = newCount;
		localStorage.setItem(
			'materialCount',
			JSON.stringify(newMaterialCount)
		);

		setMaterialCount(initializeData());
	};

	const handleRequestSort = (property: keyof TableItem) => {
		if (property !== undefined){
			const isAsc = orderBy === property && order === 'asc';
			setOrder(isAsc ? 'desc' : 'asc');
			setOrderBy(property);
		}
	};

	const handleRowClick = (row: TableItem) => {
		setSelectedDataItem(row);
		setOverlayOpen(true);
	};

	const sortData = (array: TableItem[]) => {
		if (order === undefined){
			return array
		}

		return array.sort((a, b) => {
			let aItem = a[orderBy];
			let bItem = b[orderBy];

			// Change Datatype for these columns
			if (orderBy === 'score'){
				aItem = parseInt(a[orderBy].substring(-1))
				bItem = parseInt(b[orderBy].substring(-1))
			} else if (orderBy === 'name'){
				aItem = (aItem as string).replace(" AA", "")
				bItem = (bItem as string).replace(" AA", "")
				aItem = parseInt(a[orderBy])
				bItem = parseInt(b[orderBy])
			}

			if (aItem < bItem) {
				return order === 'asc' ? -1 : 1;
			}
			if (aItem > bItem) {
				return order === 'asc' ? 1 : -1;
			}
			return 0;
		});
	};

	const tableCellStyle = { padding: '8px 8px' };

	return (
		<div>
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
				<TableHead>
					<TableRow>
					{headCells.map(headCell => (
						<TableCell key={headCell.id} align={'center'}>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={() => handleRequestSort(headCell.id)}
						>
							{headCell.label}
						</TableSortLabel>
						</TableCell>
					))}
					</TableRow>
				</TableHead>
				<TableBody>
					{sortData(data).map((row) => (
					<Tooltip title={row.tooltip}>
						<TableRow key={row.id} onClick={() => handleRowClick(row)}>
							<TableCell style={tableCellStyle} align="center">{row.name}</TableCell>
							<TableCell style={tableCellStyle} align="center">{row.priorityScore}({row.count})</TableCell>
							<TableCell style={tableCellStyle} align="center">{row.score}</TableCell>
							<TableCell style={tableCellStyle} align="left">{row.dropsFrom}</TableCell>
							<TableCell style={tableCellStyle} align="left">{row.useIn}</TableCell>
						</TableRow>
					</Tooltip>
					))}
				</TableBody>
				</Table>
			</TableContainer>

			{overlayOpen && (
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
						onMatCountChange={handleMatCountChange}/>
				</div>
			)}
		</div>
	);
}

export default SortableTable;