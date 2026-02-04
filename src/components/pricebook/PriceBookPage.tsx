import React, { useState } from 'react';
import { ArrowLeft, Book, Plus, FolderPlus, Search } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { ThemeMode } from '../../types';
import { FolderCard } from './FolderCard';
import { FavoriteCard } from './FavoriteCard';
import { Folder } from '../../types/favorites';
import { playSound } from '../../utils/sound';

interface PriceBookPageProps {
    theme: ThemeMode;
    onBack: () => void;
}

export const PriceBookPage: React.FC<PriceBookPageProps> = ({ theme, onBack }) => {
    const { favorites, folders, loading, removeFavorite, createFolder, getFavoritesInFolder } = useFavorites();
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    if (loading) return <div className="p-10 text-center opacity-50">Loading Price Book...</div>;

    const currentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId) : null;

    // Filter Items
    let displayItems = getFavoritesInFolder(currentFolderId);
    if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        // If searching, search ALL favorites or just current folder? Usually global search is better, 
        // but let's stick to current view for now + tags search.
        displayItems = displayItems.filter(item =>
            item.tags?.some(t => t.toLowerCase().includes(lowerTerm)) ||
            item.note?.toLowerCase().includes(lowerTerm) ||
            item.price.toString().includes(lowerTerm)
        );
    }

    // Filter Folders (Only show in Root)
    // Sub-folders not supported yet in data model (Folder has no parentId), so all folders are flat.
    // UI decision: Show folders only when in Root View.
    const displayFolders = currentFolderId === null
        ? folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const handleCreateFolder = async () => {
        const name = prompt("New Folder Name:");
        if (name) {
            const newFolder: Folder = {
                id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
                name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await createFolder(newFolder);
        }
    };

    const containerClass = theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#EBF4F8] text-[#11616B]';
    const inputClass = theme === 'dark'
        ? "bg-white/5 border border-white/10 text-white placeholder-white/30"
        : "bg-white border-gray-200 text-[#11616B] placeholder-[#11616B]/50";

    return (
        <div className={`absolute inset-0 z-50 flex flex-col ${containerClass}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-5 border-b border-opacity-10 border-current">
                <div className="flex items-center gap-2">
                    <button onClick={currentFolderId ? () => setCurrentFolderId(null) : onBack} className="p-2 -ml-2 opacity-70 hover:opacity-100">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Book size={20} />
                        {currentFolder ? currentFolder.name : 'PRICE BOOK'}
                    </h2>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {currentFolderId === null && (
                        <button onClick={handleCreateFolder} className="p-2 opacity-70 hover:opacity-100" title="New Folder">
                            <FolderPlus size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="p-4 pb-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
                    <input
                        type="text"
                        placeholder="Search tags, notes..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-opacity-50 ${inputClass} ${theme === 'dark' ? 'focus:ring-cyber-cyan' : 'focus:ring-[#11616B]'}`}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">

                {/* Folders Grid */}
                {displayFolders.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                        {displayFolders.map(folder => (
                            <FolderCard
                                key={folder.id}
                                folder={folder}
                                itemCount={getFavoritesInFolder(folder.id).length}
                                onClick={() => setCurrentFolderId(folder.id)}
                                theme={theme}
                            // Add delete/rename handlers later
                            />
                        ))}
                    </div>
                )}

                {/* Items List */}
                {displayItems.length > 0 ? (
                    <div>
                        {displayFolders.length > 0 && <h3 className="opacity-50 text-xs font-bold uppercase tracking-wider mb-3 mt-2">主收藏夹</h3>}
                        <div className="space-y-4">
                            {displayItems.map(item => (
                                <FavoriteCard
                                    key={item.id}
                                    item={item}
                                    theme={theme}
                                    onDelete={() => removeFavorite(item.id)}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    displayFolders.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-40 opacity-50 space-y-2">
                            <p>No items found.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};
