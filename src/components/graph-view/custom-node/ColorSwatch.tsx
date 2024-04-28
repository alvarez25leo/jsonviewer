interface ColorSwatchProps {
	size?: number
	radius?: number
	color: string
}
const ColorSwatch = ({ size = 12, radius = 4, color }: ColorSwatchProps) => {
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: radius,
				backgroundColor: color,
			}}
		></div>
	)
}
export default ColorSwatch
