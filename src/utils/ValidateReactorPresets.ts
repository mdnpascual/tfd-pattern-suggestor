import { ItemPreset } from '../data/constants';



const ValidateReactorPresets = (
	presets: ItemPreset[],
) => {
	const validPresets = presets.filter(item =>
		item.title !== undefined &&
		item.element !== undefined &&
		item.ammoType !== undefined &&
		item.skillType !== undefined
	);

	if (presets.length !== validPresets.length) {
		localStorage.setItem('reactorPresets', JSON.stringify(validPresets));
	}

	return validPresets
}

export default ValidateReactorPresets;