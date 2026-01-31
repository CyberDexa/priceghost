// Database Types
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  url: string;
  name: string;
  image_url: string | null;
  current_price: number | null;
  original_price: number | null;
  lowest_price: number | null;
  highest_price: number | null;
  target_price: number | null;
  currency: string;
  retailer: string;
  is_active: boolean;
  last_checked: string | null;
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  price: number;
  currency: string;
  checked_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  product_id: string;
  alert_type: 'price_drop' | 'target_reached' | 'back_in_stock';
  threshold_price: number | null;
  threshold_percentage: number | null;
  is_triggered: boolean;
  triggered_at: string | null;
  created_at: string;
}

// API Types
export interface ScrapeResult {
  success: boolean;
  name?: string;
  price?: number;
  currency?: string;
  image_url?: string;
  retailer?: string;
  error?: string;
}

export interface AddProductRequest {
  url: string;
  target_price?: number;
}

// UI Types
export type Retailer = 
  | 'amazon' 
  | 'walmart' 
  | 'bestbuy' 
  | 'target' 
  | 'ebay' 
  | 'costco'
  | 'aliexpress'
  | 'temu'
  | 'newegg'
  | 'homedepot'
  | 'lowes'
  | 'wayfair'
  | 'etsy'
  | 'argos'
  | 'currys'
  | 'johnlewis'
  | 'ao'
  | 'very'
  | 'unknown'
  | string; // Allow any retailer name for generic sites

export interface PriceChange {
  product_id: string;
  old_price: number;
  new_price: number;
  change_amount: number;
  change_percentage: number;
  direction: 'up' | 'down' | 'same';
}
