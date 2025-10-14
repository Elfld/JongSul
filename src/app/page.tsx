// app/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import CategoryChips from '@/components/CategoryChips';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { LostItem, ApiResponse } from '@/lib/types/lostItem';

const categories = ['시계', '지갑', '카드', '인형', '가방', '우산', '열쇠', '핸드폰'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [items, setItems] = useState<LostItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const debouncedTags = useDebounce(selectedTags, 300);

  const fetchItems = useCallback(async (pageNum: number, reset: boolean = false) => {
    setLoading(true);  // ← if (loading) return; 삭제
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        tags: debouncedTags.join(','),
        page: pageNum.toString(),
        limit: '12',
      });

      const response = await fetch(`/api/items?${params}`);
      const data: ApiResponse = await response.json();

      setItems(prev => reset ? data.items : [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [debouncedSearch, debouncedTags]); // ← loading 제거

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchItems(1, true);
  }, [debouncedSearch, debouncedTags, fetchItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchItems(page + 1, false);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, page, fetchItems]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearAll = () => {
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="sticky top-0 z-40">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <CategoryChips
          categories={categories}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearAll={handleClearAll}
        />
      </div>

      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
          ))}
        </div>

        {items.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">검색 결과가 없습니다</p>
          </div>
        )}

        <div ref={observerTarget} className="h-20">
          {loading && <LoadingSpinner />}
        </div>

        {!hasMore && items.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">모든 결과를 불러왔습니다</p>
          </div>
        )}
      </main>

      {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}