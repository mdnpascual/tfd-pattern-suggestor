import { Box, Grid, Typography } from "@mui/material";
import { ItemPreset, SchedulePresetObject } from "../data/constants";

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
				<Grid item xs={12} sm={4} key={index}>
					<Box
						sx={{
							padding: 2,
							border: '1px solid #444',
							borderRadius: 2,
							backgroundColor: '#1b1b1b',
							color: '#ffffff'
						}}
					>
						<Typography>
							{sched.location}: {sched.type}
						</Typography>

						{sched.type === 'Reactor' && (
						<>
							<Typography>
								<img
									src={`${process.env.PUBLIC_URL}/img/icons/Fire.png`}
									alt={`${sched.rewards.reactor_element_type} icon`}
									style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
								/>{sched.rewards.reactor_element_type}
							</Typography>
							<Typography>
								<img
									src={`${process.env.PUBLIC_URL}/img/icons/General.png`}
									alt={`${sched.rewards.weapon_rounds_type} icon`}
									style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
								/>{sched.rewards.weapon_rounds_type}
							</Typography>
							<Typography>
							<img
									src={`${process.env.PUBLIC_URL}/img/icons/General.png`}
									alt={`${sched.rewards.arche_type} icon`}
									style={{ width: '20px', height: '20px', marginRight: '5px', verticalAlign: 'middle' }}
								/>{sched.rewards.arche_type}
							</Typography>
							<Box
								sx={{
								position: 'relative',
								'&:hover::after': {
									content: `attr(data-presets)`,
									position: 'absolute',
									top: '100%',
									left: 0,
									backgroundColor: '#333',
									border: '1px solid #444',
									padding: '4px',
									zIndex: 10,
									whiteSpace: 'nowrap',
									color: '#fff',
								},
								}}
								data-presets={sched.title.join(', ')}
							>
								<Typography>Hover to see presets</Typography>
							</Box>
						</>)}
					</Box>
				</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default RotationComponent;