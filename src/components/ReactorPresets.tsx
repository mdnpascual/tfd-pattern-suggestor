import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
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
		<Accordion expanded={isOpen} onChange={handleToggle} sx={{mt:'10px'}}>
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
					<Grid container spacing={2} sx={{ mt: 0 }}>
						<Grid item xs={isMobile ? 12 : 4}>
							<FormControl fullWidth>
								<InputLabel>Element</InputLabel>
								<Select
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
						<PresetCard
							key={index + preset.title}
							preset={preset}
							index={index}
							weapons={weaponTypes[preset.ammoType]}
							openConfirmDeleteDialog={openConfirmDeleteDialog}/>
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