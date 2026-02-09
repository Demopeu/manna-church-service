export const POSITION_OPTIONS = ['담임목사', '목사', '구역장'] as const;
export const ROLES = {
  SENIOR: POSITION_OPTIONS[0],
  ASSOCIATE: POSITION_OPTIONS[1],
  DISTRICT: POSITION_OPTIONS[2],
} as const;
