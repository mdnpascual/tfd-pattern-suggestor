import React from 'react';
import { GearPart } from '../data/constants';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ColorByGoal from '../utils/ColorByGoal';

interface MaterialPlannerProps {
	title: string;
	parts: GearPart[];
	stock: Record<string, number>;
	onMatCountChange: (itemName: string, newCount: number) => void;
	onOwned: (itemName: string) => void;
	onQuantityChange?: (quantity: number) => void;
	enableMultiple?: boolean;
	initialQuantity?: number;
	disableOwnership?: boolean;
}

const MaterialPlanner: React.FC<MaterialPlannerProps> = ({
	title,
	parts,
	stock,
	onMatCountChange,
	onOwned,
	onQuantityChange,
	enableMultiple,
	initialQuantity = 1,
	disableOwnership
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const handleMatCountChange = (name: string, newCount: number) => {
		onMatCountChange(name, newCount);
	};

	const handleQuantityChange = (quantity: number) => {
		if (onQuantityChange){
			onQuantityChange(quantity);
		}
	}

	return (
		<Box sx={{ p: 2, maxWidth: '700px', margin: '0 auto', maxHeight: '90vh', overflow: 'auto' }} id={`${title.replaceAll(" ", "-")}-textfield-planner`}>
			{parts.map(part => (
				<Box key={part.name} sx={{ mb: 0, width: isMobile ? '90vw' : '100%' }}>
					<Grid container alignItems="center" sx={{ display: 'flex', width: '100%' }}>
						<Box
							sx={{
								flex: 1,
								display: 'flex',
								alignItems: 'center',
								ml: 0,
								mb: 2,
								mt: 2.5,
								overflow: 'hidden',
								whiteSpace: 'nowrap',
								maxWidth: '100%',
							}}
						>
							<Typography
								variant="h6"
								color={ColorByGoal(stock[part.name] || 0, initialQuantity, initialQuantity, stock, part.mats)}
								noWrap
								sx={{
									flexGrow: isMobile ? 1 : 0,
									mr: 1,
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									maxWidth: 'calc(100% - 110px)'
								}}
							>
								{part.name}:
							</Typography>
							<TextField
								type="number"
								variant="outlined"
								size="small"
								value={stock[part.name] || 0}
								onChange={e => handleMatCountChange(part.name, parseInt(e.target.value))}
								inputProps={{ min: 0 }}
								sx={{ width: '100px', flexShrink: 0 }}
							/>
						</Box>
					</Grid>
					<Grid container spacing={2} sx={{ maxWidth: "100%" }}>
						{part.mats?.map(mat => (
							<Grid item xs={5} key={mat.name} sx={{ maxWidth: "50%" }}>
								<Box display="flex" alignItems="center" sx={{ width: "100%" }}>
									<TextField
										label={mat.name}
										type="number"
										variant="outlined"
										size="small"
										value={stock[mat.name] || 0}
										onChange={e => handleMatCountChange(mat.name, parseInt(e.target.value))}
										sx={{ width: "200px", mr: 2 }}
										inputProps={{ min: 0, style: { textAlign: 'right' } }}
										InputLabelProps={{ sx: { color: ColorByGoal((stock[mat.name] || 0) + (stock[part.name] || 0), mat.quantity, initialQuantity, stock) } }}
									/>
									<Typography sx={{ flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: 'ellipsis' }}>
										/ {mat.quantity}
									</Typography>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
			))}
			<Box display="flex" alignItems="center" id={`${title.replaceAll(" ", "-")}-desired-quantity`} sx={{ mt: 2 }}>
				{!disableOwnership && (
					<Button
						id={`${title.replaceAll(" ", "-")}-owned-button`}
						variant="contained"
						color="secondary"
						onClick={(e) => { onOwned(title); }}
					>
						{enableMultiple ? '✅ Completed' : '✅ Owned'}
					</Button>
				)}
				{enableMultiple && (
					<TextField
						label="Desired Quantity"
						type="number"
						variant="outlined"
						size="small"
						value={initialQuantity}
						onChange={e => handleQuantityChange(parseInt(e.target.value))}
						sx={{ width: '140px', ml: disableOwnership ? '0px' : '10px' }}
						inputProps={{ min: 0 }}
					/>
				)}
			</Box>
		</Box>
	);
};

export default MaterialPlanner;