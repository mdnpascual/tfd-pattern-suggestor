import React, { useEffect, useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { Alert, Box, Button, Snackbar } from '@mui/material';
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
	const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

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
						findFileId(accessToken);
					} else {
						authInstance.signIn({ scope: SCOPES });
					}
				}
			});
		});
	}, []);

	const findFileId = async (accessToken: string) => {
        try {
            const response = await gapi.client.request({
                path: '/drive/v3/files',
                method: 'GET',
                params: {
                    q: `name='${FILE_NAME}' and trashed=false`,
                    fields: 'files(id, name)',
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const files = response.result.files;
            if (files && files.length > 0) {
                setFileId(files[0].id);
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
		} else {
			showSnackbar('User did not grant the required scopes.', 'error');
		}
	};

	const onError = () => {
		console.log('Login failed');
	};

	const handleLogout = () => {
		googleLogout();
		setIsLoggedIn(false);
		setToken(undefined);
		setFileId(null);
	};

	const saveToGoogleDrive = async () => {
		if (!token) {
			showSnackbar('Failed to fetch auth token', 'error');
			return;
		}

		const saves = localStorage.getItem('saves');
		if (!saves) {
			showSnackbar('No Saves found', 'info');
			return;
		}

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
		});
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
						onClick={saveToGoogleDrive}
						sx={{ mr: 1 }}
					>
						{isMobile ? 'Save' : 'Save to Google Drive'}
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={loadFromGoogleDrive}
						sx={{ mr: 1 }}
						disabled={!fileId}
					>
						{isMobile ? 'Load' : 'Load from Google Drive'}
					</Button>
					<Button variant="contained" color="secondary" onClick={handleLogout}>
						Logout
					</Button>
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
		</Box>
	);
};

export default GoogleDriveSave;