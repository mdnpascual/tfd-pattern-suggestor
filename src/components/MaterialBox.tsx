import React, { useState } from 'react';
import '../App.css'; // Assume CSS is defined here
import { Box, Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MaterialBoxProps {
	title: string;
	backgroundImage: string;
	xOffset: number;
	yOffset: number;
	onSelect: (title: string) => void;
	onOwned: (title: string) => void;
	scale?: number;
	disableOwnership?: boolean;
}

const CustomTextField = styled(TextField)({
	'& .MuiInputBase-root': {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		color: '#fff',
		fontSize: '2rem',
		'& .MuiOutlinedInput-input': {
		padding: '4px',
		paddingTop: '6px',
		paddingBottom: '6px',
		textAlign: 'right',
		},
	},
	'& .MuiInputLabel-root': {
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		color: '#fff',
		padding: '0 5px',
	},
});

const MaterialBox: React.FC<MaterialBoxProps> = ({
	title,
	backgroundImage,
	xOffset,
	yOffset,
	onSelect,
	onOwned,
	scale,
	disableOwnership
}) => {
	const [hovered, setHovered] = useState(false);
	const isComplete = Math.round(Math.random())
	const [quantity, setQuantity] = useState<string>('');

	backgroundImage = backgroundImage.replaceAll(' ', '%20')

	const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuantity(event.target.value);
	};

	return (
		<div
			id={`${title.replaceAll(" ", "-")}-material-box`}
			className="material-box"
			style={{
				borderColor: isComplete ? "#6cfc8c" : "#fff",
				borderWidth: '5px',
				position: 'relative' // added for positioning child elements
			}}
			onMouseEnter={() => !disableOwnership && isComplete && setHovered(true)}
			onMouseLeave={() => !disableOwnership && isComplete && setHovered(false)}
			>

			<div
				style={{
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: '#fff', // White base background
					zIndex: -2
				}}
			/>

			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundImage: `url(${process.env.PUBLIC_URL}${backgroundImage})`,
					backgroundPositionX: `${xOffset}px`,
					backgroundPositionY: `${yOffset}px`,
					backgroundSize: scale ? `${scale}%` : 'cover',
					backgroundRepeat: 'no-repeat',
					zIndex: -1
				}}
			/>
			<div
				className="title"
				style={{
					padding: '10px',
					whiteSpace: 'nowrap',
					overflow: 'hidden',
					textOverflow: 'ellipsis'
				}}
				>
				{title}
			</div>
			<Box sx={{
				display: 'flex',
				justifyContent: 'flex-end',
				marginTop: '15px',
				paddingBottom: '5px',
				paddingRight: '3px',
			}}>
				<CustomTextField
					label="Count"
					variant="outlined"
					value={quantity}
					onChange={handleQuantityChange}
					inputProps={{ min: 0 }}
					sx={{ width: '100px' }}
				/>
			</Box>
		</div>
	);
};

export default MaterialBox;