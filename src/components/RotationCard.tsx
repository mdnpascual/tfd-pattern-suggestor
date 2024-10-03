import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LocationData } from './Rotation';

interface RotationCardProps {
	location: string;
	type: string;
	rewards: {
		reactor_element_type: string;
		weapon_rounds_type: string;
		arche_type: string;
	};
	title: string[];
	locationData: LocationData;
}

const formatDuration = (durationInSeconds: number) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const RotationCard: React.FC<RotationCardProps> = ({
	location,
	type,
	rewards,
	title,
	locationData
}) => {
	const [hovered, setHovered] = useState(false);

	return (
	<Box
		sx={{
			padding: 2,
			border: '1px solid #444',
			borderRadius: 2,
			backgroundColor: '#1b1b1b',
			color: '#ffffff',
			position: 'relative'
		}}
		onMouseEnter={() => setHovered(true)}
		onMouseLeave={() => setHovered(false)}
	>
		{hovered && type === 'Reactor' && (
			<Box
				sx={{
					position: 'absolute',
					bottom: '50%',
					left: '20%',
					backgroundColor: '#333',
					border: '1px solid #444',
					padding: '4px',
					zIndex: 10,
					whiteSpace: 'nowrap',
					color: '#fff',
				}}
			>
				Matched Presets:
				{title.map((preset, index) => (
					<div key={index}>{preset}</div>
				))}
			</Box>
		)}
		<Typography>
			{location}: {type}
		</Typography>

		{type === 'Reactor' && (
		<>
			<Typography>
			<img
				src={`${process.env.PUBLIC_URL}/img/icons/${rewards.reactor_element_type}.png`}
				alt={`${rewards.reactor_element_type} icon`}
				style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
			/>
			{rewards.reactor_element_type}
			</Typography>
			<Typography>
			<img
				src={`${process.env.PUBLIC_URL}/img/icons/${rewards.weapon_rounds_type.replace(/ Rounds$/, '')}.png`}
				alt={`${rewards.weapon_rounds_type} icon`}
				style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
			/>
			{rewards.weapon_rounds_type}
			</Typography>
			<Typography>
			<img
				src={`${process.env.PUBLIC_URL}/img/icons/${rewards.arche_type}.png`}
				alt={`${rewards.arche_type} icon`}
				style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
			/>
			{rewards.arche_type}
			</Typography>
		</>
		)}

		<Typography>
			Best Mission: {locationData.bestMission} ({locationData.duration !== 1000 ? formatDuration(locationData.duration)  : '?:??'})
		</Typography>
		<Typography>
			Drop Rate: {locationData.reactorPerMin !== 0 ? locationData.reactorPerMin.toString() + ' / min' : '[Data Collection in Progress]'}
		</Typography>
	</Box>
	);
};

export default RotationCard;
