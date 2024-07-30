import React from 'react';
import PageWithSidebarComponent from './PageWithSidebar';

const ComponentA = () => <div>See All Content (WIP)</div>;
const ComponentB = () => <div>Upgrade Mats Content (WIP)</div>;
const ComponentC = () => <div>Research Mats Content (WIP)</div>;
const ComponentD = () => <div>Basic Mats Content (WIP)</div>;
const ComponentE = () => <div>Amorphous Patterns Content (WIP)</div>;
const ComponentF = () => <div>Shards and Vaults Content (WIP)</div>;

const InventoryComponent: React.FC = () => {
	return (
		<PageWithSidebarComponent
			items={[
				{
					label: 'See All',
					iconPath: 'https://tfdvod.dn.nexoncdn.co.kr/img/cbt/character_v2/viessa/skill4.png',
					Component: <ComponentA />
				},
				{
					label: 'Upgrade Mats',
					iconPath: 'https://tfdvod.dn.nexoncdn.co.kr/img/cbt/character_v2/ajax/skill3.png',
					Component: <ComponentB />
				},
				{
					label: 'Research Mats',
					iconPath: 'https://tfdvod.dn.nexoncdn.co.kr/img/cbt/character_v2/esiemo/skill2.png',
					Component: <ComponentC />
				},
				{
					label: 'Basic Mats',
					iconPath: 'https://tfdvod.dn.nexoncdn.co.kr/img/cbt/character_v2/yujin/skill2.png',
					Component: <ComponentD />
				},
				{
					label: 'Amorphous Patterns',
					iconPath: 'https://tfdvod.dn.nexoncdn.co.kr/img/cbt/character_v2/jayber/skill1.png',
					Component: <ComponentE />
				},
				{
					label: 'Shards and Vaults',
					iconPath: 'https://tfdvod.dn.nexoncdn.co.kr/img/cbt/character_v2/enzo/skill1.png',
					Component: <ComponentF />
				}
			]}
		/>
	);
};

export default InventoryComponent;