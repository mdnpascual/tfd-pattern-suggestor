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
				item.rewards.weapon_rounds_type === (preset.ammoType + ' Rounds') && (matchingLocation.secondaryAmmo === (preset.ammoType + ' Rounds') || matchingLocation.secondaryAmmo === "*") &&
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

		remainingPresets = presets.filter(preset =>
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
		const aCombinedLength = a.combined.length;
		const bCombinedLength = b.combined.length;

		// Sort by combined length first
		if (aCombinedLength !== bCombinedLength) {
			return bCombinedLength - aCombinedLength;
		}

		// Calculate scores for combined if lengths are equal
		const aScore = locationData[a.location].reactorPerMin + (locationData[a.location].secondaryReactorPerMin === 0 ? locationData[a.location].reactorPerMin * estimateSecondaryRatio : locationData[a.location].secondaryReactorPerMin);
		const bScore = locationData[b.location].reactorPerMin + (locationData[b.location].secondaryReactorPerMin === 0 ? locationData[b.location].reactorPerMin * estimateSecondaryRatio : locationData[b.location].secondaryReactorPerMin);
		if (aScore !== bScore && aCombinedLength !== 0) {
			return bScore - aScore;
		}

		const aRotationLength = a.rotation.length;
		const bRotationLength = b.rotation.length;

		// Sort by rotation length if scores are equal
		if (aRotationLength !== bRotationLength) {
			return bRotationLength - aRotationLength;
		}

		// Compare scores for rotation if lengths are equal
		const aRotationScore = locationData[a.location].reactorPerMin;
		const bRotationScore = locationData[b.location].reactorPerMin;
		if (aRotationScore !== bRotationScore && aRotationLength !== 0) {
			return bRotationScore - aRotationScore;
		}

		const aStaticLength = a.static.length;
		const bStaticLength = b.static.length;

		// Sort by static length if rotation scores are equal
		if (aStaticLength !== bStaticLength) {
			return bStaticLength - aStaticLength;
		}

		// Compare scores for static if lengths are equal
		const aSecondaryScore = (locationData[a.location].secondaryReactorPerMin === 0 ? locationData[a.location].reactorPerMin * estimateSecondaryRatio : locationData[a.location].secondaryReactorPerMin);
		const bSecondaryScore = (locationData[b.location].secondaryReactorPerMin === 0 ? locationData[b.location].reactorPerMin * estimateSecondaryRatio : locationData[b.location].secondaryReactorPerMin);
		return bSecondaryScore - aSecondaryScore;
	});

	setFilteredSchedule(newFilteredSchedule);
}

export default SortSchedule;