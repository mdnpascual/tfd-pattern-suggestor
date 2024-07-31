import React, { useState } from 'react';
import '../App.css'; // Assume CSS is defined here
import { GearPart } from '../data/constants';

interface RectangularBoxProps {
	title: string;
	backgroundImage: string;
	outlineColor: string;
	items: GearPart[];
}

const RectangularBox: React.FC<RectangularBoxProps> = ({ title, backgroundImage, outlineColor, items }) => {
	const [hovered, setHovered] = useState(false);

	return (
		<div
			className="rectangular-box"
			style={{
				backgroundImage: `url(${backgroundImage})`,
				borderColor: outlineColor
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}>
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