import '../App.css'
// import CharacterList from './CharacterList';
import PageWithSidebarComponent from './PageWithSidebar';
import CharacterRawData from '../data/characters.json';
import WeaponRawData from '../data/weapons.json';
import CategoryList from './CategoryList';

const ComponentC = () => <div>Enhancement List Content (WIP)</div>;

const GearComponent = () => {
	return (
		<PageWithSidebarComponent
			items={[
				{
					label: 'Descendants',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/3abbdecc406856f017166f73ff96aaf7',
					Component: <CategoryList
									data={CharacterRawData}
									localStorageStatusKey={'characterStatus'}
									localStorageMaterialKey={'materialCount'}
								/>
				},
				{
					label: 'Weapons',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/c68f037038b03f1f28a668ef2eb55b85',
					Component: <CategoryList
						data={WeaponRawData}
						localStorageStatusKey={'weaponStatus'}
						localStorageMaterialKey={'materialCount'}
						withQuantity
					/>
				},
				{
					label: 'Enhancements',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/7721eedef87ad6fb392af98d2e927fcb',
					Component: <ComponentC />
				}
			]}
		/>
	);
};

export default GearComponent;