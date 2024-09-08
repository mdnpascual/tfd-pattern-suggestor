import React, { useState } from 'react';
import '../App.css';
import { Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MaterialBoxProps {
	title: string;
	incomingQuantity: number;
	backgroundImage: string;
	xOffset: number;
	yOffset: number;
	onSelect: (title: string) => void;
	onQuantityChange: (quantity: number) => void;
	scale?: number;
	isComplete?: boolean;
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
	incomingQuantity,
	backgroundImage,
	xOffset,
	yOffset,
	onSelect,
	onQuantityChange,
	scale,
	isComplete
}) => {
	const [hovered, setHovered] = useState(false);
	const [quantity, setQuantity] = useState<number>(incomingQuantity);
	const [previousQuantity, setPreviousQuantity] = useState<number>(incomingQuantity);

	backgroundImage = backgroundImage.replaceAll(' ', '%20')

	const handleQuantityChange = (event: React.FocusEvent<HTMLInputElement>) => {
		const newValue = Number(event.target.value);
		if (newValue !== previousQuantity) {
			setQuantity(newValue);
			onQuantityChange(newValue);
		}
		setPreviousQuantity(newValue);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(event.target.value);
		setPreviousQuantity(quantity);
		setQuantity(newValue);
	};

	return (
		<div
			id={`${title.replaceAll(" ", "-")}-material-box`}
			className="material-box"
			style={{
				borderColor: isComplete ? "#6cfc8c" : "#F44336",
				borderWidth: '5px',
				position: 'relative'
			}}
			onClick={() => onSelect(title)}>

			<div
				style={{
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: '#fff',
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
					onBlur={handleQuantityChange}
					onChange={handleInputChange}
					inputProps={{ min: 0 }}
					sx={{ width: '100px' }}
				/>
			</Box>
		</div>
	);
};

export default MaterialBox;