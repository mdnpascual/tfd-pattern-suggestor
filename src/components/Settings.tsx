import React from 'react';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const SettingsComponent: React.FC = () => {

	const handleClearLocalStorage = () => {
		const confirmed = window.confirm("Are you sure you want to clear all selections?");
		if (confirmed) {
			localStorage.setItem('selectedItems', '');
			localStorage.setItem('selectedFilters', '');
		}
	};

	return (
		<div style={{ width: '100%', height: '100vh', display: 'flex' }}>
			<Grid container spacing={2}>
				<Grid item xs={6}>
					<Button onClick={handleClearLocalStorage} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
						Delete Local Storage
					</Button>
					<Tooltip title="Click this to quickly remove the saved/remembered selections">
						<IconButton size="small">
							<InfoIcon color="action" />
						</IconButton>
					</Tooltip>
				</Grid>
			</Grid>

		</div>
	)
};

export default SettingsComponent;