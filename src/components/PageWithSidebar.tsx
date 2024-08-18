import React, { useState, ReactElement } from 'react';
import '../App.css'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import GenerateSuggestion from '../utils/GenerateSuggestions';
import { useNavigate } from 'react-router-dom';
import { getBooleanSetting } from './Settings';

interface SidebarItem {
	label: string;
	iconPath: string;
	Component: ReactElement;
}

interface PageWithSidebarProps {
	items: SidebarItem[];
}

const PageWithSidebarComponent: React.FC<PageWithSidebarProps> = ({ items }) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);
	const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
	const navigate = useNavigate();

	const realTimeSuggestorSetting = getBooleanSetting('realTimeSuggestor', false);

	const confirmGenerate = () => {
		setConfirmationOpen(true);
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<div className="page-container">
			<div className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
				{sidebarOpen && (
				<ul>
					{items.map((item, index) => (
					<li id={`${item.label.replaceAll(" ", "-")}-list-name`} key={index} onClick={() => setActiveIndex(index)}>
						<img src={item.iconPath} alt={item.label} style={{ width: 24, height: 24, marginRight: 10 }} />
						{item.label}
					</li>
					))}
					<li>
						<Button id="diff-button" disabled={realTimeSuggestorSetting} onClick={() => {confirmGenerate()}} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
							Generate Suggestion
						</Button>
					</li>
				</ul>
				)}
			</div>

			<button
				className={`toggle-button ${sidebarOpen ? '' : 'collapsed'}`}
				onClick={toggleSidebar}
			>
				{sidebarOpen ? '<<' : '>>'}
			</button>

			<div className="content">
				{items[activeIndex].Component}
			</div>

			<Dialog
				open={confirmationOpen}
				onClose={() => setConfirmationOpen(false)}
			>
				<DialogTitle>Confirm Generate Suggestion</DialogTitle>
				<DialogContent>
					<DialogContentText>
						This will overwrite the current selected list in the pattern suggestor, do you want to continue?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setConfirmationOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={() => {GenerateSuggestion(); navigate('/patternSuggestor');}} color="secondary" autoFocus>
						Continue
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default PageWithSidebarComponent;