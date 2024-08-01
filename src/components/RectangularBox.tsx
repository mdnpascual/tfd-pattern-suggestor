import React, { useState } from 'react';
import '../App.css'; // Assume CSS is defined here
import { GearPart } from '../data/constants';
import { Button } from '@mui/material';

interface RectangularBoxProps {
	title: string;
	backgroundImage: string;
	outlineColor: string;
	xOffset: number;
	yOffset: number;
	onSelect: (title: string) => void;
	onOwned: (title: string) => void;
}

const RectangularBox: React.FC<RectangularBoxProps> = ({
	title,
	backgroundImage,
	outlineColor,
	xOffset,
	yOffset,
	onSelect,
	onOwned
}) => {
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className="rectangular-box"
			style={{
				backgroundImage: `url(${backgroundImage})`,
				borderColor: outlineColor,
				backgroundPositionX: xOffset + 'px',
				backgroundPositionY: yOffset + 'px'
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			onClick={() => onSelect(title)}>
			<div className="title">{title}</div>
			{hovered && (
			<div className="rectangular-overlay">
				<Button variant="contained" color="secondary" onClick={(e) => {e.stopPropagation(); onOwned(title)}}>
					✅ Owned
				</Button>
			</div>
		)}
		</div>
	);
};

export default RectangularBox;