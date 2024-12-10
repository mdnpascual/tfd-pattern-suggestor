import { FilterProps } from "../components/CheckboxFilter";

export const filterOptions: FilterProps[] = [
	{label: 'Normal', tooltip: "Adds Patterns in Normal Difficulty"},
	{label: 'Hard', tooltip: "Adds Patterns in Hard Difficulty"},
	{label: 'Collosus', tooltip: "Filters Patterns only useable in Collosus"},
	{label: 'Special Ops', tooltip: "Filters Patterns that only drops in Special Ops"},
	{label: 'Void Reactor', tooltip: "Filters Patterns only useable in Void Reactors"},
	{label: 'Sharen Exclusive', tooltip: "Filters Patterns that only drops with Sharen's succesful infiltration"},
];

export const collosusOptions: FilterProps[] = [
	{label: 'Grave Walker', tooltip: "Only Show Patterns useable by beating Grave Walker"},
	{label: 'Stunning Beauty', tooltip: "Only Show Patterns useable by beating Stunning Beauty"},
	{label: 'Executioner', tooltip: "Only Show Patterns useable by beating Executioner"},
	{label: 'Dead Bride', tooltip: "Only Show Patterns useable by beating Dead Bride"},
	{label: 'Devourer', tooltip: "Only Show Patterns useable by beating Devourer"},
	{label: 'Pyromaniac', tooltip: "Only Show Patterns useable by beating Pyromaniac"},
	{label: 'Swamp Walker', tooltip: "Only Show Patterns useable by beating Swamp Walker"},
	{label: 'Hanged Man', tooltip: "Only Show Patterns useable by beating Hanged Man"},
	{label: 'Obstructer', tooltip: "Only Show Patterns useable by beating Obstructer"},
	{label: 'Frost Walker', tooltip: "Only Show Patterns useable by beating Frost Walker"},
	{label: 'Molten Fortress', tooltip: "Only Show Patterns useable by beating Molten Fortress"},
	{label: 'Gluttony', tooltip: "Only Show Patterns useable by beating Gluttony"}
]

