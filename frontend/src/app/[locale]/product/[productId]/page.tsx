"use client";

import InputField from "@/src/components/InputField";
import ImageGallery from "@/src/components/product-page/ImageGallery";
import QuantitySelector from "@/src/components/QuantitySelector";
import Rating from "@/src/components/Rating";
import { addItemToCart, addReview } from "@/src/services/mutate";
import {
  useAuth,
  useCart,
  useProduct,
  useProducts,
  useReviews,
} from "@/src/services/queries";
import { Cart } from "@/src/types/types";
import { addItemToLocalCart, getLocalCart } from "@/src/utils/indexedDb";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import { mutate } from "swr";

const ProductPage = () => {
  const { productId } = useParams();
  const {
    data: product,
    isLoading,
    error,
    mutate: mutateProduct,
  } = useProduct();
  const { data: status } = useAuth();
  const { data: reviews } = useReviews();
  const { data: remoteCart, mutate: mutateCart } = useCart();
  const { data: productsData } = useProducts();
  const products = productsData?.products;
  const [cart, setCart] = useState<Cart | null>(null);

  const localCart = getLocalCart();

  const fetchCart = useCallback(async () => {
    if (status?.isAuthenticated) {
      setCart(remoteCart ?? null);
    } else {
      setCart(await localCart);
    }
  }, [localCart, remoteCart, status?.isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const [reviewData, setReviewData] = useState({
    comment: "",
    rating: 0,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = async () => {
    if (status?.isAuthenticated) {
      await addItemToCart(productId, quantity);
      toast.success("product added to cart");
      setQuantity(0);
      mutateCart();
    } else {
      await addItemToLocalCart(productId, quantity, products);
      toast.success("product added to cart");
      setQuantity(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };
  const handleRatingChange = (rating: number) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  if (isLoading) return <div className="flex-1">Loading...</div>;
  if (error) return <div>Failed to load product.</div>;
  return (
    <div className="lg:small-container large-container flex flex-col gap-4">
      <div className="flex flex-1 flex-col items-center gap-12 py-4 md:flex-row md:items-start md:justify-center">
        <ImageGallery />
        <div className="flex flex-col gap-4 lg:col-span-2">
          <div>
            <h1 className="">{product.name}</h1>
            <p className="text-xs font-bold text-gray-500">
              Product # {product._id}
            </p>
          </div>
          <div className="border-y-2 py-2">
            <Rating value={product.rating} numReviews={product.numReviews} />
          </div>
          <p className="text-2xl font-bold text-gray-800">${product.price}</p>
          <div className="flex gap-4">
            <QuantitySelector
              maxQty={
                product?.inStock -
                (cart?.cartItems.find((item: any) => item.product === productId)
                  ?.qty ?? 0)
              }
              minQty={0}
              onQuantityChange={setQuantity}
              quantity={quantity}
            />
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-orange-400 px-6 py-1 text-sm font-bold text-white transition-colors hover:bg-orange-500 disabled:bg-orange-300"
              disabled={quantity < 1}
            >
              Add to Cart
            </button>
          </div>
          <div className="border-y-2 py-2">
            <span className="text-lg font-bold">Status:</span>
            {product?.inStock > 0 ? (
              <span className="text-base font-bold text-green-700">{` ${product?.inStock} In Stock `}</span>
            ) : (
              <span className="text-base font-bold text-red-700">
                Out of Stock
              </span>
            )}
            {(cart?.cartItems.find((item: any) => item.product === productId)
              ?.qty ?? 0) > 0 && (
              <p>
                <span className="text-base font-medium">(Added to cart: </span>
                <span className="text-sm font-medium">
                  {
                    cart?.cartItems.find(
                      (item: any) => item.product === productId,
                    )?.qty
                  }
                </span>
                <span className="text-base font-medium">)</span>
              </p>
            )}
          </div>
          <div className="border-b-2 py-2">
            <h2 className="mb-0">Description:</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="">
        {status?.isAuthenticated ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setFormLoading(true);
              await addReview(productId, reviewData);
              setFormLoading(false);
            }}
            className="mt-4"
          >
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  size={24}
                  onClick={() => handleRatingChange(index + 1)}
                  className={`cursor-pointer ${
                    reviewData.rating > index
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <InputField
              id="review-comment"
              name="comment"
              textarea={true}
              value={reviewData.comment}
              onChange={handleChange}
              isLoading={formLoading}
              label="comment"
              placeholder="Enter review comment"
              type={"text"}
            />
            <button
              type="submit"
              className="mt-2 rounded bg-orange-400 px-4 py-2 text-white hover:bg-orange-500"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p className="mt-4 text-gray-500">Log in to write a review.</p>
        )}
      </div>
      <h2 className="text-xl font-semibold">Customer Reviews</h2>
      {reviews
        ?.filter((review) => review.comment && review.comment.trim() != "")
        .map((review) => (
          <div key={review._id} className="my-2 rounded-lg bg-gray-100 p-4">
            <p className="font-semibold">{review.name}</p>
            <p className="text-yellow-500">Rating: {review.rating}</p>
            <p>{review.comment}</p>
          </div>
        ))}
    </div>
  );
};
export default ProductPage;
