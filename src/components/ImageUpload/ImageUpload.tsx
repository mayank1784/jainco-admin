import React, { useState, useEffect } from 'react'
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
	deleteObject,
} from 'firebase/storage'
import { toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

interface ImageUploadProps {
	title: string
	mandatory?: boolean
	onUploadComplete: (url: string) => void
	onDelete: () => void
	reset: boolean
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	title,
	mandatory = false,
	onUploadComplete,
	onDelete,
	reset,
}) => {
	const [uploadProgress, setUploadProgress] = useState<number>(0)
	const [uploading, setUploading] = useState<boolean>(false)
	const [imageUrl, setImageUrl] = useState<string | null>(null)

	useEffect(() => {
		if (reset) {
			setImageUrl(null)
			setUploadProgress(0)
			setUploading(false)
		}
	}, [reset])

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			const fileTypes = [
				'image/jpeg',
				'image/jpg',
				'image/png',
				'image/webp',
			]
			const maxSize = 5 * 1024 * 1024 // 5MB

			if (!fileTypes.includes(file.type)) {
				toast.error(
					'Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.'
				)
				return
			}

			if (file.size > maxSize) {
				toast.error('File size exceeds 5MB.')
				return
			}

			const storage = getStorage()
			const uniqueFileName = `${Date.now()}_${file.name}` // Unique filename with ti
			const storageRef = ref(storage, `images/${uniqueFileName}`)

			if (imageUrl) {
				const oldImageRef = ref(storage, imageUrl)
				deleteObject(oldImageRef).catch((error) => {
					console.error('Previous image deletion failed', error)
					toast.error('Previous image deletion failed')
				})
			}

			const uploadTask = uploadBytesResumable(storageRef, file)

			setUploading(true)

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					setUploadProgress(progress)
				},
				(error) => {
					console.error('Upload failed', error)
					toast.error('Upload failed.')
					setUploading(false)
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(
						(downloadURL) => {
							setImageUrl(downloadURL)
							onUploadComplete(downloadURL)
							setUploading(false)
						}
					)
				}
			)
		}
	}

	const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		if (imageUrl) {
			const storage = getStorage()
			const imageRef = ref(storage, imageUrl)
			deleteObject(imageRef)
				.then(() => {
					setImageUrl(null)
					onDelete()
					toast.success('Image deleted successfully.')
				})
				.catch((error) => {
					console.error('Delete failed', error)
					toast.error('Delete failed.')
				})
		}
	}

	return (
		<div className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5">
			<h2 className="text-center">{title}</h2>
			{/* <ToastContainer /> */}
			<input
				type="file"
				accept=".png, .jpg, .jpeg, .webp"
				className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
				onChange={handleFileChange}
				required={mandatory}
			/>
			<div className="flex flex-col items-center justify-center space-y-3">
				{uploading ? (
					<p>Uploading: {uploadProgress.toFixed(2)}%</p>
				) : imageUrl ? (
					<div className="relative">
						<img
							src={imageUrl}
							alt="Uploaded"
							className="h-35 w-35 sm:h-40 sm:w-40 object-contain border p-1 bg-slate-300 border-dotted border-form-strokedark"
						/>
						<button
							type="button"
							onClick={handleDelete}
							className="absolute hover:bg-opacity-80 top-0 right-0 bg-red-500 text-white rounded-full p-1 z-9999 w-4 h-4 flex items-center justify-center overflow-hidden">
							&times;
						</button>
					</div>
				) : (
					<>
						<span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
									fill="#3C50E0"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
									fill="#3C50E0"
								/>
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
									fill="#3C50E0"
								/>
							</svg>
						</span>
						<p className="text-sm text-center">
							<span className="text-primary text-sm">
								Click to upload
							</span>{' '}
							or drag and drop
						</p>
						<p className="mt-1.5 text-sm">PNG, JPG or WEBP</p>
						<p className="text-sm">(max, 800 X 800px)</p>
					</>
				)}
			</div>
		</div>
	)
}

export default ImageUpload
