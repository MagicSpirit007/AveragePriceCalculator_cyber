import { HistoryRecord, FavoriteItem, Folder } from '../types/favorites';

const DB_NAME = 'AveragePriceCalculatorDB';
const DB_VERSION = 1;

export class StorageService {
    private db: IDBDatabase | null = null;

    constructor() {
        this.initDB();
    }

    private initDB(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve();
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('IndexedDB error:', event);
                reject('Error opening database');
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // 历史记录 Store
                if (!db.objectStoreNames.contains('history')) {
                    const historyStore = db.createObjectStore('history', { keyPath: 'id' });
                    historyStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // 收藏夹 Store
                if (!db.objectStoreNames.contains('folders')) {
                    const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
                    folderStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                }

                // 收藏项 Store
                if (!db.objectStoreNames.contains('favorites')) {
                    const favoriteStore = db.createObjectStore('favorites', { keyPath: 'id', autoIncrement: true }); // Use autoIncrement or specific ID strategy
                    // 注意：FavoriteItem 继承自 ReceiptItem，ReceiptItem 有 id (number)。
                    // 这里我们可能需要一个新的唯一 ID，或者复用 ReceiptItem 的 ID (如果它是唯一的)。
                    // 为了安全起见，我们让 Store autoIncrement，但在查询时使用 folderId 索引。
                    // 实际上 ReceiptItem.id 只是当前比价列表里的临时 ID，不适合做永久 ID。
                    // 所以我们在存入 FavoriteItem 时，应该生成一个 uuid 或者让 DB 自增。
                    // 修正：favorites.ts 里定义了 dbId?: number

                    favoriteStore.createIndex('folderId', 'folderId', { unique: false });
                    favoriteStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
                    favoriteStore.createIndex('favoriteAt', 'favoriteAt', { unique: false });
                }
            };
        });
    }

    private async getDB(): Promise<IDBDatabase> {
        if (!this.db) {
            await this.initDB();
        }
        return this.db!;
    }

    // --- History Operations ---

    async addHistory(record: HistoryRecord): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['history'], 'readwrite');
            const store = transaction.objectStore('history');
            const request = store.add(record);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getHistory(limit: number = 50): Promise<HistoryRecord[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['history'], 'readonly');
            const store = transaction.objectStore('history');
            const index = store.index('createdAt');
            // 倒序获取
            const request = index.openCursor(null, 'prev');
            const results: HistoryRecord[] = [];

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                if (cursor && results.length < limit) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    async deleteHistory(id: string): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['history'], 'readwrite');
            const store = transaction.objectStore('history');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clearHistory(): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['history'], 'readwrite');
            const store = transaction.objectStore('history');
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // --- Favorites Operations ---

    async addFavorite(item: FavoriteItem): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['favorites'], 'readwrite');
            const store = transaction.objectStore('favorites');
            // 如果没有 id，可以生成一个 UUID，或者让 DB 自增 (如果 keyPath 不是 id)
            // 在这里我们假设 FavoriteItem 传入时会有唯一的 ID (例如用 crypto.randomUUID() 或者时间戳)
            // 为了简单，我们强制要求传入 ID 或者在这里生成
            const itemToSave = { ...item };
            if (!itemToSave.id) {
                // @ts-ignore
                itemToSave.id = crypto.randomUUID ? parseInt(crypto.randomUUID()) : Date.now();
                // ReceiptItem id is number, but we need string ideally for global unique.
                // Let's modify ReceiptItem or just use a timestamp for now if strictly number.
                // Waiting... ReceiptItem.id is number. Let's use Date.now() for unique number ID.
                itemToSave.id = Date.now();
            }

            const request = store.put(itemToSave); // put supports update if key exists

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getFavorites(folderId: string | null = null): Promise<FavoriteItem[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['favorites'], 'readonly');
            const store = transaction.objectStore('favorites');
            const index = store.index('folderId');
            // IDB cannot index null directly in some browsers/implementations perfectly standardly 
            // but 'null' value is valid key.
            const request = index.getAll(folderId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllFavorites(): Promise<FavoriteItem[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['favorites'], 'readonly');
            const store = transaction.objectStore('favorites');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFavorite(id: number): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['favorites'], 'readwrite');
            const store = transaction.objectStore('favorites');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // --- Folder Operations ---

    async createFolder(folder: Folder): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['folders'], 'readwrite');
            const store = transaction.objectStore('folders');
            const request = store.add(folder);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async getFolders(): Promise<Folder[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['folders'], 'readonly');
            const store = transaction.objectStore('folders');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFolder(id: string): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['folders', 'favorites'], 'readwrite');
            const folderStore = transaction.objectStore('folders');
            const favoriteStore = transaction.objectStore('favorites');

            // Delete folder
            folderStore.delete(id);

            // Move items to root (folderId = null) or delete them?
            // Proposal: Move to root.
            const index = favoriteStore.index('folderId');
            const request = index.openCursor(id);

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                if (cursor) {
                    const updateData = cursor.value;
                    updateData.folderId = null;
                    cursor.update(updateData);
                    cursor.continue();
                }
            };

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
}

export const storageService = new StorageService();
