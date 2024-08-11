import CharacterRawData from '../data/characters.json';
import WeaponRawData from '../data/weapons.json';
import EnhancementRawData from '../data/enhancements.json';
import PatternRawData from '../data/patterns.json';
import { CategoryData } from "../components/CategoryList";
import { Item } from "../components/MultiSelectList";
import { Pattern, Material, GearPart } from "../data/constants";

const GenerateSuggestion = () => {
	let selectedItemsToBeSaved: string[] = []
	let itemPriorityToBeSaved: number[] = []

	let items: Item[] = []
	const patternData: Record<string, Pattern> = PatternRawData;

	Object.entries(patternData).forEach(([key, data]) => {
		data.drops.forEach((drop) => {
			if (!items.find(item => item.label === drop.name)){
				items.push({id: key + drop.name, label: drop.name, priority: 1})
			}
		})
	});

	const itemLabels = items.map((item) => item.label);

	const characterStorage = localStorage.getItem('characterStatus');
	const characterStatus = characterStorage ? JSON.parse(characterStorage) : undefined;
	const weaponStorage = localStorage.getItem('weaponStatus');
	const weaponStatus = weaponStorage ? JSON.parse(weaponStorage) : undefined;
	const enhancementStorage = localStorage.getItem('enhancementStatus');
	const enhancementStatus = enhancementStorage ? JSON.parse(enhancementStorage) : undefined;

	const materialStorage = localStorage.getItem('materialCount');
	const materialStatus = materialStorage ? JSON.parse(materialStorage) : undefined;

	if (!characterStatus){
		throw new Error("Failed to read Characters. This shouldn't happen");
	}

	if (!weaponStatus){
		throw new Error("Failed to read Weapons. This shouldn't happen");
	}

	if (!enhancementStatus){
		throw new Error("Failed to read Enhancements. This shouldn't happen");
	}

	if(!materialStatus){
		throw new Error("Failed to read Materials. This shouldn't happen")
	}

	const characterData = CharacterRawData as Record<string, CategoryData>
	Object.entries(characterData).forEach(([key, data]) => {
		if(!characterStatus[key]){	// Unowned
			let relatedItems: Material[] = [];
			data.parts.forEach((part: GearPart) => {
				const parentQuantity = materialStatus[part.name] ?? 0;
				if (parentQuantity === 0) {
					part.mats?.forEach((mat: Material) => {
						if (itemLabels.includes(mat.name)){
							relatedItems.push(mat)
						}
					});
				}
			});
			const unownedItems = relatedItems.filter((item) => {
				if (materialStatus[item.name]){
					return materialStatus[item.name] <= 0
				}
				return true
			})
			unownedItems.forEach((unowned) => {
				const matchedItem = items.find(item => item.label === unowned.name);
				if (matchedItem) {
					selectedItemsToBeSaved.push(matchedItem.id)
					itemPriorityToBeSaved.push(5 - unownedItems.length)
				}
			})

		}

	});

	const weaponData = WeaponRawData as Record<string, CategoryData>
	Object.entries(weaponData).forEach(([key, data]) => {
		if(!weaponStatus[key]){	// Unowned
			const goal = materialStatus[key] ?? 5;
			if (goal) {
				let relatedItems: Material[] = [];
				data.parts.forEach((part: GearPart) => {
					const parentQuantity = materialStatus[part.name] ?? 0;
					if (parentQuantity < goal){
						part.mats?.forEach((mat: Material) => {
							if (itemLabels.includes(mat.name)){
								relatedItems.push(mat)
							}
						});
					}
				});
				const unownedItems = relatedItems.filter((item) => {
					if (materialStatus[item.name]){
						return materialStatus[item.name] <= 0
					}
					return true
				})
				unownedItems.forEach((unowned) => {
					const matchedItem = items.find(item => item.label === unowned.name);
					if (matchedItem) {
						selectedItemsToBeSaved.push(matchedItem.id)
						itemPriorityToBeSaved.push(5 - unownedItems.length)
					}
				})
			}
		}
	});

	const enhancementData = EnhancementRawData as Record<string, CategoryData>
	Object.entries(enhancementData).forEach(([key, data]) => {
		if(!enhancementStatus[key]){	// Unowned
			const goal = materialStatus[key] ?? 5;
			if (goal) {
				let relatedItems: Material[] = [];
				data.parts.forEach((part: GearPart) => {
					const parentQuantity = materialStatus[part.name] ?? 0;
					if (parentQuantity < goal) {
						part.mats?.forEach((mat: Material) => {
							if (itemLabels.includes(mat.name)){
								relatedItems.push(mat)
							}
						});
					}
				});

				const unownedItems = relatedItems.filter((item) => {
					if (materialStatus[item.name]){
						return materialStatus[item.name] <= 0
					}
					return true
				})

				unownedItems.forEach((unowned) => {
					const matchedItem = items.find(item => item.label === unowned.name);
					if (matchedItem) {
						selectedItemsToBeSaved.push(matchedItem.id)
						itemPriorityToBeSaved.push(5 - unownedItems.length)
					}
				})
			}
		}
	});

	localStorage.setItem('selectedItems', JSON.stringify(selectedItemsToBeSaved));
	localStorage.setItem('itemPriority', JSON.stringify(itemPriorityToBeSaved));
}

export default GenerateSuggestion