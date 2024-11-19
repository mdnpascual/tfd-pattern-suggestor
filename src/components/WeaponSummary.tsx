import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AMMO_TYPES, ScheduleObject, WEAPONS_COLOR_MAP } from "../data/constants";
import { useEffect, useState } from "react";
import GetLocalStorageItem from "../utils/GetLocalStorageItem";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Title, TooltipItem, ChartOptions, TooltipPositionerFunction, ChartType } from 'chart.js';
import LocationRawData from '../data/locations.json';
import { LocationData } from "./Rotation";
const locationData = LocationRawData as Record<string, LocationData>;

declare module 'chart.js' {
	interface TooltipPositionerMap {
		followMouse: TooltipPositionerFunction<ChartType>;
	}
}

// Register the components
Tooltip.positioners.followMouse = function(_, eventPosition) {
	return {
		x: eventPosition.x,
		y: eventPosition.y
	};
}
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

interface WeaponSummaryProps {
	locations: ScheduleObject[];
}

const WeaponSummary: React.FC<WeaponSummaryProps> = ({ locations }) => {
	const [isOpen, setIsOpen] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		const savedState = GetLocalStorageItem<boolean>('reactorPresetsWeaponAccordion', true);
		setIsOpen(savedState);
	}, []);

	const handleToggle = () => {
		const newState = !isOpen;
		setIsOpen(newState);
		localStorage.setItem('reactorPresetsWeaponAccordion', JSON.stringify(newState));
	};

	let percentages: number[] = new Array(AMMO_TYPES.length).fill(0);
	let bestLocations: string[] = new Array(AMMO_TYPES.length).fill('');
	locations.forEach((loc) => {
		const matchingLocation = locationData[loc.location]
		if (loc.rewards.weapon_rounds_type) {
			const ammoType = loc.rewards.weapon_rounds_type.split(" Rounds")[0];
			const index = AMMO_TYPES.findIndex(type => type === ammoType);
			if (index > -1 && percentages[index] < matchingLocation.reactorPerMin) {
				percentages[index] = matchingLocation.reactorPerMin
				bestLocations[index] =
				`${loc.location}
${matchingLocation.bestMission}: ${matchingLocation.reactorPerMin.toFixed(2)} reactors / min`
			}
		}
	})

	// Prepare chart data
	const titles = AMMO_TYPES.map((ammo) => ammo);
	const backgroundColors = AMMO_TYPES.map(ammo => WEAPONS_COLOR_MAP[ammo]);
	const maxDropRate = Math.max(...percentages)
	const data = {
			labels: titles,
			datasets: [{
				label: 'Relative Speed (%)',
				data: percentages.map(rate => (rate / maxDropRate) * 100),
				backgroundColor: backgroundColors.map((color) => color.backgroundColor),
				borderColor: backgroundColors.map((color) => color.borderColor),
				borderWidth: 4
			}]
	};

	const options: ChartOptions<'bar'> = {
		responsive: true,
		maintainAspectRatio: false,
		indexAxis: "y",
		scales: {
			x: {
				beginAtZero: true,
				title: {
					display: true,
					text: 'Relative Speed (%)',
					color: '#ffffff',
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
				ticks: {
					color: '#ffffff',
				}
			},
			y: {
				title: {
					display: true,
					text: 'Ammo Type',
					color: '#ffffff',
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
				ticks: {
					color: '#ffffff',
				}
			}
		},
		plugins: {
			tooltip: {
				backgroundColor: '#333333',
				titleColor: '#ffffff',
				bodyColor: '#ffffff',
				callbacks: {
					label: (tooltipItem: TooltipItem<'bar'>) => {
						const index = tooltipItem.dataIndex;
						return bestLocations[index].split("\n")
					},

				},
				displayColors: false,
				position: 'followMouse'
			}
		},
		backgroundColor: '#000000',
	};

	return (
		<Accordion expanded={isOpen} onChange={handleToggle} sx={{ mt: '10px' }}>
		<AccordionSummary expandIcon={<ExpandMoreIcon />}>
			<Typography>Weapon View</Typography>
		</AccordionSummary>
		<AccordionDetails>
			<Box sx={{ width: '100%', height: isMobile ? '30vh' : undefined, maxHeight: '30vh', overflow: 'hidden' }}>
				<Bar data={data} options={options} style={{ height: '100%', width: '100%' }} />
			</Box>
		</AccordionDetails>
		</Accordion>
	);
};

export default WeaponSummary;
