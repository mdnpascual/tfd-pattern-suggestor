import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const DebugComponent: React.FC = () => {

	const [loadString, setLoadString] = useState('');
	const [deviceDimensions, setDeviceDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight
	});

	useEffect(() => {
		const handleResize = () => {
			setDeviceDimensions({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const copyLocalStorageToClipboard = () => {
		const localStorageData = JSON.stringify(localStorage);
		navigator.clipboard.writeText(localStorageData).then(
			() => alert('Local storage copied to clipboard.'),
			(err) => alert('Failed to copy to clipboard.')
		);
	};

	const loadStringIntoLocalStorage = () => {
		try {
			const parsedData = JSON.parse(loadString);
			for (const key in parsedData) {
			if (parsedData.hasOwnProperty(key)) {
				localStorage.setItem(key, parsedData[key]);
			}
			}
			alert('Local storage updated from string.');
		} catch (error) {
			alert('Invalid JSON string.');
		}
	};

	const handleClearLocalStorage = () => {
		const confirmed = window.confirm("Are you sure you want to clear all selections?");
		if (confirmed) {
			localStorage.setItem('selectedItems', '');
			localStorage.setItem('selectedFilters', '');
			localStorage.setItem('itemPriority', '');
			localStorage.setItem('characterStatus', '');
			localStorage.setItem('materialCount', '');
			localStorage.setItem('selectedCollossusFilters', '');
			localStorage.setItem('weaponStatus', '');
			localStorage.setItem('enhancementStatus', '');
			localStorage.setItem('percentileValues', '');
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Button
				variant="outlined"
				color="error"
				onClick={handleClearLocalStorage}
				sx={{ mb: 2 }}
			>
				Clear Local Storage
			</Button>
			<Button
				variant="outlined"
				color="secondary"
				onClick={copyLocalStorageToClipboard}
				sx={{ mb: 2 }}
			>
				Copy Local Storage to Clipboard
			</Button>
			<TextField
				label="Load JSON into Local Storage"
				variant="outlined"
				multiline
				rows={4}
				value={loadString}
				onChange={(e) => setLoadString(e.target.value)}
				sx={{ mb: 2, width: '100%' }}
			/>
			<Button
				variant="outlined"
				color="secondary"
				onClick={loadStringIntoLocalStorage}
				disabled={!loadString.trim()}
			>
				Load String into Local Storage
			</Button>
			<Typography variant="body2" sx={{ mt: 2 }}>
				Device Dimensions: {deviceDimensions.width} x {deviceDimensions.height}
			</Typography>
		</Box>
	)
}

export default DebugComponent;