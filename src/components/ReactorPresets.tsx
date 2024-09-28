import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AMMO_TYPES, ELEMENTS, ItemPreset, SKILL_TYPES } from "../data/constants";
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';



interface ReactorPresetsProps {
	presets: ItemPreset[];
	setPresets: React.Dispatch<React.SetStateAction<ItemPreset[]>>
}

const ReactorPresets: React.FC<ReactorPresetsProps> = ({
	presets,
	setPresets
}) => {
	const [userPreset, setUserPreset] = useState<ItemPreset | null>(null);
	const [deleteKey, setDeleteKey] = useState<number | null>(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const addUserPreset = () => {
		if (userPreset) {
			setPresets([...presets, { ...userPreset }]);
			setUserPreset(null);
		}
	};

	const handleDelete = (index: number) => {
		const newPresets = presets.filter((_, i) => i !== index);
		setPresets(newPresets);
		setDeleteKey(null)
	};

	const openConfirmDeleteDialog = (index: number) => {
		setDeleteKey(index);
	};

	return (
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography>Reactor Presets</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Box>
					<Typography mb="5px">Add a User Preset:</Typography>
					<FormControl fullWidth>
						<TextField
							label="Title"
							value={userPreset?.title || ''}
							onChange={(e) => setUserPreset({ ...userPreset, title: e.target.value } as ItemPreset)}
							variant="outlined"
							sx={{ backgroundColor: '#333', color: '#fff' }}
							InputLabelProps={{style: { color: '#ccc' }}}
							InputProps={{style: { color: '#fff' }}}
						/>
					</FormControl>
					<Grid container spacing={2} sx={{ mt: 2 }}>
						<Grid item xs={isMobile ? 12 : 4}>
							<FormControl fullWidth>
								<InputLabel>Element</InputLabel>
								<Select
									value={userPreset?.element || ''}
									onChange={(e) => setUserPreset({ ...userPreset, element: e.target.value } as ItemPreset)}
								>
									{ELEMENTS.map((element, index) => (
										<MenuItem key={index} value={element}>{element}</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={isMobile ? 12 : 4}>
							<FormControl fullWidth>
								<InputLabel>Ammo Type</InputLabel>
								<Select
									value={userPreset?.ammoType || ''}
									onChange={(e) => setUserPreset({ ...userPreset, ammoType: e.target.value } as ItemPreset)}
								>
									{AMMO_TYPES.map((ammo, index) => (
										<MenuItem key={index} value={ammo}>{ammo}</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={isMobile ? 12 : 4}>
							<FormControl fullWidth>
								<InputLabel>Skill Type</InputLabel>
								<Select
									value={userPreset?.skillType || ''}
									onChange={(e) => setUserPreset({ ...userPreset, skillType: e.target.value } as ItemPreset)}
								>
									{SKILL_TYPES.map((skill, index) => (
										<MenuItem key={index} value={skill}>{skill}</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
					<Button onClick={addUserPreset} variant="contained" sx={{ mt: 2 }}>
						Add Preset
					</Button>
				</Box>
				<Box sx={{ mt: 2 }}>
					<Grid container spacing={2}>
					{presets.map((preset, index) => (
						<Grid item xs={12} sm={4} key={index}>
							<Box
								sx={{
									padding: 2,
									border: '1px solid #444',
									borderRadius: 2,
									backgroundColor: '#1b1b1b',
									color: '#ffffff',
									position: 'relative'
								}}
							>
								<IconButton
									onClick={() => openConfirmDeleteDialog(index)}
									sx={{
										position: 'absolute',
										top: 8,
										right: 8,
										color: 'white'
									}}
								>
									<DeleteIcon />
								</IconButton>
								<Typography>
									{preset.title}
								</Typography>
								<Typography>
									<img
										src={`${process.env.PUBLIC_URL}/img/icons/Fire.png`}
										alt={`${preset.element} icon`}
										style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
									/>{preset.element}
								</Typography>
								<Typography>
									<img
										src={`${process.env.PUBLIC_URL}/img/icons/General.png`}
										alt={`${preset.ammoType} icon`}
										style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
									/>{preset.ammoType}
								</Typography>
								<Typography>
								<img
										src={`${process.env.PUBLIC_URL}/img/icons/General.png`}
										alt={`${preset.skillType} icon`}
										style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
									/>{preset.skillType}
								</Typography>
							</Box>
						</Grid>
					))}
					</Grid>
				</Box>
			</AccordionDetails>
			<Dialog
				open={deleteKey !== null}
				onClose={() => setDeleteKey(null)}
			>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete the preset "{deleteKey !== null ? presets[deleteKey].title : ''}"? This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteKey(null)} color="primary">
						Cancel
					</Button>
					<Button onClick={() => handleDelete(deleteKey!)} color="secondary" autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Accordion>
	)
}

export default ReactorPresets;