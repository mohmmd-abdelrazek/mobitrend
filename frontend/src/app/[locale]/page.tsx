import PromotionBanner from "@/src/components/home/PromotionBanner";
import Carousel from "@/src/components/home/Carousel";
import CategoryList from "@/src/components/home/CategoryList";

const LandingPage = () => {
  const featuredProducts = ["https://placehold.co/400", "https://placehold.co/400", "https://placehold.co/400"]; // Add your product image URLs here
  const categories = [{ id: 1, name: "Smartphones", imageUrl: "https://placehold.co/400" }];
  

  return (
    <div>
      <PromotionBanner />
      <Carousel />
      <CategoryList categories={categories} />
    </div>
  );
};

export default LandingPage;
