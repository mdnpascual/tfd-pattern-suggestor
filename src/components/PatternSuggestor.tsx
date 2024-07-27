import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@mui/material';
import MultiSelectList, { Item } from './MultiSelectList';
import data from '../data/patterns.json';
import CheckboxFilter, { FilterProps } from './CheckboxFilter';
import SortableTable from './SortableTable';

interface DropList {
	chance: number,
	name: string,
}

interface Pattern {
	drops: DropList[],
	dropsFrom: string,
	useIn: string
}

const filterOptions: FilterProps[] = [
	{label: 'Normal', tooltip: "Adds Patterns in Normal Difficulty"},
	{label: 'Hard', tooltip: "Adds Patterns in Hard Difficulty"},
	{label: 'Collosus', tooltip: "Filters Patterns only useable in Collosus"},
	{label: 'Special Ops', tooltip: "Filters Patterns that only drops in Special Ops"},
	{label: 'Void Reactor', tooltip: "Filters Patterns only useable in Void Reactors"},
	{label: 'Sharen Exclusive', tooltip: "Filters Patterns that only drops with Sharen's succesful infiltration"},
];

const collosusOptions: FilterProps[] = [
	{label: 'Grave Walker', tooltip: "Only Show Patterns useable by beating Grave Walker"},
	{label: 'Stunning Beauty', tooltip: "Only Show Patterns useable by beating Stunning Beauty"},
	{label: 'Executioner', tooltip: "Only Show Patterns useable by beating Executioner"},
	{label: 'Dead Bride', tooltip: "Only Show Patterns useable by beating Dead Bride"},
	{label: 'Devourer', tooltip: "Only Show Patterns useable by beating Devourer"},
	{label: 'Pyromaniac', tooltip: "Only Show Patterns useable by beating Pyromaniac"},
	{label: 'Swamp Walker', tooltip: "Only Show Patterns useable by beating Swamp Walker"},
	{label: 'Hanged Man', tooltip: "Only Show Patterns useable by beating Hanged Man"},
	{label: 'Obstructer', tooltip: "Only Show Patterns useable by beating Obstructer"},
	{label: 'Frost Walker', tooltip: "Only Show Patterns useable by beating Frost Walker"},
	{label: 'Molten Fortress', tooltip: "Only Show Patterns useable by beating Molten Fortress"}
]

const specOpsKeywords = [
	'defend albion resource',
	'neutralize void experiment',
	'block kuiper mining'
]

let items: Item[] = []
const patternData: Record<string, Pattern> = data;

