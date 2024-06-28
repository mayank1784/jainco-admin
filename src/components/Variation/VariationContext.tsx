import React, { createContext, useState } from 'react'

interface VariationObject {
	[key: string]: string[] | (string | VariationList)[] // Union type for values
}

interface VariationList extends Array<string | VariationList> {}

interface VariationContextType {
	variationValues: VariationObject
	setVariationValues: React.Dispatch<React.SetStateAction<VariationObject>>
}

export const VariationContext = createContext<VariationContextType>({
	variationValues: {},
	setVariationValues: () => {},
})

export const VariationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [variationValues, setVariationValues] = useState<VariationObject>({})

	return (
		<VariationContext.Provider
			value={{ variationValues, setVariationValues }}>
			{children}
		</VariationContext.Provider>
	)
}
