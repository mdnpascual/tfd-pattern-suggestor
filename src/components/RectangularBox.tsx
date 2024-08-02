import React, { useState } from 'react';
import '../App.css'; // Assume CSS is defined here
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Button } from '@mui/material';

interface RectangularBoxProps {
	title: string;
	backgroundImage: string;
	xOffset: number;
	yOffset: number;
	onSelect: (title: string) => void;
	onOwned: (title: string) => void;
	isDisabled?: boolean;
}

const RectangularBox: React.FC<RectangularBoxProps> = ({
	title,
	backgroundImage,
	xOffset,
	yOffset,
	onSelect,
	onOwned,
	isDisabled
}) => {
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className="rectangular-box"
			style={{
				backgroundImage: `url(${backgroundImage})`,
				borderColor: isDisabled ? "#6cfc8c" : "#fff",
				borderWidth: '5px',
				backgroundPositionX: xOffset + 'px',
				backgroundPositionY: yOffset + 'px'
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={() => !isDisabled && onSelect(title)}>
			{isDisabled && (
				<Box sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'rgba(255, 255, 255, 0.5)'
					}}>
					<CheckCircleOutlineIcon sx={{ fontSize: 100, color: '#6cfc8c' }} />
				</Box>
			)}
			<div className="title">{title}</div>
			{hovered && (
			<div className="rectangular-overlay">
				<Button variant="contained" color="secondary" onClick={(e) => {onOwned(title); e.stopPropagation();}}>
					{isDisabled && ('❌ Unown')}
					{!isDisabled && ('✅ Owned')}
				</Button>
			</div>
		)}
		</div>
	);
};

export default RectangularBox;