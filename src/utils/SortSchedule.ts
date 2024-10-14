import { LocationData } from '../components/Rotation';
import { ItemPreset, ItemPresetBestLocation, ItemPresetCategory, ScheduleObject, SchedulePresetObject, createItemPresetCategory, estimateSecondaryRatio } from '../data/constants';
import LocationRawData from '../data/locations.json';
const locationData = LocationRawData as Record<string, LocationData>;

const CheckBestLocation = (
	list: ItemPresetBestLocation[],
	schedule: ScheduleObject,
	matchedPresets: ItemPresetCategory[]
) => {
	matchedPresets.forEach((preset) => {
		const inListIndex = list.findIndex((item) => item.title === preset.title);
		const dropRate = preset.isCombined
			? locationData[schedule.location].reactorPerMin + (locationData[schedule.location].secondaryReactorPerMin === 0 ? locationData[schedule.location].reactorPerMin * estimateSecondaryRatio : locationData[schedule.location].secondaryReactorPerMin)
			: preset.isRotation
				? locationData[schedule.location].reactorPerMin
				: preset.isStatic
					? (locationData[schedule.location].secondaryReactorPerMin === 0 ? locationData[schedule.location].reactorPerMin * estimateSecondaryRatio : locationData[schedule.location].secondaryReactorPerMin)
					: 0;

		if (inListIndex === -1) {
			list.push({
				...preset,
				location: schedule.location,
				dropRate: dropRate
			})
		} else {
			if (dropRate > list[inListIndex].dropRate) {
				list[inListIndex].location = schedule.location
				list[inListIndex].dropRate = dropRate
			}
		}
	})
	return list;
}

