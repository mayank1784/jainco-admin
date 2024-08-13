// import React, { useState } from 'react'
// import AsyncCreatableSelect from 'react-select/async-creatable'
// import { toast } from 'react-toastify'
// import { db } from '../../../services/firebase'
// import {
// 	collection,
// 	addDoc,
// 	query,
// 	getDocs,
// 	orderBy,
// 	startAfter,
// 	where,
// 	limit,
// } from 'firebase/firestore'
// import { SingleValue } from 'react-select'
// import 'react-toastify/dist/ReactToastify.css'

// interface CategoryOption {
// 	label: string
// 	value: string
// 	id: string
// }

// interface CategorySelectProps {
// 	onCategoryChange: (value: SingleValue<CategoryOption>) => void
// }

// const CategorySelect: React.FC<CategorySelectProps> = ({
// 	onCategoryChange,
// }) => {
// 	const [isLoading, setIsLoading] = useState<boolean>(false)

// 	const handleCreateCategory = async (inputValue: string) => {
// 		if (!inputValue || inputValue === '') {
// 			toast.error('Category name cannot be empty.')
// 			return
// 		}
// 		try {
// 			await addDoc(collection(db, 'categories'), {
// 				name: inputValue,
// 			})

// 			toast.success('Category added successfully.')
// 		} catch (error) {
// 			toast.error('Error adding category.')
// 		}
// 	}

// 	const findCategoriesFirestore = async (
// 		name: string
// 	): Promise<CategoryOption[]> => {
// 		setIsLoading(true)
// 		const q = query(
// 			collection(db, 'categories'),
// 			orderBy('name'), // Order results alphabetically by name
// 			startAfter(name.toLowerCase()), // Start search after the input (inclusive)
// 			where('name', '>=', name.toLowerCase()), // Match names greater than or equal to input (case-insensitive)
// 			limit(10) // Limit results to 10 (adjust as needed)
// 		)
// 		const querySnapshot = await getDocs(q)

// 		const categories: CategoryOption[] = []
// 		querySnapshot.forEach((doc) => {
// 			const categoryData = doc.data() as { name: string } // Cast to object with only name
// 			categories.push({
// 				label: categoryData.name, // Set label to name
// 				value: categoryData.name, // Set value to name (adjust if needed)
// 				id: doc.id, // Use document ID for id
// 			})
// 		})
// 		setIsLoading(false)
// 		return categories
// 	}

// 	const loadOptions = (inputValue: string) => {
// 		return new Promise<CategoryOption[]>((resolve) => {
// 			setTimeout(() => {
// 				resolve(findCategoriesFirestore(inputValue))
// 			}, 500)
// 		})
// 	}

// 	const handleOptionChange = (
// 		selectedOption: SingleValue<CategoryOption>
// 	) => {
// 		if (selectedOption?.value !== 'create-new') {
// 			onCategoryChange(selectedOption)
// 		}
// 	}
// 	const getNewOptionData = (inputValue: string) => ({
// 		label: `Create new: ${inputValue}`,
// 		value: 'create-new',
// 		id: 'create-new',
// 	})

// 	return (
// 		<>
// 			<AsyncCreatableSelect
// 				cacheOptions
// 				className="relative z-20 w-full dark:text-white text-black"
// 				classNamePrefix="react-select"
// 				loadOptions={loadOptions}
// 				onChange={handleOptionChange}
// 				isLoading={isLoading}
// 				placeholder="Select or create a category"
// 				getNewOptionData={getNewOptionData}
// 				onCreateOption={handleCreateCategory}
// 				required={true}
// 				styles={{
// 					control: (provided, state) => ({
// 						...provided,
// 						backgroundColor: 'transparent',
// 						borderColor: state.isFocused
// 							? 'rgba(59, 130, 246, 1)'
// 							: 'rgba(209, 213, 219, 1)',
// 						boxShadow: state.isFocused
// 							? '0 0 0 1px rgba(59, 130, 246, 1)'
// 							: 'none',
// 						transition:
// 							'border-color 0.3s ease, box-shadow 0.3s ease',
// 						padding: '0.75rem',
// 						borderRadius: '0.375rem',
// 						outline: 'none',
// 						color: 'inherit',
// 					}),
// 					option: (provided, state) => ({
// 						...provided,
// 						color: 'inherit',
// 						backgroundColor: state.isFocused
// 							? 'rgba(59, 130, 246, 0.1)'
// 							: 'transparent',
// 						padding: '0.75rem',
// 						cursor: 'pointer',
// 						fontFamily: 'inherit',
// 						fontSize: 'inherit',
// 					}),
// 					singleValue: (provided) => ({
// 						...provided,
// 						color: 'inherit',
// 						fontFamily: 'inherit',
// 						fontSize: 'inherit',
// 					}),
// 					placeholder: (provided) => ({
// 						...provided,
// 						color: 'inherit',
// 						fontFamily: 'inherit',
// 						fontSize: 'inherit',
// 					}),
// 					menu: (provided) => ({
// 						...provided,
// 						borderRadius: '0.375rem',
// 						boxShadow:
// 							'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
// 						backgroundColor:
// 							document.documentElement.classList.contains('dark')
// 								? 'rgba(31, 41, 55, 1)' // Dark mode background color
// 								: provided.backgroundColor, // Default background color
// 					}),
// 				}}
// 			/>
// 		</>
// 	)
// }

// export default CategorySelect

import React, { useState } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { toast } from 'react-toastify'
import { db } from '../../../services/firebase'
import Modal from 'react-modal'
import {
	collection,
	addDoc,
	query,
	getDocs,
	orderBy,
	startAfter,
	where,
	limit,
} from 'firebase/firestore'
import { SingleValue } from 'react-select'
import 'react-toastify/dist/ReactToastify.css'

