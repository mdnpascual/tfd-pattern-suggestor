import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppBar, Tabs, Tab, CssBaseline, useMediaQuery  } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import darkTheme from './theme';
import PatternSuggestorComponent from './components/PatternSuggestor';
import AboutComponent from './components/About'
import GearComponent from './components/Gear';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ExploreIcon from '@mui/icons-material/Explore';
import { JoyrideWithNavigation, loadBackupDataToLocalStorage } from './components/Joyride';
import { BackupData, localStorageKeys, SaveData } from './data/constants';
import { compileData } from './components/Saves';
import { PreloadedDataProvider } from './components/PreloadedDataContext';
import FarmRotationComponent from './components/FarmRotation';


const tabNameToIndex = {
	0: "/patternSuggestor",
	1: "/gear",
	2: "/farmRotation",
	3: "/about",
};
const indexToTabName = {
	"/patternSuggestor": 0,
	"/gear": 1,
	"/farmRotation": 2,
	"/about": 3,
};

const App = () => {
	const [isTutorialOpen, setIsTutorialOpen] = useState(false);
	const [backupData, setBackupData] = useState<Record<string, SaveData | BackupData>>({})
	const [reloadKey, setReloadKey] = useState(0);

	useEffect(() => {
		const finishedGearTutorial = localStorage.getItem('finishedGearTutorial');
		let bData = {}
		if (finishedGearTutorial === null || finishedGearTutorial.length === 0) {
			bData = compileData("Backup")
			setBackupData(bData)
			localStorageKeys.forEach((key) => {
				localStorage.setItem(key, '');
			})
			setReloadKey((prevKey) => prevKey + 1)
			setIsTutorialOpen(true);
		}

		const handleBeforeUnload = () => {
			if ((finishedGearTutorial === null || finishedGearTutorial.length === 0) && Object.keys(bData).length !== 0) {
				loadBackupDataToLocalStorage(bData);
			}
		};

		window.addEventListener('pagehide', handleBeforeUnload)
		window.addEventListener('visibilitychange', handleBeforeUnload)
		window.addEventListener('unload', handleBeforeUnload)
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => {
			window.removeEventListener('pagehide', handleBeforeUnload)
			window.removeEventListener('visibilitychange', handleBeforeUnload)
			window.removeEventListener('unload', handleBeforeUnload)
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, []);

	const handleCloseTutorial = () => {
		setIsTutorialOpen(false);
		setReloadKey((prevKey) => prevKey + 1)
	};

	const savedSelectedItems = localStorage.getItem('selectedItems');
	const landingPage = (savedSelectedItems?.length ?? 0) > 2
		? "/patternSuggestor"
		: "/gear";

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Router basename="/tfd-pattern-suggestor">
				{isTutorialOpen && (
					<JoyrideWithNavigation isTutorialOpen={isTutorialOpen} handleCloseTutorial={handleCloseTutorial} backupData={backupData}/>
				)}
				<div>
					<NavTabs />
					<Routes>
						<Route
							path="/patternSuggestor"
							element={<PatternSuggestorComponent key={reloadKey}/>}
						/>
						<Route path="/gear" element={
							<PreloadedDataProvider>
								<GearComponent key={reloadKey}/>
							</PreloadedDataProvider>
						} />
						<Route path="/farmRotation" element={<FarmRotationComponent />} />
						<Route path="/about" element={<AboutComponent />} />
						<Route path="/" element={<Navigate replace to={landingPage} />} />
					</Routes>
				</div>
			</Router>
		</ThemeProvider>
	);
};

const NavTabs = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const navigate = useNavigate();
	const location = useLocation();

	const handleTabChange = (event: React.SyntheticEvent, newValue: keyof typeof tabNameToIndex) => {
		navigate(tabNameToIndex[newValue]);
	};

	const pathname = location.pathname as keyof typeof indexToTabName

	return (
		<AppBar position="static">
			<Tabs
				value={indexToTabName[pathname] || 0}
				onChange={handleTabChange}
				centered
			>
				<Tab id="suggestor-tab" icon={isMobile ? <ChecklistIcon /> : undefined} label={!isMobile ? "Pattern Suggestor" : undefined} />
				<Tab id="gear-inventory-tab" icon={isMobile ? <AddTaskIcon /> : undefined} label={!isMobile ? "Gear Inventory" : undefined} />
				<Tab id="weekly-farm-rotation" icon={isMobile ? <ExploreIcon /> : undefined} label={!isMobile ? "Weekly Rotation" : undefined} />
				<Tab icon={isMobile ? <HelpOutlineIcon /> : undefined} label={!isMobile ? "Help" : undefined} />
			</Tabs>
		</AppBar>
	);
};

export default App;