import { Product } from "src/app/products/product";

export interface ProductState {
    products: Product[];
    selectedProductId: number | null;
    errorMessage: string;
  }