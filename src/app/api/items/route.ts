// app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LostItem } from '@/lib/types/lostItem';

const allMockData: LostItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  image: '',
  date: `2025-10-${String(10 - Math.floor(i / 5)).padStart(2, '0')}`,
  tag: ['시계', '지갑', '카드', '인형', '가방', '우산', '열쇠', '핸드폰'][i % 8],
  location: ['홍대 스타벅스', '홍대입구역', '신촌 백화점', '강남역', '홍대 CU'][i % 5],
  description: `${i + 1}번 분실물 설명`,
}));

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  await new Promise(resolve => setTimeout(resolve, 500));

  const filtered = allMockData.filter((item) => {
    const tagMatch = tags.length === 0 || tags.includes(item.tag);
    const searchLower = search.toLowerCase();
    const searchMatch = 
      search === '' ||
      item.location.toLowerCase().includes(searchLower) ||
      item.tag.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower);

    return tagMatch && searchMatch;
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  return NextResponse.json({
    items: paginatedItems,
    total: filtered.length,
    hasMore: endIndex < filtered.length,
  });

}
