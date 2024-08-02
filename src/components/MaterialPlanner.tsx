import React from 'react';
import { GearPart } from '../data/constants';
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

	return (
		<Box sx={{ p: 2 }}>
			{parts.map(part => (
			<Box key={part.name} sx={{ mb: 2 }}>
				<Typography variant="h6" sx={{ mb: 2 }}>{part.name}</Typography>
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
							/>
							<Typography sx={{ flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: 'ellipsis' }}> / {mat.quantity}</Typography>
						</Box>
					</Grid>
				))}
				</Grid>
			</Box>
			))}
			<Box display="flex" alignItems="center"> {/* Ensures inline display of all child components */}
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