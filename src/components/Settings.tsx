import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const SettingsComponent: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const [percentileValues, setPercentileValues] = useState<number[]>(
		JSON.parse(localStorage.getItem('percentileValues') || '[0.5, 0.85, 0.95]')
	);

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

	return (
		<Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
			<Typography variant="h6" gutterBottom sx={{ flexShrink: 0, mr: 2 }}>
				Percentile Settings
			</Typography>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 1, mt: 1 }}>
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
						InputProps={{
							endAdornment: <InputAdornment position="end">%</InputAdornment>
						}}
						value={Number((value * 100).toFixed(4))}
						onChange={(e) => handlePercentileChange(index, e.target.value)}
						sx={{ mb: 2, width: '100%' }}
					/>
				))}
			</Box>
		</Box>
	);
}

export default SettingsComponent;