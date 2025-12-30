import { useState, useEffect } from 'react';

interface UsePWAReturn {
    showInstallBtn: boolean;
    handleInstallClick: () => Promise<void>;
}

/**
 * PWA 安装提示 Hook
 * 管理 beforeinstallprompt 事件和安装按钮显示
 */
export const usePWA = (): UsePWAReturn => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowInstallBtn(false);
        }
        setDeferredPrompt(null);
    };

    return {
        showInstallBtn,
        handleInstallClick
    };
};
