
import React, { createContext, useState, useContext } from 'react';
// Interface for individual variations in Firestore
export interface Variation {
  variationType: Record<string, string>;
  images: string[];
  price: number;
  stock: number;
  isAvailable: boolean;
  sku: string;
}

// Context type including variationType and variations
interface VariationContextType {
  variationType: string[];  // List of variation titles
  setVariationType: React.Dispatch<React.SetStateAction<string[]>>;
  variations: Variation[];  // List of variations
  setVariations: React.Dispatch<React.SetStateAction<Variation[]>>;
  variationTypesList: Record<string, string[]>;  // Object with keys as titles and values as arrays of strings
  setVariationTypesList: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;  // State setter for variationTypesList
  resetVariations: ()=>void;

}

// Default values for the context
export const VariationContext = createContext<VariationContextType>({
  variationType: [],
  setVariationType: () => {},
  variations: [],
  setVariations: () => {},
  variationTypesList: {},
  setVariationTypesList: ()=>{},
  resetVariations: ()=>{}
});

// VariationProvider component
export const VariationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [variationType, setVariationType] = useState<string[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [variationTypesList, setVariationTypesList] = useState<Record<string, string[]>>({});

  const resetVariations = () => {
    setVariations([]);
    setVariationType([]);
    setVariationTypesList({});
};

  return (
    <VariationContext.Provider
      value={{
        variationType,
        setVariationType,
        variations,
        setVariations,
		variationTypesList,
        setVariationTypesList,
        resetVariations
      }}
    >
      {children}
    </VariationContext.Provider>
  );
};

export const useVariationContext = () => {
  const context = useContext(VariationContext)
  if (!context) {
    throw new Error('useVariationContext must be used within a VariationProvider')
  }
  return context
}

