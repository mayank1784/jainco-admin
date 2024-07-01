import React, { useState } from 'react'

interface CustomSwitcherProps {
	defaultEnabled: boolean
	onToggle: (enabled: boolean) => void
}

const ActiveSwitcher: React.FC<CustomSwitcherProps> = ({
	defaultEnabled,
	onToggle,
}) => {
	const [enabled, setEnabled] = useState(defaultEnabled)

	const handleChange = () => {
		const newEnabled = !enabled
		setEnabled(newEnabled)
		onToggle(newEnabled)
	}

	return (
		<label className="flex items-center cursor-pointer z-999">
			<div className="relative">
				<input
					type="checkbox"
					className="sr-only"
					checked={enabled}
					onChange={handleChange}
				/>
				<div className="block w-14 h-8 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
				<div
					className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition transform flex items-center justify-center ${
						enabled ? 'translate-x-full bg-green-500' : 'bg-red-500'
					}`}
					style={{ transition: 'transform 0.3s ease' }}>
					{enabled ? (
						<svg
							className="w-4 h-4 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 13l4 4L19 7"></path>
						</svg>
					) : (
						<svg
							className="w-4 h-4 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					)}
				</div>
			</div>
		</label>
	)
}

export default ActiveSwitcher
