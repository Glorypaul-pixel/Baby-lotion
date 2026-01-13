// src/types/Product.ts

export type Product = {
  id: string;
  name: string;
  description: string;
  category: "soap" | "baby_lotion" | "adult_lotion";
  price: number;
  image_url: string;
  stock: number;
  is_featured: boolean;
  created_at: string;
};
