import React, { useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { FavoriteItem, Folder } from '../../types/favorites';
import { Modal } from './Modal';
import { TagInput } from './TagInput';
import { FolderPicker } from './FolderPicker';
import { playSound } from '../../utils/sound';

interface FavoriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: FavoriteItem | null;
    theme: 'light' | 'dark';
}

export const FavoriteModal: React.FC<FavoriteModalProps> = ({ isOpen, onClose, item, theme }) => {
    const { folders, addFavorite, createFolder } = useFavorites();
    const [tags, setTags] = useState<string[]>([]);
    const [folderId, setFolderId] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Reset state when opening
    React.useEffect(() => {
        if (isOpen && item) {
            setTags(item.tags || []);
            setFolderId(item.folderId || null);
            setNote(item.note || '');
        }
    }, [isOpen, item]);

    const handleSave = async () => {
        if (!item) return;

        setIsSaving(true);
        // Prepare favorite item
        const favItem: FavoriteItem = {
            ...item,
            tags,
            folderId,
            note,
            favoriteAt: new Date().toISOString()
        };

        await addFavorite(favItem);
        playSound('print');
        setIsSaving(false);
        onClose();
    };

    const handleCreateFolder = async () => {
        const name = prompt("Enter folder name:");
        if (name) {
            const newFolder: Folder = {
                id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
                name,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await createFolder(newFolder);
            setFolderId(newFolder.id); // Auto select new folder
        }
    };

    // Style constants
    const inputClass = theme === 'dark'
        ? "w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:border-cyber-cyan outline-none"
        : "w-full bg-[#EBF4F8] border border-transparent rounded-lg p-3 text-[#11616B] placeholder-[#11616B]/50 focus:border-[#11616B]/30 outline-none";

    const labelClass = theme === 'dark' ? "text-xs font-bold text-white/50 uppercase mb-2 block" : "text-xs font-bold text-[#11616B]/60 uppercase mb-2 block";

    const btnPrimaryClass = theme === 'dark'
        ? "flex-1 bg-cyber-primary text-black font-bold py-3 rounded-lg hover:bg-white transition-all ml-2"
        : "flex-1 bg-[#DC8B70] text-white font-bold py-3 rounded-lg hover:bg-[#B56A50] transition-all ml-2";

    const btnSecondaryClass = theme === 'dark'
        ? "flex-1 bg-white/5 text-white font-bold py-3 rounded-lg hover:bg-white/10 transition-all mr-2"
        : "flex-1 bg-gray-200 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-300 transition-all mr-2";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={theme === 'dark' ? 'ADD TO FAVORITES' : '添加到收藏'} theme={theme}>
            <div className="space-y-4">
                {/* Folder Picker */}
                <div>
                    <label className={labelClass}>{theme === 'dark' ? 'Folder' : '文件夹'}</label>
                    <FolderPicker
                        folders={folders}
                        selectedId={folderId}
                        onSelect={setFolderId}
                        onCreateNew={handleCreateFolder}
                        theme={theme}
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className={labelClass}>{theme === 'dark' ? 'Tags' : '标签'}</label>
                    <TagInput tags={tags} onChange={setTags} theme={theme} placeholder={theme === 'dark' ? "Type & Enter..." : "输入标签..."} />
                </div>

                {/* Note */}
                <div>
                    <label className={labelClass}>{theme === 'dark' ? 'Note' : '备注'}</label>
                    <textarea
                        className={inputClass}
                        rows={2}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="..."
                    />
                </div>

                {/* Actions */}
                <div className="flex pt-2">
                    <button onClick={onClose} className={btnSecondaryClass}>
                        {theme === 'dark' ? 'CANCEL' : '取消'}
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className={btnPrimaryClass}>
                        {isSaving ? 'SAVING...' : (theme === 'dark' ? 'CONFIRM' : '确认收藏')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
