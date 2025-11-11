'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { User, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';

/**
 * 로그인 컴포넌트 (내부)
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 회원가입 후 성공 메시지
  const successMessage = searchParams.get('message');

  // 이미 로그인된 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/'); // 로그인 성공 → 메인 페이지
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  // 이미 로그인된 경우 빈 화면 (리다이렉트 대기)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* 컨테이너 */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* 제목 */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            로그인
          </h1>

          {/* 성공 메시지 (회원가입 후) */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이메일 입력란 */}
            <div>
              <label htmlFor="email" className="sr-only">
                이메일 주소
              </label>
              <div className="flex items-center border-b border-gray-300 pb-2">
                <User className="w-5 h-5 text-gray-400 mr-3" />
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

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <Link
                href="/register"
                className="text-sky-500 hover:text-sky-600 font-medium"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* 하단 안내 */}
        <p className="mt-4 text-center text-xs text-gray-500">
          분실물을 찾기 위해서는 로그인이 필요합니다.
        </p>
      </div>
    </div>
  );
}

/**
 * 로그인 페이지
 *
 * 기능:
 * - 이메일/비밀번호 입력
 * - 로그인 처리
 * - 이미 로그인된 경우 메인 페이지로 리다이렉트
 * - 회원가입 페이지 링크
 * - 회원가입 후 성공 메시지 표시
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
