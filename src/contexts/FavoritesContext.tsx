import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FavoriteItem, Folder } from '../types/favorites';
import { storageService } from '../services/storage';

interface FavoritesContextType {
    favorites: FavoriteItem[];
    folders: Folder[];
    loading: boolean;
    addFavorite: (item: FavoriteItem) => Promise<void>;
    removeFavorite: (id: number) => Promise<void>;
    createFolder: (folder: Folder) => Promise<void>;
    deleteFolder: (id: string) => Promise<void>;
    getFavoritesInFolder: (folderId: string | null) => FavoriteItem[];
    refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        // Don't set loading to true here to avoid flickering if we just want to refresh silently
        // Or handle loading state more granularly if needed.
        // For now, let's keep it simple.
        try {
            const [favs, flds] = await Promise.all([
                storageService.getAllFavorites(), // Assuming getAllFavorites exists as per previous analysis
                storageService.getFolders()
            ]);
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

    const deleteFolder = async (id: string) => {
        try {
            await storageService.deleteFolder(id);
            await loadData();
        } catch (error) {
            console.error('Failed to delete folder:', error);
        }
    };

    const getFavoritesInFolder = (folderId: string | null) => {
        return favorites.filter(f => f.folderId === folderId);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            folders,
            loading,
            addFavorite,
            removeFavorite,
            createFolder,
            deleteFolder,
            getFavoritesInFolder,
            refreshFavorites: loadData
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
