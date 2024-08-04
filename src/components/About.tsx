import React, { useEffect, useState } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const AboutComponent: React.FC = () => {
	const [loadString, setLoadString] = useState('');
	const [deviceDimensions, setDeviceDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight
	});

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
		}
	};

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

	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
			<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				textAlign: 'center',
				padding: 3,
				borderRadius: 2,
				boxShadow: 1,
				bgcolor: 'background.paper',
			}}
			>
			<Typography variant="h4" gutterBottom>
				About / Support
			</Typography>
			<Typography variant="body1" sx={{ mb: 3 }}>
				If you have any questions, feedback, found a mistake, or want to report a bug, join us on Discord.
			</Typography>
			<Button
				variant="contained"
				color="primary"
				href="https://discord.gg/d9HrFwUYfx"
				target="_blank"
				rel="noopener noreferrer"
				sx={{ mb: 4 }}
			>
				Join our Discord
			</Button>

			<Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
				Debug
			</Typography>
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Button
						variant="outlined"
						color="error"
						onClick={handleClearLocalStorage}
						sx={{ mb: 2 }}>
						Clear Local Storage
					</Button>
					<Button
						variant="outlined"
						color="secondary"
						onClick={copyLocalStorageToClipboard}
						sx={{ mb: 2 }}>
						Copy Local Storage to Clipboard
					</Button>
					<TextField
						label="Load JSON into Local Storage"
						variant="outlined"
						multiline
						rows={4}
						value={loadString}
						onChange={(e) => setLoadString(e.target.value)}
						sx={{ mb: 2, width: '100%' }}/>
					<Button
						variant="outlined"
						color="secondary"
						onClick={loadStringIntoLocalStorage}
						disabled={!loadString.trim()}>
						Load String into Local Storage
					</Button>
					<Typography variant="body2" sx={{ mt: 2 }}>
						Device Dimensions: {deviceDimensions.width} x {deviceDimensions.height}
					</Typography>
					<Typography
						variant="caption"
						sx={{
							position: 'absolute',
							bottom: 8,
							right: 16,
							color: 'text.secondary',
						}}
						>
						Version 0.6.1
					</Typography>
				</Box>
			</Box>
		</Container>
	);
};

export default AboutComponent;