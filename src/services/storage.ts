import { HistoryRecord, FavoriteDraft, FavoriteItem, Folder } from '../types/favorites';

const DB_NAME = 'AveragePriceCalculatorDB';
const DB_VERSION = 2;
const FAVORITES_STORE = 'favorites';

const createId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createFavoritesStore = (db: IDBDatabase) => {
    const favoriteStore = db.createObjectStore(FAVORITES_STORE, { keyPath: 'favoriteId' });
    favoriteStore.createIndex('itemId', 'id', { unique: false });
    favoriteStore.createIndex('folderId', 'folderId', { unique: false });
    favoriteStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
    favoriteStore.createIndex('favoriteAt', 'favoriteAt', { unique: false });
    return favoriteStore;
};

const normalizeFavorite = (item: FavoriteDraft): FavoriteItem => ({
    ...item,
    favoriteId: item.favoriteId || createId(),
    tags: Array.isArray(item.tags) ? item.tags : [],
    folderId: item.folderId ?? null,
    favoriteAt: item.favoriteAt || new Date().toISOString(),
});

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
                const transaction = (event.target as IDBOpenDBRequest).transaction;
                const oldVersion = event.oldVersion;

                if (!db.objectStoreNames.contains('history')) {
                    const historyStore = db.createObjectStore('history', { keyPath: 'id' });
                    historyStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                if (!db.objectStoreNames.contains('folders')) {
                    const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
                    folderStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                }

                if (!db.objectStoreNames.contains(FAVORITES_STORE)) {
                    createFavoritesStore(db);
                    return;
                }

                const existingStore = transaction?.objectStore(FAVORITES_STORE);
                if (oldVersion < 2 && existingStore && existingStore.keyPath !== 'favoriteId') {
                    const getAllRequest = existingStore.getAll();
                    getAllRequest.onsuccess = () => {
                        const migratedItems = (getAllRequest.result as FavoriteDraft[]).map(normalizeFavorite);
                        db.deleteObjectStore(FAVORITES_STORE);
                        const favoriteStore = createFavoritesStore(db);
                        migratedItems.forEach((item) => favoriteStore.put(item));
                    };
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

    async addFavorite(item: FavoriteDraft): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([FAVORITES_STORE], 'readwrite');
            const store = transaction.objectStore(FAVORITES_STORE);

            const save = (existing?: FavoriteItem) => {
                const itemToSave = normalizeFavorite({
                    ...existing,
                    ...item,
                    favoriteId: item.favoriteId || existing?.favoriteId,
                });
                store.put(itemToSave);
            };

            if (item.favoriteId) {
                save();
            } else {
                const request = store.index('itemId').get(item.id);
                request.onsuccess = () => save(request.result as FavoriteItem | undefined);
                request.onerror = () => reject(request.error);
            }

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    async getFavorites(folderId: string | null = null): Promise<FavoriteItem[]> {
        const allFavorites = await this.getAllFavorites();
        return allFavorites.filter(item => item.folderId === folderId);
    }

    async getAllFavorites(): Promise<FavoriteItem[]> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([FAVORITES_STORE], 'readonly');
            const store = transaction.objectStore(FAVORITES_STORE);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFavorite(favoriteId: string): Promise<void> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([FAVORITES_STORE], 'readwrite');
            const store = transaction.objectStore(FAVORITES_STORE);
            const request = store.delete(favoriteId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

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
            const transaction = db.transaction(['folders', FAVORITES_STORE], 'readwrite');
            const folderStore = transaction.objectStore('folders');
            const favoriteStore = transaction.objectStore(FAVORITES_STORE);

            folderStore.delete(id);

            const index = favoriteStore.index('folderId');
            const request = index.openCursor(id);

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                if (cursor) {
                    const updateData = cursor.value as FavoriteItem;
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
