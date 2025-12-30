import { useState, useEffect } from 'react';
import { ThemeMode } from '../types';
import { playSound } from '../utils/sound';

interface UseThemeReturn {
    themeMode: ThemeMode;
    toggleTheme: () => void;
}

/**
 * 主题管理 Hook
 * 监听系统主题变化，管理 body class
 */
export const useTheme = (): UseThemeReturn => {
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');

    // 初始检测和监听系统主题
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // 初始检测
        if (mediaQuery.matches) {
            setThemeMode('dark');
        }

        // 监听系统主题变化
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            setThemeMode(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

    // 同步 body class
    useEffect(() => {
        if (themeMode === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [themeMode]);

    // 切换主题
    const toggleTheme = () => {
        playSound('click');
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    return {
        themeMode,
        toggleTheme
    };
};
