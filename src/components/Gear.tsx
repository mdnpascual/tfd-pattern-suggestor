import '../App.css'
import PageWithSidebarComponent from './PageWithSidebar';
import CharacterRawData from '../data/characters.json';
import { Characters } from '../data/constants';
import RectangularBox from './RectangularBox';
import { useState } from 'react';
import MaterialPlanner from './MaterialPlanner';

const CharacterList = () => {
	const [selected, setSelected] = useState<string>('');

	const characterData = CharacterRawData as Characters;
	const characterList = Object.keys(characterData);

	const handleSelected = (item: string) => {
		setSelected(item)
	};

	const handleQuantityChange = (itemName: string, newQuantity: number) => {

	}
	const handlePriorityChange = () => {

	}
	const handleOwnershipToggle = (itemName: string) => {

	}

	// return <div>Character List Content (WIP)</div>
	return <div className="rectangular-box-grid">
		{characterList.map((character) => (
			<div>
				{selected === character && (
					<div className="character-list-overlay">
						<button className="overlay-close-button" onClick={() => setSelected("")}>X</button>
						<MaterialPlanner
							parts={characterData[character as keyof Characters].parts}
							stock={[{name:"", stock: 1}]}
							onQuantityChange={handleQuantityChange}
							onPriorityChange={handlePriorityChange}
							onOwnershipToggle={handleOwnershipToggle}/>
					</div>
				)}
				<div>
					<RectangularBox
						title={character}
						backgroundImage={characterData[character as keyof Characters].img}
						outlineColor={'#FFF'}
						items={characterData[character as keyof Characters].parts.map(part => {return {name: part.name, mats: part.mats}})}
						xOffset={characterData[character as keyof Characters].xOffset}
						yOffset={characterData[character as keyof Characters].yOffset}
						onSelect={handleSelected}/>
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