export interface VoidFusionLocations {
	"Kingston (Normal) - Grand Square: Void Fusion Reactor": VoidFusionLocationsProp;
	"Sterile Land (Normal) - Rockfall: Void Fusion Reactor": VoidFusionLocationsProp;
	"Sterile Land (Normal) - The Repository: Void Fusion Reactor": VoidFusionLocationsProp;
	"Sterile Land (Normal) - Restriction Zone: Void Fusion Reactor": VoidFusionLocationsProp;
	"Vespers (Normal) - The Ruins: Void Fusion Reactor": VoidFusionLocationsProp;
	"Vespers (Normal) - Lost Supply Depot: Void Fusion Reactor": VoidFusionLocationsProp;
	"Vespers (Normal) - Moonlight Lake: Void Fusion Reactor": VoidFusionLocationsProp;
	"Echo Swamp (Normal) - Musket Swamp: Void Fusion Reactor": VoidFusionLocationsProp;
	"Echo Swamp (Normal) - Derelict Covert: Void Fusion Reactor": VoidFusionLocationsProp;
	"Agna Desert (Normal) - Vermillion Waste: Void Fusion Reactor": VoidFusionLocationsProp;
	"Agna Desert (Normal) - The Storage: Void Fusion Reactor": VoidFusionLocationsProp;
	"Agna Desert (Normal) - Miragestone Deposit: Void Fusion Reactor": VoidFusionLocationsProp;
	"White-night Gulch (Normal) - The Mountaintops: Void Fusion Reactor": VoidFusionLocationsProp;
	"White-night Gulch (Normal) - Observatory: Void Fusion Reactor": VoidFusionLocationsProp;
	"White-night Gulch (Normal) - Hatchery: Void Fusion Reactor": VoidFusionLocationsProp;
	"Hagios (Normal) - Dune Base: Void Fusion Reactor": VoidFusionLocationsProp;
	"Hagios (Normal) - The Corrupted Zone: Void Fusion Reactor": VoidFusionLocationsProp;
	"Hagios (Normal) - Fractured Monolith: Void Fusion Reactor": VoidFusionLocationsProp;
	"Fortress (Normal) - Frozen Valley: Void Fusion Reactor": VoidFusionLocationsProp;
	"Fortress (Normal) - Fallen Ark: Void Fusion Reactor": VoidFusionLocationsProp;
	"Fortress (Normal) - Defense Line: Void Fusion Reactor": VoidFusionLocationsProp;
	"Kingston (Hard) - Grand Square: Void Fusion Reactor": VoidFusionLocationsProp;
	"Sterile Land (Hard) - Rockfall: Void Fusion Reactor": VoidFusionLocationsProp;
	"Sterile Land (Hard) - The Repository: Void Fusion Reactor": VoidFusionLocationsProp;
	"Sterile Land (Hard) - Restriction Zone: Void Fusion Reactor": VoidFusionLocationsProp;
	"Vespers (Hard) - The Ruins: Void Fusion Reactor": VoidFusionLocationsProp;
	"Vespers (Hard) - Lost Supply Depot: Void Fusion Reactor": VoidFusionLocationsProp;
	"Vespers (Hard) - Moonlight Lake: Void Fusion Reactor": VoidFusionLocationsProp;
	"Echo Swamp (Hard) - Musket Swamp: Void Fusion Reactor": VoidFusionLocationsProp;
	"Echo Swamp (Hard) - Derelict Covert: Void Fusion Reactor": VoidFusionLocationsProp;
	"Agna Desert (Hard) - Vermillion Waste: Void Fusion Reactor": VoidFusionLocationsProp;
	"Agna Desert (Hard) - The Storage: Void Fusion Reactor": VoidFusionLocationsProp;
	"Agna Desert (Hard) - Miragestone Deposit: Void Fusion Reactor": VoidFusionLocationsProp;
	"White-night Gulch (Hard) - The Mountaintops: Void Fusion Reactor": VoidFusionLocationsProp;
	"White-night Gulch (Hard) - Observatory: Void Fusion Reactor": VoidFusionLocationsProp;
	"White-night Gulch (Hard) - Hatchery: Void Fusion Reactor": VoidFusionLocationsProp;
	"Hagios (Hard) - Dune Base: Void Fusion Reactor": VoidFusionLocationsProp;
	"Hagios (Hard) - The Corrupted Zone: Void Fusion Reactor": VoidFusionLocationsProp;
	"Hagios (Hard) - Fractured Monolith: Void Fusion Reactor": VoidFusionLocationsProp;
	"Fortress (Hard) - Frozen Valley: Void Fusion Reactor": VoidFusionLocationsProp;
	"Fortress (Hard) - Fallen Ark: Void Fusion Reactor": VoidFusionLocationsProp;
	"Fortress (Hard) - Defense Line: Void Fusion Reactor": VoidFusionLocationsProp;
}

interface VoidFusionLocationsProp {
	"drops": VoidFusionLocationsPropData[]
}

interface VoidFusionLocationsPropData {
	"type": "Inorganic" | "Organic" | "Monomer" | "Polymer";
	"count": number
}

export interface Characters {
	"Gley": GearProp;
	"Jayber": GearProp;
	"Lepic": GearProp;
	"Viessa": GearProp;
	"Ajax": GearProp;
	"Ultimate Lepic": GearProp;
	"Valby": GearProp;
	"Kyle": GearProp;
	"Ultimate Viessa": GearProp;
	"Yujin": GearProp;
	"Ultimate Gley": GearProp;
	"Enzo": GearProp;
	"Ultimate Bunny": GearProp;
	"Esiemo": GearProp;
	"Ultimate Ajax": GearProp;
	"Bunny": GearProp;
	"Freyna": GearProp;
	"Sharen": GearProp;
	"Blair": GearProp;
}

