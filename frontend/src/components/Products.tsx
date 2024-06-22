import ProductCard from "@/src/components/ProductCard";
import { Product } from "@/src/types/types";
import { useProducts } from "@/src/services/queries";
import ProductCardSkeleton from "./ProductCardSkeleton";

const Products = () => {
  const { data, isLoading, error } = useProducts();
  if (error)
    return (
      <div className="flex flex-1 items-center justify-center">
        Failed to load
      </div>
    );
  if (isLoading)
    return (
      <div className="dynamic-grid p-4">
      {Array(6).fill(0).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
    );
  const products = data?.products;
  return (
    <div className="dynamic-grid p-4">
      {products?.map((product: Product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default Products;
