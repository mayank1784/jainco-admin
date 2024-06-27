// import React, { useState, useEffect, useCallback } from 'react'
// import AsyncCreatableSelect from 'react-select/async-creatable'
// import { toast } from 'react-toastify'
// import { db } from '../../../services/firebase'
// import { collection, addDoc, onSnapshot, query } from 'firebase/firestore'
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
// 	const [categories, setCategories] = useState<CategoryOption[]>([])

// 	const fetchCategories = useCallback(() => {
// 		setIsLoading(true)
// 		const q = query(collection(db, 'categories'))

// 		const unsubscribe = onSnapshot(
// 			q,
// 			(querySnapshot) => {
// 				const categoryList: CategoryOption[] = querySnapshot.docs.map(
// 					(doc) => ({
// 						label: doc.data().name,
// 						value: doc.data().name,
// 						id: doc.id,
// 					})
// 				)
// 				setCategories(categoryList)
// 				setIsLoading(false)
// 			},
// 			(error: any) => {
// 				toast.error(`Error fetching categories. ${error}`)
// 				setIsLoading(false)
// 			}
// 		)

// 		return () => unsubscribe()
// 	}, [])

// 	useEffect(() => {
// 		const unsubscribe = fetchCategories()
// 		return () => unsubscribe()
// 	}, [fetchCategories])

// 	const handleCreateCategory = async (inputValue: string) => {
// 		if (!inputValue) {
// 			toast.error('Category name cannot be empty.')
// 			return
// 		}
// 		try {
// 			const docRef = await addDoc(collection(db, 'categories'), {
// 				name: inputValue,
// 			})
// 			const newCategoryOption = {
// 				label: inputValue,
// 				value: inputValue,
// 				id: docRef.id,
// 			}
// 			onCategoryChange(newCategoryOption)
// 			toast.success('Category added successfully.')
// 		} catch (error) {
// 			toast.error('Error adding category.')
// 		}
// 	}

// 	const filterCategories = (inputValue: string) => {
// 		const filteredCategories = categories.filter((category) =>
// 			category.label.toLowerCase().includes(inputValue.toLowerCase())
// 		)
// 		// console.log(filteredCategories)
// 		return filteredCategories
// 	}
// 	const loadOptions = (inputValue: string) =>
// 		new Promise<CategoryOption[]>((resolve) => {
// 			setTimeout(() => {
// 				resolve(filterCategories(inputValue))
// 			}, 500)
// 		})
// 	// const loadOptions = (
// 	// 	inputValue: string,
// 	// 	callback: (options: CategoryOption[]) => void
// 	// ) => {
// 	// 	callback(filterCategories(inputValue))
// 	// }

// 	return (
// 		<>
// 			<AsyncCreatableSelect
// 				cacheOptions
// 				defaultOptions={categories}
// 				className="relative z-20 w-full"
// 				classNamePrefix="react-select"
// 				loadOptions={loadOptions}
// 				onChange={onCategoryChange}
// 				isLoading={isLoading}
// 				onCreateOption={handleCreateCategory}
// 				placeholder="Select or create a category"
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
// 						'&:hover': {
// 							borderColor: 'rgba(59, 130, 246, 1)',
// 						},
// 						transition:
// 							'border-color 0.3s ease, box-shadow 0.3s ease',
// 						padding: '0.75rem',
// 						borderRadius: '0.375rem',
// 						outline: 'none',
// 						color: 'inherit', // Inherit text color from parent
// 					}),
// 					option: (provided, state) => ({
// 						...provided,
// 						color: state.isSelected ? 'white' : 'inherit',
// 						backgroundColor: state.isSelected
// 							? 'rgba(59, 130, 246, 1)'
// 							: state.isFocused
// 							? 'rgba(59, 130, 246, 0.1)'
// 							: 'transparent',
// 						'&:hover': {
// 							backgroundColor: 'rgba(59, 130, 246, 0.1)',
// 						},
// 						padding: '0.75rem',
// 						cursor: 'pointer',
// 						fontFamily: 'inherit', // Inherit font family from parent
// 						fontSize: 'inherit', // Inherit font size from parent
// 					}),
// 					singleValue: (provided) => ({
// 						...provided,
// 						color: 'inherit', // Inherit text color from parent
// 						fontFamily: 'inherit', // Inherit font family from parent
// 						fontSize: 'inherit', // Inherit font size from parent
// 					}),
// 					placeholder: (provided) => ({
// 						...provided,
// 						color: 'rgba(107, 114, 128, 1)',
// 						fontFamily: 'inherit', // Inherit font family from parent
// 						fontSize: 'inherit', // Inherit font size from parent
// 					}),
// 					menu: (provided) => ({
// 						...provided,
// 						borderRadius: '0.375rem',
// 						boxShadow:
// 							'0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
// 					}),
// 				}}
// 			/>
// 			{JSON.stringify(categories)}
// 		</>
// 	)
// }

