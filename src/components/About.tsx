import React, { useState } from 'react';
import { Box, Button, Container, Tab, Tabs, Typography } from '@mui/material';
import SettingsComponent from './Settings';
import DebugComponent from './Debug';
import Saves from './Saves';

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
					<Tab label="Saves" />
					<Tab label="Debug" />
				</Tabs>

				{tabValue === 0 && (
					<SettingsComponent/>
				)}

				{tabValue === 1 && (
					<Saves />
				)}

				{tabValue === 2 && (
					<DebugComponent/>
				)}
				<Typography
					variant="caption"
					sx={{
						position: 'absolute',
						bottom: { xs: 58, sm: 32 },
						right: 16,
						color: 'text.secondary',
					}}>
					Version 1.1.5a
				</Typography>

				<Typography
					variant="caption"
					sx={{
						position: 'absolute',
						bottom: { xs: 16, sm: 8 },
						right: 16,
						color: 'text.secondary',
						textAlign: 'right',
					}}>
					This app uses the Open API provided by Nexon. All images and data are sourced from Nexon’s API.
				</Typography>
			</Box>
		</Container>
	);
};

export default AboutComponent;