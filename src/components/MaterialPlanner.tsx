import React, { useState } from 'react';
import { GearPart } from '../data/constants';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

interface StockItem {
	name: string;
	stock: number;
}

interface MaterialPlannerProps {
	initialCount?: number;
	parts: GearPart[];
	stock: StockItem[];
	onQuantityChange: (itemName: string, newQuantity: number) => void;
	onPriorityChange: () => void;
	onOwnershipToggle: (itemName: string) => void;
}

const MaterialPlanner: React.FC<MaterialPlannerProps> = ({
	initialCount = 1,
	parts,
	stock,
	onQuantityChange,
	onPriorityChange,
	onOwnershipToggle
}) => {
	const [quantities, setQuantities] = useState<{[key: string]: number}>(() => {
		return parts.reduce((acc, part) => {
			part.mats?.forEach(mat => {
			acc[mat.name] = initialCount * mat.quantity;
			});
			return acc;
		}, {} as {[key: string]: number});
	});

	const handleQuantityChange = (name: string, quantity: number) => {
		setQuantities(prev => ({ ...prev, [name]: quantity }));
		onQuantityChange(name, quantity);
	};

	return (
		<Box sx={{ p: 2 }}>
			{parts.map(part => (
			<Box key={part.name} sx={{ mb: 2 }}>
				<Typography variant="h6" sx={{ mb: 2 }}>{part.name}</Typography>
				<Grid container spacing={2}>
				{part.mats?.map(mat => (
					<Grid item xs={4.1} key={mat.name}>
					<Box display="flex" alignItems="center">
						<TextField
						label={mat.name}
						type="number"
						variant="outlined"
						size="small"
						value={stock.find(item => item.name === mat.name)?.stock || 0}
						onChange={e => handleQuantityChange(mat.name, parseInt(e.target.value))}
						sx={{ width: '200px', mr: 2 }}
						/>
						<Typography> / {quantities[mat.name]}</Typography>
					</Box>
					</Grid>
				))}
				</Grid>
			</Box>
			))}
			<Button variant="contained" color="primary" onClick={onPriorityChange} sx={{ mr: 1 }}>
			🌟 Prioritize
			</Button>
			<Button variant="contained" color="secondary" onClick={() => parts.forEach(part => part.mats?.forEach(mat => onOwnershipToggle(mat.name)))}>
			✅ Owned
			</Button>
		</Box>
	);
};

export default MaterialPlanner;