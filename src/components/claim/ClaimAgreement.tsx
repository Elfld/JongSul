'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ClaimAgreementProps {
  onAgree: () => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

/**
 * 분실물 소유권 주장 서약서 컴포넌트
 *
 * 기능:
 * - 서약서 내용 표시
 * - 동의 체크박스
 * - 동의/취소 버튼
 */
export default function ClaimAgreement({
  onAgree,
  onCancel,
  loading = false,
  error = null,
}: ClaimAgreementProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleAgree = () => {
    if (!isChecked) {
      alert('서약서에 동의해주세요.');
      return;
    }
    onAgree();
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      {/* 제목 */}
      <h1 className="text-2xl font-bold text-center text-sky-600 mb-8">
        분실물 소유권 주장 서약서
      </h1>

      {/* 서약 내용 */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-6 max-h-96 overflow-y-auto border border-gray-200">
        <p className="text-gray-700 leading-relaxed mb-4">
          본인은 다음 사항에 동의합니다:
        </p>

        <ol className="space-y-4 text-gray-700 leading-relaxed">
          <li>
            <strong>1.</strong> 해당 분실물이 본인의 소유물임을 확인합니다.
          </li>
          <li>
            <strong>2.</strong> 허위로 소유권을 주장하는 경우, 관련 법규에 따라
            민형사상 책임을 질 수 있음을 인지합니다.
          </li>
          <li>
            <strong>3.</strong> 분실물 수령 시 신분증 확인에 동의합니다.
          </li>
          <li>
            <strong>4.</strong> 수령 후 7일 이내 찾아가지 않을 경우,
            자동으로 소유권 주장이 취소됨을 인지합니다.
          </li>
          <li>
            <strong>5.</strong> 본 서약의 내용을 충분히 이해하였으며,
            이에 따른 모든 책임을 본인이 부담함을 확인합니다.
          </li>
        </ol>
      </div>

      {/* 동의 체크박스 */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          id="agree-checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          disabled={loading}
          className="w-5 h-5 text-sky-500 border-gray-300 rounded focus:ring-sky-500 cursor-pointer disabled:opacity-50"
        />
        <label
          htmlFor="agree-checkbox"
          className="text-gray-700 font-medium cursor-pointer select-none"
        >
          위 내용에 동의합니다
        </label>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-3 rounded-full font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          취소
        </button>
        <button
          onClick={handleAgree}
          disabled={loading || !isChecked}
          className={`flex-1 py-3 rounded-full font-semibold transition-colors flex items-center justify-center ${
            isChecked && !loading
              ? 'bg-sky-500 text-white hover:bg-sky-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              처리 중...
            </>
          ) : (
            '동의'
          )}
        </button>
      </div>
    </div>
  );
}
