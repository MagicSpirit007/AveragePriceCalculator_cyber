import React from 'react';
import { Tag, Trash2, Edit } from 'lucide-react';
import { FavoriteItem } from '../../types/favorites';
import { HolographicItem } from '../dark/HolographicItem';
import { LightReceipt } from '../light/LightReceipt';

interface FavoriteCardProps {
    item: FavoriteItem;
    theme: 'light' | 'dark';
    onDelete: () => void;
    onEdit?: () => void;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({ item, theme, onDelete, onEdit }) => {
    return (
        <div className="relative group mb-4">
            {/* Meta Info Header */}
            <div className={`flex items-center gap-2 mb-2 px-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {item.tags.map(tag => (
                            <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${theme === 'dark' ? 'bg-cyber-violet/20 text-cyber-violet' : 'bg-[#EBF4F8] text-[#11616B]'}`}>
                                <Tag size={8} /> {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Reuse Existing Item Components */}
            {theme === 'dark' ? (
                <HolographicItem
                    item={item}
                    isBest={false}
                    onRemove={onDelete}
                // onEdit could be added to HolographicItem later
                />
            ) : (
                <LightReceipt
                    item={item}
                    index={0} // Index specific to display context
                    isBest={false}
                    onRemove={() => onDelete()}
                />
            )}

            {/* Note Display */}
            {item.note && (
                <div className={`mt-1 text-xs px-2 italic ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>
                    "{item.note}"
                </div>
            )}
        </div>
    );
};
