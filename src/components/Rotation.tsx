import { Box, Grid } from "@mui/material";
import { SchedulePresetObject } from "../data/constants";
import RotationCard from "./RotationCard";
import LocationRawData from '../data/locations.json';
import { useEffect, useState } from "react";

export interface LocationData {
	bestMission: string;
	duration: number;
	reactorPerMin: number;
	missionNotes: string;
}

interface RotationComponentProps {
	schedule: SchedulePresetObject[];
}

const RotationComponent: React.FC<RotationComponentProps> = ({ schedule }) => {
	const [location, setLocation] = useState<Record<string, LocationData>>({});
	useEffect(() => {
		setLocation(LocationRawData as Record<string, LocationData>)
	}, []);

	const sortedSchedule = schedule.sort((a, b) => {
		const aReactorPerMin = location[a.location]?.reactorPerMin || 0;
		const bReactorPerMin = location[b.location]?.reactorPerMin || 0;
		return bReactorPerMin - aReactorPerMin;
	});

	return (
		<Box sx={{ mt: 2 }}>
			<Grid container spacing={2}>
				{sortedSchedule.map((sched, index) => (
				<Grid item xs={12} sm={3} key={index}>
					<RotationCard
						location={sched.location}
						type={sched.type!}
						rewards={sched.rewards}
						title={sched.title}
						locationData={location[sched.location]}/>
				</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default RotationComponent;