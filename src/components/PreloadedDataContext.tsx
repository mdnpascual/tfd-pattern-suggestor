import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import InitializeCategoryData from '../utils/InitializeCategoryData';
import CharacterRawData from '../data/characters.json';
import WeaponRawData from '../data/weapons.json';
import EnhancementRawData from '../data/enhancements.json';
import BasicMaterialRawData from '../data/basicMaterials.json';
import InitializeMaterialData from '../utils/InitializeMaterialData';

interface PreloadedDataProviderProps {
	children: ReactNode;
}

interface PreloadedDataContextType {
	preloadedData: {
		character: {};
		weapon: {};
		enhancement: {};
		basicMaterials: {};
	};
	fetchPreloadedData: () => void;
}

const PreloadedDataContext = createContext<PreloadedDataContextType | undefined>(undefined);

export const PreloadedDataProvider: React.FC<PreloadedDataProviderProps> = ({ children }) => {
	const [preloadedData, setPreloadedData] = useState({
		character: {},
		weapon: {},
		enhancement: {},
		basicMaterials: {}
	});

	const fetchPreloadedData = useCallback(() => {
		const character = InitializeCategoryData(CharacterRawData, 'characterStatus', 'materialCount')
		const weapon = InitializeCategoryData(WeaponRawData, 'weaponStatus', 'materialCount')
		const enhancement = InitializeCategoryData(EnhancementRawData, 'enhancementStatus', 'materialCount')
		setPreloadedData({
			character: character,
			weapon: weapon,
			enhancement: enhancement,
			basicMaterials: InitializeMaterialData(
				BasicMaterialRawData,
				[CharacterRawData, WeaponRawData, EnhancementRawData],
				[character, weapon, enhancement],
				'materialCount')
		});
	}, []);

	useEffect(() => {
		fetchPreloadedData();
	}, [fetchPreloadedData]);

	return (
		<PreloadedDataContext.Provider value={{ preloadedData, fetchPreloadedData }}>
			{children}
		</PreloadedDataContext.Provider>
	);
};

export const usePreloadedData = () => {
	const context = useContext(PreloadedDataContext);
	if (context === undefined) {
		throw new Error('usePreloadedData must be used within a PreloadedDataProvider');
	}
	return context;
};