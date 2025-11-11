'use client';

import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  /** 다이얼로그 표시 여부 */
  isOpen: boolean;
  /** 메시지 제목 */
  title?: string;
  /** 메시지 내용 */
  message: string;
  /** 확인 버튼 텍스트 */
  confirmText?: string;
  /** 취소 버튼 텍스트 */
  cancelText?: string;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm: () => void;
  /** 취소 버튼 클릭 핸들러 */
  onCancel: () => void;
}

/**
 * 재사용 가능한 확인 다이얼로그 컴포넌트
 *
 * 사용 예시:
 * ```tsx
 * const [showDialog, setShowDialog] = useState(false);
 *
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   message="로그인이 필요한 기능입니다. 로그인하시겠습니까?"
 *   onConfirm={() => router.push('/login')}
 *   onCancel={() => setShowDialog(false)}
 * />
 * ```
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
      {/* 반투명 배경 */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* 다이얼로그 카드 */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in slide-in-from-top-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-sky-600" />
          </div>
        </div>

        {/* 제목 */}
        {title && (
          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            {title}
          </h3>
        )}

        {/* 메시지 */}
        <p className="text-gray-600 text-center mb-6 whitespace-pre-wrap">
          {message}
        </p>

        {/* 버튼 그룹 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
