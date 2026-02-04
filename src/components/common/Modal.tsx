import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    theme?: 'light' | 'dark';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, theme = 'light' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const overlayClass = theme === 'dark'
        ? "fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        : "fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4";

    const contentClass = theme === 'dark'
        ? "bg-[#151520] border border-cyber-cyan/30 text-white w-full max-w-sm rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        : "bg-white text-[#11616B] w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200";

    const headerClass = theme === 'dark'
        ? "flex justify-between items-center p-4 border-b border-white/10"
        : "flex justify-between items-center p-4 border-b border-gray-100";

    return (
        <div className={overlayClass} onClick={onClose}>
            <div className={contentClass} onClick={e => e.stopPropagation()}>
                <div className={headerClass}>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};
