export default defineEventHandler(async (event) => {
    const user = await requireUser(event);
    const id = getRouterParam(event, "id");
    if (!id) throw createError({ statusCode: 400, statusMessage: "缺少 id" });

    const docRef = adminDb().collection("admin").doc(id);
    const snapshot = await docRef.get();

    if (!snapshot.exists || snapshot.data()?.uid !== user.uid) {
        throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    await docRef.delete();

    return { ok: true };
});
