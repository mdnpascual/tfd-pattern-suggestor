import '../App.css'
import PageWithSidebarComponent from './PageWithSidebar';
import CharacterRawData from '../data/characters.json';
import WeaponRawData from '../data/weapons.json';
import EnhancementRawData from '../data/enhancements.json';
import BasicMaterialRawData from '../data/basicMaterials.json';
import CategoryList from './CategoryList';
import { usePreloadedData } from './PreloadedDataContext';

const GearComponent = () => {
	const { preloadedData, fetchPreloadedData } = usePreloadedData();

	const handleDataChange = () => {
		fetchPreloadedData();
	};

	return (
		<PageWithSidebarComponent
			onDataChanged={handleDataChange}
			items={[
				{
					label: 'Descendants',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/3abbdecc406856f017166f73ff96aaf7',
					Component: <CategoryList
						key='Descendants'
						data={CharacterRawData}
						localStorageStatusKey={'characterStatus'}
						localStorageMaterialKey={'materialCount'}
						preloadedData={preloadedData.character}
						onDataChange={handleDataChange}
					/>
				},
				{
					label: 'Weapons',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/c68f037038b03f1f28a668ef2eb55b85',
					Component: <CategoryList
						key='Weapons'
						data={WeaponRawData}
						localStorageStatusKey={'weaponStatus'}
						localStorageMaterialKey={'materialCount'}
						preloadedData={preloadedData.weapon}
						onDataChange={handleDataChange}
						withQuantity
					/>
				},
				{
					label: 'Enhancements',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/7721eedef87ad6fb392af98d2e927fcb',
					Component: <CategoryList
						key='Enhancements'
						data={EnhancementRawData}
						localStorageStatusKey={'enhancementStatus'}
						localStorageMaterialKey={'materialCount'}
						preloadedData={preloadedData.enhancement}
						onDataChange={handleDataChange}
						withQuantity
						disableOwnership
					/>
				},
				{
					label: '---',
					iconPath: '',
					Component: <div style={{ padding: '10px', textAlign: 'center', color: '#999' }}>--- Materials ---</div>
				},
				{
					label: 'Basic',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/28b5a1352177a3fd283a51ae014dccd6',
					Component: <CategoryList
						key='Enhancements'
						data={BasicMaterialRawData}
						localStorageStatusKey={'enhancementStatus'}
						localStorageMaterialKey={'materialCount'}
						preloadedData={preloadedData.basicMaterials}
						onDataChange={handleDataChange}
						withQuantity
						disableOwnership
						useMaterialBox
					/>
				}
			]}
		/>
	);
};

export default GearComponent;