import { createClient } from '@supabase/supabase-js';

const {
  NEXT_PUBLIC_SUPABASE_URL: URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: KEY,
  NEXT_PUBLIC_E2E_ADMIN_EMAIL: EMAIL,
  NEXT_PUBLIC_E2E_ADMIN_PASSWORD: PW,
} = process.env;

if (!URL || !KEY || !EMAIL || !PW) {
  throw new Error(
    '❌ E2E 테스트를 위한 환경 변수가 부족합니다. .env.local을 확인하세요.',
  );
}

export const ADMIN_AUTH = { email: EMAIL, password: PW };
export const supabaseAdmin = createClient(URL, KEY);
