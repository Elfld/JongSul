// components/Header.tsx
'use client';

import { Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-sky-100 px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-sky-600">분실물 찾기</h1>
      <div className="relative w-96">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="물품 유형이나 위치를 검색하세요"
          className="w-full pl-10 pr-4 py-2 rounded-full border border-sky-200 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
      </div>
    </header>
  );
}