// export default CategorySelect

// import React, { useState, useEffect, useCallback } from 'react'
// import AsyncCreatableSelect from 'react-select/async-creatable'
// import { toast } from 'react-toastify'
// import { db } from '../../../services/firebase'
// import {
// 	collection,
// 	addDoc,
// 	onSnapshot,
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
// 	const [categories, setCategories] = useState<CategoryOption[]>([])
// 	const [inputValue, setInputValue] = useState<string>('')

// 	// const fetchCategories = useCallback(() => {
// 	// 	setIsLoading(true)
// 	// 	const q = query(collection(db, 'categories'))

// 	// 	const unsubscribe = onSnapshot(
// 	// 		q,
// 	// 		(querySnapshot) => {
// 	// 			const categoryList: CategoryOption[] = querySnapshot.docs.map(
// 	// 				(doc) => ({
// 	// 					label: doc.data().name,
// 	// 					value: doc.data().name,
// 	// 					id: doc.id,
// 	// 				})
// 	// 			)
// 	// 			setCategories(categoryList)
// 	// 			setIsLoading(false)
// 	// 		},
// 	// 		(error: any) => {
// 	// 			toast.error(`Error fetching categories. ${error}`)
// 	// 			setIsLoading(false)
// 	// 		}
// 	// 	)

// 	// 	return () => unsubscribe()
// 	// }, [])

// 	// useEffect(() => {
// 	// 	const unsubscribe = fetchCategories()
// 	// 	return () => unsubscribe()
// 	// }, [fetchCategories])

// 	const handleCreateCategory = async (inputValue: string) => {
// 		if (!inputValue || inputValue === '') {
// 			toast.error('Category name cannot be empty.')
// 			return
// 		}
// 		try {
// 			const docRef = await addDoc(collection(db, 'categories'), {
// 				name: inputValue,
// 			})
// 			const newCategoryOption = {
// 				label: inputValue,
// 				value: inputValue,
// 				id: docRef.id,
// 			}
// 			// setCategories((prevCategories) => [
// 			// 	...prevCategories,
// 			// 	newCategoryOption,
// 			// ])
// 			onCategoryChange(newCategoryOption)
// 			toast.success('Category added successfully.')
// 		} catch (error) {
// 			toast.error('Error adding category.')
// 		}
// 	}

// 	// const filterCategories = (inputValue: string) => {
// 	// 	const filteredCategories = categories.filter((category) =>
// 	// 		category.label.toLowerCase().includes(inputValue.toLowerCase())
// 	// 	)
// 	// 	return [
// 	// 		...filteredCategories,
// 	// 		{
// 	// 			label: `Create new: "${inputValue}"`,
// 	// 			value: 'create-new',
// 	// 			id: 'create-new',
// 	// 		},
// 	// 	]
// 	// }

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
// 			const categoryData = doc.data() as { name: string } // Cast to object with only name // Cast to Category type
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

// 	// const handleInputChange = (newValue: string) => {
// 	// 	setInputValue(newValue)
// 	// }

// 	const handleOptionChange = (
// 		selectedOption: SingleValue<CategoryOption>
// 	) => {
// 		if (selectedOption?.value === 'create-new') {
// 			const newCategoryName = selectedOption.label
// 				.replace('Create new: "', '')
// 				.replace('"', '')
// 			handleCreateCategory(newCategoryName)
// 		} else {
// 			onCategoryChange(selectedOption)
// 		}
// 	}

// 	const getNewOptionData = (
// 		inputValue: string,
// 		optionLabel: React.ReactNode
// 	) => ({
// 		label: `Create new: "${inputValue}"`,
// 		value: 'create-new',
// 		id: 'create-new',
// 	})

// 	// const formatCreateLabel = (inputValue: string) =>
// 	// 	`Create new category: "${inputValue}"`

// 	// const isValidNewOption = (
// 	// 	inputValue: string,
// 	// 	selectValue: any,
// 	// 	selectOptions: any
// 	// ) => {
// 	// 	return !selectOptions.some(
// 	// 		(option: CategoryOption) => option.label === inputValue
// 	// 	)
// 	// }

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
// 			{JSON.stringify(categories)}
// 		</>
// 	)
// }

// export default CategorySelect

import React, { useState } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { toast } from 'react-toastify'
import { db } from '../../../services/firebase'
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

	const handleCreateCategory = async (inputValue: string) => {
		if (!inputValue || inputValue === '') {
			toast.error('Category name cannot be empty.')
			return
		}
		try {
			await addDoc(collection(db, 'categories'), {
				name: inputValue,
			})

			toast.success('Category added successfully.')
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
		</>
	)
}

export default CategorySelect
