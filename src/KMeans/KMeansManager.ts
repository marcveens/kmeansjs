export class KMeansManager {
    public fieldIds: string[] = [];

    public storeIds(collection: { id: any }[]) {
        this.fieldIds = collection.map(x => x.id);

        return collection;
    }
}