import '../App.css'
import PageWithSidebarComponent from './PageWithSidebar';
import CharacterRawData from '../data/characters.json';
import WeaponRawData from '../data/weapons.json';
import EnhancementRawData from '../data/enhancements.json';
import BasicMaterialRawData from '../data/basicMaterials.json';
import CategoryList from './CategoryList';
import { useEffect, useState } from 'react';
import InitializeCategoryData from '../utils/InitializeCategoryData';
import InitializeMaterialData from '../utils/InitializeMaterialData';

const ComponentTODO = () => <div>Shard List Content (WIP)</div>;

const GearComponent = () => {
	const [preloadedData, setPreloadedData] = useState({
		character: {},
		weapon: {},
		enhancement: {},
		basicMaterials: {}
	});

	useEffect(() => {
		// Preload data for each category
		setPreloadedData({
			character: InitializeCategoryData(CharacterRawData, 'characterStatus', 'materialCount'),
			weapon: InitializeCategoryData(WeaponRawData, 'weaponStatus', 'materialCount'),
			enhancement: InitializeCategoryData(EnhancementRawData, 'enhancementStatus', 'materialCount'),
			basicMaterials: InitializeMaterialData(BasicMaterialRawData, 'blah', 'materialCount')
		});
	}, []);

	return (
		<PageWithSidebarComponent
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
						withQuantity
						disableOwnership
					/>
				},
				{
					label: 'Basic',
					iconPath: 'https://nxsvc.inface.nexon.com/meta-binary/7721eedef87ad6fb392af98d2e927fcb',
					Component: <CategoryList
						key='Enhancements'
						data={BasicMaterialRawData}
						localStorageStatusKey={'enhancementStatus'}
						localStorageMaterialKey={'materialCount'}
						preloadedData={preloadedData.basicMaterials}
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