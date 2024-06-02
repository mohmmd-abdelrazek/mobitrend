import Link from "next/link";
import Rating from "./Rating";
import { Product } from "../types/types";
import { useProductImage } from "../services/queries";
import Image from "next/legacy/image";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Card } from "./ui/card";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { data, isLoading, error } = useProductImage(product._id);
  if (error) return <div className="text-center">Failed to load</div>;
  if (isLoading) return <ProductCardSkeleton />;
  const images = data.images;
  const image =
    images.length > 0
      ? images[0]
      : "https://res.cloudinary.com/dhliba9i5/image/upload/v1714169979/products/default-placeholder_r9thjf.png";

  return (
    <Card className="flex h-72 w-full flex-col p-4 transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-square w-full">
        <Image
          src={image}
          alt={product.name}
          layout="fill"
          className="h-full w-full rounded-md object-cover object-center"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-md mt-2 line-clamp-2 w-full overflow-hidden text-ellipsis p-0 font-bold">
          {product.name}
        </h3>
      </div>
      <Rating value={product.rating} numReviews={product.numReviews} />
      <Link
        href={`/product/${product._id}`}
        className="my-1 inline-block rounded bg-orange-500 px-2 py-1 text-center text-xs font-bold text-white hover:bg-orange-600"
      >
        View Details
      </Link>
    </Card>
  );
};

export default ProductCard;
