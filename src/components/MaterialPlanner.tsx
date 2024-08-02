import React from 'react';
import { GearPart, Material } from '../data/constants';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

interface MaterialPlannerProps {
	title: string;
	parts: GearPart[];
	stock: Record<string, number>;
	onMatCountChange: (itemName: string, newCount: number) => void;
	onOwned: (itemName: string) => void;
	onQuantityChange?: (quantity: number) => void;
	enableMultiple?: boolean;
	initialQuantity?: number;
}

const MaterialPlanner: React.FC<MaterialPlannerProps> = ({
	title,
	parts,
	stock,
	onMatCountChange,
	onOwned,
	onQuantityChange,
	enableMultiple,
	initialQuantity = 1
}) => {

	const handleMatCountChange = (name: string, newCount: number) => {
		onMatCountChange(name, newCount);
	};

	const handleQuantityChange = (quantity: number) => {
		if (onQuantityChange){
			onQuantityChange(quantity);
		}
	}

	const setColor = (current: number, goal: number, parts?: Material[]) => {
		if (parts){
			if (current < goal * initialQuantity) {
				const partsComplete = parts.every((part) => (stock[part.name] || 0) >= part.quantity)

				if (partsComplete) return "#FFEB3B"
				else return "#F44336"
			}
			return "#4CAF50"
		} else {
			if (current < goal) return "#F44336"
			else return "#4CAF50"
		}
	}

	return (
		<Box sx={{ p: 2 }}>
			{parts.map(part => (
				<Box key={part.name} sx={{ mb: 2 }}>
					<Grid container spacing={2} alignItems="center" sx={{ display: 'flex', width: '100%' }}>
						<Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', ml: 2, mb: 2, mt: 2.5 }}>
							<Typography variant="h6" color={setColor(stock[part.name] || 0, initialQuantity, part.mats)} noWrap sx={{ mr: 1 }}>
							{part.name}:
							</Typography>
							<TextField
							type="number"
							variant="outlined"
							size="small"
							value={stock[part.name] || 0}
							onChange={e => handleMatCountChange(part.name, parseInt(e.target.value))}
							inputProps={{ min: 0 }}
							sx={{ width: '100px' }}
							/>
						</Box>
					</Grid>
					<Grid container spacing={2}>
					{part.mats?.map(mat => (
						<Grid item xs={5} key={mat.name} sx={{maxWidth: "50%"}}>
							<Box display="flex" alignItems="center" sx={{ width: "100%" }}>
								<TextField
									label={mat.name}
									type="number"
									variant="outlined"
									size="small"
									value={stock[mat.name] || 0}
									onChange={e => handleMatCountChange(mat.name, parseInt(e.target.value))}
									sx={{ width: "200px", mr: 2 }}
									inputProps={{min: 0}}
									InputLabelProps={{sx: {color: setColor(stock[mat.name] || 0, mat.quantity)}}}
								/>
								<Typography sx={{ flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: 'ellipsis' }}> / {mat.quantity}</Typography>
							</Box>
						</Grid>
					))}
					</Grid>
				</Box>
			))}
			<Box display="flex" alignItems="center">
				<Button variant="contained" color="secondary" onClick={(e) => {onOwned(title)}}>
					{enableMultiple && ('✅ Completed')}
					{!enableMultiple && ('✅ Owned')}
				</Button>
				{enableMultiple && (
					<TextField
						label="Quantity"
						type="number"
						variant="outlined"
						size="small"
						value={initialQuantity}
						onChange={e => handleQuantityChange(parseInt(e.target.value))}
						sx={{ width: '100px', ml: '10px' }}
						inputProps={{min: 0}}
					/>
				)}
			</Box>
		</Box>
	);
};

export default MaterialPlanner;