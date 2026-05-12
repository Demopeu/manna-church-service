import { expect, test } from '@playwright/test';
import { supabaseAdmin } from '../utils/supabase';

const TEST_TITLE = '[E2E_TEST] 처음 작성한 공지';
const UPDATED_TITLE = '[E2E_TEST] 수정된 공지사항';

test.describe('공지사항 CRUD 통합 시나리오', () => {
  test.beforeEach(async ({ page }) => {
    await supabaseAdmin.from('notices').delete().ilike('title', `%[E2E_TEST]%`);
    await page.goto('/announcements');
  });
  test.afterEach(async () => {
    await supabaseAdmin.from('notices').delete().ilike('title', `%[E2E_TEST]%`);
  });

  test('공지사항 페이지가 정상적으로 렌더링된다', async ({ page }) => {
    await expect(page.getByRole('button', { name: '공지 작성' })).toBeVisible();
    await expect(page.getByText('공지 목록')).toBeVisible();
    await expect(page.getByPlaceholder('제목으로 검색...')).toBeVisible();
  });

  test('공지사항을 생성하고, 수정하고, 마지막으로 삭제한다', async ({
    page,
  }) => {
    // ==========================================
    // 1단계: CREATE (생성)
    // ==========================================
    await page.getByRole('button', { name: '공지 작성' }).click();

    await page.getByPlaceholder('공지 제목을 입력하세요').fill(TEST_TITLE);
    await page
      .getByPlaceholder('공지 내용을 입력하세요')
      .fill('테스트 내용입니다.');
    await page.locator('input[type="date"]').fill('2026-05-12');
    await page.getByRole('button', { name: '등록' }).click();

    await expect(page.getByText(TEST_TITLE)).toBeVisible();

    // ==========================================
    // 2단계: UPDATE (수정)
    // ==========================================

    const targetRow = page.locator('tr').filter({ hasText: TEST_TITLE });
    await targetRow.getByRole('button', { name: '수정' }).click();

    const editDialog = page.getByRole('alertdialog', { name: '공지 수정' });
    await expect(editDialog).toBeVisible();

    const editTitleInput =
      editDialog.getByPlaceholder('공지 제목을 입력하세요');
    await editTitleInput.fill(UPDATED_TITLE);

    const editDateInput = editDialog.locator('input[type="date"]');
    await editDateInput.fill('2026-05-13');
    await editDialog.getByRole('button', { name: '수정 완료' }).click();

    await expect(page.getByText(TEST_TITLE)).not.toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText(UPDATED_TITLE)).toBeVisible({ timeout: 10000 });

    // ==========================================
    // 3단계: DELETE (삭제)
    // ==========================================

    const updatedRow = page.locator('tr').filter({ hasText: UPDATED_TITLE });
    await updatedRow.getByRole('button', { name: '삭제' }).click();

    const confirmDeleteDialog = page.getByRole('alertdialog');
    await expect(
      confirmDeleteDialog.getByText('공지사항을 삭제하시겠습니까?'),
    ).toBeVisible();

    await confirmDeleteDialog.getByRole('button', { name: '삭제' }).click();
    await expect(page.locator('tr').getByText(UPDATED_TITLE)).not.toBeVisible({
      timeout: 10000,
    });
  });
});
