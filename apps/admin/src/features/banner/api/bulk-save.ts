import { createBanner } from './create';
import { deleteBanner } from './delete';
import { updateBannerSettings } from './update';

export async function saveBannersBulk(formData: FormData): Promise<void> {
  const deleteIds = formData.getAll('deleteId') as string[];
  await Promise.all(deleteIds.map((id) => deleteBanner(id)));

  const newImageCount = parseInt(
    (formData.get('newImageCount') as string) || '0',
    10,
  );
  const newIdMap: Record<string, string> = {};
  for (let i = 0; i < newImageCount; i++) {
    const imageFile = formData.get(`newImage-${i}`) as File;
    const title = (formData.get(`newTitle-${i}`) as string) || '';
    const { bannerId } = await createBanner(imageFile, title);
    newIdMap[`new-${i}`] = bannerId;
  }

  const orderCount = parseInt(
    (formData.get('orderCount') as string) || '0',
    10,
  );
  const updates: Array<{ id: string; title: string; sortOrder: number }> = [];
  for (let i = 0; i < orderCount; i++) {
    const rawId = (formData.get(`order-${i}-id`) as string) || '';
    const title = (formData.get(`order-${i}-title`) as string) || '';
    const id = rawId.startsWith('new-') ? newIdMap[rawId] : rawId;
    if (id) updates.push({ id, title, sortOrder: i });
  }

  if (updates.length > 0) {
    await updateBannerSettings(updates);
  }
}
