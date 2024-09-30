import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import {
	defaultReactorPresets,
	ItemPreset,
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

const filterScheduleFunc = (
	presets: ItemPreset[],
	newSchedule: ScheduleObject[],
	setFilteredSchedule: React.Dispatch<React.SetStateAction<SchedulePresetObject[]>>
) => {
	const newFilteredSchedule: SchedulePresetObject[] = newSchedule.reduce((acc, item) => {
		const matchingPreset = presets.filter(preset =>
			(item.rewards.reward_type === 'Reactor' &&
				item.rewards.reactor_element_type === preset.element &&
				item.rewards.weapon_rounds_type === (preset.ammoType + ' Rounds') &&
				item.rewards.arche_type === preset.skillType)
		);

		if (matchingPreset.length > 0) {
			acc.push({ ...item, title: matchingPreset.map(mp => mp.title), type: 'Reactor' });
		} else if (item.rewards.reward_type !== 'Reactor') {
			acc.push({ ...item, title: [item.rewards.reward_type], type: item.rewards.reward_type});
		}

		return acc;
	}, [] as SchedulePresetObject[]);

	newFilteredSchedule.sort((a, b) => {
		const aIsReactor = a.type === 'Reactor';
		const bIsReactor = b.type === 'Reactor';

		// Sort reactor by matched preset first then location alphanumerically
		if (a.type === 'Reactor' && b.type === 'Reactor') {
			if (b.title.length === a.title.length) {
				return a.location.localeCompare(b.location)
			}
			return b.title.length - a.title.length
		}

		// Sort components by location
		if (a.type !== 'Reactor' && b.type !== 'Reactor') {
			return a.location.localeCompare(b.location)
		}
		return aIsReactor === bIsReactor ? 0 : aIsReactor ? 1 : -1;
	});

	setFilteredSchedule(newFilteredSchedule);
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

	const weekInMillis = 7 * 24 * 60 * 60 * 1000;
	const userLocale = navigator.language || 'en-US';

	useEffect(() => {
		// Load Presets
		const storedPresets = localStorage.getItem('reactorPresets');
		let incomingPresets: ItemPreset[] = []
		if (storedPresets) {
			incomingPresets = JSON.parse(storedPresets)
			setPresets(incomingPresets);
		} else {
			incomingPresets = defaultReactorPresets
			setPresets(defaultReactorPresets);
		}

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
						filterScheduleFunc(incomingPresets, newSchedule, setFilteredSchedule)
					})
			})
			.catch(error => {
				console.error('Error fetching reward rotations:', error);
			});
	}, []);

	const savePresetsToLocalStorage = useDebounce((newPresets: ItemPreset[]) => {
		localStorage.setItem('reactorPresets', JSON.stringify(newPresets));
	}, 500);

	useEffect(() => {
		savePresetsToLocalStorage(presets);
		filterScheduleFunc(presets, schedule, setFilteredSchedule)
	}, [presets]);

	return (
		<Box  sx={{
			width: '100%',
			maxWidth: { xs: '95%', sm: '600px', md: '960px', lg: '1280px', xl: '1920px' },
			overflow: 'auto',
			maxHeight: 'calc(100vh - 50px)',
			margin: '0 auto'
		}}>
			<ReactorPresets presets={presets} setPresets={setPresets} />
			<Typography variant="h6" sx={{ mt: 2 }}>
				Rotation {rotation}:{' '}
					{(new Date(rotationStartDate).toLocaleString(userLocale, dateOptions))} -
					{(new Date(rotationStartDate + weekly_unix_offset).toLocaleString(userLocale, dateOptions))}
			</Typography>
			<RotationComponent schedule={filteredSchedule}/>
		</Box>
	);
};

export default FarmRotationComponent;