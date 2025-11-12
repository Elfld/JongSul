'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * 회원가입 페이지 (테스트용 - 최소 검증)
 *
 * 기능:
 * - 이메일/비밀번호/이름 입력
 * - 회원가입 처리
 * - 성공 시 로그인 페이지로 이동
 */
export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // contact_info는 빈 문자열로 전달
      await register(email, password, name, '');

      // 회원가입 성공 → 로그인 페이지로 이동
      router.push('/login?message=회원가입이 완료되었습니다. 로그인해주세요.');
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      {/* 홈으로 버튼 - 화면 좌상단 고정 */}
      <Link
        href="/"
        className="fixed top-6 left-6 px-3 py-1 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium whitespace-nowrap">홈으로</span>
      </Link>

      <div className="w-full max-w-md">
        {/* 컨테이너 */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* 제목 */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            회원가입
          </h1>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이메일 입력란 */}
            <div>
              <label htmlFor="email" className="sr-only">
                이메일 주소
              </label>
              <div className="flex items-center border-b border-gray-300 pb-2">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  required
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* 비밀번호 입력란 */}
            <div>
              <label htmlFor="password" className="sr-only">
                비밀번호
              </label>
              <div className="flex items-center border-b border-gray-300 pb-2">
                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  required
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* 이름 입력란 */}
            <div>
              <label htmlFor="name" className="sr-only">
                이름
              </label>
              <div className="flex items-center border-b border-gray-300 pb-2">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름"
                  required
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  회원가입 중...
                </>
              ) : (
                '회원가입'
              )}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link
                href="/login"
                className="text-sky-500 hover:text-sky-600 font-medium"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* 하단 안내 */}
        <p className="mt-4 text-center text-xs text-gray-500">
          테스트 버전 - 최소 검증만 적용
        </p>
      </div>
    </div>
  );
}
