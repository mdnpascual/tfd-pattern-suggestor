import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Tooltip } from '@mui/material';

interface DataItem {
	id: string;
	name: string;
	score: string;
	count: number;
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
	{ id: 'count', disablePadding: true, label: 'Matched Count' },
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
			if (a[orderBy] < b[orderBy]) {
				return order === 'asc' ? -1 : 1;
			}
			if (a[orderBy] > b[orderBy]) {
				return order === 'asc' ? 1 : -1;
			}
			return 0;
		});
	};

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
						<TableCell align="center">{row.name}</TableCell>
						<TableCell align="center">{row.count}</TableCell>
						<TableCell align="center">{row.score}</TableCell>
						<TableCell align="left">{row.dropsFrom}</TableCell>
						<TableCell align="left">{row.useIn}</TableCell>
					</TableRow>
				</Tooltip>
				))}
			</TableBody>
			</Table>
		</TableContainer>
	);
}

export default SortableTable;