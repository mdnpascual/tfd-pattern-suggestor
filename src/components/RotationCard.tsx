import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LocationData } from './Rotation';
import { SchedulePresetObject, estimateSecondaryRatio } from '../data/constants';

interface RotationCardProps {
	schedule: SchedulePresetObject;
	locationData: LocationData;
}

const formatDuration = (durationInSeconds: number) => {
	const minutes = Math.floor(durationInSeconds / 60);
	const seconds = durationInSeconds % 60;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const allAmmo = () => (
	<div>
		<img
			src={`${process.env.PUBLIC_URL}/img/icons/General.png`}
			alt={`General icon`}
			style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
		/>
		<img
			src={`${process.env.PUBLIC_URL}/img/icons/Impact.png`}
			alt={`Impact icon`}
			style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
		/>
		<img
			src={`${process.env.PUBLIC_URL}/img/icons/Special.png`}
			alt={`Special icon`}
			style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
		/>
		<img
			src={`${process.env.PUBLIC_URL}/img/icons/High-Power.png`}
			alt={`High-Power icon`}
			style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
		/>
	</div>
)

const RotationCard: React.FC<RotationCardProps> = ({
	schedule,
	locationData
}) => {
	const [hovered, setHovered] = useState(false);

	const location = schedule.location;
	const type = schedule.type;
	const rewards = schedule.rewards;
	const combinedTooltip = schedule.combined;
	const rotationTooltip = schedule.rotation;
	const staticTooltip = schedule.static;
	const tooltips = [
		{ label: "Matched Presets (Combined)", tooltip: combinedTooltip },
		{ label: "Matched Presets (Rotation)", tooltip: rotationTooltip },
		{ label: "Matched Presets (Static)", tooltip: staticTooltip },
	];
	const renderedTooltips = tooltips.filter(({ tooltip }) => tooltip.length > 0);

	const isReactor = type === "Reactor";
	const rotationType = isReactor ? ' reactors' : " " + type.split(" ")[0].toLocaleLowerCase()

	const handleTouchStart = () => setHovered(true);
	const handleTouchEnd = () => setHovered(false);

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
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
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
					{renderedTooltips.map(({ label, tooltip }, index) => (
						<div key={index}>
							{label}:<br />
							{tooltip.map((preset, presetIndex) => (
								<div key={presetIndex}>{preset}</div>
							))}
							{index < renderedTooltips.length - 1 && <br />}
						</div>
					))}
				</Box>
			)}
			<Typography>
				{location}
			</Typography>

			<Typography>
				Best Mission: {locationData.bestMission} ({locationData.missionNotes !== "ESTIMATE" ? locationData.duration !== 1000 ? formatDuration(locationData.duration)  : '?:??' : "~" + formatDuration(locationData.duration)})
			</Typography>
			{(locationData.missionNotes !== "" && locationData.missionNotes !== "ESTIMATE") &&
			<Typography>
				Mission Notes: {locationData.missionNotes}
			</Typography>}


			<table style={{ width: '100%', borderCollapse: 'collapse' }}>
				<thead>
				<tr>
					<th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #000' }}>Rotation: {locationData.missionNotes !== "ESTIMATE" ? locationData.reactorPerMin !== 0 ? locationData.reactorPerMin.toString() + rotationType + ' / min' : '[Data Collection in Progress]' : "~" + locationData.reactorPerMin.toString() + rotationType + ' / min'}</th>
					<th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #000' }}>Static: {locationData.secondaryMissionNotes !== "ESTIMATE" ? locationData.secondaryReactorPerMin !== 0 ? locationData.secondaryReactorPerMin.toString() + ' reactors / min' : '[Data Collection in Progress]' : "~" + (locationData.reactorPerMin * estimateSecondaryRatio).toFixed(2).toString() + ' reactors / min'}</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td>
						{isReactor && (<Typography>
							<img
							src={`${process.env.PUBLIC_URL}/img/icons/${rewards.reactor_element_type}.png`}
							alt={`${rewards.reactor_element_type} icon`}
							style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
							/>
							{rewards.reactor_element_type}
						</Typography>)}
					</td>
					<td>
						<Typography>
							<img
							src={`${process.env.PUBLIC_URL}/img/icons/${locationData.secondaryElement}.png`}
							alt={`${locationData.secondaryElement} icon`}
							style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
							/>
							{locationData.secondaryElement}
						</Typography>
					</td>
				</tr>
				<tr>
					<td>
						<Typography>
							<img
							src={`${process.env.PUBLIC_URL}/img/icons/${isReactor ? rewards.arche_type : type.split(" ")[0]}.png`}
							alt={`${isReactor ? rewards.arche_type : type.split(" ")[0]} icon`}
							style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
							/>
							{isReactor ? rewards.arche_type : type.split(" ")[0]}
						</Typography>
					</td>
					<td>
						<Typography>
							<img
							src={`${process.env.PUBLIC_URL}/img/icons/${locationData.secondarySkill}.png`}
							alt={`${locationData.secondarySkill} icon`}
							style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
							/>
							{locationData.secondarySkill}
						</Typography>
					</td>
				</tr>
				<tr>
					<td>
						{isReactor && (<Typography>
							<img
							src={`${process.env.PUBLIC_URL}/img/icons/${rewards.weapon_rounds_type.replace(/ Rounds$/, '')}.png`}
							alt={`${rewards.weapon_rounds_type} icon`}
							style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
							/>
							{rewards.weapon_rounds_type}
						</Typography>)}
					</td>
					<td>
						<Typography>
							{locationData.secondaryAmmo !== "*" ? <img
							src={`${process.env.PUBLIC_URL}/img/icons/${locationData.secondaryAmmo}.png`}
							alt={`${locationData.secondaryAmmo} icon`}
							style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
							/> : allAmmo()}
						</Typography>
					</td>
				</tr>
				</tbody>
			</table>

		</Box>
	);
};

export default RotationCard;
