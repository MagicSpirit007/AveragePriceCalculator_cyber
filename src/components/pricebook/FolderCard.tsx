import React from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Folder } from '../../types/favorites';

interface FolderCardProps {
    folder: Folder;
    itemCount: number;
    onClick: () => void;
    onDelete?: () => void;
    onRename?: () => void;
    theme: 'light' | 'dark';
}

export const FolderCard: React.FC<FolderCardProps> = ({ folder, itemCount, onClick, onDelete, onRename, theme }) => {
    return (
        <div
            onClick={onClick}
            className={`
                relative p-4 rounded-xl cursor-pointer group transition-all duration-300
                ${theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyber-cyan/50'
                    : 'bg-white hover:shadow-lg border border-gray-100 hover:border-[#11616B]/30'
                }
            `}
        >
            <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center mb-3
                ${theme === 'dark' ? 'bg-cyber-cyan/10 text-cyber-cyan' : 'bg-[#EBF4F8] text-[#11616B]'}
            `}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-book opacity-80"
                    aria-hidden="true"
                >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"></path>
                </svg>
            </div>

            <div className="pr-6">
                <h3 className={`font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {folder.name}
                </h3>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`}>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </p>
            </div>

            {/* Actions Menu Trigger (Hover only) */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                {onRename && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRename(); }}
                        className={`p-1.5 rounded-full ${theme === 'dark' ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <Edit2 size={12} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className={`p-1.5 rounded-full ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                    >
                        <Trash2 size={12} />
                    </button>
                )}
            </div>
        </div>
    );
};
