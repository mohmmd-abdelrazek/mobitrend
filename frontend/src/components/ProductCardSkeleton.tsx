import Image from "next/image"

const ProductCardSkeleton = () => {
  return (
    <div className="flex h-72 flex-col rounded-lg border p-4 shadow transition-shadow duration-300 hover:shadow-lg">
      <div className="relative aspect-square w-full">
        <Image
          src="https://res.cloudinary.com/dhliba9i5/image/upload/v1714169979/products/default-placeholder_r9thjf.png"
          alt="default"
          layout="fill"
          className="rounded-md h-full w-full object-cover object-center"
        />
      </div>
      <h3 className="mt-2 flex-1 overflow-hidden text-ellipsis text-md font-bold">
      <div className="w-full h-full bg-gray-200" />
      </h3>
      <div className="w-full h-full bg-gray-200" />
    </div>
  )
}

export default ProductCardSkeleton