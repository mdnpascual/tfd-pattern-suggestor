import React, { useEffect, useMemo, useState } from 'react';
import { Button, Paper, Tooltip } from '@mui/material';
import MultiSelectList, { Item } from './MultiSelectList';
import data from '../data/patterns.json';
import voidFusionRawData from '../data/voidFusionReactorShards.json';
import SortableTable from './SortableTable';
import {
	specOpsKeywords,
	filterOptions,
	collosusOptions,
	dataKeywordHard,
	dataKeywordNormal,
	dataKeywordSharen,
	dataKeywordVoidReactor,
	VoidFusionLocations,
	Pattern,
	DropList,
	dataKeywordSharenModified,
	dataKeywordDropsFromOutpost,
} from "../data/constants";
import CheckboxFilter from './CheckboxFilter';
import GenerateSuggestion from '../utils/GenerateSuggestions';
import { getBooleanSetting } from './Settings';

const voidFusionData = voidFusionRawData as VoidFusionLocations;
const voidFusionLocations = Object.keys(voidFusionData);
const patternData: Record<string, Pattern> = data;
const patternKeys = Object.keys(patternData).sort((a, b) => {
    const numA = parseInt(a.split(' ')[0], 10);
    const numB = parseInt(b.split(' ')[0], 10);
    return numA - numB;
});

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

	const [realTimeKeyUpdate, setRealTimeKeyUpdate] = useState(0);
	const [resetCheckboxFiltersUpdate, setResetCheckboxFiltersUpdate] = useState(0);
	const realTimeSuggestorSetting = getBooleanSetting('realTimeSuggestor', false)

	const items = useMemo(() => {
		if(realTimeSuggestorSetting) GenerateSuggestion();
		const newItems: Item[] = [];
		Object.entries(patternData).forEach(([key, data]) => {
			data.drops.forEach((drop) => {
				if (!newItems.find(item => item.label === drop.name)){
					newItems.push({id: key + drop.name, label: drop.name, priority: 1})
				}
			});
		});
		return newItems.sort((a, b) => a.label.localeCompare(b.label));
	}, []);

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

			let withCollosusFilters = false;

			// FILTER
			let filteredFarmList: PatternCount[] = []
			Object.entries(filters).forEach(([key, data]) => {
				if (key === 'Normal' && data){
					filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.dropsFrom.toLowerCase().includes(dataKeywordNormal)))
				}
				if (key === 'Hard' && data){
					filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.dropsFrom.toLowerCase().includes(dataKeywordHard)))
				}
				if (key === 'Collosus' && data){
					withCollosusFilters = true;
				}
				if (key === 'Sharen Exclusive' && data){
					if(filteredFarmList.length === 0){
						filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.dropsFrom.toLowerCase().includes(dataKeywordSharen)))
					}
					filteredFarmList = filteredFarmList.filter((list) => list.dropsFrom.toLowerCase().includes(dataKeywordSharen))
				}
				if (key === 'Void Reactor' && data){
					if(filteredFarmList.length === 0){
						filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => list.useIn.toLowerCase().includes(dataKeywordVoidReactor)))
					}
					filteredFarmList = filteredFarmList.filter((list) => list.useIn.toLowerCase().includes(dataKeywordVoidReactor))
				}
				if (key === 'Special Ops' && data){
					if(filteredFarmList.length === 0){

						filteredFarmList = filteredFarmList.concat(newFarmList.filter((list) => specOpsKeywords.some(keyword => list.dropsFrom.toLowerCase().includes(keyword))))
					}
					filteredFarmList = newFarmList.filter((list) => specOpsKeywords.some(keyword => list.dropsFrom.toLowerCase().includes(keyword)))
				}
			});

			// FILTER COLLOSUS
			if (withCollosusFilters) {
				let collosusOnly: PatternCount[] = [];
				Object.entries(collosusFilters).forEach(([key, data]) => {

					const keyLowerCase = key.toLowerCase();
					const specificCollosusOnly = newFarmList.filter((list) => list.useIn.toLowerCase().includes(keyLowerCase));
					if (data) {
						collosusOnly = collosusOnly.concat(specificCollosusOnly);
					}
				});
				filteredFarmList = filteredFarmList.filter((list) => collosusOnly.includes(list));
			}

			// UNIQUE
			filteredFarmList = Array.from(new Set(filteredFarmList));

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

			setFarmList(filteredFarmList)
		})
	}, [selectedItems, priorities, collosusFilters, filters, realTimeKeyUpdate]);

	const handleMatCountChange = (item: string, newCount: number) => {
		if(realTimeSuggestorSetting) {
			GenerateSuggestion();
			setRealTimeKeyUpdate(realTimeKeyUpdate + 1);
		}
	};

	const handleApplyNormalAndHardFilters = () => {
		localStorage.setItem('selectedFilters', '{"Normal":true,"Hard":true,"Collosus":false,"Special Ops":false,"Void Reactor":false,"Sharen Exclusive":false}');
		if(realTimeSuggestorSetting) {
			setRealTimeKeyUpdate(realTimeKeyUpdate + 1);
		}
		setResetCheckboxFiltersUpdate(resetCheckboxFiltersUpdate + 1)
	}

	const renderDrops = (dropsArray: DropList[], title: string, useIn: string) => (
		<div>
			{title} Matched Droplist:
			{dropsArray.map((drop, idx) => (
				<div key={idx}>{drop.name} - Chance: {drop.chance * 100}%</div>
			))}
			{voidFusionLocations.includes(useIn) && voidFusionData[useIn as keyof VoidFusionLocations] && (
				<ShardRequirements location={useIn as keyof VoidFusionLocations} />
			)}
		</div>
	);

	const ShardRequirements = ({ location }: { location: keyof VoidFusionLocations }) => {
		const shardData = voidFusionData[location];
		if (!shardData) return null;

		return (
			<div>
				<br />
				Shard Requirements:
				{shardData.drops.map((drop, idx) => (
					<div key={idx}>{drop.type}: {drop.count}</div>
				))}
			</div>
		);
	};

	const formatTooltipContent = (
		drops: DropList[],
		name: string,
		useIn: string,
		dropsFrom: string,
		children: JSX.Element
	) => {
		const currentItemIndex = patternKeys.indexOf(name);
		const previousIndex = currentItemIndex > 0 ? currentItemIndex - 1 : null;
		const nextIndex = currentItemIndex < patternKeys.length - 1 ? currentItemIndex + 1 : null;

		const currentFilteredDrops = drops.filter((drop) => selectedItems.includes(drop.name));

		const previousFilteredDrops = previousIndex !== null
			? patternData[patternKeys[previousIndex]]?.drops.filter((drop) => selectedItems.includes(drop.name))
			: undefined;

		const nextFilteredDrops = nextIndex !== null
			? patternData[patternKeys[nextIndex]]?.drops.filter((drop) => selectedItems.includes(drop.name))
			: undefined;

		const usePrevious = previousFilteredDrops && previousFilteredDrops?.length > 0 &&
			dropsFrom.toLowerCase().includes(dataKeywordSharenModified) &&
			dropsFrom.toLowerCase().includes(dataKeywordHard);

		const useNext = nextFilteredDrops && nextFilteredDrops?.length > 0 &&
			dropsFrom.toLowerCase().includes(dataKeywordDropsFromOutpost) &&
			!dropsFrom.toLowerCase().includes(dataKeywordSharenModified) &&
			dropsFrom.toLowerCase().includes(dataKeywordHard);

		const currentToolTip = renderDrops(currentFilteredDrops, name, patternData[patternKeys[currentItemIndex]].useIn);

		const previousToolTip = usePrevious && previousFilteredDrops && previousIndex
			? renderDrops(previousFilteredDrops, patternKeys[previousIndex], patternData[patternKeys[previousIndex]].useIn)
			: null;

		const nextToolTip = useNext && nextFilteredDrops && nextIndex
			? renderDrops(nextFilteredDrops, patternKeys[nextIndex], patternData[patternKeys[nextIndex]].useIn)
			: null;

		return (
			<Tooltip
				title={currentToolTip}
				key="current"
				placement={usePrevious ? 'bottom' : 'top'}
			>
				{useNext || usePrevious ? (
					<Tooltip
						title={usePrevious ? previousToolTip : nextToolTip}
						key="next-previous"
						placement={usePrevious ? 'top' : 'bottom'}
					>
						{children}
					</Tooltip>
				) : (
					children
				)}
			</Tooltip>
		);
	};

	const formatShardRequirements = (useIn: string) => {
		const location = useIn as keyof VoidFusionLocations;
		return (
			<div>
				{voidFusionLocations.includes(useIn) && (
				<div>
					<br />
					<span>
					Shard Requirements:&nbsp;
					{voidFusionData[location].drops.map((drop, idx) => (
						<span key={idx}>
						{drop.type} ({drop.count})
						{idx < voidFusionData[location].drops.length - 1 ? ', ' : ''}
						</span>
					))}
					</span>
				</div>
				)}
			</div>
		);
	}

	return (
		<div style={{ width: '100%', display: 'flex', height: 'calc(100vh - 45px)' }}>
			<div style={{ flex: view === 'both' || view === 'left' ? 1 : 0, transition: 'flex 0.3s', overflow: 'hidden', position: 'relative' }}>
				{view !== 'right' && (
				<Button onClick={toggleLeft} variant="contained" style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }} id="toggle-left-button">
					{'<<'}
				</Button>
				)}
				<Paper style={{ height: '100%', overflowY: 'auto' }}>
					<MultiSelectList startingItems={items} onChange={handleChange} key={realTimeKeyUpdate} />
				</Paper>
			</div>
			<div style={{ flex: view === 'both' || view === 'right' ? 1 : 0, transition: 'flex 0.3s', overflow: 'hidden', position: 'relative' }} id="pattern-suggested-list">
				{view !== 'left' && (
				<Button onClick={toggleRight} variant="contained" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} id="toggle-right-button">
					{'>>'}
				</Button>
				)}
				<CheckboxFilter
					labels={filterOptions}
					localStorageName={'selectedFilters'}
					defaultTrue={['Normal', 'Hard']}
					onChange={handleFilterChange}
					key={resetCheckboxFiltersUpdate} />
				{('Collosus' in filters) && (!!filters.Collosus) && <CheckboxFilter labels={collosusOptions} localStorageName={'selectedCollossusFilters'} defaultTrue={collosusOptions.map((item) => item.label)} onChange={handleCollosusChange} />}
				<Paper style={{ height: '100%', overflowY: 'auto' }} id="sortable-table">
					<SortableTable
						key={resetCheckboxFiltersUpdate}
						onMatCountChange={handleMatCountChange}
						onApplyNormalAndHardFilters={handleApplyNormalAndHardFilters}
						formatTooltipContent={formatTooltipContent}
						data={farmList.map((item, index) => {
							return {
								id: item.name,
								name: item.name,
								count: item.count,
								priorityScore: item.priorityScore,
								score: (item.score * 100).toFixed(0) + "%",
								drops: item.drops,
								dropsFrom: item.dropsFrom.replace("(Successful Infiltration)", "(Sharen)"),
								useIn: item.useIn.replace("Void Intercept Battle", "Collosus").replace("Void Fusion Reactor", "Void Outpost"),
								shardRequirements: formatShardRequirements(item.useIn)
						}})} />
				</Paper>
			</div>
		</div>
	);
};

export default PatternSuggestorComponent;