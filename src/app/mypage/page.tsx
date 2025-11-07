// app/mypage/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';

export default function MyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👤</span>
          </div>
          <h1 className="text-3xl font-bold text-sky-600 mb-2">마이페이지</h1>
          <p className="text-gray-500">준비 중입니다</p>
        </div>

        <div className="bg-sky-50 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">예정된 기능</h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="text-sky-500 mr-2">•</span>
              <span>관심 카테고리 알림 설정</span>
            </li>
            <li className="flex items-start">
              <span className="text-sky-500 mr-2">•</span>
              <span>수령 예정 분실물 목록</span>
            </li>
            <li className="flex items-start">
              <span className="text-sky-500 mr-2">•</span>
              <span>수령 코드 확인</span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 px-6 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
