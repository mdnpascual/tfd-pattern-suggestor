import React, { useMemo, useState } from 'react';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface PresetCardProps {
	preset: {
		title: string;
		element: string;
		ammoType: string;
		skillType: string;
	};
	index: number;
	weapons: string[];
	openConfirmDeleteDialog: (index: number) => void;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, index, weapons, openConfirmDeleteDialog }) => {
	const [hovered, setHovered] = useState(false);

	const weaponTooltips = useMemo(() => (
		<div>
			Weapons using {preset.ammoType} rounds:
			{weapons.map((weapon) => (
				<div key={weapon}>{weapon}</div>
			))}
		</div>
	), [preset.ammoType, weapons]);

	return (
		<Grid item xs={12} sm={3} key={index}>
			<Box
				sx={{
					padding: 2,
					border: '1px solid #444',
					borderRadius: 2,
					backgroundColor: hovered ? '#333' : '#1b1b1b',
					color: '#ffffff',
					position: 'relative',
					transition: 'background-color 0.3s',
				}}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				<IconButton
					onClick={() => openConfirmDeleteDialog(index)}
					onMouseEnter={(event) => setHovered(false)}
					onMouseLeave={() => setHovered(true)}
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						color: 'white'
					}}
				>
					<DeleteIcon />
				</IconButton>
				<Typography variant="h6">{preset.title}</Typography>
				<Typography>
					<img
						src={`${process.env.PUBLIC_URL}/img/icons/${preset.element}.png`}
						alt={`${preset.element} icon`}
						style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
					/>
					{preset.element}
				</Typography>
				<Tooltip
						title={weaponTooltips}
						key="next-previous"
						placement={'bottom'}
					>
					<Typography>
						<img
							src={`${process.env.PUBLIC_URL}/img/icons/${preset.ammoType}.png`}
							alt={`${preset.ammoType} icon`}
							style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
						/>
						{preset.ammoType}
					</Typography>
				</Tooltip>
				<Typography>
					<img
						src={`${process.env.PUBLIC_URL}/img/icons/${preset.skillType}.png`}
						alt={`${preset.skillType} icon`}
						style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
					/>
					{preset.skillType}
				</Typography>
			</Box>
		</Grid>
	);
};

export default PresetCard;
