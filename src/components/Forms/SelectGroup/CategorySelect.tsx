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

// import React, { useEffect, useState } from 'react'
// import SearchIcon from '@mui/icons-material/Search'
// import CloseIcon from '@mui/icons-material/Close'
// import { db } from '../../../services/firebase'
// import { collection, query, where, onSnapshot } from 'firebase/firestore'
// interface CategorySelectProps {
// 	onCategorySelect: (id: string) => void; // Callback to pass selected document ID to parent
// }


// const CategorySelect: React.FC<CategorySelectProps> = ({onCategorySelect}) => {
// 	const [search, setSearch] = useState('')
// 	const [searchData, setSearchData] = useState<any[]>([])
// 	const [selectedItem, setSelectedItem] = useState<number>(-1)
// 	const [showDropdown, setShowDropdown] = useState<boolean>(true)

// 	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		setSearch(e.target.value)
// 		setShowDropdown(true) // Show the dropdown when user types
// 	}

// 	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// 		if (selectedItem < searchData.length) {
// 			if (e.key === 'ArrowUp' && selectedItem > 0) {
// 				setSelectedItem((prev) => prev - 1)
// 			} else if (e.key === 'ArrowDown' && selectedItem < searchData.length - 1) {
// 				setSelectedItem((prev) => prev + 1)
// 			} else if (e.key === 'Enter' && selectedItem >= 0) {
// 				e.preventDefault()
// 				const selectedCategory = searchData[selectedItem].name
// 				setSearch(selectedCategory)
// 				setShowDropdown(false) // Hide the dropdown after selecting
// 				setSearchData([])  // Clear the dropdown data
// 				setSelectedItem(-1)
// 				onCategorySelect(searchData[selectedItem].id)
// 			}
// 		} else {
// 			setSelectedItem(-1)
// 		}
// 	}

// 	const handleItemClick = (index: number) => {
// 		const selectedCategory = searchData[index].name
// 		setSearch(selectedCategory)
// 		setShowDropdown(false) // Hide the dropdown after selecting
// 		setSearchData([])
// 		setSelectedItem(-1)
// 		onCategorySelect(searchData[index].id)
// 	}

// 	const handleClose = () => {
// 		setSearch('')
// 		setSearchData([])
// 		setShowDropdown(false) // Hide the dropdown
// 		setSelectedItem(-1)
// 	}

// 	useEffect(() => {
// 		if (search !== '') {
// 			const q = query(
// 				collection(db, 'categories'),
// 				where('name', '>=', search),
// 				where('name', '<=', search + '\uf8ff')
// 			)

// 			const unsubscribe = onSnapshot(q, (snapshot) => {
// 				const results = snapshot.docs.map((doc) => ({
// 					id: doc.id,
// 					...doc.data()
// 				}))
// 				setSearchData(results)
// 			})

// 			return () => unsubscribe()
// 		} else {
// 			setSearchData([])  // Clear dropdown when search is empty
// 		}
// 	}, [search])
// 	return (
// 		<>
// 			<div className="flex items-center border-[1.5px] border-stroke rounded-lg bg-transparent dark:border-form-strokedark dark:bg-form-input focus-within:border-primary transition">
// 				<input
// 					type="text"
// 					className="w-full capitalize rounded-l-lg py-3 px-5 text-black outline-none disabled:cursor-default disabled:bg-whiter dark:text-white dark:bg-form-input"
// 					placeholder="Product Category"
// 					autoComplete="off"
// 					onChange={handleChange}
// 					value={search}
// 					onKeyDown={handleKeyDown}
// 				/>
// 				<div className="flex-shrink-0 pr-2">
// 					{search === '' ? (
// 						<SearchIcon className="cursor-pointer" />
// 					) : (
// 						<CloseIcon
// 							className="cursor-pointer"
// 							onClick={handleClose}
// 						/>
// 					)}
// 				</div>
// 			</div>
// 			{searchData.length > 0 && showDropdown && (
// 				<div className="flex flex-col gap-1 border-stroke focus:bg-primary">
// 					{searchData.map((data: any, i) => (
// 						<div
// 							key={i}
// 							className={
// 								selectedItem === i
// 									? 'bg-primary text-white p-2 cursor-pointer'
// 									: 'p-2 hover:bg-primary hover:text-white cursor-pointer'
// 							}
// 							onClick={() => handleItemClick(i)}
// 						>
// 							{data.name}
// 						</div>
// 					))}
// 				</div>
// 			)}
// 		</>
// 	)
// }

// export default CategorySelect
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { db } from '../../../services/firebase'
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

interface CategorySelectProps {
	onCategorySelect: (id: string) => void; // Callback to pass selected document ID to parent
}

