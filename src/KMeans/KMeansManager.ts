export class KMeansManager {
    public fieldIds: string[] = [];

    public storeIds(collection: { id: any }[]) {
        this.fieldIds = collection.map(x => x.id);

        // ID shouldn't be used in kmeans algorithm
        collection.forEach(x => x.id = undefined);

        return collection;
    }
}