import { Box, Grid } from "@mui/material";
import { ItemPreset, SchedulePresetObject } from "../data/constants";
import RotationCard from "./RotationCard";

interface RotationComponentProps {
	schedule: SchedulePresetObject[];
	presets: ItemPreset[];
}

const RotationComponent: React.FC<RotationComponentProps> = ({
	schedule,
	presets
}) => {
	return (
		<Box sx={{ mt: 2 }}>
			<Grid container spacing={2}>
				{schedule.map((sched, index) => (
				<Grid item xs={12} sm={3} key={index}>
					<RotationCard
						location={sched.location}
						type={sched.type!}
						rewards={sched.rewards}
						title={sched.title}/>
				</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default RotationComponent;