export default defineEventHandler(async (event) => {
    const user = await requireUser(event);
    const body = await readBody<{ item?: string; dollar?: string | number }>(event);

    // 所有欄位都在 server 端重新驗證，不信任前端傳來的內容
    const item = String(body?.item ?? "").trim().slice(0, 100);
    const dollar = String(body?.dollar ?? "").replace(/[^0-9]/g, "");

    if (!item || !dollar) {
        throw createError({ statusCode: 400, statusMessage: "item 與 dollar 為必填" });
    }

    // 日期由 server 產生，避免前端竄改
    const now = new Date();
    const date = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(
        now.getDate(),
    ).padStart(2, "0")}`;

    const docRef = await adminDb().collection("admin").add({
        uid: user.uid,
        item,
        dollar,
        date,
        createdAt: Date.now(),
    });

    return { id: docRef.id, item, dollar, date };
});
