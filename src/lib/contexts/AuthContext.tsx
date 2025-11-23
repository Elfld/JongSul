'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * 인증 사용자 정보
 */
interface User {
  id?: number;
  email: string;
  name?: string;
  phone?: string;
}

/**
 * 인증 컨텍스트 타입
 */
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 인증 컨텍스트 Provider
 *
 * 역할:
 * - 전역 인증 상태 관리 (user, token)
 * - localStorage에 token 저장/로드
 * - login/register/logout 함수 제공
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 localStorage에서 토큰 & 유저 정보 로드
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);

      // 저장된 유저 정보 복원
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // 파싱 실패 시 무시
        }
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * 로그인
   * @param email 이메일
   * @param password 비밀번호
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || '로그인에 실패했습니다.';

        // 401, 404는 정상적인 비즈니스 로직 (로그 안 남김)
        // 500번대나 네트워크 에러만 로깅
        if (response.status >= 500) {
          console.error('Login server error:', response.status, errorData);
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // OpenAPI 명세: { access_token, token_type }
      setToken(data.access_token);
      localStorage.setItem('access_token', data.access_token);

      // user 정보 저장 (서버에서 안 주므로 email만)
      const userInfo = { email };
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      // Error 객체가 아닌 경우만 로깅 (네트워크 에러 등)
      if (!(error instanceof Error)) {
        console.error('Login network error:', error);
      }
      throw error;
    }
  };

  /**
   * 회원가입
   * @param email 이메일
   * @param password 비밀번호
   * @param name 이름
   * @param phone 연락처
   *
   * 주의: 자동 로그인 안 함. UI에서 로그인 페이지로 이동 처리
   */
  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => {
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          contact_info: phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || '회원가입에 실패했습니다.';

        // 409(중복), 400(유효성)은 정상 비즈니스 로직 (로그 안 남김)
        // 500번대만 로깅
        if (response.status >= 500) {
          console.error('Register server error:', response.status, errorData);
        }

        throw new Error(errorMessage);
      }

      // 회원가입 성공
      // OpenAPI 명세: { id, email, name }
      // 자동 로그인 안 함 - UI에서 로그인 페이지로 이동
      await response.json();
    } catch (error) {
      // Error 객체가 아닌 경우만 로깅 (네트워크 에러 등)
      if (!(error instanceof Error)) {
        console.error('Register network error:', error);
      }
      throw error;
    }
  };

  /**
   * 로그아웃
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * 사용법:
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuth();
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
