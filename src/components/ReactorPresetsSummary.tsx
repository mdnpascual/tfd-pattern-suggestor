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
import { ELEMENTS_COLOR_MAP, ItemPresetBestLocation } from "../data/constants";
import { useEffect, useState } from "react";
import GetLocalStorageItem from "../utils/GetLocalStorageItem";
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Title, TooltipItem, ChartOptions } from 'chart.js';

const MAX_LABEL_LENGTH = 40;
const MOBILE_MAX_LABEL_LENGTH = 15;
// Register the components
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

interface ReactorPresetsSummaryProps {
	presets: ItemPresetBestLocation[];
}

const ReactorPresetsSummary: React.FC<ReactorPresetsSummaryProps> = ({ presets }) => {
	const [isOpen, setIsOpen] = useState(false);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		const savedState = GetLocalStorageItem<boolean>('reactorPresetsSummaryAccordion', false);
		setIsOpen(savedState);
	}, []);

	const handleToggle = () => {
		const newState = !isOpen;
		setIsOpen(newState);
		localStorage.setItem('reactorPresetsSummaryAccordion', JSON.stringify(newState));
	};

	// Prepare chart data
	const titles = presets.map(preset => preset.title);
	const dropRates = presets.map(preset => preset.dropRate);
	const maxDropRate = dropRates[0];
	const percentages = dropRates.map(rate => (rate / maxDropRate) * 100);
	const backgroundColors = dropRates.map(rate => ELEMENTS_COLOR_MAP[presets[dropRates.indexOf(rate)].element]);

	const data = {
			labels: titles,
			datasets: [{
				label: 'Relative Speed (%)',
				data: percentages,
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
					text: 'Presets',
					color: '#ffffff',
				},
				grid: {
					color: 'rgba(255, 255, 255, 0.1)',
				},
				ticks: {
					color: '#ffffff',
					callback: (tickValue: string | number, index: number, ticks: any[]) => {
						const label_length = isMobile ? MOBILE_MAX_LABEL_LENGTH : MAX_LABEL_LENGTH
						return presets[index] ? presets[index].title.slice(0, label_length) + (presets[index].title.length > label_length ? '...' : '') : undefined;
					}
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
						return `${presets[index].location}: ${presets[index].dropRate.toFixed(2)} reactors / min`;
					}
				}
			}
		},
		backgroundColor: '#000000'
	};

	return (
		<Accordion expanded={isOpen} onChange={handleToggle} sx={{ mt: '10px' }}>
		<AccordionSummary expandIcon={<ExpandMoreIcon />}>
			<Typography>Preset View</Typography>
		</AccordionSummary>
		<AccordionDetails>
			<Box sx={{ width: '100%', height: isMobile ? '60vh' : undefined, maxHeight: '60vh', overflow: 'hidden' }}>
				{presets.length > 0 ? (
					<Bar data={data} options={options} style={{ height: '100%', width: '100%' }} />
				) : (
					<Typography>No Presets to display</Typography>
				)}
			</Box>
		</AccordionDetails>
		</Accordion>
	);
};

export default ReactorPresetsSummary;
