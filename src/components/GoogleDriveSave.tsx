import React, { useEffect, useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
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
import { gapi } from 'gapi-script';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const CLIENT_ID = '657627652232-n7saeafbbucmtrl3ncg6eih78fv03dqs.apps.googleusercontent.com';
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

	const handleSnackbarClose = () => {
		setSnackbarMessage(null);
	};

    const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
    };

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		gapi.load('client:auth2', () => {
			gapi.auth2.init({
				client_id: CLIENT_ID,
				scope: SCOPES,
			}).then(() => {
				const authInstance = gapi.auth2.getAuthInstance();
				if (authInstance.isSignedIn.get()) {
					const currentUser = authInstance.currentUser.get();
					if (currentUser.hasGrantedScopes(SCOPES)) {
						const accessToken = currentUser.getAuthResponse().access_token;
						setToken(accessToken);
						setIsLoggedIn(true);
						findFileIdAndFetchMetadata(accessToken);
					} else {
						authInstance.signIn({ scope: SCOPES });
					}
				}
			});
		});
	}, []);

	const findFileIdAndFetchMetadata = async (accessToken: string) => {
		try {
			const response = await gapi.client.request({
				path: '/drive/v3/files',
				method: 'GET',
				params: {
					q: `name='${FILE_NAME}' and trashed=false`,
					fields: 'files(id, name, modifiedTime)',
				},
				headers: {
					'Authorization': `Bearer ${accessToken}`,
				},
			});

			const files = response.result.files;
			if (files && files.length > 0) {
				setFileId(files[0].id);
				setLastModifiedTime(files[0].modifiedTime);
			}
		} catch (error) {
			showSnackbar('Error finding save file: ' + error, 'error');
		}
	};

	const onSuccess = (response: any) => {
		const authInstance = gapi.auth2.getAuthInstance();
		const currentUser = authInstance.currentUser.get();
		const accessToken = currentUser.getAuthResponse().access_token;

		if (currentUser.hasGrantedScopes(SCOPES)) {
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

		const request = gapi.client.request({
			path: `/upload/drive/v3/files${fileId ? "/" + fileId : undefined}`,
			method: fileId ? 'PATCH' : 'POST',
			params: { uploadType: 'multipart' },
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': `multipart/related; boundary="${boundary}"`,
			},
			body: multipartRequestBody,
		});

		request.execute((file: any) => {
			showSnackbar('Saves synced to Google Drive', 'success');
			setFileId(file.id); // Store the file ID for future updates
			setLastModifiedTime(new Date().toISOString());
			setIsProcessing(false);
		});
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

		const request = gapi.client.request({
			path: `/drive/v3/files/${fileId}`,
			method: 'GET',
			params: { alt: 'media' },
			headers: {
				'Authorization': `Bearer ${token}`,
			},
		});

		request.execute((fileContent: any) => {
			const saves = fileContent;
			localStorage.setItem('saves', JSON.stringify(saves));
			showSnackbar('Saves Loaded from Google Drive', 'success');
			onLoadFromGoogleDrive(saves);
			setIsProcessing(false);
		});
	};

	const handleSaveClick = () => {
		setShowConfirmDialog(true);
	};

	return (
		<Box sx={{ p: 2, alignItems: 'center' }}>
			{!isLoggedIn ? (
				<GoogleLogin
					onSuccess={onSuccess}
					onError={onError}
				/>
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
