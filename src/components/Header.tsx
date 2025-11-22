// components/Header.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const expandedSearchRef = useRef<HTMLDivElement>(null);

  // 확장된 검색창 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchExpanded &&
        expandedSearchRef.current &&
        !expandedSearchRef.current.contains(event.target as Node)
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchExpanded]);

  // 확장 시 input에 포커스
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchExpanded) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchExpanded]);

  return (
    <header className="bg-gradient-to-b from-sky-50 to-white border-b border-sky-100 px-6 py-4 flex items-center justify-between relative">
      <h1 className="text-2xl font-bold text-sky-600 whitespace-nowrap">분실물 찾기</h1>

      <div className="flex items-center gap-4">
        {/* 검색창 - md 이상에서 표시, 기본 384px, 공간 부족 시 축소 */}
        <div className="relative hidden md:block w-96 shrink min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="물품 유형이나 위치를 검색하세요"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border-2 border-sky-200 shadow-sm focus:outline-none focus:border-sky-400 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
        </div>

        {/* 검색 버튼 - md 미만에서 표시 */}
        <button
          onClick={() => setIsSearchExpanded(true)}
          className="md:hidden flex-shrink-0 w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white transition-colors shadow-md hover:shadow-lg"
          aria-label="검색"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={() => router.push(isAuthenticated ? '/mypage' : '/login')}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white transition-colors shadow-md hover:shadow-lg"
          aria-label="마이페이지"
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* 확장된 검색창 오버레이 - md 미만에서만 */}
      {isSearchExpanded && (
        <div
          ref={expandedSearchRef}
          className="md:hidden absolute inset-x-0 top-0 bg-white border-b border-sky-100 px-4 py-3 flex items-center gap-3 z-50 shadow-lg"
        >
          <div className="relative flex-1">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="물품 유형이나 위치를 검색하세요"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border-2 border-sky-200 shadow-sm focus:outline-none focus:border-sky-400 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
          </div>
          <button
            onClick={() => setIsSearchExpanded(false)}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            aria-label="검색 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
}
