import Image from "next/image"
import { Card } from "./ui/card"


const ProductCardSkeleton = () => {
  return (
    <Card className="flex h-72 w-full flex-col p-4 animate-pulse">
      <div className="relative w-full aspect-square bg-gray-300 rounded-md" />
      <div className="flex-1 mt-2">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mt-2"></div>
      <div className="my-1 h-6 bg-gray-300 rounded w-1/2"></div>
    </Card>
  )
}

export default ProductCardSkeleton