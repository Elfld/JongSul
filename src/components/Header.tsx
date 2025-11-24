// components/Header.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
  const [isCompact, setIsCompact] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const expandedSearchRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // compact 상태 변경 시 애니메이션 동안 측정 방지
  const setCompactWithLock = useCallback((value: boolean) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsCompact(value);
    setTimeout(() => setIsTransitioning(false), 350);
  }, [isTransitioning]);

  // 검색바 크기 감지를 ref로 관리 (useEffect 재실행 방지)
  const checkSearchBarWidthRef = useRef<() => void>(() => {});

  // 실제 크기 감지 로직
  checkSearchBarWidthRef.current = () => {
    if (isTransitioning) return;

    if (searchBarRef.current && !isCompact) {
      const width = searchBarRef.current.offsetWidth;
      if (width < 180) {
        setCompactWithLock(true);
      }
    }

    if (isCompact) {
      const headerWidth = window.innerWidth;
      const availableWidth = headerWidth - 350;
      if (availableWidth >= 250) {
        setCompactWithLock(false);
      }
    }
  };

  // resize 이벤트에서만 호출 (마운트 시 1회 + resize 시)
  useEffect(() => {
    const handleResize = () => checkSearchBarWidthRef.current();

    // 초기 체크 (마운트 시 1회만)
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 빈 의존성 - 마운트 시 1회만 실행

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

      <div className="flex items-center gap-4 min-w-0 flex-1 justify-end">
        {/* 검색바 - 반응형으로 줄어들다가 compact 모드로 전환 */}
        {!isCompact ? (
          <div
            ref={searchBarRef}
            className="relative w-96 shrink min-w-[120px] transition-all duration-300 ease-out"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="물품 유형이나 위치를 검색하세요"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border-2 border-sky-200 shadow-sm focus:outline-none focus:border-sky-400 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-400" />
          </div>
        ) : (
          <button
            onClick={() => setIsSearchExpanded(true)}
            className="flex-shrink-0 w-11 h-11 rounded-full bg-white border-2 border-sky-200 flex items-center justify-center shadow-sm hover:border-sky-400 hover:shadow-md transition-all duration-300 ease-out"
            aria-label="검색"
          >
            <Search className="w-5 h-5 text-sky-400" />
          </button>
        )}

        <button
          onClick={() => router.push(isAuthenticated ? '/mypage' : '/login')}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center text-white transition-colors shadow-md hover:shadow-lg"
          aria-label="마이페이지"
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* 확장된 검색창 오버레이 */}
      {isSearchExpanded && (
        <div
          ref={expandedSearchRef}
          className="absolute inset-x-0 top-0 bg-white border-b border-sky-100 px-4 py-3 flex items-center gap-3 z-50 shadow-lg animate-in slide-in-from-top duration-200"
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
