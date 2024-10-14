import React, { useState, useEffect } from 'react';
import { Typography, Box, FormControlLabel, TextField, Switch, Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import {
	defaultReactorPresets,
	ItemPreset,
	ItemPresetBestLocation,
	LocationReward,
	rewardsFileName,
	rewardsSchedulePath,
	rotationRef,
	rotationStartDate,
	ScheduleObject,
	SchedulePresetObject,
	weekly_unix_offset,
} from "../data/constants";
import ReactorPresets from './ReactorPresets';
import RotationComponent from './Rotation';
import useDebounce from '../utils/Debounce';
import SortSchedule from '../utils/SortSchedule';
import GetLocalStorageItem from '../utils/GetLocalStorageItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReactorPresetsSummary from './ReactorPresetsSummary';
import ValidateReactorPresets from '../utils/ValidateReactorPresets';

const useLocalStorageDebounce = (key: string, delay: number) => {
	return useDebounce((value: any) => {
		localStorage.setItem(key, JSON.stringify(value));
	}, delay);
}

const dateOptions = {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false
} as Intl.DateTimeFormatOptions;

const FarmRotationComponent: React.FC = () => {
	const [presets, setPresets] = useState<ItemPreset[]>([]);
	const [schedule, setSchedule] = useState<ScheduleObject[]>([]);
	const [filteredSchedule, setFilteredSchedule] = useState<SchedulePresetObject[]>([]);
	const [rotation, setRotation] = useState<number>(9);
	const [ignoreStatic, setIgnoreStatic] = useState<boolean>(false);
	const [showAll, setShowAll] = useState<boolean>(false);
    const [filterDropRate, setFilterDropRate] = useState<string>('');
	const [presetBestLocation, setPresetBestLocation] = useState<ItemPresetBestLocation[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	const weekInMillis = 7 * 24 * 60 * 60 * 1000;
	const userLocale = navigator.language || 'en-US';

	useEffect(() => {
		// Load Presets
		const storedPresets = GetLocalStorageItem('reactorPresets', defaultReactorPresets);
		setPresets(ValidateReactorPresets(storedPresets));

		const savedState = GetLocalStorageItem<boolean>('reactorPresetsLocationAccordion', true);
		setIsOpen(savedState);

		const storedShowAll = GetLocalStorageItem<boolean>('reactorPresetsShowAll', false);
		setShowAll(storedShowAll);
		const storedIgnoreStatic = GetLocalStorageItem<boolean>('reactorPresetsIgnoreStatic', false);
		setIgnoreStatic(storedIgnoreStatic);
		const storedFilterDropRate = GetLocalStorageItem<string>('reactorPresetsFilterDropRate', "0");
		setFilterDropRate(storedFilterDropRate);

		// Calculate the current rotation
		const now = Date.now();
		const weeksElapsed = Math.floor((now - rotationStartDate) / weekInMillis);
		const currentRotation = rotationRef + weeksElapsed;
		setRotation(currentRotation)

		// Fetch reward rotation from the provided URL
		fetch(rewardsSchedulePath)
			.then(response => response.json())
			.then(data => {
				const latestRevision = data.history[0]; // First entry is the latest
				fetch(latestRevision.url)
					.then(response => response.json())
					.then(data => {
						// Extract rewards based on current rotation
						const newSchedule: ScheduleObject[] = [];
						const content = JSON.parse(data.files[rewardsFileName].content)
						content.rewards.forEach((item: LocationReward) => {
							const location = Object.keys(item)[0];
							const rewardsArray = item[location].rewards;

							const rewardForCurrentRotation = rewardsArray.find(reward => reward.rotation === currentRotation);
							if (rewardForCurrentRotation) {
								newSchedule.push({ location, rewards: rewardForCurrentRotation });
							}
						});

						// Update the schedule with the new data
						setSchedule(newSchedule.sort((a,b) => a.location.localeCompare(b.location)));
						SortSchedule(storedPresets, newSchedule, showAll, storedIgnoreStatic, storedFilterDropRate, setFilteredSchedule, setPresetBestLocation)
					})
			})
			.catch(error => {
			});
	}, []);

	const savePresetsToLocalStorage = useLocalStorageDebounce('reactorPresets', 500);
	const saveShowAllToLocalStorage = useLocalStorageDebounce('reactorPresetsShowAll', 500);
	const saveIgnoreStaticToLocalStorage = useLocalStorageDebounce('reactorPresetsIgnoreStatic', 500);
	const saveFilterDropRateToLocalStorage = useLocalStorageDebounce('reactorPresetsFilterDropRate', 500);

	useEffect(() => {
		savePresetsToLocalStorage(presets);
		SortSchedule(presets, schedule, showAll, ignoreStatic, filterDropRate, setFilteredSchedule, setPresetBestLocation);
	}, [presets]);

	useEffect(() => {
		saveShowAllToLocalStorage(ignoreStatic);
		SortSchedule(presets, schedule, showAll, ignoreStatic, filterDropRate, setFilteredSchedule, setPresetBestLocation);
	}, [showAll]);

	useEffect(() => {
		saveIgnoreStaticToLocalStorage(ignoreStatic);
		SortSchedule(presets, schedule, showAll, ignoreStatic, filterDropRate, setFilteredSchedule, setPresetBestLocation);
	}, [ignoreStatic]);

	useEffect(() => {
		saveFilterDropRateToLocalStorage(filterDropRate);
		SortSchedule(presets, schedule, showAll, ignoreStatic, filterDropRate, setFilteredSchedule, setPresetBestLocation);
	}, [filterDropRate]);

	const handleFilterDropRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Only allow numbers and decimals greater than 0
		if (/^\d*\.?\d*$/.test(value) || value === '') {
			setFilterDropRate(value);
		}
	};

	const handleToggle = () => {
		const newState = !isOpen;
		setIsOpen(newState);
		localStorage.setItem('reactorPresetsLocationAccordion', JSON.stringify(newState));
	};

	return (
		<Box  sx={{
			width: '100%',
			maxWidth: { xs: '95%', sm: '95%', md: '95%', lg: '95%', xl: '90%' },
			overflow: 'auto',
			maxHeight: 'calc(100vh - 50px)',
			margin: '0 auto'
		}}>
			<ReactorPresets presets={presets} setPresets={setPresets} />
			<ReactorPresetsSummary presets={presetBestLocation}></ReactorPresetsSummary>
			<Accordion expanded={isOpen} onChange={handleToggle} sx={{mt:'10px'}}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography>Location View</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Box
						display="flex"
						alignItems="center"
						flexDirection={{ xs: 'column', sm: 'row' }}
						sx={{ mt: 2 }}
					>
						<Typography variant="h6" sx={{ mb: { xs: 2, sm: 0 }, mr: { sm: 2 } }}>
							Rotation {rotation}:{' '}
							{(new Date(rotationStartDate + ((rotation - rotationRef) * weekly_unix_offset)).toLocaleString(userLocale, dateOptions))} -{' '}
							{(new Date(rotationStartDate + ((rotation - rotationRef) * weekly_unix_offset) + weekly_unix_offset - 1000).toLocaleString(userLocale, dateOptions))}
						</Typography>
						<Box
							display="flex"
							flexDirection={{ xs: 'row', sm: 'row' }}
							alignItems="center"
							sx={{ mt: { xs: 2, sm: 0 } }}
						>
							<FormControlLabel
								control={
									<Switch
										checked={showAll}
										onChange={() => setShowAll(prev => !prev)}
									/>
								}
								label="Show All"
								sx={{ mr: 2 }}
							/>
							<FormControlLabel
								control={
									<Switch
										checked={ignoreStatic}
										onChange={() => setIgnoreStatic(prev => !prev)}
									/>
								}
								label="Ignore Static"
								sx={{ mr: 2 }}
							/>
							<TextField
								label="Ignore drop rate below"
								variant="outlined"
								value={filterDropRate}
								onChange={handleFilterDropRateChange}
								size="small"
								type="number"
								inputProps={{ min: 0 }}
							/>
						</Box>
					</Box>
				</AccordionDetails>
				<RotationComponent schedule={filteredSchedule}/>
			</Accordion>
		</Box>
	);
};

export default FarmRotationComponent;