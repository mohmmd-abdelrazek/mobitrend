import ProductCard from "@/src/components/ProductCard";
import { Product } from "@/src/types/types";
import { useProducts } from "@/src/services/queries";

const Products = () => {
    const { data, isLoading, error } = useProducts();
    if (error) return <div className="flex flex-1 items-center justify-center">Failed to load</div>;
    if (isLoading)
      return (
        <div className="flex flex-1 items-center justify-center">Loading...</div>
      );
    const products = data?.products;
  return (
    <div className="dynamic-grid p-4">
            {products?.map((product: Product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
  )
}

export default Products