import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid, Tooltip } from '@mui/material';
import { TableItem } from './SortableTable';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ColorByGoal from '../utils/ColorByGoal';
import calculateRolls, { PercentileDisplayProps } from '../utils/CalculateRolls';

interface DropListOverlayProps {
	dropTable?: TableItem;
	materialCount: Record<string, number>;
	materialMapping: Record<string, string>;
	onMatCountChange: (itemName: string, newCount: number) => void;
	shardRequirements?: JSX.Element;
}

const DropListOverlay: React.FC<DropListOverlayProps> = ({
	dropTable,
	materialCount,
	materialMapping,
	onMatCountChange,
	shardRequirements
}) => {
	const [percentiles, setPercentiles] = useState<PercentileDisplayProps>({percentiles: [0.5, 0.85, 0.95], values: [0, 0 ,0]});
	const [percentileValues, setPercentileValues] = useState<number[]>(
		JSON.parse(localStorage.getItem('percentileValues') || '[0.5, 0.85, 0.95]')
	);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const isEmptyShardRequirements = () => {
		if (!shardRequirements) return true;
		if (shardRequirements.type === 'div' && (!shardRequirements.props.children || shardRequirements.props.children.length === 0)) {
			return true;
		}

		return false;
    };

	const computeTooltipShards = (count: number) => {
		if (isEmptyShardRequirements()){
			return (<div></div>)
		} else {
			return (
				<div>
					Total Shards Needed:
					{shardRequirements?.props.children.props.children[1].props.children[1].map((shard: any) => (
						<div>
							{shard.props.children[0]}: {shard.props.children[2] * count}
						</div>
					))}
				</div>
			);
		}
	};

	const getGoal = (name: string) => {
		if (materialCount[materialMapping[materialMapping[name]]]) {
			return (materialCount[materialMapping[materialMapping[name]]]) - (materialCount[materialMapping[name]] ?? 0)
		} else {
			return (materialCount[materialMapping[name]] ?? 0)
		}
	}

	useEffect(() => {
		compute();
	}, [materialCount]);

	const compute = () => {
		if (dropTable) {
			const probabilities: Record<string, number> = {};
			const requirements: Record<string, number> = {};
			dropTable.drops.map((drop, index) => {
				const goal = getGoal(drop.name);
				if (ColorByGoal(materialCount[drop.name] ?? 0, goal, 1, materialCount) === "#F44336") {
					probabilities[drop.name] = drop.chance
					requirements[drop.name] = goal - (materialCount[drop.name] ?? 0)
				}
			});

			setPercentiles(calculateRolls(probabilities, requirements, percentileValues));
		}
	}

	if (dropTable) {
		const handleMatCountChange = (name: string, newCount: number) => {
			onMatCountChange(name, newCount);
		};

		return (
			<Box sx={{ p: 2, pt: 0, height: '95vh' }}>
				<Box sx={{overflowY: 'auto', maxHeight: isEmptyShardRequirements() ? '15vh' : '25vh',}}>
					<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
						Amorphous Pattern #{dropTable.name}
					</Typography>
					<Typography sx={{ mt:'20px', mb: '20px' }}>
						Drops From: {dropTable.dropsFrom}<br/>
						Use In: {dropTable.useIn}
						{shardRequirements}
					</Typography>
				</Box>
				<Box key={dropTable.name} sx={{
					mb: 0,
					width: isMobile ? '90vw' : undefined,
					maxHeight: isEmptyShardRequirements() ? '65vh' : '55vh',
					overflowY: 'auto',
					borderColor: 'transparent'
				}}>
					{dropTable.drops.map((drop, index) => (
						<Box
							key={index}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								border: '3px solid',
								borderColor: ColorByGoal(materialCount[drop.name] ?? 0, getGoal(drop.name), 1, materialCount),
								padding: 1,
								paddingBottom: 0,
								paddingTop: 1,
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
				<Box sx={{overflowY: 'auto', maxHeight: '20vh'}}>
					<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
						Number of Patterns needed:
					</Typography>

					<Grid container spacing={0}>
						{percentiles.percentiles.map((percentile, index) => (
							<Grid item xs={4} key={index}>
								<Tooltip title={isEmptyShardRequirements() ? undefined : computeTooltipShards(percentiles.values[index])}>
									<Box
										sx={{
											padding: '2px',
											backgroundColor: 'background.default',
											borderRadius: '8px',
											color: 'text.primary',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<Typography variant="subtitle1">
											~{percentile}%:
										</Typography>
										<Typography variant="h6">
											{percentiles.values[index]}
										</Typography>
									</Box>
								</Tooltip>
							</Grid>
						))}
					</Grid>
				</Box>
			</Box>
		);
	} else {
		return (<div></div>);
	}

};

export default DropListOverlay;