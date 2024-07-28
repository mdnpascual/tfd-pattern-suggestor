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
	{label: 'Molten Fortress', tooltip: "Only Show Patterns useable by beating Molten Fortress"}
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

export const specOpsKeywords = [
	'defend albion resource',
	'neutralize void experiment',
	'block kuiper mining'
]

export const dataKeywordNormal = '(normal)';
export const dataKeywordHard = '(hard)';
export const dataKeywordCollosus = 'void intercept battle';
export const dataKeywordSharen = '(successful infiltration)';
export const dataKeywordVoidReactor = 'void fusion reactor';
export const dataKeywordSpecOps = 'void fusion reactor';