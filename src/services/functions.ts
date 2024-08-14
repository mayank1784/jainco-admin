import { collection, Timestamp, writeBatch, doc } from 'firebase/firestore'
import { db } from './firebase'
import { ProductData } from '../types/product'
import { toast } from 'react-toastify'

export const addProduct = async (productData: ProductData) => {
	try {
		// Initialize a new batch
		const batch = writeBatch(db)

		// Reference to the products collection
		const productRef = doc(collection(db, 'products'))

		// Filter out otherImages if not provided
		const { variationTypes, variations, otherImages, ...rest } = productData
		const filteredOtherImages =
			otherImages?.filter((image) => image.trim().length > 0) || []
		// Check if variationTypes is not an empty object
		const isVariationTypesNotEmpty =
			variationTypes && Object.keys(variationTypes).length > 0

		const finalProductData = {
			...rest,
			...(filteredOtherImages.length > 0
				? { otherImages: filteredOtherImages }
				: {}),
			createdAt: Timestamp.fromDate(new Date()),
			...(isVariationTypesNotEmpty && { variationTypes }),
		}

		// Add product data to the batch
		batch.set(productRef, finalProductData)

		// Add each variation to a nested subcollection under the product document

		variations.forEach((variation) => {
			// Validation checks for variations

			if (variation.price <= 0) {
				console.log('variation price mismatch')
				toast.error('Variation price must be greater than 0.')
				throw new Error('Variation price must be greater than 0.')
			}
			if (!variation.sku || variation.sku.trim() === '') {
				toast.error('Variation SKU is required.')
				throw new Error('Variation SKU is required.')
			}

			// Remove the images property if its length is 0
			const { images, ...rest } = variation
			const variationData =
				images.length > 0 ? { ...rest, images } : { ...rest }

			// If validation passes, add the variation to the batch
			const variationRef = doc(collection(productRef, 'variations'))
			batch.set(variationRef, variationData)
		})

		// Commit the batch
		await batch.commit()

		toast.success('Product added successfully!')
	} catch (error) {
		console.error('Error adding product: ', error)
		toast.error(`Failed to add product: ${JSON.stringify(error)}`)
		throw new Error('Unable to add product.')
	}
}
