import '../App.css'
import PageWithSidebarComponent from './PageWithSidebar';
import CharacterRawData from '../data/characters.json';
import { Characters } from '../data/constants';
import RectangularBox from './RectangularBox';
import { useState } from 'react';
import MaterialPlanner from './MaterialPlanner';
import { Typography } from '@mui/material';

const CharacterList = () => {
	const savedCharacterStatus = localStorage.getItem('characterStatus');
	let initialCharacterStatus: Record<string, boolean>;
	if (savedCharacterStatus){
		initialCharacterStatus = JSON.parse(savedCharacterStatus);
	}
	const [selected, setSelected] = useState<string>('');

	const characterData = CharacterRawData as Characters;

	const characterList = Object.keys(characterData).sort();
	const [characterStatus, setCharacterStatus] = useState<Record<string, boolean>>(
		characterList.reduce((acc, character) => {
			acc[character] = initialCharacterStatus && character in initialCharacterStatus ? initialCharacterStatus[character] : false;
			return acc;
	}, {} as Record<string, boolean>));

	const handleSelected = (item: string) => {
		setSelected(item)
	};

	const handleOwned = (item: string) => {
		console.log("WOT", item)
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

	const handleMatCountChange = (itemName: string, newCount: number) => {
		// TODO
	}
	const handlePriorityChange = () => {
		// TODO
	}

	return <div className="rectangular-box-grid">
		<Typography variant="h3" sx={{ mb: 2 }}>WIP WIP WIP</Typography>
		{characterList.map((character) => (
			<div>
				{selected === character && (
					<div className="character-list-overlay">
						<button className="overlay-close-button" onClick={() => setSelected("")}>X</button>
						<MaterialPlanner
							title={character}
							parts={characterData[character as keyof Characters].parts}
							stock={[{name:"", stock: 1}]}
							onMatCountChange={handleMatCountChange}
							onPriorityChange={handlePriorityChange}
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
const ComponentB = () => <div>Weapon List Content (WIP)</div>;

const GearComponent = () => {

	return (
		<PageWithSidebarComponent
			items={[
				{
					label: 'Descendants',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/3abbdecc406856f017166f73ff96aaf7',
					Component: <CharacterList />
				},
				{
					label: 'Weapons',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/c68f037038b03f1f28a668ef2eb55b85',
					Component: <ComponentB />
				}
			]}
		/>
	);
};

export default GearComponent;