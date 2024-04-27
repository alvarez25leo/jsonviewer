interface TabJsonGraphProps {
	currentTab: "code" | "graph" | "compare"
	handleTabChange: (tab: "code" | "graph" | "compare") => void
	language: string
}
const TabJsonGraphComponent: React.FC<TabJsonGraphProps> = ({ currentTab, handleTabChange, language }) => {
	const getClassNames = (tab: "code" | "graph" | "compare") => {
		return `flex justify-center items-center gap-x-1 px-2 py-1 rounded-md text-[#cccccc80] bg-[#282c34] w-full ${
			currentTab === tab ? " bg-[#404754] text-[#cccccc]" : ""
		}`
	}
	return (
		<div className="rounded-md bg-[#282c34] p-1 shadow-sm">
			<ul
				className="grid gap-1 text-sm font-medium text-[#000] dark:text-gray-400 "
				style={{
					gridTemplateColumns: "1fr 1fr 1fr",
				}}
			>
				<li>
					<button className={getClassNames("code")} onClick={() => handleTabChange("code")}>
						<div>
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
								/>
							</svg>
						</div>
						<div>Code</div>
					</button>
				</li>
				<li>
					<button disabled={language !== "json"} className={getClassNames("graph")} onClick={() => handleTabChange("graph")}>
						<div>
							<svg width="18" height="18" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
								/>
							</svg>
						</div>
						<div>Graph</div>
					</button>
				</li>
				<li>
					<button className={getClassNames("compare")} onClick={() => handleTabChange("compare")}>
						<div>
							<svg width="18" height="18" viewBox="0 0 512 512">
								<path
									fill="currentColor"
									d="M231,337.9c-2.8-2.8-6.5-4.6-11.1-4.6c-4.6,0-8.3,1.9-11.1,4.6c-2.8,2.8-4.6,6.5-4.6,11.1
                      c0,4.6,1.9,8.3,4.6,11.1l0,0l46.3,45.4H154.2c-23.1,0-38-8.3-47.2-26.8c-9.3-19.4-11.1-47.2-11.1-66.7V158.3
                      c16.7-2.8,32.4-12,44.4-25c13-14.8,20.4-33.3,20.4-53.7C160.6,36.1,124.5,0,81,0S1.4,36.1,1.4,79.6c0,19.4,7.4,38,19.4,52.8
                      c11.1,13,25.9,21.3,42.6,25v153.7c0,16.7,0,48.1,11.1,74.1c13.9,33.3,40.7,50.9,78.7,50.9h101.8l-45.4,45.4
                      c-6.5,6.5-6.5,16.7,0,22.2l0,0c2.8,2.8,7.4,4.6,11.1,4.6c4.6,0,8.3-1.9,11.1-4.6l65.7-64.8c4.6-4.6,7.4-11.1,7.4-17.6
                      c0-6.5-2.8-13-7.4-17.6L231,337.9L231,337.9z M81,128.7c-25.9,0-48.1-21.3-48.1-48.1S54.2,32.4,81,32.4s48.1,21.3,48.1,48.1
                      S106.9,128.7,81,128.7z M447.7,352.8V199.1c0-16.7,0-48.1-11.1-74.1c-13.9-33.3-40.7-50.9-78.7-50.9H256l45.4-45.4
                      c6.5-6.5,6.5-16.7,0-22.2l0,0c-2.8-2.8-7.4-4.6-11.1-4.6c-4.6,0-8.3,1.9-11.1,4.6l-65.7,64.8c-4.6,4.6-7.4,11.1-7.4,17.6
                      c0,6.5,2.8,13,7.4,17.6l67.6,67.6c2.8,2.8,6.5,4.6,11.1,4.6s8.3-1.9,11.1-4.6c2.8-2.8,4.6-6.5,4.6-11.1s-1.9-8.3-4.6-11.1l0,0
                      L256,106.5h101.8c23.1,0,38,8.3,47.2,26.8c9.3,19.4,11.1,47.2,11.1,66.7v153.7c-16.7,2.8-32.4,12-44.4,25
                      c-13,14.8-20.4,33.3-20.4,53.7c0,43.5,36.1,79.6,79.6,79.6s79.6-36.1,79.6-79.6c0-19.4-7.4-38-19.4-52.8
                      C480.1,365.7,464.3,356.5,447.7,352.8z M431,478.7c-25.9,0-48.1-21.3-48.1-48.1s21.3-48.1,48.1-48.1s48.1,21.3,48.1,48.1
                      C479.1,457.4,457.8,478.7,431,478.7z"
								/>
							</svg>
						</div>
						<div>Compare</div>
					</button>
				</li>
			</ul>
		</div>
	)
}

export default TabJsonGraphComponent
