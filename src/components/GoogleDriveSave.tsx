import React, { useEffect, useState } from 'react';
import { googleLogout, useGoogleLogin, hasGrantedAllScopesGoogle } from '@react-oauth/google';
import {
	Alert,
	Box,
	Button,
	Snackbar,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'tfd-pattern-suggestor-saves.json';

const GoogleDriveSave: React.FC<{onLoadFromGoogleDrive: (saveJSON: any) => void}> = ({onLoadFromGoogleDrive}) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState<string | undefined>(undefined);
	const [fileId, setFileId] = useState<string | null>(null);
	const [lastModifiedTime, setLastModifiedTime] = useState<string | null>(null);
	const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
	const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
	const [isProcessing, setIsProcessing] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);

	const tokenValid = async (accessToken: string) => {
		try {
			const response = await fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + accessToken);
			const data = await response.json();
			if (data.error) {
				throw new Error('Invalid token');
			}

			setIsLoggedIn(true);
			setToken(accessToken);
			findFileIdAndFetchMetadata(accessToken);
		} catch (error) {
			setIsLoggedIn(false);
			setToken(undefined);
			localStorage.removeItem('googleAccessToken');
			showSnackbar('Google login has expired. Please log in again to use Google Drive sync: ' + error, 'info');
		}
	};

	useEffect(() => {
		const accessToken = localStorage.getItem('googleAccessToken');
		if (!accessToken) {
			return;
		}
		tokenValid(accessToken);
	}, []);

	const handleSnackbarClose = () => {
		setSnackbarMessage(null);
	};

	const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
		setSnackbarMessage(message);
		setSnackbarSeverity(severity);
	};

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const findFileIdAndFetchMetadata = async (accessToken: string) => {
		try {
			const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${FILE_NAME}' and trashed=false&fields=files(id,name,modifiedTime)`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const data = await response.json();
			if (data.files && data.files.length > 0) {
				setFileId(data.files[0].id);
				setLastModifiedTime(data.files[0].modifiedTime);
			}
		} catch (error) {
			showSnackbar('Error finding save file: ' + error, 'error');
		}
	};

	const onSuccess = (response: any) => {
		const accessToken = response.access_token;

		if (hasGrantedAllScopesGoogle(response, SCOPES)) {
			localStorage.setItem('googleAccessToken', accessToken);
			setIsLoggedIn(true);
			setToken(accessToken);
			findFileIdAndFetchMetadata(accessToken);
		} else {
			showSnackbar('User did not grant the required scopes.', 'error');
		}
	};

	const onError = () => {
		showSnackbar('Login Failed', 'error');
	};

	const handleLogout = () => {
		googleLogout();
		localStorage.removeItem('googleAccessToken');
		setIsLoggedIn(false);
		setToken(undefined);
		setFileId(null);
	};

	const saveToGoogleDrive = async () => {
		setShowConfirmDialog(false);

		if (!token) {
			showSnackbar('Failed to fetch auth token', 'error');
			return;
		}

		const saves = localStorage.getItem('saves');
		if (!saves) {
			showSnackbar('No Saves found', 'info');
			return;
		}

		setIsProcessing(true);

		const boundary = 'foo_bar_baz';
		const metadata = {
			name: FILE_NAME,
			mimeType: 'application/json',
		};

		const multipartRequestBody =
			`--${boundary}\r\n` +
			'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
			JSON.stringify(metadata) + '\r\n' +
			`--${boundary}\r\n` +
			'Content-Type: application/json\r\n\r\n' +
			saves + '\r\n' +
			`--${boundary}--`;

		try {
			const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files${fileId ? '/' + fileId : ''}?uploadType=multipart`, {
				method: fileId ? 'PATCH' : 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': `multipart/related; boundary="${boundary}"`,
				},
				body: multipartRequestBody,
			});

			const file = await response.json();
			showSnackbar('Saves synced to Google Drive', 'success');
			setFileId(file.id); // Store the file ID for future updates
			setLastModifiedTime(new Date().toISOString());
		} catch (error) {
			showSnackbar('Failed to save to Google Drive: ' + error, 'error');
		} finally {
			setIsProcessing(false);
		}
	};

	const loadFromGoogleDrive = async () => {
		if (!token) {
			showSnackbar('Failed to fetch auth token', 'error');
			return;
		}

		if (!fileId) {
			showSnackbar('Failed to sync save data', 'error');
			return;
		}

		setIsProcessing(true);

		try {
			const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			const fileContent = await response.json();
			localStorage.setItem('saves', JSON.stringify(fileContent));
			showSnackbar('Saves Loaded from Google Drive', 'success');
			onLoadFromGoogleDrive(fileContent);
		} catch (error) {
			showSnackbar('Failed to load from Google Drive: ' + error, 'error');
		} finally {
			setIsProcessing(false);
		}
	};

	const handleSaveClick = () => {
		setShowConfirmDialog(true);
	};

	const login = useGoogleLogin({
		scope: SCOPES,
		onSuccess: onSuccess,
		onError: onError,
	});

	return (
		<Box sx={{ p: 2, alignItems: 'center' }}>
			{!isLoggedIn ? (

				<Button
					color="primary"
					onClick={() => login()}
					variant='contained'
				>
					Sign in with Google 🚀
				</Button>
			) : (
				<Box>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSaveClick}
						sx={{ mr: 1 }}
						disabled={isProcessing}
					>
						{isMobile ? 'Save' : 'Save to Google Drive'}
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={loadFromGoogleDrive}
						sx={{ mr: 1 }}
						disabled={!fileId || isProcessing}
					>
						{isMobile ? 'Load' : 'Load from Google Drive'}
					</Button>
					<Button
						variant="contained"
						color="secondary"
						onClick={handleLogout}
						disabled={isProcessing}
					>
						Logout
					</Button>
					{lastModifiedTime && (
						<Typography variant="body2" color="textSecondary" sx={{pt: 2}}>
							Last synced at: {new Date(lastModifiedTime).toLocaleString()}
						</Typography>
					)}
				</Box>
			)}
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

			<Dialog
				open={showConfirmDialog}
				onClose={() => setShowConfirmDialog(false)}
			>
				<DialogTitle>Confirm Sync</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Have you clicked the Save button for the local saves before syncing to Google Drive?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowConfirmDialog(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={saveToGoogleDrive} color="secondary">
						Yes, Continue
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default GoogleDriveSave;
