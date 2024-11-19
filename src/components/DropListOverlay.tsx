import React, { useState, useMemo, useCallback } from 'react';
import { Box, Typography, TextField, Grid, Tooltip, IconButton } from '@mui/material';
import { TableItem } from './SortableTable';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ColorByGoal from '../utils/ColorByGoal';
import calculateRolls from '../utils/CalculateRolls';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

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
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const characterStatus = JSON.parse(localStorage.getItem('characterStatus') || '{}')
	const weaponStatus = JSON.parse(localStorage.getItem('weaponStatus') || '{}')

	const [percentileValues] = useState<number[]>(
		JSON.parse(localStorage.getItem('percentileValues') || '[0.5, 0.85, 0.95]')
	);

	const isEmptyShardRequirements = useCallback(() => {
		if (!shardRequirements) return true;
		if (shardRequirements.type === 'div' && (!shardRequirements.props.children || shardRequirements.props.children.length === 0)) {
			return true;
		}
		return false;
	}, [shardRequirements]);

	const computeTooltipShards = useCallback((count: number) => {
		if (isEmptyShardRequirements()) {
			return null;
		} else {
			return (
				<div>
					Total Shards Needed:
					{shardRequirements?.props.children.props.children[1].props.children[1].map((shard: any) => (
						<div key={shard.props.children[0]}>
							{shard.props.children[0]}: {shard.props.children[2] * count}
						</div>
					))}
				</div>
			);
		}
	}, [shardRequirements, isEmptyShardRequirements]);

	const getGoal = useCallback((name: string) => {
		if (materialCount[materialMapping[materialMapping[name]]] !== undefined) {
			// Don't count if Character or Weapon is marked as completed
			if (characterStatus[materialMapping[materialMapping[name]]] || weaponStatus[materialMapping[materialMapping[name]]]){
				return 0;
			}

			return Math.max(0, Math.min((materialCount[materialMapping[materialMapping[name]]] - (materialCount[materialMapping[name]] ?? 0)), Number.MAX_SAFE_INTEGER));
		} else {
			// Don't count if Character or Weapon is marked as completed
			if (characterStatus[materialMapping[name]] || weaponStatus[materialMapping[name]]){
				return 0;
			}

			return (materialCount[materialMapping[name]] ?? 0);
		}
	}, [materialCount, materialMapping]);

	const percentiles = useMemo(() => {
		if (dropTable) {
			const probabilities: Record<string, number> = {};
			const requirements: Record<string, number> = {};
			dropTable.drops.forEach((drop) => {
				const goal = getGoal(drop.name);
				if (ColorByGoal(materialCount[drop.name] ?? 0, goal, 1, materialCount) === "#F44336") {
					probabilities[drop.name] = drop.chance;
					requirements[drop.name] = goal - (materialCount[drop.name] ?? 0);
				}
			});
			return calculateRolls(probabilities, requirements, percentileValues);
		}
		return { percentiles: [], values: [] };
	}, [dropTable, materialCount, getGoal, percentileValues]);

	const handleMatCountChange = useCallback((name: string, newCount: number) => {
		onMatCountChange(name, newCount);
	}, [onMatCountChange]);

	if (dropTable) {
		return (
			<Box sx={{ p: 2, pt: 0, height: '95vh' }}>
				<Box sx={{ overflowY: 'auto', maxHeight: isEmptyShardRequirements() ? '15vh' : '25vh' }}>
					<Typography variant="h5" sx={{ fontWeight: 'bold' }}>
						Amorphous Pattern #{dropTable.name}
					</Typography>
					<Typography sx={{ mt: '20px', mb: '20px' }}>
						Drops From: {dropTable.dropsFrom}<br />
						Use In: {dropTable.useIn}
						{shardRequirements}
					</Typography>
				</Box>
				<Box
					id={`p${dropTable.name.replaceAll(" ", "-")}-droplist-overlay`}
					key={dropTable.name}
					sx={{
						mb: 0,
						width: isMobile ? '90vw' : undefined,
						maxHeight: isEmptyShardRequirements() ? '65vh' : '55vh',
						overflowY: 'auto',
						borderColor: 'transparent',
					}}
				>
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
								mb: 1}}>
							<Box sx={{ display: 'flex', width: '100%' }}>
								<Box sx={{ flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '70%' }}>
									<Typography variant="body2" sx={{ fontWeight: 'bold' }}>
										{(drop.chance * 100).toFixed(0)}%
									</Typography>
									<Typography
										variant="body1"
										sx={{
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											flexShrink: 1,
											width: '95%',
											pt: '10px',
											pb: '15px'
										}}>
										{drop.name}
									</Typography>
								</Box>

								<Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', mr: 1, width: '25%' }}>
									<Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
										<IconButton
											onClick={() => {isMobile
												? handleMatCountChange(drop.name, (materialCount[drop.name] ?? 0) + 1)
												: handleMatCountChange(drop.name, (materialCount[drop.name] ?? 0) - 1);
											}}
												size="small"
												sx={{
													borderRadius: '4px',
													padding: '8px 12px',
													mt: isMobile ? -1 : undefined,
													mb: isMobile ? 0 : 1
												}}>
											{isMobile ? (
												<ArrowUpwardIcon fontSize="small" />
											) : (
												<span>-</span>
											)}
										</IconButton>

										<TextField
											type="number"
											variant="outlined"
											size="small"
											value={materialCount[drop.name] ?? 0}
											onChange={(e) => handleMatCountChange(drop.name, parseInt(e.target.value))}
											sx={{
												width: '60px',
												mb: 1,
												'& input': {
													textAlign: 'center',
													MozAppearance: 'textfield',
													'&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
														display: 'none',
													},
												},
											}}
											inputProps={{ min: 0 }}
										/>

										<IconButton
											onClick={() => {isMobile
												? handleMatCountChange(drop.name, (materialCount[drop.name] ?? 0) - 1)
												: handleMatCountChange(drop.name, (materialCount[drop.name] ?? 0) + 1);
											}}
												size="small"
												sx={{
													borderRadius: '4px',
													padding: '8px 12px',
													mt: isMobile ? -1 : undefined,
													mb: isMobile ? 0 : 1
												}}>
											{isMobile ? (
												<ArrowDownwardIcon fontSize="small" />
											) : (
												<span>+</span>
											)}
										</IconButton>
									</Box>

									<Typography fontSize={16} variant="caption" sx={{ flexShrink: 0, whiteSpace: 'nowrap', mt: '-5px', ml: 2 }}>
										/ {getGoal(drop.name)}
									</Typography>
								</Box>
							</Box>
						</Box>
					))}
				</Box>
				<Box sx={{ overflowY: 'auto', maxHeight: '20vh' }} id={`p${dropTable.name.replaceAll(" ", "-")}-pattern-statistics`}>
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
		return null;
	}
};

export default React.memo(DropListOverlay);
