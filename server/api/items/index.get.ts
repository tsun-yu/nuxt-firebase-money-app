import type { ItemsType } from "~/types/item";

export default defineEventHandler(async (event) => {
    const user = await requireUser(event);

    const snapshot = await adminDb()
        .collection("admin")
        .get();

    const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            item: data.item ?? "",
            dollar: String(data.dollar ?? ""),
            date: data.date ?? "",
        } satisfies ItemsType;
    });

    items.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

    return { items };
});
