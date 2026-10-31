/**
 * 一次性 migration：把舊資料（純前端時期建立、沒有 uid 欄位）
 * 全部補上目前登入者的 uid。
 *
 * 用法：登入後，在瀏覽器網址列呼叫一次
 *   POST http://localhost:3000/api/items/migrate
 * 或用 curl 搭配登入後的 cookie 呼叫。
 * 確認資料正常後，建議把這支檔案刪除，避免正式環境留著備用入口。
 */
export default defineEventHandler(async (event) => {
    const user = await requireUser(event);

    const snapshot = await adminDb().collection("admin").get();

    let updated = 0;
    const batch = adminDb().batch();

    snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.uid) {
            batch.update(doc.ref, { uid: user.uid });
            updated++;
        }
    });

    if (updated > 0) await batch.commit();

    return { updated };
});