Object.entries(patternData).forEach(([key, data]) => {
	data.drops.forEach((drop) => {
		if (!items.find(item => item.label === drop.name)){
			items.push({id: key + drop.name, label: drop.name, priority: 1})
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
	count: number,
	priorityScore: number,
	score: number,
	drops: DropList[],
	dropsFrom: string,
	useIn: string
}

const PatternSuggestorComponent: React.FC = () => {
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [priorities, setPriorities] = useState<number[]>([]);
	const [farmList, setFarmList] = useState<PatternCount[]>([]);
	const [filters, setFilters] = useState({});
	const [collosusFilters, setCollosusFilters] = useState({});
	const [view, setView] = useState('both');

	const handleChange = (items: string[], priorities: number[]) => {
		setSelectedItems(items)
		setPriorities(priorities)
		setFarmList([])
	};

	const handleFilterChange = (selectedFilters: Record<string, boolean>) => {
		setFilters(selectedFilters);
	};

	const handleCollosusChange = (selectedFilters: Record<string, boolean>) => {
		setCollosusFilters(selectedFilters);
	};

	const toggleLeft = () => {
		if (view === 'both') {
			setView('right');
		} else if (view === 'left') {
			setView('both');
		}
		};

		const toggleRight = () => {
		if (view === 'both') {
			setView('left');
		} else if (view === 'right') {
			setView('both');
		}
	};

	useEffect(() => {
		let newFarmList: PatternCount[] = []
		selectedItems.forEach((selectedItem, idx) => {
			Object.entries(patternData).forEach(([key, data]) => {
				data.drops.forEach((drop) => {

					if (drop.name === selectedItem){
						const found = newFarmList.find(item => item.name === key);
						if (found){
							found.count += 1;
							found.priorityScore += parseInt((priorities[idx] * (patternData[key].drops.find((drop) => drop.name === selectedItem)?.chance ?? 0) * 100).toFixed(0));
							found.score += patternData[key].drops.find((drop) => drop.name === selectedItem)?.chance ?? 0;
						} else {
							newFarmList.push({
								name: key,
								count: 1,
								priorityScore: parseInt((priorities[idx] * (patternData[key].drops.find((drop) => drop.name === selectedItem)?.chance ?? 0) * 100).toFixed(0)),
								score: patternData[key].drops.find((drop) => drop.name === selectedItem)?.chance ?? 0,
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
				if (key === 'Void Reactor' && data){
					if(filteredFarmList.length === 0){
						filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.useIn.toLowerCase().includes("void fusion reactor")))
					}
					filteredFarmList = filteredFarmList.filter((list) => list.useIn.toLowerCase().includes("void fusion reactor"))
				}
				if (key === 'Special Ops' && data){
					if(filteredFarmList.length === 0){

						filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => specOpsKeywords.some(keyword => list.dropsFrom.toLowerCase().includes(keyword))))
					}
					filteredFarmList = newFarmList.filter((list) => specOpsKeywords.some(keyword => list.dropsFrom.toLowerCase().includes(keyword)))
				}
			});

			// FILTER COLLOSUS
			Object.entries(collosusFilters).forEach(([key, data]) => {
				if (!data) {
					const keyLowerCase = key.toLowerCase(); // Convert the key to lowercase once
					filteredFarmList = filteredFarmList.filter((list) =>
						!list.useIn.toLowerCase().includes(keyLowerCase)
					);
				}
			});

			// SORT
			filteredFarmList = filteredFarmList.sort((a: PatternCount, b: PatternCount) => {
				if (a.priorityScore === b.priorityScore){
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
				return (a.priorityScore - b.priorityScore) * -1;
			})

			setFarmList(Array.from(new Set(filteredFarmList)))
		})
	}, [selectedItems, priorities, collosusFilters, filters]);

	const formatTooltipContent = (drops: DropList[], name: string) => {
		const filteredDrops = drops.filter((drop) => selectedItems.includes(drop.name))
		return (
			<div>
				{name} Matched Droplist:
				{filteredDrops.map((drop, index) => (
					<div key={index}>
						{drop.name} - Chance: {drop.chance * 100}%
					</div>
				))}
			</div>
		);
	};

	return (
		<div style={{ width: '100%', display: 'flex', height: '100vh' }}>
			<div style={{ flex: view === 'both' || view === 'left' ? 1 : 0, transition: 'flex 0.3s', overflow: 'auto', position: 'relative' }}>
				{view !== 'right' && (
				<Button onClick={toggleLeft} variant="contained" style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
					{'<<'}
				</Button>
				)}
				<Paper style={{ height: 'calc(100vh - 20px)', overflowY: 'auto' }}>
					<MultiSelectList startingItems={items} onChange={handleChange} />
				</Paper>
			</div>
			<div style={{ flex: view === 'both' || view === 'right' ? 1 : 0, transition: 'flex 0.3s', overflow: 'auto', position: 'relative' }}>
				{view !== 'left' && (
				<Button onClick={toggleRight} variant="contained" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
					{'>>'}
				</Button>
				)}
				<CheckboxFilter
					labels={filterOptions}
					localStorageName={'selectedFilters'}
					defaultTrue={['Normal', 'Hard']}
					onChange={handleFilterChange} />
				{('Collosus' in filters) && (!!filters.Collosus) && <CheckboxFilter labels={collosusOptions} localStorageName={'selectedCollossusFilters'} defaultTrue={collosusOptions.map((item) => item.label)} onChange={handleCollosusChange} />}
				<Paper style={{ height: 'calc(100vh - 20px)', overflowY: 'auto' }}>
					<SortableTable data={farmList.map((item, index) => {
						return {
							id: item.name,
							name: item.name,
							count: item.count,
							priorityScore: item.priorityScore,
							score: (item.score * 100).toFixed(0) + "%",
							dropsFrom: item.dropsFrom.replace("(Successful Infiltration)", "(Sharen)"),
							useIn: item.useIn.replace("Void Intercept Battle", "Collosus").replace("Void Fusion Reactor", "Void Outpost"),
							tooltip: formatTooltipContent(item.drops, item.name)
						}})} />
				</Paper>
			</div>
		</div>
	);
};

export default PatternSuggestorComponent;