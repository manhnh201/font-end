export class StorageObject {
    key!: string;
    value: any;
    createdAt: number = Date.now();
    expireAfter?: number;
    options: any = {};
}