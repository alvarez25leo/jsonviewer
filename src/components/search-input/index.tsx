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
		<div>
			<input type="search" id="search-node" value={searchValue} onChange={handleSearch} placeholder="Search Node" onKeyDown={handleKeyDown} />
			<span>{searchValue && `${nodeCount}/${nodeCount > 0 ? currentNode + 1 : "0"}`}</span>
		</div>
	)
}