const SortSchedule = (
	presets: ItemPreset[],
	newSchedule: ScheduleObject[],
	showAll: boolean,
	ignoreStatic: boolean,
	filterDropRate: string,
	setFilteredSchedule: React.Dispatch<React.SetStateAction<SchedulePresetObject[]>>,
	setPresetBestLocation: React.Dispatch<React.SetStateAction<ItemPresetBestLocation[]>>
) => {
	let presetBestLocation: ItemPresetBestLocation[] = [];
	const newFilteredSchedule: SchedulePresetObject[] = newSchedule.reduce((acc, item) => {

		const matchingLocation = locationData[item.location]
		const filteredDropRate = parseFloat(filterDropRate);

		const matchedCombined = presets.filter(preset =>
			(item.rewards.reward_type === 'Reactor' &&
				item.rewards.reactor_element_type === preset.element && matchingLocation.secondaryElement === preset.element &&
				(item.rewards.weapon_rounds_type === (preset.ammoType + ' Rounds') || matchingLocation.secondaryAmmo === "*") && (matchingLocation.secondaryAmmo === (preset.ammoType + ' Rounds') || matchingLocation.secondaryAmmo === "*") &&
				item.rewards.arche_type === preset.skillType && matchingLocation.secondarySkill === preset.skillType &&
				(isNaN(filteredDropRate) || (!isNaN(filteredDropRate) && matchingLocation.reactorPerMin + (matchingLocation.secondaryReactorPerMin === 0 ? (matchingLocation.reactorPerMin * estimateSecondaryRatio) : matchingLocation.secondaryReactorPerMin) >= filteredDropRate)))
		);

		let remainingPresets = presets.filter(preset =>
			!matchedCombined.map(preset => preset.element).includes(preset.element)
		);

		const matchedRotation = remainingPresets.filter(preset =>
			(item.rewards.reward_type === 'Reactor' &&
				item.rewards.reactor_element_type === preset.element &&
				item.rewards.weapon_rounds_type === (preset.ammoType + ' Rounds') &&
				item.rewards.arche_type === preset.skillType &&
				(isNaN(filteredDropRate) || (!isNaN(filteredDropRate) && matchingLocation.reactorPerMin >= filteredDropRate)))
		);

		remainingPresets = remainingPresets.filter(preset =>
			!matchedRotation.map(preset => preset.element).includes(preset.element)
		);

		const matchedStatic = ignoreStatic ? [] : remainingPresets.filter(preset =>
			(item.rewards.reward_type === 'Reactor' &&
				matchingLocation.secondaryElement === preset.element &&
				(matchingLocation.secondaryAmmo === (preset.ammoType + ' Rounds') || matchingLocation.secondaryAmmo === "*") &&
				matchingLocation.secondarySkill === preset.skillType &&
				(isNaN(filteredDropRate) || (!isNaN(filteredDropRate) && ((matchingLocation.secondaryReactorPerMin === 0 ? (matchingLocation.reactorPerMin * estimateSecondaryRatio)  : matchingLocation.secondaryReactorPerMin ) >= filteredDropRate))))
		);

		presetBestLocation = CheckBestLocation(presetBestLocation, item, [
			...matchedCombined.map((item) => ({ ...createItemPresetCategory(item), isCombined: true })),
			...matchedRotation.map((item) => ({ ...createItemPresetCategory(item), isRotation: true })),
			...matchedStatic.map((item) => ({ ...createItemPresetCategory(item), isStatic: true }))
		])

		if (showAll && item.rewards.reward_type === 'Reactor') {
			if (Math.max(matchingLocation.reactorPerMin, (matchingLocation.secondaryReactorPerMin === 0 ? (matchingLocation.reactorPerMin * estimateSecondaryRatio) : matchingLocation.secondaryReactorPerMin)) >= filteredDropRate) {
				acc.push({ ...item,
					rotation: matchedRotation.map(mp => mp.title),
					combined: matchedCombined.map(mp => mp.title),
					static: matchedStatic.map(mp => mp.title),
					type: 'Reactor' });
			}
		} else if (matchedCombined.length + matchedRotation.length + matchedStatic.length > 0) {
			acc.push({ ...item,
				rotation: matchedRotation.map(mp => mp.title),
				combined: matchedCombined.map(mp => mp.title),
				static: matchedStatic.map(mp => mp.title),
				type: 'Reactor' });
		} else if (item.rewards.reward_type !== 'Reactor') {
			acc.push({ ...item,
				rotation: [item.rewards.reward_type],
				combined: [],
				static: matchedStatic.map(mp => mp.title),
				type: item.rewards.reward_type});
		}

		return acc;
	}, [] as SchedulePresetObject[]);

	newFilteredSchedule.sort((a, b) => {
		const aTotalLength = a.combined.length + a.rotation.length + a.static.length;
		const bTotalLength = b.combined.length + b.rotation.length + b.static.length;

		const aCombinedScore = locationData[a.location].reactorPerMin + (locationData[a.location].secondaryReactorPerMin === 0 ? locationData[a.location].reactorPerMin * estimateSecondaryRatio : locationData[a.location].secondaryReactorPerMin);
		const bCombinedScore = locationData[b.location].reactorPerMin + (locationData[b.location].secondaryReactorPerMin === 0 ? locationData[b.location].reactorPerMin * estimateSecondaryRatio : locationData[b.location].secondaryReactorPerMin);

		const aRotationScore = locationData[a.location].reactorPerMin;
		const bRotationScore = locationData[b.location].reactorPerMin;

		const aSecondaryScore = (locationData[a.location].secondaryReactorPerMin === 0 ? locationData[a.location].reactorPerMin * estimateSecondaryRatio : locationData[a.location].secondaryReactorPerMin);
		const bSecondaryScore = (locationData[b.location].secondaryReactorPerMin === 0 ? locationData[b.location].reactorPerMin * estimateSecondaryRatio : locationData[b.location].secondaryReactorPerMin);

		const aTotalScore = (a.combined.length * aCombinedScore) + (a.rotation.length * aRotationScore) + (a.static.length * aSecondaryScore)
		const bTotalScore = (b.combined.length * bCombinedScore) + (b.rotation.length * bRotationScore) + (b.static.length * bSecondaryScore)
		return bTotalScore - aTotalScore;
	});

	presetBestLocation.sort((a,b) => {
		return b.dropRate - a.dropRate
	})

	setFilteredSchedule(newFilteredSchedule);
	setPresetBestLocation(presetBestLocation);
}

export default SortSchedule;