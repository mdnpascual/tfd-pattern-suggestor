import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { localStorageKeys } from "../data/constants";

const DebugComponent: React.FC = () => {

	const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
	const [loadString, setLoadString] = useState('');
	const [deviceDimensions, setDeviceDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight
	});
	const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

	const handleSnackbarClose = () => {
        setSnackbarMessage(null);
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
    };

	const confirmDelete = () => {
		setConfirmationOpen(true);
	};

	useEffect(() => {
		const handleResize = () => {
			setDeviceDimensions({
				width: window.innerWidth,
				height: window.innerHeight
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const copyLocalStorageToClipboard = () => {
		const localStorageData = JSON.stringify(localStorage);
		navigator.clipboard.writeText(localStorageData).then(
			() => showSnackbar('Local storage copied to clipboard.', 'info'),
			(err) => showSnackbar('Failed top copy to clipboard' + err, 'error')
		);
	};

	const loadStringIntoLocalStorage = () => {
		try {
			const parsedData = JSON.parse(loadString);
			for (const key in parsedData) {
				if (parsedData.hasOwnProperty(key)) {
					localStorage.setItem(key, parsedData[key]);
				}
			}
			showSnackbar('Local storage updated from string.', 'info');
		} catch (error) {
			showSnackbar('Invalid JSON string', 'error');
		}
	};

	const handleClearLocalStorage = () => {
		localStorageKeys.forEach((key) => {
			localStorage.setItem(key, '');
		})
		setConfirmationOpen(false)
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Button
				variant="outlined"
				color="error"
				onClick={() => confirmDelete()}
				sx={{ mb: 2 }}
			>
				Clear Local Storage
			</Button>
			<Button
				variant="outlined"
				color="secondary"
				onClick={copyLocalStorageToClipboard}
				sx={{ mb: 2 }}
			>
				Copy Local Storage to Clipboard
			</Button>
			<TextField
				label="Load JSON into Local Storage"
				variant="outlined"
				multiline
				rows={4}
				value={loadString}
				onChange={(e) => setLoadString(e.target.value)}
				sx={{ mb: 2, width: '100%' }}
			/>
			<Button
				variant="outlined"
				color="secondary"
				onClick={loadStringIntoLocalStorage}
				disabled={!loadString.trim()}
			>
				Load String into Local Storage
			</Button>
			<Typography variant="body2" sx={{ mt: 2 }}>
				Device Dimensions: {deviceDimensions.width} x {deviceDimensions.height}
			</Typography>
			<Dialog
				open={confirmationOpen}
				onClose={() => setConfirmationOpen(false)}
			>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to clear all selections?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmationOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={() => handleClearLocalStorage()} color="secondary" autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
                open={!!snackbarMessage}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
		</Box>
	)
}

export default DebugComponent;