'use client';
import { composeProviders } from './compose-providers';
const All = composeProviders();

export function Providers({ children }: { children: React.ReactNode }) {
  return <All>{children}</All>;
}
