/**
 * 인증 관련 타입 정의
 *
 * OpenAPI 2.0 기준 이메일 인증 회원가입 플로우
 */

// ==================== 이메일 인증 ====================

/**
 * 이메일 인증번호 요청
 * POST /users/email/request-verification
 */
export interface EmailRequest {
  email: string;
}

/**
 * 인증번호 검증 요청
 * POST /users/email/verify
 */
export interface VerificationRequest {
  email: string;
  code: string; // 6자리 인증번호
}

/**
 * 인증번호 검증 응답
 * POST /users/email/verify
 */
export interface VerificationResponse {
  message: string;
  verification_token: string; // 10분 유효
}

// ==================== 회원가입 ====================

/**
 * 인증된 회원가입 요청
 * POST /users/register/verified
 */
export interface UserCreateVerified {
  email: string;
  password: string;
  name: string;
  contact_info?: string | null;
  verification_token: string; // 필수!
}

/**
 * 회원가입 응답
 */
export interface UserResponse {
  id: number;
  email: string;
  name: string;
}

// ==================== 로그인 ====================

/**
 * 로그인 요청
 * POST /users/login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// ==================== 회원가입 단계 ====================

/**
 * 회원가입 UI 단계
 */
export type RegisterStep = 1 | 2 | 3;

/**
 * 회원가입 폼 상태
 */
export interface RegisterFormState {
  // 단계 관리
  step: RegisterStep;

  // 1단계: 이메일
  email: string;

  // 2단계: 인증번호
  verificationCode: string;
  remainingTime: number; // 초 단위 (300초 = 5분)
  canResend: boolean;

  // 3단계: 회원정보
  password: string;
  passwordConfirm: string;
  name: string;
  contactInfo: string;
  verificationToken: string;

  // 로딩 & 에러
  loading: boolean;
  error: string;
}
