import { FC, SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & {
	size?: number
}

export const CopyIcon: FC<IconProps> = ({ size = 18, ...props }) => (
	<svg viewBox="0 0 24 24" width={size} height={size} {...props}>
		<path
			fill="currentColor"
			d="M5.5028 4.62704L5.5 6.75V17.2542C5.5 19.0491 6.95507 20.5042 8.75 20.5042L17.3663 20.5045C17.0573 21.3782 16.224 22.0042 15.2444 22.0042H8.75C6.12665 22.0042 4 19.8776 4 17.2542V6.75C4 5.76929 4.62745 4.93512 5.5028 4.62704ZM17.75 2C18.9926 2 20 3.00736 20 4.25V17.25C20 18.4926 18.9926 19.5 17.75 19.5H8.75C7.50736 19.5 6.5 18.4926 6.5 17.25V4.25C6.5 3.00736 7.50736 2 8.75 2H17.75ZM17.75 3.5H8.75C8.33579 3.5 8 3.83579 8 4.25V17.25C8 17.6642 8.33579 18 8.75 18H17.75C18.1642 18 18.5 17.6642 18.5 17.25V4.25C18.5 3.83579 18.1642 3.5 17.75 3.5Z"
		/>
	</svg>
)

export const FormatIcon: FC<IconProps> = ({ size = 18, ...props }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 16 16"
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="1"
		{...props}
	>
		<polyline points="2.75 4.75,2.75 1.75,8.25 1.75,13.25 6.75,13.25 14.25,2.75 14.25" />
		<path d="m6.25 7.75 2 1.75-2 1.75m-2.5-3.5-2 1.75 2 1.75" />
	</svg>
)

export const CodeIcon: FC<IconProps> = ({ size = 18, ...props }) => (
	<svg width={size} height={size} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
	</svg>
)

export const GraphIcon: FC<IconProps> = ({ size = 18, ...props }) => (
	<svg width={size} height={size} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
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
)

export const CompareIcon: FC<IconProps> = ({ size = 18, ...props }) => (
	<svg width={size} height={size} viewBox="0 0 512 512" {...props}>
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
)

export const TypesIcon: FC<IconProps> = ({ size = 20, ...props }) => (
	<svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 16 16" height={size} width={size} {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M1.5 1h2v1H2v12h1.5v1h-2l-.5-.5v-13l.5-.5zm6 6h-2L5 6.5v-2l.5-.5h2l.5.5v2l-.5.5zM6 6h1V5H6v1zm7.5 1h-3l-.5-.5v-3l.5-.5h3l.5.5v3l-.5.5zM11 6h2V4h-2v2zm-3.5 6h-2l-.5-.5v-2l.5-.5h2l.5.5v2l-.5.5zM6 11h1v-1H6v1zm7.5 2h-3l-.5-.5v-3l.5-.5h3l.5.5v3l-.5.5zM11 12h2v-2h-2v2zm-1-2H8v1h2v-1zm0-5H8v1h2V5z"
		/>
	</svg>
)

export const CenterViewIcon: FC<IconProps> = ({ size = 20, ...props }) => (
	<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" role="presentation" width={size} height={size} {...props}>
		<path
			fill="currentColor"
			d="M20 17.614V4.886l-4 1.5v12.728l4-1.5zm-5.373 3.871L9 19.375l-5.649 2.118A1 1 0 0 1 2 20.557V5.693a1 1 0 0 1 .649-.936l5.995-2.249A.973.973 0 0 1 9 2.443a1.069 1.069 0 0 1 .373.072L15 4.625l5.649-2.118A1 1 0 0 1 22 3.443v14.864a1 1 0 0 1-.649.936l-5.995 2.249a.973.973 0 0 1-.356.065.993.993 0 0 1-.373-.072zM14 19.114V6.386l-4-1.5v12.728l4 1.5zM8 4.886l-4 1.5v12.728l4-1.5V4.886z"
		/>
	</svg>
)

export const ZoomOutIcon: FC<IconProps> = ({ size = 24, ...props }) => (
	<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
	</svg>
)

export const ZoomInIcon: FC<IconProps> = ({ size = 24, ...props }) => (
	<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	</svg>
)

export const ArrowRightIcon: FC<IconProps> = ({ size = 24, ...props }) => (
	<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
	</svg>
)

export const ArrowLeftIcon: FC<IconProps> = ({ size = 24, ...props }) => (
	<svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width={size} height={size} {...props}>
		<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
	</svg>
)
