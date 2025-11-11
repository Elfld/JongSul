// components/Header.tsx
'use client';

import { Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-gradient-to-b from-sky-50 to-white border-b border-sky-100 px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-sky-600 whitespace-nowrap">분실물 찾기</h1>

      <div className="flex items-center gap-4">
        <div className="relative w-96">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="물품 유형이나 위치를 검색하세요"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border-2 border-sky-200 shadow-sm focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
        </div>

        <button
          onClick={() => router.push(isAuthenticated ? '/mypage' : '/login')}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white transition-colors shadow-md hover:shadow-lg"
          aria-label="마이페이지"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}