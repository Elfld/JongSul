// src/lib/types/lostItem.ts
export interface LostItem {
  id: number;
  image: string;
  date: string;
  tag: string;
  location: string;
  description: string;
}

export interface ApiResponse {
  items: LostItem[];
  total: number;
  hasMore: boolean;
}