import { useState } from "react";
import { Characters, Material, GearPart } from "../data/constants";
import MaterialPlanner from "./MaterialPlanner";
import RectangularBox from "./RectangularBox";
import CharacterRawData from '../data/characters.json';

const CharacterList = () => {
	const savedCharacterStatus = localStorage.getItem('characterStatus');
	let initialCharacterStatus: Record<string, boolean>;
	if (savedCharacterStatus){
		initialCharacterStatus = JSON.parse(savedCharacterStatus);
	}

	const savedMaterialCount = localStorage.getItem('materialCount');
	let initialMaterialCount: Record<string, number>;
	if (savedMaterialCount){
		initialMaterialCount = JSON.parse(savedMaterialCount);
	}

	const [selected, setSelected] = useState<string>('');

	const characterData = CharacterRawData as Characters;

	const characterList = Object.keys(characterData).sort();
	const [characterStatus, setCharacterStatus] = useState<Record<string, boolean>>(
		characterList.reduce((acc, character) => {
			acc[character] = initialCharacterStatus && character in initialCharacterStatus ? initialCharacterStatus[character] : false;
			return acc;
	}, {} as Record<string, boolean>));

	let material: Material[] = []
	Object.entries(characterData).forEach(([key, data]) => {
		data.parts.forEach((part: GearPart) => {
			part.mats?.forEach((mat: Material) => {
				material.push(mat)
			})
		})
	});

	const materialList = material.map((item) => item.name).sort();
	const [materialCount, setMaterialCount] = useState<Record<string, number>>(
		materialList.reduce((acc, material) => {
			acc[material] = initialMaterialCount && material in initialMaterialCount ? initialMaterialCount[material] : 0;
			return acc;
	}, {} as Record<string, number>));

	const handleSelected = (item: string) => {
		setSelected(item)
	};

	const handleOwned = (item: string) => {
		const savedCharacterStatus = localStorage.getItem('characterStatus');
		let newCharacterStatus: Record<string, boolean>;
		if (savedCharacterStatus) {
			newCharacterStatus = JSON.parse(savedCharacterStatus);

		} else {
			newCharacterStatus = characterStatus
		}

		newCharacterStatus[item] = !newCharacterStatus[item];
		localStorage.setItem('characterStatus', JSON.stringify(newCharacterStatus));
		setCharacterStatus(newCharacterStatus);
		setSelected("")
	};

	const handleMatCountChange = (item: string, newCount: number) => {
		const savedMaterialCount = localStorage.getItem('materialCount');
		let newMaterialCount: Record<string, number>;
		if (savedMaterialCount) {
			newMaterialCount = JSON.parse(savedMaterialCount);

		} else {
			newMaterialCount = materialCount
		}

		newMaterialCount[item] = newCount;
		localStorage.setItem('materialCount', JSON.stringify(newMaterialCount));
		setMaterialCount(newMaterialCount);
	}

	return <div className="rectangular-box-grid">
		{characterList.map((character) => (
			<div>
				{selected === character && (
					<div className="character-list-overlay">
						<button className="overlay-close-button" onClick={() => setSelected("")}>X</button>
						<MaterialPlanner
							title={character}
							parts={characterData[character as keyof Characters].parts}
							stock={materialCount}
							onMatCountChange={handleMatCountChange}
							onOwned={handleOwned}/>
					</div>
				)}
				<div>
					<RectangularBox
						title={character}
						backgroundImage={characterData[character as keyof Characters].img}
						xOffset={characterData[character as keyof Characters].xOffset}
						yOffset={characterData[character as keyof Characters].yOffset}
						isDisabled={characterStatus[character]}
						onSelect={handleSelected}
						onOwned={handleOwned}/>
				</div>
			</div>
		))}
	</div>
};

export default CharacterList;