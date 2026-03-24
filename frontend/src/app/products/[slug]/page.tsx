export const revalidate = 300;

import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductInteractions from "@/components/product/ProductInteractions";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type Product = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  images?: string[];
  priceConsumer: number;
  priceReseller: number;
  unit: string;
  minOrderReseller: number;
  stock: number;
  description?: string;
  tags?: string[];
  avgRating?: number;
  reviewCount?: number;
  category?: { name: string; slug: string };
};

export type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string };
};

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/products?limit=100`);
    const data = await res.json();
    return (data.data || []).map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// Next.js 15: params is now a Promise — must be awaited before use
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null = null;
  let reviews: Review[] = [];
  let relatedProducts: Product[] = [];

  try {
    const res = await fetch(`${BASE_URL}/products/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) notFound();
    const data = await res.json();
    product = data.data;
  } catch {
    notFound();
  }

  try {
    const [reviewsRes, relatedRes] = await Promise.all([
      fetch(`${BASE_URL}/reviews/product/${product!.id}`, {
        next: { revalidate: 300 },
      }),
      fetch(
        `${BASE_URL}/products?category=${product!.category?.slug}&limit=5`,
        { next: { revalidate: 300 } },
      ),
    ]);
    reviews = reviewsRes.ok ? (await reviewsRes.json()).data || [] : [];
    const relatedData = relatedRes.ok
      ? (await relatedRes.json()).data || []
      : [];
    relatedProducts = relatedData
      .filter((p: Product) => p.id !== product!.id)
      .slice(0, 4);
  } catch {
    // fallback empty
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-[6%] min-h-screen">
        <div className="max-w-6xl mx-auto">
          <ProductInteractions
            product={product!}
            reviews={reviews}
            relatedProducts={relatedProducts}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
