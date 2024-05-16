import Image from "next/legacy/image";

interface CategoryProps {
  categories: { id: number; name: string; imageUrl: string }[];
}

const CategoryList: React.FC<CategoryProps> = ({ categories }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="max-w-sm overflow-hidden rounded shadow-lg"
        >
          <div className="h-20 w-20">
          <Image
            className="w-full"
            src={category.imageUrl}
            alt={category.name}
            width={400}
            height={400}
          >
            </Image>
          </div>
          <div className="px-6 py-4">
            <div className="mb-2 text-xl font-bold">{category.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
