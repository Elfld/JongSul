// components/CategoryChips.tsx
'use client';

import { useRef, useState } from 'react';
import { X } from 'lucide-react';

interface CategoryChipsProps {
  categories: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export default function CategoryChips({
  categories,
  selectedTags,
  onTagToggle,
  onClearAll,
}: CategoryChipsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-white border-b border-sky-100 px-6 py-4">
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
            onClick={onClearAll}
            disabled={selectedTags.length === 0}
            className={`flex-shrink-0 px-4 py-2 rounded-full border-2 transition-all ${
                selectedTags.length > 0
                ? 'bg-red-500 border-red-500 text-white hover:bg-red-600 cursor-pointer'
                : 'bg-gray-200 border-gray-300 text-gray-600 opacity-50'
            }`}
            >
            <X className="w-4 h-4" />
        </button>
        {categories.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={`flex-shrink-0 px-5 py-2 rounded-full border-2 transition-all ${
              selectedTags.includes(tag)
                ? 'bg-sky-500 border-sky-500 text-white hover:bg-sky-600'
                : 'bg-white border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}