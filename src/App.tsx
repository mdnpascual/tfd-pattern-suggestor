import React from 'react';
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

const tabNameToIndex = {
	0: "/patternSuggestor",
	1: "/gear",
	2: "/about",
};
const indexToTabName = {
	"/patternSuggestor": 0,
	"/gear": 1,
	"/about": 2,
};

const App = () => {
	const savedSelectedItems = localStorage.getItem('selectedItems');
	const landingPage = (savedSelectedItems?.length ?? 0) > 2
		? "/patternSuggestor"
		: "/gear";
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Router basename="/tfd-pattern-suggestor">
			<div>
				<NavTabs />
				<Routes>
				<Route
					path="/patternSuggestor"
					element={<PatternSuggestorComponent />}
				/>
				<Route path="/gear" element={<GearComponent />} />
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
				<Tab icon={isMobile ? <ChecklistIcon /> : undefined} label={!isMobile ? "Pattern Suggestor" : undefined} />
                <Tab icon={isMobile ? <AddTaskIcon /> : undefined} label={!isMobile ? "Gear Inventory" : undefined} />
                <Tab icon={isMobile ? <HelpOutlineIcon /> : undefined} label={!isMobile ? "Help" : undefined} />
			</Tabs>
		</AppBar>
	);
};

export default App;