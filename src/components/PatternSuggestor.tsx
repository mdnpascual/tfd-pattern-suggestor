import React, { useEffect, useState } from 'react';
import { Button, Paper } from '@mui/material';
import MultiSelectList, { Item } from './MultiSelectList';
import data from '../data/patterns.json';
import CheckboxFilter from './CheckboxFilter';
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

const filterOptions = [
	'Normal',
	'Hard',
	'Collosus',
	'Special Ops',
	'Void Outpost',
	'Sharen Exclusive'
];

const collosusOptions = [
	'Grave Walker',
	'Stunning Beauty',
	'Executioner',
	'Dead Bride',
	'Devourer',
	'Pyromaniac',
	'Swamp Walker',
	'Hanged Man',
	'Obstructer',
	'Frost Walker',
	'Molten Fortress'
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
	matchCount: number,
	score: number,
	drops: DropList[],
	dropsFrom: string,
	useIn: string
}

const PatternSuggestorComponent: React.FC = () => {
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [farmList, setFarmList] = useState<PatternCount[]>([]);
	const [filters, setFilters] = useState({});
	const [collosusFilters, setCollosusFilters] = useState({});
	const [view, setView] = useState('both');

	const handleChange = (items: string[]) => {
		setSelectedItems(items)
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
		selectedItems.forEach((selectedItem) => {
			Object.entries(patternData).forEach(([key, data]) => {
				data.drops.forEach((drop) => {

					if (drop.name === selectedItem){
						const found = newFarmList.find(item => item.name === key);
						if (found){
							found.matchCount += 1
							found.score += patternData[key].drops.find((drop) => drop.name === selectedItem)?.chance ?? 0
						} else {
							newFarmList.push({
								name: key,
								matchCount: 1,
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
				if (key === 'Void Outpost' && data){
					if(filteredFarmList.length === 0){
						filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.dropsFrom.toLowerCase().includes("vulgus strategic outpost")))
					}
					filteredFarmList = filteredFarmList.filter((list) => list.dropsFrom.toLowerCase().includes("vulgus strategic outpost"))
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

				if (key === 'Grave Walker' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("grave walker"))
				}
				if (key === 'Stunning Beauty' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("stunning beauty"))
				}
				if (key === 'Executioner' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("executioner"))
				}
				if (key === 'Dead Bride' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("dead bride"))
				}
				if (key === 'Devourer' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("devourer"))
				}
				if (key === 'Pyromaniac' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("pyromaniac"))
				}
				if (key === 'Swamp Walker' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("swamp walker"))
				}
				if (key === 'Hanged Man' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("hanged man"))
				}
				if (key === 'Obstructer' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("obstructer"))
				}
				if (key === 'Frost Walker' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("frost walker"))
				}
				if (key === 'Molten Fortress' && !data){
					filteredFarmList = filteredFarmList.filter((list) => !list.useIn.toLowerCase().includes("molten fortress"))
				}
			});

			// SORT
			filteredFarmList = filteredFarmList.sort((a: PatternCount, b: PatternCount) => {
				if (a.matchCount === b.matchCount){
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
				return (a.matchCount - b.matchCount) * -1;
			})

			setFarmList(Array.from(new Set(filteredFarmList)))
		})
	}, [selectedItems, collosusFilters, filters]);

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
					<MultiSelectList items={items} onChange={handleChange} />
				</Paper>
			</div>
			<div style={{ flex: view === 'both' || view === 'right' ? 1 : 0, transition: 'flex 0.3s', overflow: 'auto', position: 'relative' }}>
				{view !== 'left' && (
				<Button onClick={toggleRight} variant="contained" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
					{'>>'}
				</Button>
				)}
				<CheckboxFilter labels={filterOptions} localStorageName={'selectedFilters'} defaultTrue={['Normal', 'Hard', 'Collosus']} onChange={handleFilterChange} />
				{('Collosus' in filters) && (!!filters.Collosus) && <CheckboxFilter labels={collosusOptions} localStorageName={'selectedCollossusFilters'} defaultTrue={collosusOptions} onChange={handleCollosusChange} />}
				<Paper style={{ height: 'calc(100vh - 20px)', overflowY: 'auto' }}>
					<SortableTable data={farmList.map((item, index) => {
						return {
							id: item.name,
							name: item.name,
							count: item.matchCount,
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