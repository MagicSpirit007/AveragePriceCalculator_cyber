import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    theme?: 'light' | 'dark';
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange, placeholder = "Add tag...", theme = 'light' }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = input.trim();
            if (val && !tags.includes(val)) {
                onChange([...tags, val]);
                setInput('');
            }
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    const tagClass = theme === 'dark'
        ? "bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30"
        : "bg-[#EBF4F8] text-[#11616B]";

    const inputClass = theme === 'dark'
        ? "bg-transparent outline-none flex-1 min-w-[80px] text-white placeholder-white/30"
        : "bg-transparent outline-none flex-1 min-w-[80px] text-[#11616B] placeholder-[#11616B]/50";

    return (
        <div className={`
            flex flex-wrap gap-2 p-2 rounded-lg border focus-within:ring-2 transition-all
            ${theme === 'dark' ? 'bg-black/20 border-white/10 focus-within:border-cyber-cyan/50' : 'bg-white border-gray-200 focus-within:border-[#11616B]/50'}
        `}>
            {tags.map(tag => (
                <span key={tag} className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${tagClass}`}>
                    {tag}
                    <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                        <X size={10} />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ''}
                className={inputClass}
            />
        </div>
    );
};
