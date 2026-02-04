import React from 'react';
import { Folder as FolderIcon, Plus } from 'lucide-react';
import { Folder } from '../../types/favorites';

interface FolderPickerProps {
    folders: Folder[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onCreateNew: () => void;
    theme?: 'light' | 'dark';
}

export const FolderPicker: React.FC<FolderPickerProps> = ({ folders, selectedId, onSelect, onCreateNew, theme = 'light' }) => {

    const itemClass = (isActive: boolean) => `
        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
        ${isActive
            ? (theme === 'dark' ? 'bg-cyber-primary/20 border border-cyber-primary text-cyber-primary' : 'bg-[#11616B]/10 text-[#11616B] font-bold')
            : (theme === 'dark' ? 'hover:bg-white/5 text-white/70' : 'hover:bg-gray-50 text-gray-600')
        }
    `;

    return (
        <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
            <div
                className={itemClass(selectedId === null)}
                onClick={() => onSelect(null)}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <FolderIcon size={14} />
                </div>
                <span className="text-sm">主收藏夹</span>
            </div>

            {folders.map(folder => (
                <div
                    key={folder.id}
                    className={itemClass(selectedId === folder.id)}
                    onClick={() => onSelect(folder.id)}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-opacity-20`} style={{ backgroundColor: folder.color || (theme === 'dark' ? '#333' : '#eee'), color: folder.color }}>
                        <FolderIcon size={14} fill="currentColor" />
                    </div>
                    <span className="text-sm">{folder.name}</span>
                </div>
            ))}

            <button
                onClick={onCreateNew}
                className={`w-full flex items-center gap-2 p-2 text-xs font-bold uppercase tracking-wider justify-center rounded-lg border border-dashed hover:border-solid transition-all mt-2 ${theme === 'dark' ? 'border-white/20 text-white/50 hover:bg-white/5 hover:text-white' : 'border-gray-300 text-gray-400 hover:text-[#11616B] hover:border-[#11616B]'
                    }`}
            >
                <Plus size={12} /> New Folder
            </button>
        </div>
    );
};
