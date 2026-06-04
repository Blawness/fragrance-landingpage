import { CraftStory } from "@/components/scenes/CraftStory";
import { Footer } from "@/components/scenes/Footer";
import { Hero } from "@/components/scenes/Hero";
import { Preloader } from "@/components/scenes/Preloader";
import { ProductDetail } from "@/components/scenes/ProductDetail";
import { ProductSequence } from "@/components/scenes/ProductSequence";
import { ScentNotes } from "@/components/scenes/ScentNotes";

export default function Home() {
  return (
    <main>
      <Preloader />
      <Hero />
      <ProductSequence />
      <ScentNotes />
      <CraftStory />
      <ProductDetail />
      <Footer />
    </main>
  );
}
