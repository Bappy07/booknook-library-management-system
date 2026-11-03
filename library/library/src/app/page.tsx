
import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import HowItWorks from "@/components/home/HowItWorks";
import Categories from "@/components/home/Categories";
export default function Home() {
  return (
    <main className="flex-1">
      <HeroSlider />
      <NewArrivals />
      <HowItWorks />
      <Categories />
    </main>
  );
}

