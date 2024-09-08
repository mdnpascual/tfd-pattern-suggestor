import React, { useState } from 'react';
import { MaterialUsageData } from '../data/constants';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery } from '@mui/material';

interface MaterialUsageProps {
	title: string;
	bestFarm: string;
	material: MaterialUsageData[];
	quantity: number;
	onQuantityChange?: (quantity: number) => void;
}

const MaterialUsage: React.FC<MaterialUsageProps> = ({
	title,
	bestFarm,
	material,
	quantity,
	onQuantityChange
}) => {
	const [showZeroGoals, setShowZeroGoals] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	material = material.sort((a, b) => a.part.localeCompare(b.part));
	const zeroGoalMaterials = material.filter(mat => mat.goal === 0);
	const nonZeroGoalMaterials = material.filter(mat => mat.goal > 0);

	const toggleZeroGoals = () => {
		setShowZeroGoals(prev => !prev);
	};

	const handleQuantityChange = (quantity: number) => {
		if (onQuantityChange){
			onQuantityChange(quantity);
		}
	}

	return (
		<Box sx={{ p: 2, maxWidth: '700px', margin: '0 auto', maxHeight: '90vh' }} id={`${title.replaceAll(" ", "-")}-textfield-usage`}>
			<Box sx={{ overflowY: 'auto' }}>
				<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
					{title}
				</Typography>
				<Typography sx={{ mt: '20px', mb: '20px' }}>
					Best Farm: {bestFarm}
				</Typography>
			</Box>
			<Box sx={{ width: isMobile ? '90vw' : '100%', maxHeight: '60vh', overflow: 'auto' }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>
								<Typography variant="h6">Part</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="h6">Goal</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="h6">x</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="h6">Base<br></br>Count</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="h6">=</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="h6">Total</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{nonZeroGoalMaterials.map(mat => (
							<TableRow key={mat.part}>
								<TableCell>
									<Typography>{mat.part}</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography>{mat.goal || 0}</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography variant="h6">x</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography>{mat.baseCount || 0}</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography variant="h6">=</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography>{mat.baseCount * (mat.goal || 0)}</Typography>
								</TableCell>
							</TableRow>
						))}
						{zeroGoalMaterials.length > 0 && (<TableRow key={'divider'}>
							<TableCell colSpan={6}>
								<Button onClick={toggleZeroGoals}>
									{showZeroGoals ? 'Hide Materials with 0 Goal' : 'Show Materials with 0 Goal'}
								</Button>
							</TableCell>
						</TableRow>)}
						{zeroGoalMaterials.map((mat, index) => (
							<TableRow key={index} sx={{ visibility: showZeroGoals ? 'visible' : 'collapse' }}>
								<TableCell>
									<Typography>{mat.part}</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography>{mat.goal || 0}</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography variant="h6">x</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography>{mat.baseCount || 0}</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography variant="h6">=</Typography>
								</TableCell>
								<TableCell align="center">
									<Typography>{mat.baseCount * (mat.goal || 0)}</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>
			<Box display="flex" alignItems="center" id={`${title.replaceAll(" ", "-")}-desired-quantity`} sx={{ mt: 2, justifyContent: 'space-between' }}>
				<Typography variant="h5" sx={{ fontWeight: 'bold', mr: '10px' }}>
					{title}:
				</Typography>
				<Box display="flex" alignItems="center">
					<TextField
						label="Quantity"
						type="number"
						variant="outlined"
						size="small"
						value={quantity}
						onChange={e => handleQuantityChange(parseInt(e.target.value))}
						sx={{ width: '140px', mr: '10px' }}
						inputProps={{ min: 0, style: { textAlign: 'right' } }}
					/>
					<Typography sx={{ mr: '15px' }}>/</Typography>
					<Typography sx={{ mr: '25px' }}>{nonZeroGoalMaterials.reduce((sum, mat) => sum + mat.goal * mat.baseCount, 0)}</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default MaterialUsage;