export interface Weapons {
	"Smithereens": GearProp;
	"Greg\u0027s Reversed Fate": GearProp;
	"Blue Beetle": GearProp;
	"Restored Relic": GearProp;
	"Divine Punishment": GearProp;
	"The Final Masterpiece": GearProp;
	"Nazeistra\u0027s Devotion": GearProp;
	"Perforator": GearProp;
	"Executor": GearProp;
	"Python": GearProp;
	"Enduring Legacy": GearProp;
	"Albion Cavalry Gun": GearProp;
	"Secret Garden": GearProp;
	"Wave of Light": GearProp;
	"Afterflow Sword": GearProp;
	"Piercing Light": GearProp;
	"King\u0027s Guard Lance": GearProp;
	"Thunder Cage": GearProp;
	"The Last Dagger": GearProp;
	"Fallen Hope": GearProp;
	"Clairvoyance": GearProp;
}

interface GearProp {
	"parts": GearPart[];
	"img": string;
	"xOffset": number;
	"yOffset": number;
	"flipHorizontal"?: boolean;
	"scale"?: number;
}

export interface GearPart {
	"name": string;
	"mats"?: Material[];
}

export interface Material {
	"name": string;
	"quantity": number;
}

export interface MaterialPair {
	"parent": GearPart;
	"item": Material;
}

export interface Pattern {
	drops: DropList[],
	dropsFrom: string,
	useIn: string
}

export interface DropList {
	chance: number,
	name: string,
}

export interface MaterialUsageData {
	parent: string,
	part: string,
	baseCount: number,
	goal: number
}

export interface ItemPreset {
	title: string;
	element: string;
	ammoType?: string;
	skillType: string;
}

export interface ItemPresetBestLocation extends ItemPreset {
	location: string;
	dropRate: number;
	bestMission: string;
}

export interface ItemPresetCategory extends ItemPreset {
	isCombined: boolean;
	isRotation: boolean;
	isStatic: boolean;
}

export const createItemPresetCategory = (preset: ItemPreset): ItemPresetCategory => {
	return {
		...preset,
		isCombined: false,
		isRotation: false,
		isStatic: false,
	};
}

export interface Reward {
	rotation: number;
	reward_type: string;
	reactor_element_type: string;
	weapon_rounds_type: string;
	arche_type: string;
}

export interface LocationReward {
	[location: string]: {
		rewards: Reward[];
	};
}

export interface ScheduleObject {
	location: string;
	rewards: Reward;
}

export interface SchedulePresetObject extends ScheduleObject {
	combined: string[];
	rotation: string[];
	static: string[];
	type: string;
}

export const specOpsKeywords = [
	'defend albion resource',
	'neutralize void experiment',
	'block kuiper mining'
]

const baseKeys = [
	'selectedItems',
	'selectedFilters',
	'itemPriority',
	'characterStatus',
	'materialCount',
	'selectedCollossusFilters',
	'weaponStatus',
	'enhancementStatus',
	'percentileValues',
	'finishedGearTutorial',
	'customItemPriority',
	'respectUserPriority',
	'suggestUntilQuantityReached',
	'realTimeSuggestor',
	'reactorPresets',
	'reactorPresetsAccordion',
	'reactorPresetsSummaryAccordion',
	'reactorPresetsLocationAccordion',
	'reactorPresetsWeaponAccordion',
	'reactorPresetsShowAll',
	'reactorPresetsIgnoreStatic',
	'reactorPresetsFilterDropRate'
] as const;

export type SaveData = {
	[K in typeof baseKeys[number]]?: string;
};

export const localStorageKeys: Array<keyof SaveData> = [...baseKeys];

export type BackupData = {
	[K in keyof SaveData as `${K}Backup`]?: string;
};

export const localStorageBackupKeys: Array<keyof BackupData> = baseKeys.map(key => `${key}Backup` as keyof BackupData);

export const joyrideStyles = {
	options: {
		arrowColor: '#333', // Dark background color
		backgroundColor: '#333', // Dark background color
		textColor: '#fff', // White text color
		primaryColor: '#1a73e8', // Accent color for buttons and highlights
		spotlightShadow: '0 0 15px rgba(255, 255, 255, 0.5)', // Soft white spotlight
		overlayColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay background
		zIndex: 1000, // Ensures the tutorial is on top of other elements
	},
	buttonNext: {
		backgroundColor: '#1a73e8', // Dark blue next button
		color: '#fff',
	},
	buttonBack: {
		color: '#fff', // White back button
	},
	buttonClose: {
		color: '#fff', // White close button
	},
};

