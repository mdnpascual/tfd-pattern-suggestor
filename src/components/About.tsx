import React, { useState } from 'react';
import { Box, Button, Container, Tab, Tabs, Typography } from '@mui/material';
import SettingsComponent from './Settings';
import DebugComponent from './Debug';

const AboutComponent: React.FC = () => {
	const [tabValue, setTabValue] = useState(0);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<Container maxWidth="md" sx={{ mt: 0, mb: 4 }}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					textAlign: 'center',
					padding: 2,
					pb: 0,
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
				sx={{ mb: 2 }}
			>
				Join our Discord
			</Button>

			<Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
				<Tab label="Settings" />
				<Tab label="Debug" />
			</Tabs>

			{tabValue === 0 && (
				<SettingsComponent/>
			)}

			{tabValue === 1 && (
				<DebugComponent/>
			)}
			<Typography
				variant="caption"
				sx={{
					position: 'absolute',
					bottom: 8,
					right: 16,
					color: 'text.secondary',
				}}
			>
				Version 0.8.0
			</Typography>
			</Box>
		</Container>
	);
};

export default AboutComponent;