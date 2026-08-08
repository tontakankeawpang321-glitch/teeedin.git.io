export interface LandPost {
  id: string | number;
  title: string;
  price: number;
  province: string;
  address: string; // District/Amphoe or street address
  contact_name: string;
  phone: string;
  line_id: string;
  body: string; // Full description
  images: string[];
  lat: number | null;
  lng: number | null;
  createdAt?: string;
}

export type SortOption = 'latest' | 'price_asc' | 'price_desc';

export interface FilterState {
  province: string;
  districtQuery: string;
  minPrice: number | '';
  maxPrice: number | '';
  sortBy: SortOption;
  hasMapOnly: boolean;
}

export interface NewPostInput {
  title: string;
  price: number | '';
  province: string;
  address: string;
  contact_name: string;
  phone: string;
  line_id: string;
  body: string;
  lat: number | '';
  lng: number | '';
  images: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
