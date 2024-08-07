import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { TableItem } from './SortableTable';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ColorByGoal from '../utils/ColorByGoal';

interface DropListOverlayProps {
	dropTable?: TableItem;
	materialCount: Record<string, number>;
	materialMapping: Record<string, string>;
	onMatCountChange: (itemName: string, newCount: number) => void;
}

const DropListOverlay: React.FC<DropListOverlayProps> = ({
	dropTable,
	materialCount,
	materialMapping,
	onMatCountChange
}) => {

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const getGoal = (name: string) => {
		if (materialCount[materialMapping[materialMapping[name]]]) {
			return (materialCount[materialMapping[materialMapping[name]]]) - (materialCount[materialMapping[name]] ?? 0)
		} else {
			return (materialCount[materialMapping[name]] ?? 0)
		}
	}

	if (dropTable) {
		const handleMatCountChange = (name: string, newCount: number) => {
			onMatCountChange(name, newCount);
		};

		return (
			<Box sx={{ p: 2, height: '90vh' }}>
				<Typography variant="h5" sx={{ fontWeight: 'bold', mb: '20px' }}>
					Amorphous Pattern #{dropTable.name}
				</Typography>
				<Box key={dropTable.name} sx={{ mb: 2, width: isMobile ? '90vw' : undefined, maxHeight: '20vh' }}>
					{dropTable.drops.map((drop, index) => (
						<Box
							key={index}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								border: '3px solid',
								borderColor: ColorByGoal(materialCount[drop.name] ?? 0, getGoal(drop.name), 1, materialCount),
								padding: 1,
								mb: 1,
							}}
						>
							<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
								<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
									{(drop.chance * 100).toFixed(0)}%
								</Typography>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<Typography variant="body1" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 1 }}>
									{drop.name}
								</Typography>
								<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 1 }}>
									<TextField
										type="number"
										variant="outlined"
										size="small"
										value={materialCount[drop.name] ?? 0}
										onChange={e => handleMatCountChange(drop.name, parseInt(e.target.value))}
										sx={{ width: '60px', mb: 1, mr: '15px' }}
										inputProps={{ min: 0, style: { textAlign: 'right' } }}
									/>
									<Typography fontSize={16} variant="caption" sx={{ flexShrink: 0, whiteSpace: 'nowrap', mt: '-5px' }}>
										/ {getGoal(drop.name)}
									</Typography>
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			</Box>
		);
	} else {
		return (<div></div>);
	}

};

export default DropListOverlay;