interface CategoryOption {
	label: string
	value: string
	id: string
}

interface CategorySelectProps {
	onCategoryChange: (value: SingleValue<CategoryOption>) => void
}

const CategorySelect: React.FC<CategorySelectProps> = ({
	onCategoryChange,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [newCategoryName, setNewCategoryName] = useState<string>('')
	const [newCategoryDescription, setNewCategoryDescription] = useState<string>('')
	const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null)

const handleCreateCategory = async () => {
		if (!newCategoryName || newCategoryName === '') {
			toast.error('Category name cannot be empty.')
			return
		}

		try {
			const categoryData = {
				name: newCategoryName,
				description: newCategoryDescription,
				image: newCategoryImage ? newCategoryImage.name : '',
			}
			await addDoc(collection(db, 'categories'), categoryData)

			toast.success('Category added successfully.')
			setIsModalOpen(false)
		} catch (error) {
			toast.error('Error adding category.')
		}
	}

	

	const findCategoriesFirestore = async (
		name: string
	): Promise<CategoryOption[]> => {
		setIsLoading(true)
		const q = query(
			collection(db, 'categories'),
			orderBy('name'), // Order results alphabetically by name
			startAfter(name.toLowerCase()), // Start search after the input (inclusive)
			where('name', '>=', name.toLowerCase()), // Match names greater than or equal to input (case-insensitive)
			limit(10) // Limit results to 10 (adjust as needed)
		)
		const querySnapshot = await getDocs(q)

		const categories: CategoryOption[] = []
		querySnapshot.forEach((doc) => {
			const categoryData = doc.data() as { name: string } // Cast to object with only name
			categories.push({
				label: categoryData.name, // Set label to name
				value: categoryData.name, // Set value to name (adjust if needed)
				id: doc.id, // Use document ID for id
			})
		})
		setIsLoading(false)
		return categories
	}

	const loadOptions = (inputValue: string) => {
		return new Promise<CategoryOption[]>((resolve) => {
			setTimeout(() => {
				resolve(findCategoriesFirestore(inputValue))
			}, 500)
		})
	}

	const handleOptionChange = (
		selectedOption: SingleValue<CategoryOption>
	) => {
		if (selectedOption?.value !== 'create-new') {
			onCategoryChange(selectedOption)
		}
	}
	const getNewOptionData = (inputValue: string) => ({
		label: `Create new: ${inputValue}`,
		value: 'create-new',
		id: 'create-new',
	})

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setNewCategoryImage(event.target.files[0])
		}
	}

	return (
		<>
			<AsyncCreatableSelect
				cacheOptions
				className="relative z-20 w-full dark:text-white text-black"
				classNamePrefix="react-select"
				loadOptions={loadOptions}
				onChange={handleOptionChange}
				isLoading={isLoading}
				placeholder="Select or create a category"
				getNewOptionData={getNewOptionData}
				onCreateOption={handleCreateCategory}
				required={true}
				styles={{
					control: (provided, state) => ({
						...provided,
						backgroundColor: 'transparent',
						borderColor: state.isFocused
							? 'rgba(59, 130, 246, 1)'
							: 'rgba(209, 213, 219, 1)',
						boxShadow: state.isFocused
							? '0 0 0 1px rgba(59, 130, 246, 1)'
							: 'none',
						transition:
							'border-color 0.3s ease, box-shadow 0.3s ease',
						padding: '0.75rem',
						borderRadius: '0.375rem',
						outline: 'none',
						color: 'inherit',
					}),
					option: (provided, state) => ({
						...provided,
						color: 'inherit',
						backgroundColor: state.isFocused
							? 'rgba(59, 130, 246, 0.1)'
							: 'transparent',
						padding: '0.75rem',
						cursor: 'pointer',
						fontFamily: 'inherit',
						fontSize: 'inherit',
					}),
					singleValue: (provided) => ({
						...provided,
						color: 'inherit',
						fontFamily: 'inherit',
						fontSize: 'inherit',
					}),
					placeholder: (provided) => ({
						...provided,
						color: 'inherit',
						fontFamily: 'inherit',
						fontSize: 'inherit',
					}),
					menu: (provided) => ({
						...provided,
						borderRadius: '0.375rem',
						boxShadow:
							'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
						backgroundColor:
							document.documentElement.classList.contains('dark')
								? 'rgba(31, 41, 55, 1)' // Dark mode background color
								: provided.backgroundColor, // Default background color
					}),
				}}
			/>
			<Modal
				isOpen={isModalOpen}
				onRequestClose={() => setIsModalOpen(false)}
				contentLabel="Create New Category"
				className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto p-6 mt-10"
				overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
			>
				<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
					Create New Category
				</h2>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Category Name
					</label>
					<input
						type="text"
						placeholder="Category Name"
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Category Description
					</label>
					<textarea
						placeholder="Category Description"
						value={newCategoryDescription}
						onChange={(e) => setNewCategoryDescription(e.target.value)}
						className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					></textarea>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
						Category Image
					</label>
					<input
						type="file"
						onChange={handleFileChange}
						className="mt-1 block w-full text-gray-500 dark:text-gray-300"
					/>
				</div>
				<div className="flex justify-end">
					<button
						onClick={handleCreateCategory}
						className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Create
					</button>
					<button
						onClick={() => setIsModalOpen(false)}
						className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Cancel
					</button>
				</div>
				</Modal>
		</>
	)
}

export default CategorySelect
