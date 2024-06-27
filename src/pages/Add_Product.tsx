import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '../layout/DefaultLayout'
import _ from 'lodash'
import React, { useState, useRef, useContext } from 'react'
import { SingleValue } from 'react-select'
import CategorySelect from '../components/Forms/SelectGroup/CategorySelect'

import ImageUpload from '../components/ImageUpload/ImageUpload'

import { toast } from 'react-toastify'
import { useForm, SubmitHandler } from 'react-hook-form'
import RichDescription from '../components/Forms/RichDescription'

interface ProductDetails {
	[key: string]: string | {} | [] | number
}

const ProductForm = () => {
	const {
		register,
		formState: { errors },
		handleSubmit,
		watch,
		setValue,
		setError,
		reset,
	} = useForm({ mode: 'all' })

	const [formSubmitting, setFormSubmittting] = useState(false)
	const [mainImageUrl, setMainImageUrl] = useState<string>('')
	const [optionalImagesUrls, setOptionalImagesUrls] = useState<string[]>([
		'',
		'',
		'',
	])

	const variationTitleRef = useRef<HTMLInputElement>(null)

	const [variationTitle, setVariationTitle] = useState<string>('')
	const [variationTitleList, setVariationTitleList] = useState<string[]>([])

	const [variationValues, setVariationValues] = useState<{
		[key: string]: string[]
	}>({})
	const [newVariationValue, setNewVariationValue] = useState<{
		[key: string]: string
	}>({})

	const handleMainImageUpload = (url: string) => {
		setMainImageUrl(url)
	}
	const handleCategoryChange = (
		selectedOption: SingleValue<{
			label: string
			value: string
			id: string
		}>
	) => {
		if (selectedOption) {
			setValue('category', selectedOption.id)
		} else {
			setError('category', {
				type: 'manual',
				message: 'Please select a category', // Set the error message
			})
		}
	}
	const handleDescriptionChange = (content: string) => {
		setValue('description', content)
	}
	const handleOptionalImageUpload = (index: number, url: string) => {
		const newOptionalImagesUrls = [...optionalImagesUrls]
		newOptionalImagesUrls[index] = url
		setOptionalImagesUrls(newOptionalImagesUrls)
	}

	const handleDeleteMainImage = () => {
		setMainImageUrl('')
	}

	const handleDeleteOptionalImage = (index: number) => {
		const newOptionalImagesUrls = [...optionalImagesUrls]
		newOptionalImagesUrls[index] = ''
		setOptionalImagesUrls(newOptionalImagesUrls)
	}

	const handleKeyDownTitle = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			handleAddVariationTitle()
		}
	}

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

	const onSubmit: SubmitHandler<ProductDetails> = (data) => {
		if (mainImageUrl === '' /* replace with condition */) {
			console.log('main image not present')
			toast.error('Main image is mandatory.')
			return
		}
		setFormSubmittting(true)
		const finalProductData: ProductDetails = {
			...data,
			...(optionalImagesUrls.filter((str) => str.trim().length > 0)
				.length > 0
				? {
						otherImages: optionalImagesUrls.filter(
							(str) => str.trim().length > 0
						),
				  }
				: {}),
			mainImage: mainImageUrl,
			variations: variationValues,
			unavailableCombinations: [],
		}
		console.log('Final Product Data:', finalProductData)
		setTimeout(() => {
			setFormSubmittting(false)
			toast.success('Product Uploaded')
			setMainImageUrl('')
			setOptionalImagesUrls(['', '', ''])
		}, 3000)
	}

	return (
		<DefaultLayout>
			<Breadcrumb pageName="Add Products" />

			<div className="grid grid-cols-1 gap-9">
				<div className="flex flex-col gap-9">
					<form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
						<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
							<div className="border-b border-stroke py-2 px-6.5 dark:border-strokedark flex flex-row justify-between items-center">
								<h3 className="font-medium text-black dark:text-white">
									Add Products
								</h3>
								<button
									type="submit"
									disabled={formSubmitting}
									className={`inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:opacity-65
									}`}>
									{formSubmitting ? (
										<svg
											className="animate-spin h-5 w-5 mr-3"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24">
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V2.5a.5.5 0 011 0V4a8 8 0 018 8h-1.5a.5.5 0 010-1H20a8 8 0 01-8 8v1.5a.5.5 0 01-1 0V20a8 8 0 01-8-8H4a.5.5 0 010-1H2a8 8 0 018-8v1.5a.5.5 0 01-1 0V4a8 8 0 018-8h1.5a.5.5 0 010 1H4a8 8 0 01-8 8v1.5a.5.5 0 010 1V12z"></path>
										</svg>
									) : (
										'Submit'
									)}
								</button>
							</div>
							<div className="flex flex-col gap-5.5 p-6.5">
								{variationTitle}
								<br></br>
								{JSON.stringify(variationTitleList)}
								<br></br>
								{JSON.stringify(variationValues)}
								<div>
									<label className="mb-3 block text-black dark:text-white">
										Product Name
									</label>

									<input
										required
										{...register('name', {
											required: 'Name is Required...',
											minLength: {
												value: 4,
												message:
													'name must be atleast 4 characters long...',
											},
											maxLength: {
												value: 24,
												message:
													'name must be atmost 30 characters long...',
											},
										})}
										autoFocus
										type="text"
										placeholder="Product Name"
										className={`w-full capitalize rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
											errors.name ? 'border-red-500' : ''
										}`}
									/>
									{typeof errors.name?.message ===
										'string' && (
										<span className="text-red-600">
											{errors.name?.message}
										</span>
									)}
								</div>

								<div className="mb-8">
									<label className="mb-3 block text-black dark:text-white">
										Description
									</label>

									<RichDescription
										mandatory={true}
										minChars={20}
										onChange={handleDescriptionChange}
									/>
								</div>

								<div>
									<label className="mb-3 block text-black dark:text-white">
										Category
									</label>
									<CategorySelect
										onCategoryChange={handleCategoryChange}
									/>
									{typeof errors.category?.message ===
										'string' && (
										<span className="text-red-600">
											{errors.category?.message}
										</span>
									)}
								</div>

								<div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
									<div>
										<label className="mb-3 block text-black dark:text-white">
											Lower Price
										</label>
										<input
											type="number"
											{...register('lowerPrice', {
												required:
													'Lower price is required',
												valueAsNumber: true,
											})}
											required
											min={0}
											max={10000}
											placeholder="Lower Price"
											className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
												errors.lowerPrice
													? 'border-red-500'
													: ''
											}`}
										/>
										{typeof errors.lowerPrice?.message ===
											'string' && (
											<span className="text-red-600">
												{errors.lowerPrice?.message}
											</span>
										)}
									</div>
									<div>
										<label className="mb-3 block text-black dark:text-white">
											Upper Price
										</label>
										<input
											type="number"
											{...register('upperPrice', {
												required:
													'Upper price is required',

												valueAsNumber: true,
												validate: (value) =>
													parseFloat(
														watch('lowerPrice')
													) <= parseFloat(value) ||
													'Upper price must be greater than lower price',
											})}
											required
											placeholder="Upper Price"
											min={10}
											max={10000}
											className={`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary ${
												errors.upperPrice
													? 'border-red-500'
													: ''
											}`}
										/>
										{typeof errors.upperPrice?.message ===
											'string' && (
											<span className="text-red-600">
												{errors.upperPrice?.message}
											</span>
										)}
									</div>
								</div>

								<div className="grid grid-cols-1 gap-9 sm:grid-cols-4">
									<ImageUpload
										title="Main Image"
										mandatory={true}
										onUploadComplete={handleMainImageUpload}
										onDelete={handleDeleteMainImage}
									/>
									{optionalImagesUrls.map((url, index) => (
										<ImageUpload
											key={index}
											title={`Optional Image ${
												index + 1
											}`}
											onUploadComplete={(url) =>
												handleOptionalImageUpload(
													index,
													url
												)
											}
											onDelete={() =>
												handleDeleteOptionalImage(index)
											}
										/>
									))}
								</div>

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
												setVariationTitle(
													_.toLower(e.target.value)
												)
											}
											value={variationTitle}
											ref={variationTitleRef}
											placeholder="Variation Name"
											className="w-full capitalize rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
										/>
										<button
										type='button'
											onClick={handleAddVariationTitle}
											disabled={variationTitle === ''}
											name="variationAddRef"
											className="inline-flex disabled:bg-teal-200 items-center justify-center rounded-full bg-meta-3 py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">
											Add
										</button>
									</div>
								</div>

								{variationTitleList.map(
									(variationTitle, index) => (
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
													value={
														newVariationValue[
															variationTitle
														] || ''
													}
													
													onChange={(e) =>
														setNewVariationValue({
															...newVariationValue,
															[variationTitle]:
																_.toLower(
																	e.target
																		.value
																),
														})
													}
													
													onKeyDown={(e) =>
														handleKeyDownValue(
															e,
															variationTitle,
															newVariationValue[
																variationTitle
															]
														)
													}
													className="w-full col-span-2 capitalize rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
												/>
												<button
												type='button'
													onClick={() =>
														handleAddVariationValue(
															variationTitle,
															newVariationValue[
																variationTitle
															]
														)
													}
													disabled={
														newVariationValue[
															variationTitle
														] === ''
													}
													className="border disabled:border disabled:bg-inherit bg-zinc-400 rounded-md hover:bg-opacity-70">
													Add
												</button>
												<button
												type='button'
													onClick={() =>
														handleDeleteVariationValue(
															variationTitle
														)
													}
													// disabled={
													// 	newVariationValue[
													// 		variationTitle
													// 	] !== ''
													// }
													className="border disabled:border disabled:bg-inherit bg-red-500 text-white rounded-md hover:bg-opacity-70">
													Delete
												</button>
											</div>
											<div className="flex flex-wrap gap-2">
												{variationValues[
													variationTitle
												] &&
													variationValues[
														variationTitle
													].map((value) => (
														<div className="relative">
															<p
																key={value}
																className="bg-zinc-400 text-black rounded-xl px-4 py-1 text-sm dark:bg-zinc-50">
																{value}
															</p>
															<div
																onClick={() => {
																	setVariationValues(
																		(
																			prev
																		) => ({
																			...prev,
																			[variationTitle]:
																				prev[
																					variationTitle
																				].filter(
																					(
																						v
																					) =>
																						v !==
																						value
																				),
																		})
																	)
																}}
																className="cursor-pointer absolute top-0 right-1 h-3 w-3 rounded-full bg-red-500 flex justify-center items-center hover:bg-opacity-60 lowercasebg-red-500 text-white p-1">
																&times;
															</div>
														</div>
													))}
											</div>
										</div>
									)
								)}
							</div>
						</div>
					</form>
				</div>
			</div>
		</DefaultLayout>
	)
}

export default ProductForm
