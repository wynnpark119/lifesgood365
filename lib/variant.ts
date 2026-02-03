"use client";

export type Variant = "lg365" | "monthly";

export const VARIANT_COOKIE_KEY = "lg-dashboard-variant";

export const DEFAULT_VARIANT: Variant = "lg365";

export const VARIANT_LABELS: Record<Variant, string> = {
  lg365: "Life's Good 365 AI",
  monthly: "Monthly LG",
};

/**
 * 클라이언트에서 쿠키로 저장된 variant 읽기
 */
export function getVariant(): Variant {
  if (typeof document === "undefined") return DEFAULT_VARIANT;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${VARIANT_COOKIE_KEY}=([^;]*)`)
  );
  const value = match ? decodeURIComponent(match[1]) : null;
  if (value === "lg365" || value === "monthly") return value;
  return DEFAULT_VARIANT;
}

/**
 * variant를 쿠키에 저장 (기본 1년 유효)
 */
export function setVariant(variant: Variant): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${VARIANT_COOKIE_KEY}=${encodeURIComponent(variant)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * variant에 따른 데이터 베이스 경로 prefix (public 기준)
 * lg365: /data/  → public/data/
 * monthly: /data/monthly/ → public/data/monthly/
 */
export function getDataPathPrefix(variant: Variant): string {
  return variant === "monthly" ? "/data/monthly" : "/data";
}
