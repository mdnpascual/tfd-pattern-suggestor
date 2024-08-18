import { Box, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const getRespectUserPrioritySetting = () => {
	try {
		const storedValue = localStorage.getItem('respectUserPriority');
		if (storedValue === null) {
			return true;
		}
		const parsedValue = JSON.parse(storedValue);

		if (typeof parsedValue === 'boolean') {
			return parsedValue;
		} else {
			return true;
		}
	} catch (error) {
		return true;
	}
}

const SettingsComponent: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const [percentileValues, setPercentileValues] = useState<number[]>(
		JSON.parse(localStorage.getItem('percentileValues') || '[0.5, 0.85, 0.95]')
	);

	const [respectUserPriority, setRespectUserPriority] = useState<boolean>(getRespectUserPrioritySetting);

	const handlePercentileChange = (index: number, value: string) => {
		let newValue = parseFloat((parseFloat(value) / 100).toFixed(4));

		// Validation
		if (newValue < 0.0001) newValue = 0.01;
		if (newValue > .9999) newValue = .9999;

		const newPercentileValues = [...percentileValues];
		newPercentileValues[index] = newValue;
		setPercentileValues(newPercentileValues);

		localStorage.setItem('percentileValues', JSON.stringify(newPercentileValues));
	};

	const handleRespectUserPriorityChange = (value: boolean) => {
		setRespectUserPriority(value)
		localStorage.setItem('respectUserPriority', value ? 'true' : 'false' );
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<FormControlLabel
					control={
						<Checkbox
							checked={respectUserPriority}
							onChange={(e) => handleRespectUserPriorityChange(e.target.checked)}
							color="primary"
						/>
					}
					label="Respect Custom Priority"
				/>
				<Tooltip title="Disabling this setting will clear the custom priority every time the generate suggestion is triggered. Custom priority is set when you change the priority outside the generate suggestion priorities.">
					<IconButton>
						<InfoIcon />
					</IconButton>
				</Tooltip>
			</Box>

			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<Typography variant="h6" gutterBottom>
					Percentile Settings
				</Typography>
				<Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'nowrap' }}>
					{percentileValues.map((value, index) => (
						<TextField
							key={index}
							label={`Percentile ${index + 1}`}
							variant="outlined"
							type="number"
							size="small"
							inputProps={{
								min: 0,
								max: 99,
								step: 1,
								style: { textAlign: 'center' },
							}}
							InputLabelProps={{
								shrink: true
							}}
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>
							}}
							value={Number((value * 100).toFixed(4))}
							onChange={(e) => handlePercentileChange(index, e.target.value)}
							sx={{ mb: 2, minWidth: '120px', width: 'auto' }}
						/>
					))}
				</Box>
			</Box>

			{/* Add more settings below this line in the same way */}
		</Box>
	);
}

export default SettingsComponent;