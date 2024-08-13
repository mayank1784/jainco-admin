import React, { useContext, useEffect, useState, useMemo } from 'react'
import { VariationContext } from '../Variation/VariationContext'

import ActiveSwitcher from '../Switchers/ActiveSwitcher'
import _ from 'lodash'
import ImageUpload from '../ImageUpload/ImageUpload'

const generateCombinations = (
	variationTypesList: Record<string, string[]>
): Record<string, string>[] => {
	const keys = Object.keys(variationTypesList)

	// Return an empty array if there are no keys or any key has no values
	if (
		keys.length === 0 ||
		keys.some((key) => variationTypesList[key].length === 0)
	) {
		return []
	}

	const values = keys.map((key) => variationTypesList[key])

	const combinations: string[][] = []

	const createCombinations = (
		currentCombination: string[],
		index: number
	) => {
		if (index === keys.length) {
			combinations.push([...currentCombination])
			return
		}

		const currentValues = values[index]
		currentValues.forEach((value) => {
			currentCombination[index] = value
			createCombinations(currentCombination, index + 1)
		})
	}

	createCombinations(new Array(keys.length).fill(''), 0)

	return combinations.map((combination) => {
		const obj: Record<string, string> = {}
		combination.forEach((value, index) => {
			obj[keys[index]] = value
		})
		return obj
	})
}
const VariationTable: React.FC<{ mainImage: string }> = ({ mainImage }) => {
	const [variationMainImage, setVariationMainImage] = useState(mainImage)

	const [modalIndex, setModalIndex] = useState<number | null>(null)

	useEffect(() => {
		setVariationMainImage(mainImage)
	}, [mainImage])

	const { variationType, variationTypesList, variations, setVariations } =
		useContext(VariationContext)

	const transformedData = useMemo(
		() => generateCombinations(variationTypesList),
		[variationTypesList]
	)

	useEffect(() => {
		const initialVariations = transformedData.map((combination) => ({
			variationType: combination,
			images: [],
			price: 0,
			stock: 0,
			isAvailable: true,
			sku: '',
		}))

		setVariations(initialVariations)
	}, [transformedData, setVariations])

	const handleToggle = (index: number, enabled: boolean) => {
		setVariations((prev) =>
			prev.map((variation, i) =>
				i === index ? { ...variation, isAvailable: enabled } : variation
			)
		)
	}

	const handleInputChange = (index: number, field: string, value: any) => {
		setVariations((prev) =>
			prev.map((variation, i) =>
				i === index ? { ...variation, [field]: value } : variation
			)
		)
	}

	const handleDelete = (index: number) => {
		setVariations((prev) => prev.filter((_, i) => i !== index))
	}

	const handleImageUpload = (imageUrl: string) => {
		if (modalIndex !== null) {
			setVariations((prev) =>
				prev.map((variation, i) =>
					i === modalIndex
						? {
								...variation,
								images: [...variation.images, imageUrl],
						  }
						: variation
				)
			)
		}
	}

	const handleImageDelete = (imageIndex: number) => {
		if (modalIndex !== null) {
			setVariations((prev) =>
				prev.map((variation, i) =>
					i === modalIndex
						? {
								...variation,
								images: variation.images.filter(
									(_, idx) => idx !== imageIndex
								),
						  }
						: variation
				)
			)
		}
	}

	const openModal = (index: number) => {
		setModalIndex(index)
	}

	const closeModal = () => {
		setModalIndex(null)
	}

	return (
		<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
			<div className="py-6 px-4 md:px-6 xl:px-7.5">
				<h4 className="text-xl font-semibold text-black dark:text-white">
					Product Variations
				</h4>
			</div>

			{transformedData.length !== 0 ? (
				<div className="overflow-x-auto">
					<table className="min-w-full">
						<thead className="border-b border-stroke dark:border-strokedark uppercase">
							<tr className="flex justify-center">
								<th className="w-15 flex-shrink-0 px-4 py-2 font-medium">
									S.No
								</th>
								<th className="w-40 flex-shrink-0 px-4 py-2 font-medium">
									SKU
								</th>
								<th className="w-30 flex-shrink-0 px-4 py-2 font-medium">
									Image
								</th>
								{variationType.map((title, index) => (
									<th
										key={index}
										className="w-30 flex-shrink-0 px-4 py-2 font-medium uppercase">
										{title}
									</th>
								))}
								<th className="w-20 flex-shrink-0 px-4 py-2 font-medium">
									Price
								</th>
								<th className="w-20 flex-shrink-0 px-4 py-2 font-medium">
									Stock
								</th>
								<th className="w-20 flex-shrink-0 px-4 py-2 font-medium">
									Active
								</th>
								<th className="w-30 flex-shrink-0 px-4 py-2 font-medium">
									Delete
								</th>
							</tr>
						</thead>
						<tbody>
							{variations.map((variation, Vindex) => (
								<tr
									key={Vindex}
									className="flex border-t min-h-20 border-stroke dark:border-strokedark items-center justify-center text-center">
									<td className="w-15 flex-shrink-0 px-4 py-2">
										{Vindex + 1}
									</td>
									<td className="w-40 flex-shrink-0 px-1 py-2 flex justify-center items-center overflow-hidden">
										<input
											type="text"
											value={variation.sku}
											onChange={(e) =>
												handleInputChange(
													Vindex,
													'sku',
													_.toLower(e.target.value.trim())
												)
											}
											className="border rounded-md capitalize w-35 pr-2 pl-2"
										/>
									</td>
									<td className="w-30 flex-shrink-0 px-1 py-2 flex flex-row justify-center items-center gap-1">
										<div className="w-19 h-19 p-0">
											<img
												src={
													variation.images[0] ||
													variationMainImage
												}
												alt="Image"
												className="cover w-19"
											/>
										</div>
										<div className='flex flex-col gap-1 p-0 m-0 w-10'>
										<button
											type="button"
											onClick={() => openModal(Vindex)}
											className="text-primary"
											id="editVariationImages">
											Edit
										</button>
										<p className='font-thin text-xs'>{variation.images.length} images</p>
										</div>

										{modalIndex === Vindex && (
											<div className="fixed inset-0 z-9999 flex items-center justify-center bg-black bg-opacity-50 max-h-screen overflow-y-auto">
												<div className="mx-auto p-4 bg-white shadow-lg rounded-lg z-999">
													<div className="mb-4">
														<h2 className="text-xl font-semibold text-gray-800">
															Variation Images
														</h2>
													</div>
													<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
														{[0, 1, 2, 3, 4].map(
															(_, index) => (
																<div
																	className="bg-gray-100 p-4 rounded-lg shadow-md"
																	key={index}>
																	<ImageUpload
																		title={`Image ${
																			index +
																			1
																		}`}
																		imageUrl={
																			variation
																				.images[
																				index
																			]
																		}
																		reset={
																			false
																		}
																		onUploadComplete={(
																			url
																		) =>
																			handleImageUpload(
																				url
																			)
																		}
																		onDelete={() =>
																			handleImageDelete(
																				index
																			)
																		}
																	/>
																</div>
															)
														)}
													</div>
													<div className="mt-6 text-right mb-5">
														<button
															type="button"
															onClick={closeModal}
															className="px-4 py-2 bg-blue-500 text-white rounded-md">
															Close
														</button>
													</div>
												</div>
											</div>
										)}
									</td>

									{variationType.map((title, colIndex) => (
										<td
											key={colIndex}
											className="w-30 flex-shrink-0 px-4 py-2 text-sm text-black dark:text-white capitalize text-wrap break-all">
											{variation.variationType[title]}
										</td>
									))}
									<td className="w-20 flex-shrink-0 px-1 py-2 flex justify-center items-center overflow-hidden">
										<input
											type="number"
											value={variation.price}
											onChange={(e) =>
												handleInputChange(
													Vindex,
													'price',
													parseFloat(e.target.value)
												)
											}
											className="border rounded-md w-16"
										/>
									</td>
									<td className="w-20 flex-shrink-0 px-1 py-2 flex justify-center items-center overflow-hidden">
										<input
											type="number"
											value={variation.stock}
											onChange={(e) =>
												handleInputChange(
													Vindex,
													'stock',
													parseInt(e.target.value, 10)
												)
											}
											className="border rounded-md w-16"
										/>
									</td>
									<td className="w-20 flex-shrink-0 px-1 py-2 flex justify-center items-center">
										<ActiveSwitcher
											defaultEnabled={
												variation.isAvailable
											}
											onToggle={(enabled) =>
												handleToggle(Vindex, enabled)
											}
										/>
									</td>
									<td className="w-30 flex-shrink-0 px-1 py-2 flex justify-center items-center">
										<button
											onClick={() => handleDelete(Vindex)}
											type="button"
											className="text-red-500">
											Delete
										</button>
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
