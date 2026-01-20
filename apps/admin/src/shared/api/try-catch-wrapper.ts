import { ActionState } from '../model';

export async function tryCatchAction<T>(
  operation: () => Promise<T>,
): Promise<T | ActionState> {
  try {
    return await operation();
  } catch (err) {
    console.error('System Error:', err);
    return {
      success: false,
      message: '일시적인 시스템 오류입니다. 잠시 후 다시 시도해주세요.',
    };
  }
}

export async function tryCatchVoid(
  operation: () => Promise<void>,
): Promise<void> {
  try {
    await operation();
  } catch (err) {
    console.error('System Error:', err);
    throw new Error('일시적인 시스템 오류입니다. 잠시 후 다시 시도해주세요.');
  }
}
