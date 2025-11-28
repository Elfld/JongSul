'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Loader2, ArrowLeft, Phone, Info } from 'lucide-react';
import Link from 'next/link';

/**
 * 회원가입 페이지 (이메일 인증)
 *
 * 플로우:
 * 1. 이메일 입력 → 인증요청 → 인증번호 발송
 * 2. 인증번호 입력 → 확인 버튼 → 토큰 발급
 * 3. 나머지 정보 입력 → 회원가입
 */
export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [previousEmail, setPreviousEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  // 타이머 카운트다운
  useEffect(() => {
    if (remainingTime > 0 && !isEmailVerified) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime, isEmailVerified]);

  // 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 인증번호 발송
  const handleRequestVerification = async () => {
    setError('');
    setVerifyingEmail(true);

    try {
      const response = await fetch('/api/users/email/request-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setPreviousEmail(email);
        setRemainingTime(300);
        setVerificationCode('');
      } else {
        setError(data.error || '인증번호 발송에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  // 인증번호 입력
  const handleVerificationCodeChange = (code: string) => {
    setVerificationCode(code);
  };

  // 인증번호 검증 (확인 버튼)
  const handleVerifyCode = async () => {
    if (verificationCode.length === 0) {
      setError('인증번호를 입력해주세요.');
      return;
    }

    setError('');
    setVerifyingEmail(true);

    try {
      const response = await fetch('/api/users/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationToken(data.verification_token);
        setIsEmailVerified(true);
        setError('');
      } else {
        console.log('[인증 에러 응답]', data);
        setError(data.error || '인증번호가 올바르지 않습니다.');
        setVerificationCode('');
        setIsEmailVerified(false);
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
      setVerificationCode('');
      setIsEmailVerified(false);
    } finally {
      setVerifyingEmail(false);
    }
  };

  // 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 이메일 인증 확인
    if (!isEmailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }

    // 비밀번호 일치 확인
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/users/register/verified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          contact_info: contactInfo || null,
          verification_token: verificationToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?message=회원가입이 완료되었습니다. 로그인해주세요.');
      } else {
        setError(data.error || '회원가입에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      {/* 홈으로 버튼 */}
      <Link
        href="/"
        className="fixed top-6 left-6 px-3 py-1 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium whitespace-nowrap">홈으로</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* 제목 */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            회원가입
          </h1>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">
                {typeof error === 'string' ? error : '오류가 발생했습니다. 다시 시도해주세요.'}
              </p>
            </div>
          )}

          {/* 회원가입 폼 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이메일 입력란 + 인증요청/재발송 버튼 */}
            <div>
              <label htmlFor="email" className="sr-only">
                이메일 주소
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center border-b border-gray-300 pb-2">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소"
                    required
                    disabled={isEmailVerified}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRequestVerification}
                  disabled={!email || verifyingEmail || isEmailVerified}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isEmailVerified
                    ? '✓ 완료'
                    : previousEmail === email && remainingTime > 0
                    ? '재발송'
                    : '인증요청'}
                </button>
              </div>

              {/* 인증번호 발송 안내 */}
              {remainingTime > 0 && !isEmailVerified && (
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <Info className="w-4 h-4" />
                  <span>인증번호를 발송했습니다. {formatTime(remainingTime)}</span>
                </div>
              )}
            </div>

            {/* 인증번호 입력란 + 확인 버튼 */}
            <div>
              <label htmlFor="verificationCode" className="sr-only">
                인증번호
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center border-b border-gray-300 pb-2">
                  <input
                    id="verificationCode"
                    type="text"
                    inputMode="numeric"
                    value={verificationCode}
                    onChange={(e) => handleVerificationCodeChange(e.target.value)}
                    placeholder="인증번호"
                    disabled={!(previousEmail === email && remainingTime > 0) || isEmailVerified}
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={!(previousEmail === email && remainingTime > 0) || verificationCode.length === 0 || verifyingEmail || isEmailVerified}
                  className={`px-4 py-2 text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    previousEmail === email && remainingTime > 0 && !isEmailVerified
                      ? 'bg-sky-500 hover:bg-sky-600'
                      : 'bg-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {verifyingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin inline" />
                    </>
                  ) : isEmailVerified ? (
                    '✓ 완료'
                  ) : (
                    '확인'
                  )}
                </button>
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

            {/* 비밀번호 확인 입력란 */}
            <div>
              <label htmlFor="passwordConfirm" className="sr-only">
                비밀번호 확인
              </label>
              <div className="flex items-center border-b border-gray-300 pb-2">
                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호 확인"
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

            {/* 연락처 입력란 (선택) */}
            <div>
              <label htmlFor="contactInfo" className="sr-only">
                연락처 (선택)
              </label>
              <div className="flex items-center border-b border-gray-300 pb-2">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  id="contactInfo"
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="연락처 (선택)"
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={loading || !isEmailVerified}
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
          이메일 인증 회원가입
        </p>
      </div>
    </div>
  );
}