const CategorySelect: React.FC<CategorySelectProps> = ({ onCategorySelect }) => {
	const [search, setSearch] = useState('')
	const [searchData, setSearchData] = useState<any[]>([])
	const [selectedItem, setSelectedItem] = useState<number>(-1)
	const [showDropdown, setShowDropdown] = useState<boolean>(true)
	const [showModal, setShowModal] = useState<boolean>(false)
	const [newCategoryName, setNewCategoryName] = useState('')
	const [newCategoryDescription, setNewCategoryDescription] = useState('')
	const [newCategoryImage, setNewCategoryImage] = useState('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
		setShowDropdown(true) // Show the dropdown when user types
	}

	// const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
	// 	if (selectedItem < searchData.length) {
	// 		if (e.key === 'ArrowUp' && selectedItem > 0) {
	// 			setSelectedItem((prev) => prev - 1)
	// 		} else if (e.key === 'ArrowDown' && selectedItem < searchData.length - 1) {
	// 			setSelectedItem((prev) => prev + 1)
	// 		} else if (e.key === 'Enter' && selectedItem >= 0) {
	// 			e.preventDefault()
	// 			const selectedCategory = searchData[selectedItem]
	// 			setSearch(selectedCategory.name)
	// 			setShowDropdown(false) // Hide the dropdown after selecting
	// 			setSearchData([])  // Clear the dropdown data
	// 			setSelectedItem(-1)
	// 			onCategorySelect(selectedCategory.id)
	// 		}
	// 	} else {
	// 		setSelectedItem(-1)
	// 	}
	// }

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			if (selectedItem >= 0 && selectedItem < searchData.length) {
				const selectedCategory = searchData[selectedItem]
				setSearch(selectedCategory.name)
				setShowDropdown(false) // Hide the dropdown after selecting
				setSearchData([])  // Clear the dropdown data
				setSelectedItem(-1)
				onCategorySelect(selectedCategory.id)
			} else if (searchData.length > 0) {
				// Select the first item if no item is currently selected
				const firstCategory = searchData[0]
				setSearch(firstCategory.name)
				setShowDropdown(false) // Hide the dropdown after selecting
				setSearchData([])  // Clear the dropdown data
				setSelectedItem(-1)
				onCategorySelect(firstCategory.id)
			}
		} else if (selectedItem < searchData.length) {
			if (e.key === 'ArrowUp' && selectedItem > 0) {
				setSelectedItem((prev) => prev - 1)
			} else if (e.key === 'ArrowDown' && selectedItem < searchData.length - 1) {
				setSelectedItem((prev) => prev + 1)
			}
		} else {
			setSelectedItem(-1)
		}
	}

	const handleItemClick = (index: number) => {
		const selectedCategory = searchData[index]
		setSearch(selectedCategory.name)
		setShowDropdown(false) // Hide the dropdown after selecting
		setSearchData([])
		setSelectedItem(-1)
		onCategorySelect(selectedCategory.id)
	}

	const handleClose = () => {
		setSearch('')
		setSearchData([])
		setShowDropdown(false) // Hide the dropdown
		setSelectedItem(-1)
	}

	const handleModalOpen = () => {
		setShowModal(true)
	}

	const handleModalClose = () => {
		setShowModal(false)
		setNewCategoryName('')
		setNewCategoryDescription('')
		setNewCategoryImage('')
	}

	const handleCreateCategory = async () => {
		if (newCategoryName.trim() === '') {
			alert('Category name is required')
			return
		}

		try {
			const docRef = await addDoc(collection(db, 'categories'), {
				name: newCategoryName,
				description: newCategoryDescription,
				image: newCategoryImage
			})
			handleModalClose()
			setSearch(newCategoryName)
			setShowDropdown(false)
			setSearchData([])
			onCategorySelect(docRef.id)
		} catch (error) {
			console.error('Error adding new category:', error)
		}
	}

	const handleCreateCategoryKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') { // Handle Enter or Space key
			e.preventDefault()
			handleModalOpen()
		}
	}

	useEffect(() => {
		if (search !== '') {
			const q = query(
				collection(db, 'categories'),
				where('name', '>=', search),
				where('name', '<=', search + '\uf8ff')
			)

			const unsubscribe = onSnapshot(q, (snapshot) => {
				const results = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}))
				setSearchData(results)
			})

			return () => unsubscribe()
		} else {
			setSearchData([])  // Clear dropdown when search is empty
		}
	}, [search])

	return (
		<>
			<div className="flex items-center border-[1.5px] border-stroke rounded-lg bg-transparent dark:border-form-strokedark dark:bg-form-input focus-within:border-primary transition">
				<input
					type="text"
					className="w-full capitalize rounded-l-lg py-3 px-5 text-black outline-none disabled:cursor-default disabled:bg-whiter dark:text-white dark:bg-form-input"
					placeholder="Product Category"
					autoComplete="off"
					onChange={handleChange}
					value={search}
					onKeyDown={handleKeyDown}
				/>
				<div className="flex-shrink-0 pr-2">
					{search === '' ? (
						<SearchIcon className="cursor-pointer" />
					) : (
						<CloseIcon
							className="cursor-pointer"
							onClick={handleClose}
						/>
					)}
				</div>
			</div>
			{searchData.length === 0 && search !== '' && showDropdown && (
				<div className="flex flex-col gap-1 border-stroke focus:bg-primary">
					<div
						className="p-2 cursor-pointer hover:bg-primary hover:text-white"
						onClick={handleModalOpen}
						onKeyDown={handleCreateCategoryKeyDown}
					>
						Create new category
					</div>
				</div>
			)}
			{searchData.length > 0 && showDropdown && (
				<div className="flex flex-col gap-1 border-stroke focus:bg-primary">
					{searchData.map((data: any, i) => (
						<div
							key={data.id}
							className={
								selectedItem === i
									? 'bg-primary text-white p-2 cursor-pointer'
									: 'p-2 hover:bg-primary hover:text-white cursor-pointer'
							}
							onClick={() => handleItemClick(i)}
						>
							{data.name}
						</div>
					))}
				</div>
			)}
			<Dialog open={showModal} onClose={handleModalClose}>
				<DialogTitle>Create New Category</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Category Name"
						type="text"
						fullWidth
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Description"
						type="text"
						fullWidth
						value={newCategoryDescription}
						onChange={(e) => setNewCategoryDescription(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Image URL"
						type="text"
						fullWidth
						value={newCategoryImage}
						onChange={(e) => setNewCategoryImage(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleModalClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleCreateCategory} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default CategorySelect

