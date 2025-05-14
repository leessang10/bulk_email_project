/**
 * 이메일 주소의 유효성을 검증합니다.
 * @param email 검증할 이메일 주소
 * @returns 유효한 이메일 주소인 경우 true, 그렇지 않은 경우 false
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // RFC 5322 표준을 따르는 이메일 정규식
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // 기본 형식 검증
  if (!emailRegex.test(email)) {
    return false;
  }

  // 길이 검증
  if (email.length > 254) {
    return false;
  }

  // 로컬 파트와 도메인 파트 분리
  const [localPart, domainPart] = email.split('@');

  // 로컬 파트 길이 검증
  if (localPart.length > 64) {
    return false;
  }

  // 도메인 파트 검증
  const domainParts = domainPart.split('.');
  if (domainParts.some((part) => part.length > 63)) {
    return false;
  }

  return true;
}