export const defaultReactorPresets = [
	{
		"title": "Bunny",
		"element": "Electric",
		"skillType": "Singular"
	},
	{
		"title": "Lepic",
		"element": "Fire",
		"skillType": "Tech"
	},
	{
		"title": "Gley/Valby/Enzo",
		"element": "Non-Attribute",
		"skillType": "Dimension"
	},
	{
		"title": "Hailey",
		"element": "Chill",
		"skillType": "Singular"
	},
	{
		"title": "Sharen",
		"element": "Electric",
		"skillType": "Fusion"
	},
	{
		"title": "Freyna",
		"element": "Toxic",
		"skillType": "Tech"
	}
]

export const ELEMENTS_COLOR_MAP: Record<string, { backgroundColor: string; borderColor: string }> = {
	Fire: {
		backgroundColor: 'rgba(144, 30, 45, 0.4)',
		borderColor: 'rgba(237, 36, 58, 1.0)'
	},
	Chill: {
		backgroundColor: 'rgba(160, 240, 247, 0.4)',
		borderColor: 'rgba(95, 231, 243, 1.0)'
	},
	Electric: {
		backgroundColor: 'rgba(0, 51, 102, 0.4)',
		borderColor: 'rgba(87, 147, 216, 1.0)'
	},
	Toxic: {
		backgroundColor: 'rgba(73, 122, 22, 0.4)',
		borderColor: 'rgba(4, 251, 4, 1.0)'
	},
	'Non-Attribute': {
		backgroundColor: 'rgba(255, 255, 255, 0.4)',
		borderColor: 'rgba(255, 255, 255, 1.0)'
	},
};

export const WEAPONS_COLOR_MAP: Record<string, { backgroundColor: string; borderColor: string }> = {
	General: {
		backgroundColor: 'rgba(255, 255, 255, 0.4)',
		borderColor: 'rgba(255, 255, 255, 1.0)'
	},
	Impact: {
		backgroundColor: 'rgba(73, 122, 22, 0.4)',
		borderColor: 'rgba(4, 251, 4, 1.0)'
	},
	Special: {
		backgroundColor: 'rgba(255, 165, 0, 0.4)',
		borderColor: 'rgba(255, 140, 0, 1.0)'
	},
	'High-Power': {
		backgroundColor: 'rgba(128, 0, 128, 0.4)',
		borderColor: 'rgba(75, 0, 130, 1.0)'
	},
};

export const ELEMENTS = ['Fire', 'Chill', 'Electric', 'Toxic', 'Non-Attribute'] as const;
export const AMMO_TYPES = ['General', 'Impact', 'Special', 'High-Power'] as const;
export const SKILL_TYPES = ['Singular', 'Dimension', 'Fusion', 'Tech'] as const;

export type ElementType = typeof ELEMENTS[number];
export type AmmoType = typeof AMMO_TYPES[number];
export type SkillType = typeof SKILL_TYPES[number];

export const rewardsSchedulePath = 'https://api.github.com/gists/ac9fc987e97221569781549081c326e3';
export const rewardsFileName = 'reward_rotation.json'
export const rotationRef = 9;
export const rotationStartDate = new Date('2024-09-24T07:00:00Z').getTime();
export const weekly_unix_offset = 604800000

export const defaultStartingQuantity = 5;

export const dataKeywordNormal = '(normal)';
export const dataKeywordHard = '(hard)';
export const dataKeywordCollosus = 'void intercept battle';
export const dataKeywordSharen = '(successful infiltration)';
export const dataKeywordSharenModified = '(sharen)';
export const dataKeywordVoidReactor = 'void fusion reactor';
export const dataKeywordSpecOps = 'void fusion reactor';
export const dataKeywordDropsFromOutpost = 'vulgus strategic outpost'

export const patternNameToRemove = / AA| AB| AC/;
export const estimateSecondaryRatio = 0.70;