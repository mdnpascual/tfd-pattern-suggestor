import '../App.css'
import CharacterList from './CharacterList';
import PageWithSidebarComponent from './PageWithSidebar';

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