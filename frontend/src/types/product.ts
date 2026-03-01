export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  priceConsumer: number;
  priceReseller: number;
  minOrderReseller: number;
  stock: number;
  unit: string;
  imageUrl: string | null;
  images: string[];
  isFeatured: boolean;
  seasonStart: number | null;
  seasonEnd: number | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  category: Category;
  avgRating: number;
  reviewCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}
