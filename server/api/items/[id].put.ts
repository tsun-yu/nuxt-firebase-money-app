export default defineEventHandler(async (event) => {
    const user = await requireUser(event);
    const id = getRouterParam(event, "id");
    if (!id) throw createError({ statusCode: 400, statusMessage: "缺少 id" });

    const body = await readBody<{ item?: string; dollar?: string | number }>(event);
    const item = String(body?.item ?? "").trim().slice(0, 100);
    const dollar = String(body?.dollar ?? "").replace(/[^0-9]/g, "");

    if (!item || !dollar) {
        throw createError({ statusCode: 400, statusMessage: "item 與 dollar 為必填" });
    }

    const docRef = adminDb().collection("admin").doc(id);
    const snapshot = await docRef.get();

    // 確認這筆資料真的屬於當前登入者，否則任何人都能改到別人的資料
    if (!snapshot.exists || snapshot.data()?.uid !== user.uid) {
        throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    await docRef.update({ item, dollar });

    return { ok: true };
});
