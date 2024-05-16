"use client";

import InputField from "@/src/components/InputField";
import ImageGallery from "@/src/components/product-page/ImageGallery";
import QuantitySelector from "@/src/components/QuantitySelector";
import Rating from "@/src/components/Rating";
import { addItemToCart, addReview } from "@/src/services/mutate";
import { useAuth, useCart, useProduct, useReviews } from "@/src/services/queries";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
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
  const { data: cart, mutate:mutateCart } = useCart();

  const [reviewData, setReviewData] = useState({
    comment: "",
    rating: 1,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  if (isLoading) return <p className="flex-1">Loading...</p>;
  if (error) return <p>Failed to load product.</p>;
  return (
    <div className="small-responsive-container flex flex-1 flex-col md:justify-between items-center md:items-start gap-8 py-4 md:flex-row">
      <ImageGallery />
      <div className="flex flex-col gap-2 lg:col-span-2">
        <h1 className="">{product.name}</h1>
        <p className="text-sm text-gray-500">Product # {product._id}</p>
        <div className="">
          <Rating value={product.rating} numReviews={product.numReviews} />
        </div>
        <p className="text-2xl font-semibold text-gray-800">
          Price: {product.price}
        </p>
        <div className="border-b">
          <h2 className="mb-0">Description:</h2>
          <p className="text-gray-600">{product.description}</p>
        </div>
        <QuantitySelector maxQty={product?.inStock - (cart?.cartItems.find((item: any)=>item.product === productId)?.qty ?? 0)} onQuantityChange={setQuantity} quantity={quantity} />
        <div className="flex gap-4">
          <button
            onClick={async () => {
              await addItemToCart(productId, quantity);
              toast.success("product added to cart");
              setQuantity(0)
              mutateCart()
            }}
            className="rounded bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-200"
            disabled={quantity < 1}
          >
            Add to Cart
          </button>
          <button className="rounded bg-green-500 px-6 py-2 text-white transition-colors hover:bg-green-600">
            Buy Now
          </button>
        </div>
        <div>
          <span>status :</span>
        {product?.inStock > 0 ? (
          <span className="text-green-700">{` ${product?.inStock} In Stock `}</span>
        ) :(
          <span className="text-red-700">Out of Stock</span>
        ) }
        {cart?.cartItems.find((item: any)=>item.product === productId)?.qty > 0 && (<span>{`(Added to cart: ${cart?.cartItems.find((item: any)=>item.product === productId)?.qty})`}</span>)}
        </div>

        {/* Reviews Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          {reviews?.map((review) => (
            <div key={review.id} className="my-2 rounded-lg bg-gray-100 p-4">
              <p className="font-semibold">{review.name}</p>
              <p className="text-yellow-500">Rating: {review.rating}</p>
              <p>{review.comment}</p>
            </div>
          ))}

          {status.isAuthenticated ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormLoading(true);
                await addReview(productId, reviewData);
                setFormLoading(false);
              }}
              className="mt-4"
            >
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
                className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p className="mt-4 text-gray-500">Log in to write a review.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
