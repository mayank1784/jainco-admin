import { Timestamp } from "firebase/firestore";
import { Variation } from "../components/Variation/VariationContext";

export type Product = {
  image: string;
  name: string;
  category: string;
  price: number;
  sold: number;
  profit: number;
};

export type ProductData = {
  name: string;
  description: string;
  lowerPrice: number;
  upperPrice: number;
  category: string; //category id
  createdAt: Timestamp;
  mainImage: string;
  otherImages?: string[];
  variationTypes: string[];
  variations: Variation[];
}

