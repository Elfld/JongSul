'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

  // Mock 데이터: 실제로는 API로 item 정보를 가져와야 함
  useEffect(() => {
    // TODO: API 연동 시 실제 데이터 fetch
    const mockItem: ItemResponse = {
      id: parseInt(itemId),
      registered_at: new Date().toISOString(),
      location: '5호관',
      status: 'LOST',
      photo_url: null,
      tags: [{ id: 1, name: '지갑' }],
    };
    setItem(mockItem);
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

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white py-12">
      {/* 분실물 정보 간단 표시 */}
      <div className="max-w-2xl mx-auto mb-8 px-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            분실물 정보
          </h2>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>
              {item.tags.map((tag) => `#${tag.name}`).join(' ')}
            </span>
            <span>|</span>
            <span>📍 {item.location || '위치 정보 없음'}</span>
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
