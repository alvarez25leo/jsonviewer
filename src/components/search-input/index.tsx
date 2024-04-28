import { useFocusNode } from "@/hooks/useFocusNode"

export const SearchInput = () => {
	const [searchValue, setValue, skip, nodeCount, currentNode] = useFocusNode()

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			skip()
		}
	}

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.currentTarget.value)
	}

	return (
		<div
			style={{
				position: "relative",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: "0 5px",
			}}
		>
			<div
				className="grid"
				style={{
					gridTemplateColumns: "1fr 35px",
					border: "1px solid rgb(255 255 255 / 49%)",
					borderRadius: "5px",
				}}
			>
				<input
					type="text"
					id="search-node"
					value={searchValue}
					onChange={handleSearch}
					placeholder="Search node"
					onKeyDown={handleKeyDown}
					className="bg-transparent"
					style={{
						border: "none",
						outline: "none",
						height: 30,
						padding: "0 5px",
						color: "#fff",
						opacity: 0.6,
					}}
				/>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						color: "#fff",
						opacity: 0.6,
					}}
				>
					<span>{searchValue && `${nodeCount}/${nodeCount > 0 ? currentNode + 1 : "0"}`}</span>
				</div>
			</div>
		</div>
	)
}
