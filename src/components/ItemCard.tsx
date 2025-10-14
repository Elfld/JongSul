// components/ItemCard.tsx
'use client';

import { LostItem } from '@/lib/types/lostItem';

interface ItemCardProps {
  item: LostItem;
  onClick: () => void;
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="h-48 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
        {item.image ? (
          <img src={item.image} alt={item.tag} className="w-full h-full object-cover" />
        ) : (
          <div className="text-sky-400 text-6xl">📦</div>
        )}
      </div>
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-medium">
            {item.tag}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-1">📍 {item.location}</p>
        <p className="text-gray-500 text-xs">📅 {item.date}</p>
      </div>
    </div>
  );
}