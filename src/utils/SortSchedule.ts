import { LocationData } from '../components/Rotation';
import { ItemPreset, ScheduleObject, SchedulePresetObject, estimateSecondaryRatio } from '../data/constants';
import LocationRawData from '../data/locations.json';
const locationData = LocationRawData as Record<string, LocationData>;

const SortSchedule = (
	presets: ItemPreset[],
	newSchedule: ScheduleObject[],
	ignoreStatic: boolean,
	filterDropRate: string,
	setFilteredSchedule: React.Dispatch<React.SetStateAction<SchedulePresetObject[]>>
) => {
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

		if (matchedCombined.length + matchedRotation.length + matchedStatic.length > 0) {
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

		if (aTotalLength !== bTotalLength) {
			const aTotalScore = (a.combined.length * aCombinedScore) + (a.rotation.length * aRotationScore) + (a.static.length * aSecondaryScore)
			const bTotalScore = (b.combined.length * bCombinedScore) + (b.rotation.length * bRotationScore) + (b.static.length * bSecondaryScore)
			return bTotalScore - aTotalScore;
		}

		return bTotalLength - aTotalLength;
	});

	setFilteredSchedule(newFilteredSchedule);
}

export default SortSchedule;