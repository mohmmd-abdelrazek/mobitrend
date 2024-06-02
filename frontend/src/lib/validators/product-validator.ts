import { z } from "zod";

export const AVAILABLE_CATEGORIES = [
  "electronics",
  "books",
  "clothing",
] as const;

export const AVAILABLE_RATINGS = ["5", "4", "3", "2", "1"] as const;
export const AVAILABLE_PRICE = ["0-50", "51-100", "101-200"] as const;

export const ProductFilterValidator = z.object({
  categories: z.array(z.enum(AVAILABLE_CATEGORIES)),
  ratings: z.array(z.enum(AVAILABLE_RATINGS)),
  price: z.enum(AVAILABLE_PRICE),
});

export type ProductState = z.infer<typeof ProductFilterValidator>
