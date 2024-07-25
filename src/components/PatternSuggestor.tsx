import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Tooltip, Typography } from '@mui/material';
import MultiSelectList, { Item } from './MultiSelectList';
import data from '../data/patterns.json';
import CheckboxFilter from './CheckboxFilter';

interface DropList {
	chance: number,
	name: string,
}

interface Pattern {
	drops: DropList[],
	dropsFrom: string,
	useIn: string
}

const filterOptions = [
	'Normal',
	'Hard',
	'Collosus',
	'Infiltration',
	'Special Ops',
	'Void Outpost',
	'Sharen Exclusive'
];

let items: Item[] = []
const patternData: Record<string, Pattern> = data;

Object.entries(patternData).forEach(([key, data]) => {
	data.drops.forEach((drop) => {
		if (!items.find(item => item.label === drop.name)){
			items.push({id: key + drop.name, label: drop.name})
		}
	})
});


items = items.sort((a: Item, b: Item) => {
	if (a.label < b.label) return -1
	if (b.label < a.label) return 1
	return 0;
})

interface PatternCount {
	name: string,
	score: number,
	drops: DropList[],
	dropsFrom: string,
	useIn: string
}

const PatternSuggestorComponent: React.FC = () => {
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [farmList, setFarmList] = useState<PatternCount[]>([]);
	const [filters, setFilters] = useState({});

	const handleChange = (items: string[]) => {
		setSelectedItems(items)
		setFarmList([])
	};

	const handleFilterChange = (selectedFilters: Record<string, boolean>) => {
		setFilters(selectedFilters);
	};

	useEffect(() => {
		let newFarmList: PatternCount[] = []
		selectedItems.forEach((selectedItem) => {
			Object.entries(patternData).forEach(([key, data]) => {
				data.drops.forEach((drop) => {

					if (drop.name === selectedItem){
						const found = newFarmList.find(item => item.name === key);
						if (found){
							found.score += 1
						} else {
							newFarmList.push({
								name: key,
								score: 1,
								drops: patternData[key].drops,
								dropsFrom: patternData[key].dropsFrom,
								useIn: patternData[key].useIn
							})
						}
					}
				})
			});

			// FILTER
			let filteredFarmList: PatternCount[] = []
			Object.entries(filters).forEach(([key, data]) => {
				if (key === 'Normal' && data){
					filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.dropsFrom.toLowerCase().includes("(normal)")))
				}
				if (key === 'Hard' && data){
					filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.dropsFrom.toLowerCase().includes("(hard)")))
				}
				if (key === 'Collosus' && data){
					if(filteredFarmList.length === 0){
						filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.useIn.toLowerCase().includes("void intercept battle")))
					}
					filteredFarmList = filteredFarmList.filter((list) => list.useIn.toLowerCase().includes("void intercept battle"))
				}
				if (key === 'Sharen Exclusive' && data){
					if(filteredFarmList.length === 0){
						filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.dropsFrom.toLowerCase().includes("(successful infiltration)")))
					}
					filteredFarmList = filteredFarmList.filter((list) => list.dropsFrom.toLowerCase().includes("(successful infiltration)"))
				}
				if (key === 'Void Outpost' && data){
					if(filteredFarmList.length === 0){
						filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.dropsFrom.toLowerCase().includes("vulgus strategic outpost")))
					}
					filteredFarmList = filteredFarmList.filter((list) => list.dropsFrom.toLowerCase().includes("vulgus strategic outpost"))
				}
			});

			// SORT
			filteredFarmList = filteredFarmList.sort((a: PatternCount, b: PatternCount) => {
				if (a.score === b.score){
					let aTotalScore = 0
					let bTotalScore = 0
					a.drops.forEach((drop) => {
						if (selectedItems.includes(drop.name)){
							aTotalScore += drop.chance
						}
					})
					b.drops.forEach((drop) => {
						if (selectedItems.includes(drop.name)){
							bTotalScore += drop.chance
						}
					})

					if (aTotalScore === bTotalScore){
						if (a.name < b.name) return -1;
						if (a.name > b.name) return 1;
						return 0;
					}
					return (aTotalScore - bTotalScore) * -1;
				}
				return (a.score - b.score) * -1;
			})

			setFarmList(Array.from(new Set(filteredFarmList)))
		})
	}, [selectedItems, filters]);

	const formatTooltipContent = (drops: DropList[]) => {
		const filteredDrops = drops.filter((drop) => selectedItems.includes(drop.name))
		return (
			<div>
			{filteredDrops.map((drop, index) => (
				<div key={index}>
				{drop.name} - Chance: {drop.chance * 100}%
				</div>
			))}
			</div>
		);
	};

	return (
		<div style={{ width: '100%', height: '100vh', display: 'flex' }}>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<Paper style={{ height: 'calc(100vh - 20px)', overflowY: 'auto' }}>
						<MultiSelectList items={items} onChange={handleChange} />
					</Paper>
				</Grid>
				<Grid item xs={6} style={{ padding: '10px' }}>
					<CheckboxFilter labels={filterOptions} defaultTrue={['Normal', 'Hard', 'Collosus']} onChange={handleFilterChange} />
					<Typography variant="h6">Patterns Found:</Typography>
					{farmList.map((item, index) => (
						<Tooltip
							key={index}
							title={formatTooltipContent(item.drops)}
							placement="right"
							arrow
						>
							<Typography key={index} variant="body1">
								{item.name} : {item.score}
							</Typography>
						</Tooltip>
					))}
				</Grid>
			</Grid>
		</div>
	);
};

export default PatternSuggestorComponent;