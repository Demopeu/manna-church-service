export const POSITION_ORDER = ['담임목사', '목사', '구역장'] as const;

export const POSITION_OPTIONS = ['담임목사', '목사', '구역장'] as const;

export type Position = (typeof POSITION_OPTIONS)[number];
