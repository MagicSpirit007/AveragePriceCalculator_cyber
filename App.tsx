import React, { useState, useEffect } from 'react';
import { DarkModeApp } from './src/components/dark/DarkModeApp';
import { LightModeApp } from './src/components/light/LightModeApp';
import { ThemeMode } from './src/types';

/**
 * 主应用入口
 * 根据主题模式渲染深色或浅色界面
 */
function App() {
  // 主题状态: 'light' 或 'dark'
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  // 检测系统主题偏好
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

  // 同步主题到 body class
  useEffect(() => {
    if (themeMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [themeMode]);

  // 切换主题
  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  // 根据主题渲染对应界面
  if (themeMode === 'dark') {
    return <DarkModeApp onToggleTheme={toggleTheme} />;
  }

  return <LightModeApp onToggleTheme={toggleTheme} />;
}

export default App;