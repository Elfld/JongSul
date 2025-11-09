'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Package, MapPin, Calendar } from 'lucide-react';
import ClaimAgreement from '@/components/claim/ClaimAgreement';
import ClaimCodeDisplay from '@/components/claim/ClaimCodeDisplay';
import { ItemResponse } from '@/lib/types/lostItem';

/**
 * 분실물 찾기 페이지
 *
 * 플로우:
 * 1. 서약서 표시 (ClaimAgreement)
 * 2. 동의 시 6자리 코드 생성
 * 3. 코드 표시 (ClaimCodeDisplay)
 */
export default function ClaimPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const [item, setItem] = useState<ItemResponse | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [claimCode, setClaimCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 실제 API에서 분실물 정보 가져오기
  useEffect(() => {
    async function fetchItem() {
      try {
        setError(null);
        const response = await fetch(`/api/items/${itemId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('분실물을 찾을 수 없습니다.');
          } else {
            setError('분실물 정보를 불러오는데 실패했습니다.');
          }
          return;
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error('Failed to fetch item:', err);
        setError('네트워크 오류가 발생했습니다.');
      }
    }

    fetchItem();
  }, [itemId]);

  // 6자리 랜덤 코드 생성
  const generateClaimCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  };

  // 유효기간 계산 (7일 후)
  const calculateExpiresAt = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString();
  };

  // 동의 처리
  const handleAgree = () => {
    const code = generateClaimCode();
    const expires = calculateExpiresAt();

    setClaimCode(code);
    setExpiresAt(expires);
    setAgreed(true);

    // TODO: API 연동 시 서버에 소유권 주장 등록
    // await claimItem(itemId, code, expires);
  };

  // 취소 처리
  const handleCancel = () => {
    router.back();
  };

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 날짜 포맷팅
  const formattedDate = new Date(item.registered_at).toLocaleDateString('ko-KR', {
    month: 'numeric',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white py-12">
      {/* 분실물 정보 상세 표시 */}
      <div className="max-w-4xl mx-auto mb-8 px-4">
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            분실물 정보
          </h2>

          {/* 이미지 + 정보 레이아웃 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* 좌측: 이미지 */}
            <div className="relative w-full md:w-80 h-80 flex-shrink-0 bg-gradient-to-br from-sky-100 to-sky-200 rounded-xl overflow-hidden">
              {item.photo_url && !imageError ? (
                <Image
                  src={item.photo_url}
                  alt={item.tags[0]?.name || '분실물'}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sky-400">
                  <Package className="w-32 h-32" />
                </div>
              )}
            </div>

            {/* 우측: 정보 (ClaimedItemCard 스타일) */}
            <div className="flex-1 space-y-4">
              {/* 태그 */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-medium border border-sky-200"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* 위치 */}
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-base">{item.location || '위치 정보 없음'}</span>
              </div>

              {/* 등록 날짜 */}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-base">{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 서약서 또는 코드 표시 */}
      {!agreed ? (
        <ClaimAgreement onAgree={handleAgree} onCancel={handleCancel} />
      ) : (
        claimCode && <ClaimCodeDisplay code={claimCode} expiresAt={expiresAt} />
      )}
    </div>
  );
}
