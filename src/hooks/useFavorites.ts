import { useState, useCallback, useEffect } from 'react';
import { FavoriteItem, Folder } from '../types/favorites';
import { storageService } from '../services/storage';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [favs, flds] = await Promise.all([
                storageService.getAllFavorites(), // Need getAllFavorites implementation in storage service logic adjusted for this usage if needed, or getFavorites(null) etc.
                storageService.getFolders()
            ]);
            // storageService.getAllFavorites() was added in my mental model but let's check storage.ts if I wrote it.
            // checking storage.ts... I added getAllFavorites.
            setFavorites(favs);
            setFolders(flds);
        } catch (error) {
            console.error('Failed to load favorites data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const addFavorite = async (item: FavoriteItem) => {
        try {
            await storageService.addFavorite(item);
            await loadData();
        } catch (error) {
            console.error('Failed to add favorite:', error);
        }
    };

    const removeFavorite = async (id: number) => {
        try {
            await storageService.deleteFavorite(id);
            await loadData();
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    const createFolder = async (folder: Folder) => {
        try {
            await storageService.createFolder(folder);
            await loadData();
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    };

    // Helper to get favorites by folder
    const getFavoritesInFolder = (folderId: string | null) => {
        return favorites.filter(f => f.folderId === folderId);
    };

    return {
        favorites,
        folders,
        loading,
        addFavorite,
        removeFavorite,
        createFolder,
        getFavoritesInFolder,
        refreshFavorites: loadData
    };
};
