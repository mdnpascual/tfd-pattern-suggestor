import { useState, useRef } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS, LIFECYCLE, Placement } from 'react-joyride';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BackupData, joyrideStyles, localStorageBackupKeys, SaveData } from '../data/constants';
import { useNavigate } from 'react-router-dom';

export const loadBackupDataToLocalStorage = (backupData: { [key: string]: SaveData | BackupData }) => {
	localStorageBackupKeys.forEach((key) => {
		const data = backupData[key];
		if (data) {
			localStorage.setItem(key.replace("Backup", ""), JSON.stringify(data));
		}
	});
};

export const JoyrideWithNavigation = ({
	isTutorialOpen,
	handleCloseTutorial,
	backupData
}: {
	isTutorialOpen: boolean,
	handleCloseTutorial: () => void,
	backupData: { [key: string]: SaveData | BackupData; }
}) => {
	const [stepIndex, setStepIndex] = useState(0);
	const updatePosition = useRef<(() => void) | null>(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const navigate = useNavigate();

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
			target: "#pattern-suggested-list table tbody tr:nth-child(1)",
			content: (
				<div>
					<p>You can click on this pattern once you've decided to start farming it.</p>
					<p>Click on this entry to proceed.</p>
				</div>
			),
			placement: 'left' as Placement,
			spotlightClicks: true
		},
		{
			target: "#p071-AA-droplist-overlay",
			content: (
				<div>
					<p>On this page, you can see how many of each material you need.</p>
					<p>You can also quickly update the material count based on the items you receive every time you open a pattern.</p>
				</div>
			),
			placement: 'auto' as Placement,
			offset: isMobile ? -70 : -170
		},
		{
			target: "#p071-AA-pattern-statistics",
			content: (
				<div>
					<p>This section tells you that, on average, you should be able to obtain all the items listed above in their specified quantities after opening 16 patterns.</p>
					<p>You have a 95% chance of completing the list after opening 50 patterns.</p>
				</div>
			),
			placement: 'top' as Placement,
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
			spotlightClicks: true,
			disableScrollParentFix: true
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
			spotlightClicks: true,
			disableScrollParentFix: true
		},
	];

	const isTouchscreenOnly = () => {
		return 'ontouchstart' in window && !(window as any).MSPointerEvent && !('onmousemove' in window);
	};

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

	const clickElementById = (id: string) => {
		const element = document.getElementById(id);
		element?.click();
	};

	const waitForElement = (
		id: string,
		callback: () => void,
		intervalTime = 100,
		initialDelay = 0
	) => {
		const startWaiting = () => {
			const interval = setInterval(() => {
				const element = document.getElementById(id);
				if (element) {
					callback();
					clearInterval(interval);
				}
			}, intervalTime);
		};

		if (initialDelay > 0) {
			setTimeout(startWaiting, initialDelay);
		} else {
			startWaiting();
		}
	};

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { status, action, index, type, lifecycle } = data;

		const stepsToAutoAdvance: { [key: number]: () => void } = {
			0: () => waitForElement('gear-inventory-tab', () => {
				clickElementById('gear-inventory-tab');
				setTimeout(() => setStepIndex(1), 400)
			}),
			1: () => waitForElement('Luna-textfield-planner', () => setStepIndex(3)),
			4: () => {
				clickElementById('Luna-close-material-button');
				waitForElement('Weapons-list-name', () => {
					clickElementById('Weapons-list-name');
					waitForElement('Afterglow-Sword-rectangular-box', () => {
						setStepIndex(5);
						waitForElement('Afterglow-Sword-textfield-planner', () => setStepIndex(6), 50);
					}, 400);
				}, 400);
			},
			6: () => {
				localStorage.setItem(
					"itemPriority",
					'[1,1,1,1,1,1,1,1]'
				);
				localStorage.setItem(
					"selectedItems",
					'["027 AALuna Code","017 AALuna Enhanced Cells Blueprint","015 AALuna Spiral Catalyst Blueprint","020 AALuna Stabilizer Blueprint","107Afterglow Sword Blueprint","111Afterglow Sword Nano Tube Blueprint","100Afterglow Sword Polymer Syncytium Blueprint","026Afterglow Sword Synthetic Fiber Blueprint"]'
				);
				localStorage.setItem(
					"materialCount",
					'{"Advanced Neural Circuit":0,"Ajax":1,"Ajax Code":0,"Ajax Enhanced Cells":0,"Ajax Enhanced Cells Blueprint":0,"Ajax Spiral Catalyst":0,"Ajax Spiral Catalyst Blueprint":0,"Ajax Stabilizer":0,"Ajax Stabilizer Blueprint":0,"Anode Ion Particle":0,"Artificial Biometal":0,"Balanced Plasma Battery":0,"Blair":1,"Blair Code":0,"Blair Enhanced Cells":0,"Blair Spiral Catalyst":0,"Blair Stabilizer":0,"Bunny":1,"Bunny Code":0,"Bunny Enhanced Cells":0,"Bunny Spiral Catalyst":0,"Bunny Stabilizer":0,"Carbon Crystal":0,"Ceramic Composite":0,"Common Carbon Activator":0,"Complex Carbon Activator":0,"Compound Coating Material":0,"Conductive Mettalic Foil":0,"Cooling Metallic Foil":0,"Crystal Biogel":0,"Data Processing Neural Circuit":0,"Deformed Biometal":0,"Divided Plasma Battery":0,"Encrypted Neural Circuit":0,"Energy Activator Blueprint":4,"Enzo":1,"Enzo Code":0,"Enzo Enhanced Cells":0,"Enzo Enhanced Cells Blueprint":0,"Enzo Spiral Catalyst":0,"Enzo Spiral Catalyst Blueprint":0,"Enzo Stabilizer":0,"Enzo Stabilizer Blueprint":0,"Esiemo":1,"Esiemo Code":0,"Esiemo Enhanced Cells":0,"Esiemo Enhanced Cells Blueprint":0,"Esiemo Spiral Catalyst":0,"Esiemo Spiral Catalyst Blueprint":0,"Esiemo Stabilizer":0,"Esiemo Stabilizer Blueprint":0,"Flectorite":0,"Freyna":1,"Freyna Code":0,"Freyna Enhanced Cells":0,"Freyna Spiral Catalyst":0,"Freyna Stabilizer":0,"Fusion Plasma Battery":0,"Gley":1,"Gley Code":0,"Gley Enhanced Cells":0,"Gley Enhanced Cells Blueprint":0,"Gley Spiral Catalyst":0,"Gley Spiral Catalyst Blueprint":0,"Gley Stabilizer":0,"Gley Stabilizer Blueprint":0,"Hardener":0,"Heat Plasma Battery":0,"Hellion":0,"Highly-concentrated Energy Residue":0,"Inorganic Biogel":0,"Insulated Mettalic Foil":0,"Jayber":1,"Jayber Code":0,"Jayber Enhanced Cells":0,"Jayber Enhanced Cells Blueprint":0,"Jayber Spiral Catalyst":0,"Jayber Spiral Catalyst Blueprint":0,"Jayber Stabilizer":0,"Jayber Stabilizer Blueprint":0,"Kyle":1,"Kyle Code":0,"Kyle Enhanced Cells":0,"Kyle Enhanced Cells Blueprint":0,"Kyle Spiral Catalyst":0,"Kyle Spiral Catalyst Blueprint":0,"Kyle Stabilizer":0,"Kyle Stabilizer Blueprint":0,"Lepic":1,"Lepic Code":0,"Lepic Enhanced Cells":0,"Lepic Enhanced Cells Blueprint":0,"Lepic Spiral Catalyst":0,"Lepic Spiral Catalyst Blueprint":0,"Lepic Stabilizer":0,"Lepic Stabilizer Blueprint":0,"Luna":1,"Luna Code":0,"Luna Enhanced Cells":0,"Luna Enhanced Cells Blueprint":0,"Luna Spiral Catalyst":0,"Luna Spiral Catalyst Blueprint":0,"Luna Stabilizer":0,"Luna Stabilizer Blueprint":0,"Macromolecule Biogel":0,"Metal Accelerant":0,"Monad Shard":0,"Monomolecular Extractor":0,"Murky Energy Residue":0,"Nanopolymers":0,"Organic Biogel":0,"Positive Ion Particle":0,"Pure Energy Residue":0,"Repton":0,"Reverse Charging Coil":0,"Semi-permanent Plasma":0,"Shape Memory Alloy":0,"Sharen":1,"Sharen Code":0,"Sharen Enhanced Cells":0,"Sharen Spiral Catalyst":0,"Sharen Stabilizer":0,"Silicon":0,"Specialized Biometal":0,"Superfluid":0,"Synthesized Artificial Biometal":0,"Thermal Metallic Foil":0,"Ultimate Ajax":1,"Ultimate Ajax Code":0,"Ultimate Ajax Enhanced Cells":0,"Ultimate Ajax Enhanced Cells Blueprint":0,"Ultimate Ajax Spiral Catalyst":0,"Ultimate Ajax Spiral Catalyst Blueprint":0,"Ultimate Ajax Stabilizer":0,"Ultimate Ajax Stabilizer Blueprint":0,"Ultimate Bunny":1,"Ultimate Bunny Code":0,"Ultimate Bunny Enhanced Cells":0,"Ultimate Bunny Enhanced Cells Blueprint":0,"Ultimate Bunny Spiral Catalyst":0,"Ultimate Bunny Spiral Catalyst Blueprint":0,"Ultimate Bunny Stabilizer":0,"Ultimate Bunny Stabilizer Blueprint":0,"Ultimate Gley":1,"Ultimate Gley Code":0,"Ultimate Gley Enhanced Cells":0,"Ultimate Gley Enhanced Cells Blueprint":0,"Ultimate Gley Spiral Catalyst":0,"Ultimate Gley Spiral Catalyst Blueprint":0,"Ultimate Gley Stabilizer":0,"Ultimate Gley Stabilizer Blueprint":0,"Ultimate Lepic":1,"Ultimate Lepic Code":0,"Ultimate Lepic Enhanced Cells":0,"Ultimate Lepic Enhanced Cells Blueprint":0,"Ultimate Lepic Spiral Catalyst":0,"Ultimate Lepic Spiral Catalyst Blueprint":0,"Ultimate Lepic Stabilizer":0,"Ultimate Lepic Stabilizer Blueprint":0,"Ultimate Valby":1,"Ultimate Valby Code":0,"Ultimate Valby Enhanced Cells":0,"Ultimate Valby Enhanced Cells Blueprint":0,"Ultimate Valby Spiral Catalyst":0,"Ultimate Valby Spiral Catalyst Blueprint":0,"Ultimate Valby Stabilizer":0,"Ultimate Valby Stabilizer Blueprint":0,"Ultimate Viessa":1,"Ultimate Viessa Code":0,"Ultimate Viessa Enhanced Cells":0,"Ultimate Viessa Enhanced Cells Blueprint":0,"Ultimate Viessa Spiral Catalyst":0,"Ultimate Viessa Spiral Catalyst Blueprint":0,"Ultimate Viessa Stabilizer":0,"Ultimate Viessa Stabilizer Blueprint":0,"Valby":1,"Valby Code":0,"Valby Enhanced Cells":0,"Valby Enhanced Cells Blueprint":0,"Valby Spiral Catalyst":0,"Valby Spiral Catalyst Blueprint":0,"Valby Stabilizer":0,"Valby Stabilizer Blueprint":0,"Viessa":1,"Viessa Code":0,"Viessa Enhanced Cells":0,"Viessa Enhanced Cells Blueprint":0,"Viessa Spiral Catalyst":0,"Viessa Spiral Catalyst Blueprint":0,"Viessa Stabilizer":0,"Viessa Stabilizer Blueprint":0,"Yujin":1,"Yujin Code":0,"Yujin Enhanced Cells":0,"Yujin Enhanced Cells Blueprint":0,"Yujin Spiral Catalyst":0,"Yujin Spiral Catalyst Blueprint":0,"Yujin Stabilizer":0,"Yujin Stabilizer Blueprint":0}'
				)
				clickElementById('Afterglow-Sword-close-material-button');
			},
			7: () => {
				clickElementById('suggestor-tab');
				if (isMobile) {
					waitForElement('toggle-right-button', () => {
						clickElementById('toggle-right-button');
						setStepIndex(8);
					}, 400);
				} else {
					setStepIndex(8);
				}
			},
			8: () => {
				if (isMobile) {
					waitForElement('toggle-left-button', () => {
						clickElementById('toggle-left-button');
						waitForElement('toggle-left-button', () => {
							clickElementById('toggle-left-button');
							setTimeout(() => setStepIndex(9), 400);
						}, 400);
					}, 400);
				} else {
					setStepIndex(9);
				}
			},
			9: () => {
				document.querySelectorAll('#pattern-suggested-list table tbody tr td:nth-child(2)').forEach(cell => {
					cell.classList.add('highlight');
				});
			},
			10: () => {
				document.querySelectorAll('#pattern-suggested-list table tbody tr td:nth-child(2)').forEach(cell => {
					cell.classList.remove('highlight');
				});
				if (isMobile || isTouchscreenOnly()) {
					waitForElement('p071-AA-priority-score-entry', () => {
						document.getElementById('p071-AA-priority-score-entry')?.dispatchEvent(new MouseEvent('mouseover', {
							bubbles: true,
							cancelable: true,
							view: window,
						}));
					}, 1200);
				}
			},
			11: () => {
				waitForElement('p071-AA-droplist-overlay', () => {
					setStepIndex(13);
					document.getElementById('p071-AA-priority-score-entry')?.dispatchEvent(new MouseEvent('mouseout', {
						bubbles: true,
						cancelable: true,
						view: window,
					}));
				}, 400);
			},
			14: () => {
				injectCSS(`
					.priority-part {
						background-color: green;
						color: white;
					}
				`);
				clickElementById('material-overlay-close-button');
				if (isMobile) {
					waitForElement('toggle-right-button', () => {
						clickElementById('toggle-right-button');
						waitForElement('toggle-right-button', () => {
							clickElementById('toggle-right-button');
							setTimeout(() => setStepIndex(15), 400);
						}, 100);
					}, 400);
				} else {
					setStepIndex(15);
				}
			},
			15: () => {
				const tableContainer = document.getElementById('sortable-table');
				tableContainer?.scrollTo({ top: 0 });
				removeCSS();
				if (isMobile) {
					waitForElement('toggle-left-button', () => {
						clickElementById('toggle-left-button');
						waitForElement('toggle-left-button', () => {
							clickElementById('toggle-left-button');
							setTimeout(() => setStepIndex(16), 400);
						}, 400);
					}, 400);
				} else {
					setStepIndex(16);
				}
			},
		};

		if (type === EVENTS.STEP_AFTER && stepsToAutoAdvance[index]) {
			stepsToAutoAdvance[index]();
		}

		if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
			loadBackupDataToLocalStorage(backupData);
			handleCloseTutorial();
			localStorage.setItem('finishedGearTutorial', '[1]');
			if (status === STATUS.FINISHED) {
				navigate('/gear');
			}
		}

		const stepsToIgnore = [0, 2, 4, 5, 7, 8, 12, 14, 15];
		if (action === ACTIONS.NEXT && lifecycle === LIFECYCLE.COMPLETE && !stepsToIgnore.includes(index)) {
			setStepIndex(index + 1);
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
			disableScrollParentFix
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
