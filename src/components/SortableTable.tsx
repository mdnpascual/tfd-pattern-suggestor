import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Tooltip } from '@mui/material';

interface DataItem {
	id: string;
	name: string;
	score: string;
	count: number;
	priorityScore: number;
	dropsFrom: string;
	useIn: string;
	tooltip: JSX.Element;
}

type Order = 'asc' | 'desc' | undefined;

interface HeadCell {
	disablePadding: boolean;
	id: keyof DataItem;
	label: string;
}

const headCells: HeadCell[] = [
	{ id: 'name', disablePadding: true, label: 'Pattern' },
	{ id: 'priorityScore', disablePadding: true, label: 'Priority(Count)' },
	{ id: 'score', disablePadding: false, label: 'Percentage' },
	{ id: 'dropsFrom', disablePadding: false, label: 'Drops From' },
	{ id: 'useIn', disablePadding: false, label: 'Use In' },
];

function SortableTable({ data }: { data: DataItem[] }) {
	const [order, setOrder] = useState<Order>(undefined);
	const [orderBy, setOrderBy] = useState<keyof DataItem>('name');

	const handleRequestSort = (property: keyof DataItem) => {
		if (property !== undefined){
			const isAsc = orderBy === property && order === 'asc';
			setOrder(isAsc ? 'desc' : 'asc');
			setOrderBy(property);
		}
	};

	const sortData = (array: DataItem[]) => {
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
					<TableRow key={row.id}>
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
	);
}

export default SortableTable;