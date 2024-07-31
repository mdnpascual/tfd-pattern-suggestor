import '../App.css'
import PageWithSidebarComponent from './PageWithSidebar';
import CharacterRawData from '../data/characters.json';
import { Characters } from '../data/constants';
import RectangularBox from './RectangularBox';

const CharacterList = () => {
	const characterData = CharacterRawData as Characters;
	const characterList = Object.keys(characterData);
	return <div className="rectangular-box-grid">
		{characterList.map((character) => (
			<RectangularBox
				title={character}
				backgroundImage={characterData[character as keyof Characters].img}
				outlineColor={'#FFF'}
				items={characterData[character as keyof Characters].parts.map(part => {return {name: part.name, mats: part.mats}})}/>
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