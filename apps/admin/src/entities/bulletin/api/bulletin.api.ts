export async function getLatestBulletinStatus() {
  // TODO: Supabase 로직 예시
  // const { data } = await supabase
  //   .from('bulletin')
  //   .select('created_at')
  //   .order('created_at', { ascending: false })
  //   .limit(1)
  //   .single();

  // 지금은 더미 데이터: true면 이번주 주보가 있음(숨김), false면 없음(보임)
  const hasBulletin = false;

  return hasBulletin;
}
