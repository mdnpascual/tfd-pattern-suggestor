import React, { useState, useEffect } from 'react';
import { Typography, Container } from '@mui/material';
import { defaultReactorPresets, ItemPreset, LocationReward, rewardsFileName, rewardsSchedulePath, rotationRef, rotationStartDate, ScheduleObject, SchedulePresetObject } from '../data/constants';
import ReactorPresets from './ReactorPresets';
import RotationComponent from './Rotation';
import useDebounce from '../utils/Debounce';

const filterScheduleFunc = (
	presets: ItemPreset[],
	newSchedule: ScheduleObject[],
	setFilteredSchedule: React.Dispatch<React.SetStateAction<SchedulePresetObject[]>>
) => {
	console.log(presets)
	const newFilteredSchedule: SchedulePresetObject[] = newSchedule.reduce((acc, item) => {
		const matchingPreset = presets.filter(preset =>
			(item.rewards.reward_type === 'Reactor' &&
				item.rewards.reactor_element_type === preset.element &&
				item.rewards.weapon_rounds_type === (preset.ammoType + ' Rounds') &&
				item.rewards.arche_type === preset.skillType)
		);

		if (matchingPreset.length > 0) {
			console.log(matchingPreset)
			acc.push({ ...item, title: matchingPreset.map(mp => mp.title), type: 'Reactor' });
		} else if (item.rewards.reward_type !== 'Reactor') {
			acc.push({ ...item, title: [item.rewards.reward_type], type: item.rewards.reward_type});
		}

		return acc;
	}, [] as SchedulePresetObject[]);

	newFilteredSchedule.sort((a, b) => {
		const aIsReactor = a.type === 'Reactor';
		const bIsReactor = b.type === 'Reactor';
		return aIsReactor === bIsReactor ? 0 : aIsReactor ? 1 : -1;
	});

	setFilteredSchedule(newFilteredSchedule);
}

const FarmRotationComponent: React.FC = () => {
	const [presets, setPresets] = useState<ItemPreset[]>([]);

	const [currentRotation, setCurrentRotation] = useState<number>(rotationRef);
	const [schedule, setSchedule] = useState<ScheduleObject[]>([]);
	const [filteredSchedule, setFilteredSchedule] = useState<SchedulePresetObject[]>([]);

	const weekInMillis = 7 * 24 * 60 * 60 * 1000;

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

		setCurrentRotation(currentRotation);

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
						setSchedule(newSchedule);
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
		<Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
			<ReactorPresets presets={presets} setPresets={setPresets} />
			<Typography variant="h6" sx={{ mt: 2 }}>Current Rotation: {currentRotation}</Typography>
			<RotationComponent presets={presets} schedule={filteredSchedule}/>
		</Container>
	);
};

export default FarmRotationComponent;