import React, { useContext, useRef, useState } from 'react'
import { VariationContext } from './VariationContext'
import _ from 'lodash'

const Variation: React.FC = () => {
	const { variationValues, setVariationValues } = useContext(VariationContext)
	const variationTitleRef = useRef<HTMLInputElement>(null)
	const [variationTitle, setVariationTitle] = useState<string>('')
	const [variationTitleList, setVariationTitleList] = useState<string[]>([])
	const [newVariationValue, setNewVariationValue] = useState<{
		[key: string]: string
	}>({})

	const handleAddVariationTitle = () => {
		if (variationTitle && !variationTitleList.includes(variationTitle)) {
			setVariationTitleList((prev) => [
				...prev,
				_.toLower(variationTitle),
			])
			setVariationValues((prev) => ({
				...prev,
				[_.toLower(variationTitle)]: [],
			}))
			setVariationTitle('')

			setTimeout(() => {
				if (variationTitleRef.current) {
					variationTitleRef.current.scrollIntoView({
						behavior: 'smooth',
					})
					variationTitleRef.current.focus()
				}
			}, 0)
		}
	}

	const handleKeyDownTitle = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			handleAddVariationTitle()
		}
	}

	const handleAddVariationValue = (title: string, value: string) => {
		if (value && !variationValues[title].includes(value)) {
			setVariationValues((prev) => ({
				...prev,
				[title]: [...prev[title], _.toLower(value)],
			}))
			setNewVariationValue((prev) => ({
				...prev,
				[title]: '',
			}))
		}
	}

	const handleDeleteVariationValue = (title: string) => {
		if (variationValues[title]) {
			const updatedVariationValues = { ...variationValues } // Create a copy

			delete updatedVariationValues[title] // Delete the property

			setVariationValues(updatedVariationValues)
			const updatedVariationTitleList = variationTitleList.filter(
				(item) => item !== title
			)
			setVariationTitleList(updatedVariationTitleList)
		}
	}

	const handleKeyDownValue = (
		event: React.KeyboardEvent,
		title: string,
		value: string
	) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			handleAddVariationValue(title, value)
		}
	}

	return (
		<>
			<div>
				<label className="mb-3 block text-black dark:text-white">
					Variation Types
				</label>
				<div className="grid grid-cols-2 gap-2">
					<input
						type="text"
						name="variationTitle"
						onKeyDown={handleKeyDownTitle}
						onChange={(e) =>
							setVariationTitle(_.toLower(e.target.value))
						}
						value={variationTitle}
						ref={variationTitleRef}
						placeholder="Variation Name"
						className="w-full capitalize rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
					/>
					<button
						type="button"
						onClick={handleAddVariationTitle}
						disabled={variationTitle === ''}
						name="variationAddRef"
						className="inline-flex disabled:bg-teal-200 items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
						Add
					</button>
				</div>
			</div>
			{variationTitleList.map((variationTitle, index) => (
				<div
					key={`${index}_${variationTitle}`}
					className="grid sm:grid-cols-2 grid-cols-1 gap-2">
					<div className="variationform grid grid-cols-6 gap-2 text-black dark:text-white">
						<div className="col-span-2 flex justify-center capitalize items-center overflow-hidden">
							<p className="text-center break-words">
								{variationTitle}
							</p>
						</div>
						<input
							type="text"
							value={newVariationValue[variationTitle] || ''}
							onChange={(e) =>
								setNewVariationValue({
									...newVariationValue,
									[variationTitle]: _.toLower(e.target.value),
								})
							}
							onKeyDown={(e) =>
								handleKeyDownValue(
									e,
									variationTitle,
									newVariationValue[variationTitle]
								)
							}
							className="w-full col-span-2 capitalize rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
						/>
						<button
							type="button"
							onClick={() =>
								handleAddVariationValue(
									variationTitle,
									newVariationValue[variationTitle]
								)
							}
							disabled={newVariationValue[variationTitle] === ''}
							className="border disabled:border disabled:bg-inherit bg-zinc-400 rounded-md hover:bg-opacity-70">
							Add
						</button>
						<button
							type="button"
							onClick={() =>
								handleDeleteVariationValue(variationTitle)
							}
							className="border disabled:border disabled:bg-inherit bg-red-500 text-white rounded-md hover:bg-opacity-70">
							Delete
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{variationValues[variationTitle] &&
							variationValues[variationTitle].map((value) => (
								<div
									className="relative"
									key={`${value}_${Date.now()}`}>
									<p
										key={JSON.stringify(value)}
										className="bg-zinc-400 text-black rounded-xl px-4 py-1 text-sm dark:bg-zinc-50">
										{value}
									</p>
									<div
										onClick={() => {
											setVariationValues((prev) => ({
												...prev,
												[variationTitle]: prev[
													variationTitle
												].filter((v) => v !== value),
											}))
										}}
										className="cursor-pointer absolute top-0 right-1 h-3 w-3 rounded-full bg-red-500 flex justify-center items-center hover:bg-opacity-60 lowercasebg-red-500 text-white p-1">
										&times;
									</div>
								</div>
							))}
					</div>
				</div>
			))}
		</>
	)
}

export default Variation
