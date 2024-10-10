import { Box, Grid } from "@mui/material";
import { AmmoType, ElementType, SchedulePresetObject, SkillType } from "../data/constants";
import RotationCard from "./RotationCard";
import LocationRawData from '../data/locations.json';
import { useEffect, useState } from "react";

export interface LocationData {
	bestMission: string;
	duration: number;
	reactorPerMin: number;
	missionNotes: string;
	secondaryElement: ElementType;
    secondarySkill: SkillType;
    secondaryAmmo: AmmoType | "*";
	secondaryReactorPerMin: number;
	secondaryMissionNotes: string;
}

interface RotationComponentProps {
	schedule: SchedulePresetObject[];
}

const RotationComponent: React.FC<RotationComponentProps> = ({ schedule }) => {
	const [location, setLocation] = useState<Record<string, LocationData>>({});
	useEffect(() => {
		setLocation(LocationRawData as Record<string, LocationData>)
	}, []);

	return (
		<Box sx={{ mt: 2 }}>
			<Grid container spacing={2}>
				{schedule.map((sched, index) => (
				<Grid item xs={12} xl={3} md={6} key={index}>
					<RotationCard
						schedule={sched}
						locationData={location[sched.location]}/>
				</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default RotationComponent;