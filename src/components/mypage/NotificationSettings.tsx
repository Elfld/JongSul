'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { TagService } from '@/lib/api/tags';
import { TagResponse } from '@/lib/types/lostItem';

/**
 * 알림 설정 컴포넌트
 *
 * 기능:
 * - 서버에서 카테고리 목록 로드 (캐싱 적용)
 * - 관심 카테고리 선택/해제
 * - localStorage에 설정 저장
 * - 선택된 카테고리 시각적 표시
 */

export default function NotificationSettings() {
  const [categories, setCategories] = useState<TagResponse[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  // 서버에서 카테고리 목록 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const tags = await TagService.fetchAllTags();
        setCategories(tags);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('notificationCategories');
    if (stored) {
      try {
        setSelectedCategories(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse notification settings:', e);
      }
    }
  }, []);

  // 카테고리 선택/해제 토글
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
    setSaved(false);
  };

  // 설정 저장
  const handleSave = () => {
    localStorage.setItem('notificationCategories', JSON.stringify(selectedCategories));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      {/* 제목 */}
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-sky-500" />
        <h2 className="text-xl font-bold text-gray-800">
          관심 카테고리 알림 설정
        </h2>
      </div>

      {/* 카테고리 칩들 */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categoriesLoading ? (
          <p className="text-gray-500 text-sm">카테고리 로딩 중...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-sm">카테고리를 불러올 수 없습니다</p>
        ) : (
          categories.map((category) => {
            const isSelected = selectedCategories.includes(category.name);
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.name)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-md scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            );
          })
        )}
      </div>

      {/* 안내 문구 */}
      <div className="bg-sky-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-700">
          선택한 카테고리의 분실물이 등록되면 알림을 받을 수 있습니다.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {selectedCategories.length > 0
            ? `${selectedCategories.length}개 카테고리 선택됨`
            : '카테고리를 선택해주세요'}
        </p>
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-full font-semibold transition-all ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-sky-500 text-white hover:bg-sky-600'
        }`}
      >
        {saved ? '✓ 저장되었습니다' : '저장하기'}
      </button>
    </div>
  );
}
