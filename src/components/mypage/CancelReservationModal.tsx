'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface CancelReservationModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

/**
 * 예약 취소 확인 모달
 *
 * 기능:
 * - 취소 사유 선택
 * - 취소 확정 또는 되돌아가기
 */
export default function CancelReservationModal({
  onClose,
  onConfirm,
}: CancelReservationModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');

  const reasons = [
    '일정 변경',
    '다른 방법으로 찾음',
    '기타',
  ];

  const handleConfirm = () => {
    if (!selectedReason) {
      alert('취소 사유를 선택해주세요.');
      return;
    }
    onConfirm(selectedReason);
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-800">예약 취소</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 안내 메시지 */}
        <p className="text-gray-600 mb-6">
          예약을 취소하시겠습니까?<br />
          취소 사유를 선택해주세요.
        </p>

        {/* 취소 사유 선택 */}
        <div className="space-y-3 mb-6">
          {reasons.map((reason) => (
            <label
              key={reason}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedReason === reason
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <input
                type="radio"
                name="cancelReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-5 h-5 text-red-500 focus:ring-red-500"
              />
              <span className="text-gray-800 font-medium">{reason}</span>
            </label>
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors"
          >
            돌아가기
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
          >
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}
