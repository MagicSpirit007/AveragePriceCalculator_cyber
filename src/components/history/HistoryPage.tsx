import React, { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory';
import { useFavorites } from '../../hooks/useFavorites';
import { ThemeMode, ReceiptItem } from '../../types';
import { HolographicItem } from '../dark/HolographicItem';
import { LightReceipt } from '../light/LightReceipt';
import { FavoriteModal } from '../common/FavoriteModal';

interface HistoryPageProps {
    theme: ThemeMode;
    onBack: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ theme, onBack }) => {
    const { history, loading, deleteHistory, clearHistory } = useHistory();
    const { favorites } = useFavorites();
    const [favModalOpen, setFavModalOpen] = useState(false);
    const [itemToFav, setItemToFav] = useState<ReceiptItem | null>(null);

    if (loading) {
        return <div className="p-10 text-center opacity-50">Loading database...</div>;
    }

    const handleFavorite = (item: ReceiptItem) => {
        setItemToFav(item);
        setFavModalOpen(true);
    };

    return (
        <div className={`absolute inset-0 z-50 flex flex-col ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#EBF4F8] text-[#11616B]'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-5">
                <button onClick={onBack} className="p-2 -ml-2 opacity-70 hover:opacity-100">
                    <ArrowLeft size={24} />
                </button>
                <h2 className={`text-lg font-bold ${theme === 'dark' ? 'tracking-wider' : ''}`}>
                    {theme === 'dark' ? 'HISTORY_LOG' : '历史记录'}
                </h2>
                {history.length > 0 && (
                    <button onClick={clearHistory} className="p-2 text-red-400 hover:text-red-500">
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-20 no-scrollbar">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 opacity-50 space-y-4">
                        <p>No records found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((record, index) => {
                            const item = record.bestItem;
                            // Ensure ID is number if possible, or just pass as is (HolographicItem expects number in some places but we might have string from IDB)
                            // The ReceiptItem interface says ID is number.
                            // History record ID is string (keyPath).
                            // But the item inside record is ReceiptItem which has number ID.

                            return (
                                <div key={record.id} className="relative group">
                                    <div className="text-[10px] opacity-50 mb-1 pl-2 font-mono">
                                        {new Date(record.createdAt).toLocaleString()}
                                    </div>

                                    {theme === 'dark' ? (
                                        <HolographicItem
                                            item={item}
                                            isBest={true}
                                            onRemove={() => deleteHistory(record.id)}
                                            onFavorite={() => handleFavorite(item)}
                                            isFavorite={favorites.some(f => f.id === item.id)}
                                        />
                                    ) : (
                                        <LightReceipt
                                            item={item}
                                            index={index}
                                            isBest={true}
                                            onRemove={() => deleteHistory(record.id)}
                                            onFavorite={() => handleFavorite(item)}
                                            isFavorite={favorites.some(f => f.id === item.id)}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Favorite Modal */}
            <FavoriteModal
                isOpen={favModalOpen}
                onClose={() => setFavModalOpen(false)}
                item={itemToFav}
                theme={theme}
            />
        </div>
    );
};
