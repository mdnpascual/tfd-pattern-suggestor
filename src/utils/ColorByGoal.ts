import { Material } from "../data/constants"

const ColorByGoal = (
	current: number,
	goal: number,
	initialQuantity: number,
	stock: Record<string, number>,
	parts?: Material[],
) => {
	if (parts){
		if (current < goal) {
			const partsComplete = parts.every((part) => (stock[part.name] || 0) >= part.quantity)

			if (partsComplete) return "#FFEB3B" // Yellow
			else return "#F44336" // Red
		}
		return "#4CAF50" // Green
	} else {
		if (current > goal && current < goal * initialQuantity) {
			return "#FFEB3B" // Yellow
		}
		if (current < goal) return "#F44336" // Red
		else return "#4CAF50" // Green
	}
}

export default ColorByGoal