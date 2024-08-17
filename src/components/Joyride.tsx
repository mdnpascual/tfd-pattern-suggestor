import { useState, useRef } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS, LIFECYCLE, Placement } from 'react-joyride';
import { useMediaQuery  } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BackupData, joyrideStyles, localStorageBackupKeys, SaveData } from '../data/constants';
import { useNavigate } from 'react-router-dom';

export const JoyrideWithNavigation = ({
	isTutorialOpen,
	handleCloseTutorial,
	backupData
}: {
	isTutorialOpen: boolean,
	handleCloseTutorial: () => void,
	backupData: { [key: string]: SaveData | BackupData;}
}) => {
	const [stepIndex, setStepIndex] = useState(0);
	const updatePosition = useRef<(() => void) | null>(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const navigate = useNavigate();

	const removeCSS = () => {
		const style = document.getElementById('joyride-dynamic-style');
		if (style) {
			document.head.removeChild(style);
		}
	};

	const injectCSS = (css: string) => {
		const style = document.createElement('style');
		style.type = 'text/css';
		style.id = 'joyride-dynamic-style';
		style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	};

	const loadBackupDataToLocalStorage = (backupData: { [key: string]: SaveData | BackupData }) => {
		localStorageBackupKeys.forEach((key) => {
			const data = backupData[key];
			if (data) {
				localStorage.setItem(key.replace("Backup", ""), JSON.stringify(data));
			}
		});
	};

	const joyrideSteps = [
		{
			target: '#gear-inventory-tab',
			content: (
				<div>
					<h3>Welcome to tfd-pattern-suggestor!</h3>
					<p>This guided tour will teach you how to use this tool effectively.</p>
					<p>If you're already familiar with the tool, press <b>Skip</b>.</p>
				</div>
			),
			disableBeacon: true,
			hideCloseButton: true
		},
		{
			target: '#Descendants-list-name',
			content: (
				<div>
					<p>For the tool to work effectively, it needs to know which characters and weapons you already own.</p>
				</div>
			),
		},
		{
			target: '#Luna-rectangular-box',
			content: (
				<div>
					<p>For this example, click on Luna.</p>
				</div>
			),
			spotlightClicks: true
		},
		{
			target: 'body',
			content: (
				<div>
					<p>To track your character's progress, it's best to input the current material counts. You can do this by going to the game's access info, selecting "Descendants," and then clicking on Luna.</p>
				</div>
			),
			placementBeacon: 'top' as Placement
		},
		{
			target: '#Luna-owned-button',
			content: (
				<div>
					<p>If you already own Luna, you can click this button to prevent the tool from suggesting her materials in the suggestor.</p>
				</div>
			),
		},
		{
			target: '#Afterglow-Sword-rectangular-box',
			content: (
				<div>
					<p>On the weapons tab, Click on Afterglow Sword</p>
				</div>
			),
			spotlightClicks: true
		},
		{
			target: '#Afterglow-Sword-desired-quantity',
			content: (
				<div>
					<p>The difference between the character and weapon/enhancement tabs is that you can set the desired quantity of weapons/enhancements you want.</p>
					<p>Set it to 0 if you want to ignore the weapon or enhancement.</p>
				</div>
			),
			placement: 'top-start' as Placement
		},
		{
			target: '#diff-button',
			content: (
				<div>
					<p>After setting up the Descendants, Weapons, and Enhancements you want, click this button.</p>
				</div>
			),
			placement: 'right' as Placement
		},
		{
			target: isMobile ? 'body' : '#material-list',
			content: (
				<div>
					<p>The left-hand side lists all the materials you need to farm based on the data you entered in the previous tab.</p>
					<p>For now, let's assume you're only missing Afterglow and Luna.</p>
				</div>
			),
			placement: isMobile ? undefined : 'right' as Placement,
			placementBeacon: isMobile ? 'top' as Placement : undefined
		},
		{
			target: "#pattern-suggested-list",
			content: (
				<div>
					<p>The right-hand side lists all the patterns that drop from the materials selected on the left.</p>
				</div>
			),
			placement: 'auto' as Placement
		},
		{
			target: isMobile ? 'body' : "#pattern-suggested-list",
			content: (
				<div>
					<p>The patterns are sorted by priority first.</p>
					<p>This is calculated based on the combined percentage of the items you want from the pattern.</p>
				</div>
			),
			placement: isMobile ? undefined : 'left' as Placement,
			placementBeacon: isMobile ? 'top' as Placement : undefined
		},
		{
			target: "#pattern-suggested-list table tbody tr td:nth-child(2)",
			content: (
				<div>
					<p>If you hover over this item, you'll see that the score of 52 comes from the combined percentage of Luna's Spiral Catalyst (20%) and the Afterglow Sword's Synthetic Fiber (32%).</p>
				</div>
			),
			placement: 'left' as Placement,
			spotlightClicks: true
		},
		{
			target: isMobile ? 'body' : '#material-list',
			content: (
				<div>
					<p>You can increase or decrease the priority of an item to better organize them.</p>
					<p>This is useful when you have selected many materials.</p>
				</div>
			),
			placement: isMobile ? undefined : 'right' as Placement,
			placementBeacon: isMobile ? 'top' as Placement : undefined,
			spotlightClicks: true
		},
		{
			target: "#list-header",
			content: (
				<div>
					<p>You can click on the header to sort by pattern name or percentage.</p>
				</div>
			),
			placement: 'bottom' as Placement,
			spotlightClicks: true
		},
		{
			target: "#checkbox-filters",
			content: (
				<div>
					<p>To see all the matching patterns, select "Normal" and "Hard" only.</p>
					<p>The other checkboxes act as filters to narrow down activities, reducing results on the right side.</p>
				</div>
			),
			placement: 'bottom' as Placement,
			spotlightClicks: true
		},
	];

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status, action, index, type, lifecycle } = data;
		let tooltipTarget = document.getElementById('071-AA-priority-score-entry');

		if (type === EVENTS.STEP_AFTER && index === 0 && action === ACTIONS.NEXT) {
			const interval = setInterval(() => {
				const targetElement = document.getElementById('gear-inventory-tab');
				if (targetElement) {
					targetElement.click()
					const interval2 = setInterval(() => {
						const targetElement = document.getElementById('gear-inventory-tab');
						if (targetElement) {
							setStepIndex(1)
							clearInterval(interval2);
							clearInterval(interval);
						}
					}, 400);

				}
			}, 100);
		}

		if (type === EVENTS.STEP_AFTER && index === 1) {
			const interval = setInterval(() => {
				const targetElement = document.getElementById('Luna-textfield-planner');
				if (targetElement) {
					setStepIndex(3)
					clearInterval(interval);
				}
			}, 100);
		}

		if (type === EVENTS.STEP_AFTER && index === 2) {
			const element = document.getElementById('#Bunny-rectangular-box');
			if (element) {
				element.click();
			}
		}

		if (type === EVENTS.STEP_AFTER && index === 4 && action !== ACTIONS.CLOSE && action !== ACTIONS.PREV) {
			const targetElement = document.getElementById('Luna-close-material-button');
			targetElement?.click();
			let earlyStop = false;
			const interval = setInterval(() => {
				const targetElement2 = document.getElementById('Weapons-list-name');
				if (targetElement2) {
					targetElement2?.click();
					const interval2 = setInterval(() => {
						const interval3 = setInterval(() => {
							const targetElement3 = document.getElementById('Afterglow-Sword-rectangular-box');
							if (targetElement3) {
								if (!earlyStop) setStepIndex(5)
								const interval4 = setInterval(() => {
									const targetElement4 = document.getElementById('Afterglow-Sword-textfield-planner');
									if (targetElement4) {
										setStepIndex(6)
										earlyStop = true
										clearInterval(interval4);
										clearInterval(interval3);
									}
								}, 50);
								clearInterval(interval2);
								clearInterval(interval);
							}
						}, 400);
					}, 400);
				}
			}, 400);
		}

		if (type === EVENTS.STEP_AFTER && index === 6 && action !== ACTIONS.CLOSE && action !== ACTIONS.PREV) {
			localStorage.setItem(
				"itemPriority",
				'[1,1,1,1,1,1,1,1]'
			);
			localStorage.setItem(
				"selectedItems",
				'["027 AALuna Code","017 AALuna Enhanced Cells Blueprint","015 AALuna Spiral Catalyst Blueprint","020 AALuna Stabilizer Blueprint","107Afterglow Sword Blueprint","111Afterglow Sword Nano Tube Blueprint","100Afterglow Sword Polymer Syncytium Blueprint","026Afterglow Sword Synthetic Fiber Blueprint"]'
			);
			const element = document.getElementById('Afterglow-Sword-close-material-button');
			if (element) {
				element.click();
			}
		}

		if (type === EVENTS.STEP_AFTER && index === 7 && action !== ACTIONS.CLOSE && action !== ACTIONS.PREV) {
			const element = document.getElementById('suggestor-tab');
			let stepIndexFired = false
			if (element) {
				element.click();
				if (isMobile) {
					let firstClicked = false;
					const interval = setInterval(() => {
						const interval2 = setInterval(() => {
							const targetElement = document.getElementById('toggle-right-button');
							if (targetElement) {
								if (!firstClicked) targetElement.click()
								firstClicked = true
								const interval3 = setInterval(() => {
									if (!stepIndexFired) setStepIndex(8)
									stepIndexFired = true
									clearInterval(interval3);
									clearInterval(interval2);
									clearInterval(interval);
								}, 400);
							}
						}, 100);
					}, 400);
				} else {
					setStepIndex(8)
				}
			}
		}

		if (type === EVENTS.STEP_AFTER && index === 8 && action !== ACTIONS.CLOSE && action !== ACTIONS.PREV) {
			if (isMobile) {
				let firstClicked = false;
				let secondClicked = false;
				let stepIndexFired = false
				let targetElement = document.getElementById('toggle-left-button');
				if (targetElement) {
					if (!firstClicked) targetElement.click()
					firstClicked = true
					const interval = setInterval(() => {
						targetElement = document.getElementById('toggle-left-button');
						if (targetElement) {
							if (!secondClicked) targetElement.click()
								secondClicked = true
							const interval2 = setInterval(() => {
								if (!stepIndexFired) setStepIndex(9)
								stepIndexFired = true
								clearInterval(interval2);
								clearInterval(interval);
							}, 400);
						}
					}, 400);
				}
			} else {
				setStepIndex(9)
			}
		}

		if (type === EVENTS.STEP_AFTER && index === 9 && action !== ACTIONS.CLOSE && action !== ACTIONS.PREV) {
			document.querySelectorAll('#pattern-suggested-list table tbody tr td:nth-child(2)').forEach(cell => {
				cell.classList.add('highlight');
			});
		}

		if (type === EVENTS.STEP_AFTER && index === 10 && action !== ACTIONS.CLOSE && action !== ACTIONS.PREV) {
			document.querySelectorAll('#pattern-suggested-list table tbody tr td:nth-child(2)').forEach(cell => {
				cell.classList.remove('highlight');
			});
		}

		if (type === EVENTS.STEP_BEFORE && index === 11 && action !== ACTIONS.CLOSE && action !== ACTIONS.PREV) {
			if (isMobile) {
				tooltipTarget = document.getElementById('071-AA-priority-score-entry');
				const interval = setInterval(() => {
					if (tooltipTarget) {
						tooltipTarget.dispatchEvent(new MouseEvent('mouseover', {
							bubbles: true,
							cancelable: true,
							view: window,
						}))
						clearInterval(interval)
					}
				}, 1200);
			}
		}

		if (type === EVENTS.STEP_AFTER && index === 11 && action !== ACTIONS.CLOSE && action !== ACTIONS.PREV) {
			if (tooltipTarget) {
				tooltipTarget.dispatchEvent(new MouseEvent('mouseout', {
					bubbles: true,
					cancelable: true,
					view: window,
				}))
			}
			injectCSS(`
				.priority-part {
					background-color: green;
					color: white;
				}
			`);
			if (isMobile) {
				let firstClicked = false;
				let secondClicked = false;
				let stepIndexFired = false
				let targetElement = document.getElementById('toggle-right-button');
				if (targetElement) {
					if (!firstClicked) targetElement.click()
					firstClicked = true
					const interval = setInterval(() => {
						targetElement = document.getElementById('toggle-right-button');
						if (targetElement) {
							if (!secondClicked) targetElement.click()
								secondClicked = true
							const interval2 = setInterval(() => {
								if (!stepIndexFired) setStepIndex(12)
								stepIndexFired = true
								clearInterval(interval2);
								clearInterval(interval);
							}, 400);
						}
					}, 400);
				}
			} else {
				setStepIndex(12)
			}
		}

		if (type === EVENTS.STEP_AFTER && index === 12 && action !== ACTIONS.CLOSE && action !== ACTIONS.PREV) {
			removeCSS();
			if (isMobile) {
				let firstClicked = false;
				let secondClicked = false;
				let stepIndexFired = false
				let targetElement = document.getElementById('toggle-left-button');
				if (targetElement) {
					if (!firstClicked) targetElement.click()
					firstClicked = true
					const interval = setInterval(() => {
						targetElement = document.getElementById('toggle-left-button');
						if (targetElement) {
							if (!secondClicked) targetElement.click()
								secondClicked = true
							const interval2 = setInterval(() => {
								if (!stepIndexFired) setStepIndex(13)
								stepIndexFired = true
								clearInterval(interval2);
								clearInterval(interval);
							}, 400);
						}
					}, 400);
				}
			} else {
				setStepIndex(13)
			}
		}

		if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
			console.log(backupData)
			loadBackupDataToLocalStorage(backupData)
			handleCloseTutorial()
			localStorage.setItem('finishedGearTutorial', '[1]');
			if (status === STATUS.FINISHED) {
				navigate('/gear')
			}
		}

		const stepsToIgnore = [0,2,4,5,7,8,11,12];
		if (action === ACTIONS.NEXT && lifecycle === LIFECYCLE.COMPLETE && !stepsToIgnore.includes(index)) {
			console.log("called at step: ", index)
			setStepIndex(index+1);
		}
	};

	return (
		<Joyride
			steps={joyrideSteps}
			stepIndex={stepIndex}
			run={isTutorialOpen}
			styles={joyrideStyles}
			continuous
			showSkipButton
			showProgress
			scrollDuration={0}
			callback={handleJoyrideCallback}
			floaterProps={{
				getPopper: (popper, type) => {
					if (type === 'floater') {
						updatePosition.current = popper.instance.update;
					}
				},
			}}
		/>
	);
};