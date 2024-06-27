// import React, { useState } from 'react';

// const SelectGroupOne: React.FC = () => {
//   const [selectedOption, setSelectedOption] = useState<string>('');
//   const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

//   const changeTextColor = () => {
//     setIsOptionSelected(true);
//   };

//   return (
//     <div className="mb-4.5">
//       <label className="mb-2.5 block text-black dark:text-white">
//         {' '}
//         Subject{' '}
//       </label>

//       <div className="relative z-20 bg-transparent dark:bg-form-input">
//         <select
//           value={selectedOption}
//           onChange={(e) => {
//             setSelectedOption(e.target.value);
//             changeTextColor();
//           }}
//           className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
//             isOptionSelected ? 'text-black dark:text-white' : ''
//           }`}
//         >
//           <option value="" disabled className="text-body dark:text-bodydark">
//             Select your subject
//           </option>
//           <option value="USA" className="text-body dark:text-bodydark">
//             USA
//           </option>
//           <option value="UK" className="text-body dark:text-bodydark">
//             UK
//           </option>
//           <option value="Canada" className="text-body dark:text-bodydark">
//             Canada
//           </option>
//         </select>

//         <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
//           <svg
//             className="fill-current"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <g opacity="0.8">
//               <path
//                 fillRule="evenodd"
//                 clipRule="evenodd"
//                 d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
//                 fill=""
//               ></path>
//             </g>
//           </svg>
//         </span>
//       </div>
//     </div>
//   );
// };

// export default SelectGroupOne;

// my previous custom made select group

import React, { useState } from 'react'

interface SelectGroupOneProps {
	titleLabel: string
	options: string[]
	onOptionCreate?: (newOption: string) => void
}

const SelectGroupOne: React.FC<SelectGroupOneProps> = ({
	titleLabel,
	options,
	onOptionCreate,
}) => {
	const [selectedOption, setSelectedOption] = useState<string>('')
	const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [newOption, setNewOption] = useState<string>('')

	const changeTextColor = () => {
		setIsOptionSelected(true)
	}

	const handleCreateNewOption = () => {
		if (onOptionCreate) {
			onOptionCreate(newOption)
		}
		setNewOption('')
		setIsModalOpen(false)
	}

	return (
		<div className="mb-4.5">
			<label className="mb-2.5 block text-black dark:text-white">
				{titleLabel}
			</label>
			<div className="relative z-20 bg-transparent dark:bg-form-input">
				<select
					value={selectedOption}
					onChange={(e) => {
						if (e.target.value === 'create-new') {
							setIsModalOpen(true)
						} else {
							setSelectedOption(e.target.value)
							changeTextColor()
						}
					}}
					className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
						isOptionSelected ? 'text-black dark:text-white' : ''
					}`}>
					<option
						value=""
						disabled
						className="text-body dark:text-bodydark">
						Select your {titleLabel.toLowerCase()}
					</option>
					{options.map((option) => (
						<option
							key={option}
							value={option}
							className="text-body dark:text-bodydark">
							{option}
						</option>
					))}
					<option
						value="create-new"
						className="text-body dark:text-bodydark">
						New {titleLabel} +
					</option>
				</select>
				<span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
					<svg
						className="fill-current"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<g opacity="0.8">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
								fill=""></path>
						</g>
					</svg>
				</span>
			</div>
			{isModalOpen && (
				<div className="modal">
					<div className="modal-content">
						<h2 className="mb-3 block text-black dark:text-white mt-4">
							Create New Option
						</h2>
						<div className="sm:flex sm:flex-row sm:gap-2 sm:justify-start sm:items-center">
							<input
								type="text"
								autoFocus
								value={newOption}
								onChange={(e) => setNewOption(e.target.value)}
								placeholder="Enter new option"
								className="w-full sm:w-1/4 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
							/>
							<div className="flex flex-row gap-1 items-center justify-start">
								<button
									onClick={handleCreateNewOption}
									className="inline-flex items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
									Create
								</button>
								<button className="bg-red-600 hover:bg-opacity-80 h-10 w-10 rounded-full flex items-center justify-center overflow-hidden">
									<span
										className="close text-4xl text-white"
										onClick={() => setIsModalOpen(false)}>
										&times;
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default SelectGroupOne
