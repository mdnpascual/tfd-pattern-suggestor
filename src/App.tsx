import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppBar, Tabs, Tab, Box, CssBaseline  } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import darkTheme from './theme';
import PatternSuggestorComponent from './components/PatternSuggestor';
import InventoryComponent from './components/Inventory';
import SettingsComponent from './components/Settings'

const App = () => {
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
				<Route path="/inventory" element={<InventoryComponent />} />
				<Route path="/settings" element={<SettingsComponent />} />
				<Route path="/" element={<Navigate replace to="/patternSuggestor" />} />
				</Routes>
			</div>
			</Router>
		</ThemeProvider>
	);
};

const NavTabs = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const tabNameToIndex = {
		0: "/patternSuggestor",
		1: "/inventory",
		2: "/settings",
	};
	const indexToTabName = {
		"/patternSuggestor": 0,
		"/inventory": 1,
		"/settings": 2,
	};

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
			<Tab label="Pattern Suggestor" />
			<Tab label="Component Inventory" />
			<Tab label="Settings" />
			</Tabs>
		</AppBar>
	);
};

export default App;