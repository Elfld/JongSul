'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import ConfirmDialog from '@/components/ConfirmDialog';

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
  const [customReason, setCustomReason] = useState<string>('');
  const [alertDialog, setAlertDialog] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });

  const reasons = [
    '내 것이 아님',
    '사진이 불분명함',
    '기타',
  ];

  const handleConfirm = () => {
    if (!selectedReason) {
      setAlertDialog({ isOpen: true, message: '취소 사유를 선택해주세요.' });
      return;
    }

    // "기타" 선택 시 커스텀 사유 검증
    if (selectedReason === '기타') {
      if (!customReason.trim()) {
        setAlertDialog({ isOpen: true, message: '취소 사유를 입력해주세요.' });
        return;
      }
      onConfirm(customReason.trim());
    } else {
      onConfirm(selectedReason);
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-end md:items-center justify-center z-[60] md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-md p-6 shadow-xl"
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
        <div className="space-y-3 mb-4">
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

        {/* 기타 사유 입력란 */}
        {selectedReason === '기타' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              취소 사유를 입력해주세요
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="예: 다른 일정이 생겨서..."
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none resize-none"
              rows={3}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {customReason.length}/100
            </p>
          </div>
        )}

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

      {/* 알림 다이얼로그 */}
      <ConfirmDialog
        isOpen={alertDialog.isOpen}
        message={alertDialog.message}
        onConfirm={() => setAlertDialog({ isOpen: false, message: '' })}
      />
    </div>
  );
}
