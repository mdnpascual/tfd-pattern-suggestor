import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AMMO_TYPES, ELEMENTS, ItemPreset, SKILL_TYPES } from "../data/constants";
import { useEffect, useState } from "react";
import PresetCard from "./PresetCard";
import WeaponRawData from '../data/weapons.json';
import { CategoryData } from "./CategoryList";
import GetLocalStorageItem from "../utils/GetLocalStorageItem";

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
	const [isOpen, setIsOpen] = useState(false);
	const [weaponTypes, setWeaponTypes] = useState<Record<string, string[]>>({});
	const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		const data = WeaponRawData as Record<string, CategoryData>
		const result: Record<string, string[]> = {};

		for (const weaponName in data) {
			const weapon: CategoryData = data[weaponName];
			const ammoType = weapon.ammoType!;

			if (!result[ammoType]) {
				result[ammoType] = [];
			}

			result[ammoType].push(weaponName);
		}

		setWeaponTypes(result)

		const savedState = GetLocalStorageItem<boolean>('reactorPresetsAccordion', true);
		setIsOpen(savedState);

	}, []);

	const handleToggle = () => {
		const newState = !isOpen;
		setIsOpen(newState);
		localStorage.setItem('reactorPresetsAccordion', JSON.stringify(newState));
	};

	const addUserPreset = () => {
		console.log(userPreset)
		if (userPreset?.title && userPreset?.element && userPreset?.ammoType && userPreset?.skillType) {
			setPresets([...presets, { ...userPreset }]);
			setUserPreset(null);
		} else {
			let error = []
			if (!userPreset?.title) error.push("Title cannot be empty")
			if (!userPreset?.element) error.push("Element cannot be empty")
			if (!userPreset?.ammoType) error.push("Ammo Type cannot be empty")
			if (!userPreset?.skillType) error.push("Skill Type cannot be empty")
			showSnackbar(error.join("<br/>"), 'error');
		}
	};

	const handleSnackbarClose = () => {
		setSnackbarMessage(null);
	};

	const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
		setSnackbarMessage(message);
		setSnackbarSeverity(severity);
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
		<Accordion expanded={isOpen} onChange={handleToggle} sx={{mt:'10px'}}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography>List of Reactor Presets</Typography>
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
					<Grid container spacing={2} sx={{ mt: 0 }}>
						<Grid item xs={isMobile ? 12 : 4}>
							<FormControl fullWidth>
								<InputLabel>Element</InputLabel>
								<Select
									label="Element"
									value={userPreset?.element || ''}
									onChange={(e) => setUserPreset({ ...userPreset, element: e.target.value } as ItemPreset)}
								>
									{ELEMENTS.map((element, index) => (
										<MenuItem key={index} value={element}>
											<img
												src={`${process.env.PUBLIC_URL}/img/icons/${element}.png`}
												alt={element}
												style={{ width: 24, height: 24, marginRight: 8 }}
											/>
											{element}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={isMobile ? 12 : 4}>
							<FormControl fullWidth>
								<InputLabel>Ammo Type</InputLabel>
								<Select
									label="Ammo Type"
									value={userPreset?.ammoType || ''}
									onChange={(e) => setUserPreset({ ...userPreset, ammoType: e.target.value } as ItemPreset)}
								>
									{AMMO_TYPES.map((ammo, index) => (
										<MenuItem key={index} value={ammo}>
											<img
												src={`${process.env.PUBLIC_URL}/img/icons/${ammo}.png`}
												alt={ammo}
												style={{ width: 24, height: 24, marginRight: 8 }}
											/>
											{ammo}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={isMobile ? 12 : 4}>
							<FormControl fullWidth>
								<InputLabel>Skill Type</InputLabel>
								<Select
									label="Skill Type"
									value={userPreset?.skillType || ''}
									onChange={(e) => setUserPreset({ ...userPreset, skillType: e.target.value } as ItemPreset)}
								>
									{SKILL_TYPES.map((skill, index) => (
										<MenuItem key={index} value={skill}>
											<img
												src={`${process.env.PUBLIC_URL}/img/icons/${skill}.png`}
												alt={skill}
												style={{ width: 24, height: 24, marginRight: 8 }}
											/>
											{skill}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
					</Grid>
					<Button onClick={addUserPreset} variant="contained" sx={{ mt: 2 }}>
						Add Preset
					</Button>
				</Box>
				<Box sx={{ mt: 2 }} overflow={'auto'} maxHeight={isMobile ? '43vh' : undefined}>
					<Grid container spacing={2}>
					{presets.map((preset, index) => (
						weaponTypes[preset.ammoType] && (
							<PresetCard
								key={index + preset.title}
								preset={preset}
								index={index}
								weapons={weaponTypes[preset.ammoType]}
								openConfirmDeleteDialog={openConfirmDeleteDialog}
							/>
						)
					))}
					</Grid>
				</Box>
			</AccordionDetails>
			<Snackbar
				open={!!snackbarMessage}
				autoHideDuration={6000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
					<div dangerouslySetInnerHTML={{ __html: snackbarMessage ?? '' }} />
				</Alert>
			</Snackbar>
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