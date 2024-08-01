import React, { useState } from 'react';
import '../App.css'; // Assume CSS is defined here
import { GearPart } from '../data/constants';

interface RectangularBoxProps {
	title: string;
	backgroundImage: string;
	outlineColor: string;
	items: GearPart[];
	xOffset: number;
	yOffset: number;
	onSelect: (title: string) => void;
}

const RectangularBox: React.FC<RectangularBoxProps> = ({ title, backgroundImage, outlineColor, items, xOffset, yOffset, onSelect }) => {
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
					{items.map((item, index) => (
						<div key={index} className="rectangular-item">
						<strong>{item.name}</strong>
						<ul>
							{item.mats?.map((mat, idx) => (
							<li key={idx}>{mat.name}: {mat.quantity}</li>
							))}
						</ul>
						</div>
					))}
			</div>
		)}
		</div>
	);
};

export default RectangularBox;