// components/ItemModal.tsx
'use client';

import { X } from 'lucide-react';
import { LostItem } from '@/lib/types/lostItem';

interface ItemModalProps {
  item: LostItem;
  onClose: () => void;
}

export default function ItemModal({ item, onClose }: ItemModalProps) {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:w-2/3 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center p-12">
          {item.image ? (
            <img src={item.image} alt={item.tag} className="max-w-full max-h-full object-contain rounded-xl" />
          ) : (
            <div className="text-sky-400" style={{ fontSize: '12rem' }}>📦</div>
          )}
        </div>
        <div className="md:w-1/3 p-8 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-sky-600">{item.tag}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-sky-50 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="space-y-6 flex-grow">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">분실 날짜</h3>
              <p className="text-lg text-gray-800">📅 {item.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">분실함 위치</h3>
              <p className="text-lg text-gray-800">📍 {item.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">상세 설명</h3>
              <p className="text-lg text-gray-800">{item.description}</p>
            </div>
          </div>
          <button className="mt-8 w-full bg-sky-500 text-white py-3 rounded-full font-semibold hover:bg-sky-600 transition-colors">
            문의하기
          </button>
        </div>
      </div>
    </div>
  );
}