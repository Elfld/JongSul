'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

interface ClaimCodeDisplayProps {
  code: string;
  expiresAt: string;
}

/**
 * 분실물 수령 코드 표시 컴포넌트
 *
 * 기능:
 * - 6자리 수령 코드 표시
 * - 유효기간 표시
 * - 홈으로 돌아가기
 */
export default function ClaimCodeDisplay({ code, expiresAt }: ClaimCodeDisplayProps) {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  // 날짜 포맷팅
  const formattedDate = new Date(expiresAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 코드를 개별 숫자로 분리
  const codeDigits = code.split('');

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      {/* 성공 메시지 */}
      <div className="mb-8">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
          <Check className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          소유권 주장이 접수되었습니다
        </h1>
      </div>

      {/* 수령 코드 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">수령 코드</h2>

        <div className="flex items-center justify-center mb-4">
          {/* 코드 디스플레이 */}
          <div className="flex gap-2">
            {codeDigits.map((digit, index) => (
              <div
                key={index}
                className="w-12 h-16 flex items-center justify-center bg-sky-100 border-2 border-sky-300 rounded-xl text-3xl font-bold text-sky-600"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="bg-sky-50 rounded-2xl p-6 mb-8">
        <p className="text-gray-800 font-medium mb-2">
          키오스크에서 이 코드를 입력하세요
        </p>
        <p className="text-sm text-gray-600">
          유효기간: {formattedDate}까지
        </p>
      </div>

      {/* 추가 안내 */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
        <h3 className="font-semibold text-gray-800 mb-3">수령 방법</h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li>1. 학생회관 1층 분실물 보관함으로 방문</li>
          <li>2. 키오스크에서 수령 코드 입력</li>
          <li>3. 신분증 확인 후 분실물 수령</li>
        </ol>
      </div>

      {/* 홈으로 돌아가기 버튼 */}
      <button
        onClick={handleGoHome}
        className="w-full py-3 bg-sky-500 text-white rounded-full font-semibold hover:bg-sky-600 transition-colors"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
