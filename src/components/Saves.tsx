import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, Typography, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { localStorageKeys, SaveData } from "../data/constants";
import GoogleDriveSave from './GoogleDriveSave';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';

const compileData = () => {
	const newSaveData: { [key: string]: SaveData; } = {};

	localStorageKeys.forEach((localStorageKey) => {
		const value = localStorage.getItem(localStorageKey);
		if (value !== null) {
			newSaveData[localStorageKey] = value ? JSON.parse(value) : '';
		}
	});
	return newSaveData;
}

const Saves: React.FC = () => {
	const [saves, setSaves] = useState<Record<string, SaveData>>({});
	const [newSaveName, setNewSaveName] = useState('');
	const [deleteKey, setDeleteKey] = useState<string | null>(null);

	useEffect(() => {
		const storage = localStorage.getItem('saves');
		if (storage) {
			setSaves(JSON.parse(storage));
		}
	}, []);

	const handleSave = (key: string, data?: any) => {
		let updatedSaves = { ...saves }
		if (data) {
			updatedSaves[key] = data;
		} else {
			updatedSaves[key] = compileData();
		}

		setSaves(updatedSaves);
		localStorage.setItem('saves', JSON.stringify(updatedSaves));
	};

	const load = (data: SaveData) => {
		localStorageKeys.forEach((localStorageKey) => {
			if (data[localStorageKey]) {
				localStorage.setItem(localStorageKey, JSON.stringify(data[localStorageKey]))
			} else {
				localStorage.setItem(localStorageKey, '')
			}
		})
	}

	const handleLoad = (key: string) => {
		load(saves[key]);
	};

	const handleNewSave = () => {
		if (newSaveName.trim()) {
			const newSaveData: { [key: string]: any; } = compileData();

			handleSave(newSaveName, newSaveData);
			setNewSaveName('');
		}
	};

	const handleLoadFromGoogleDrive = (saveJSON: any) => {
		setSaves(saveJSON);
		load(saveJSON[Object.keys(saveJSON)[0]]);
	};

	const handleRename = (oldKey: string, newKey: string) => {
		if (newKey.trim() && oldKey !== newKey && !saves[newKey]) {
			const updatedSaves: { [key: string]: any } = {};
			const keys = Object.keys(saves);
			const position = keys.indexOf(oldKey);

			keys.forEach((key, index) => {
				if (index === position) {
					updatedSaves[newKey] = saves[oldKey];
				} else {
					updatedSaves[key] = saves[key];
				}
			});

			setSaves(updatedSaves);
			localStorage.setItem('saves', JSON.stringify(updatedSaves));
		}
	};

	const moveSave = (index: number, direction: 'up' | 'down') => {
		const keys = Object.keys(saves);
		const newIndex = direction === 'up' ? index - 1 : index + 1;

		if (newIndex >= 0 && newIndex < keys.length) {
			const reorderedKeys = [...keys];
			const [movedKey] = reorderedKeys.splice(index, 1);
			reorderedKeys.splice(newIndex, 0, movedKey);

			const reorderedSaves: Record<string, SaveData> = {};
			reorderedKeys.forEach(key => {
				reorderedSaves[key] = saves[key];
			});

			setSaves(reorderedSaves);
			localStorage.setItem('saves', JSON.stringify(reorderedSaves));
		}
	};

	const handleDelete = (key: string) => {
		const updatedSaves = { ...saves };
		delete updatedSaves[key];
		setSaves(updatedSaves);
		localStorage.setItem('saves', JSON.stringify(updatedSaves));
		setDeleteKey(null);  // Close the dialog after deletion
	};

	const confirmDelete = (key: string) => {
		setDeleteKey(key);
	};

	return (
		<Box>
			<Box sx={{
				maxHeight: '50vh',
				overflowY: 'auto',
				p: 1,
			}}>
				{Object.keys(saves).map((key, index) => (
					<Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
						<TextField
							value={key}
							onChange={(e) => handleRename(key, e.target.value)}
							variant="outlined"
							size="small"
							sx={{ mr: 2 }}
						/>
						<Button
							variant="contained"
							color="primary"
							sx={{ mr: 2 }}
							onClick={() => handleSave(key)}
						>
							Save
						</Button>
						<Button
							variant="contained"
							color="secondary"
							onClick={() => handleLoad(key)}
						>
							Load
						</Button>
						<IconButton
							onClick={() => moveSave(index, 'up')}
							disabled={index === 0}
						>
							<ArrowUpwardIcon />
						</IconButton>
						<IconButton
							onClick={() => moveSave(index, 'down')}
							disabled={index === Object.keys(saves).length - 1}
						>
							<ArrowDownwardIcon />
						</IconButton>
						<IconButton
							onClick={() => confirmDelete(key)}
						>
							<DeleteIcon />
						</IconButton>
					</Box>
				))}
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<TextField
						value={newSaveName}
						onChange={(e) => setNewSaveName(e.target.value)}
						placeholder="New Save"
						variant="outlined"
						size="small"
						sx={{ mr: 2 }}
					/>
					<Button
						variant="contained"
						color="primary"
						sx={{ mr: 2 }}
						onClick={handleNewSave}
					>
						Save
					</Button>
					<Button
						variant="contained"
						color="secondary"
						disabled
					>
						Load
					</Button>
				</Box>
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 2 }}>
					<Typography variant="body1">Google Drive sync</Typography>
					<Tooltip title="API Access to Google Drive is currently pending review by Google.">
						<Chip label="Pending" color="warning" sx={{ ml: 1 }} />
					</Tooltip>
				</Box>
				<GoogleDriveSave onLoadFromGoogleDrive={handleLoadFromGoogleDrive} />
			</Box>
			<Dialog
				open={deleteKey !== null}
				onClose={() => setDeleteKey(null)}
			>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete the save "{deleteKey}"? This action cannot be undone.
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
		</Box>
	);
};

export default Saves;