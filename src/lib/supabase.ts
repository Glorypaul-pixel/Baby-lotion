import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  category: 'soap' | 'baby_lotion' | 'adult_lotion';
  price: number;
  image_url: string;
  stock: number;
  is_featured: boolean;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products?: Product;
};

export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};
 

export type Order = {
  id: string;
  user_id: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: ShippingAddress;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
};
