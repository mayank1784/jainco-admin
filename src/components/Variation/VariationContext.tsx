import React, { createContext, useState } from 'react'

type NestedList = [string, string]

type VariationList = (string | NestedList)[]

export interface VariationObject {
	[key: string]: VariationList
}

interface VariationContextType {
	variationValues: VariationObject
	setVariationValues: React.Dispatch<React.SetStateAction<VariationObject>>
	unavailableCombinations: Record<string, string>[]
	setUnavailableCombinations: React.Dispatch<React.SetStateAction<Record<string, string>[]>>
}

export const VariationContext = createContext<VariationContextType>({
	variationValues: {},
	setVariationValues: () => {},
	unavailableCombinations: [],
	setUnavailableCombinations: () => {},
})

export const VariationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [variationValues, setVariationValues] = useState<VariationObject>({})
	const [unavailableCombinations, setUnavailableCombinations] = useState<Record<string, string>[]>([])

	return (
		<VariationContext.Provider
			value={{ variationValues, setVariationValues, unavailableCombinations, 
				setUnavailableCombinations  }}>
			{children}
		</VariationContext.Provider>
	)
}
export const getStringOrFirstElement = (input: NestedList | string): string => {
	if (typeof input === 'string') {
		return input
	} else if (Array.isArray(input) && input.length > 0) {
		return input[0]
	} else {
		throw new Error('Input is not a string or a non-empty array of strings')
	}
}
