import React, { useContext } from 'react'
import {
	VariationContext,
	VariationObject,
	getStringOrFirstElement,
} from '../Variation/VariationContext'
import ActiveSwitcher from '../Switchers/ActiveSwitcher'

// Transform VariationObject into an array of objects representing each combination
const transformVariationObject = (
	variationObject: VariationObject
): Record<string, string>[] => {
	const keys = Object.keys(variationObject)
	const combinations: string[][] = []

	const generateCombinations = (
		currentCombination: string[],
		index: number
	) => {
		if (index === keys.length) {
			combinations.push([...currentCombination])
			return
		}

		const values = variationObject[keys[index]]
		values.forEach((value) => {
			currentCombination[index] = getStringOrFirstElement(value)
			generateCombinations(currentCombination, index + 1)
		})
	}

	generateCombinations(new Array(keys.length).fill(''), 0)

	return combinations.map((combination) => {
		const obj: Record<string, string> = {}
		combination.forEach((value, index) => {
			obj[keys[index]] = value
		})
		return obj
	})
}

const VariationTable: React.FC = () => {
	const {
		variationValues,
		unavailableCombinations,
		setUnavailableCombinations,
	} = useContext(VariationContext)

	const columns = Object.keys(variationValues)
	const transformedData = transformVariationObject(variationValues)

	const handleToggle = (index: number, enabled: boolean) => {
		const combination = transformedData[index]
		const combinationString = JSON.stringify(combination)

		if (!enabled) {
			// Add to unavailableCombinations if not already present
			if (
				!unavailableCombinations.some(
					(item) => JSON.stringify(item) === combinationString
				)
			) {
				setUnavailableCombinations((prev) => [...prev, combination])
			}
		} else {
			// Remove from unavailableCombinations if exists
			setUnavailableCombinations((prev) =>
				prev.filter(
					(item) => JSON.stringify(item) !== combinationString
				)
			)
		}
	}

	return (
		<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
			<div className="py-6 px-4 md:px-6 xl:px-7.5">
				<h4 className="text-xl font-semibold text-black dark:text-white">
					Product Variations
				</h4>
			</div>

			{Object.keys(variationValues).length !== 0 ? (
				<div className="overflow-x-auto">
					<table className="min-w-full">
						<thead className="border-b border-stroke dark:border-strokedark uppercase">
							<tr className="flex justify-center">
								<th className="w-15 flex-shrink-0 px-4 py-2 font-medium">
									S.No
								</th>
								<th className="w-20 flex-shrink-0 px-4 py-2 font-medium">
									Image
								</th>
								{columns.map((col, index) => (
									<th
										key={index}
										className="w-40 flex-shrink-0 px-4 py-2 font-medium uppercase">
										{col}
									</th>
								))}
								<th className="w-20 flex-shrink-0 px-4 py-2 font-medium">
									Active
								</th>
							</tr>
						</thead>
						<tbody>
							{transformedData.map((data, index) => (
								<tr
									key={index}
									className="flex border-t min-h-20 border-stroke dark:border-strokedark items-center justify-center text-center">
									<td className="w-15 flex-shrink-0 px-4 py-2">
										{index + 1}
									</td>
									<td className="w-20 flex-shrink-0 px-1 py-2 flex justify-center items-center border">
										<img
											src="https://www.urbanspacestore.in/cdn/shop/products/A1LtPqnQJNL._AC_SL1500.jpg"
											alt="Image"
											className="cover border"
										/>
									</td>
									{columns.map((col, colIndex) => (
										<td
											key={colIndex}
											className="w-40 flex-shrink-0 px-4 py-2 text-sm text-black dark:text-white capitalize text-wrap break-all">
											{data[col]}
										</td>
									))}

									<td
										className="w-20 flex-shrink-0 px-4 py-2"
										key={index}>
										<ActiveSwitcher
											key={index}
											defaultEnabled={
												!unavailableCombinations.some(
													(item) =>
														JSON.stringify(item) ===
														JSON.stringify(data)
												)
											}
											onToggle={(enabled) =>
												handleToggle(index, enabled)
											}
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<h6 className="text-sm px-4 md:px-6 xl:px-7.5 text-black dark:text-white">
					Nothing to show
				</h6>
			)}
		</div>
	)
}

export default VariationTable
