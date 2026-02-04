import React from 'react';
import { ConsoleInputColor } from '../../types';

interface ConsoleInputProps {
    label: string;
    value: string;
    active: boolean;
    onChange: (val: string) => void;
    onFocus: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
    themeColor: ConsoleInputColor;
    placeholder?: string;
}

// 颜色主题配置
const colorThemes = {
    pink: {
        text: 'text-cyber-pink',
        border: 'border-cyber-pink',
        shadow: 'shadow-neon-pink',
        bg: 'bg-cyber-pink/10',
        label: 'text-cyber-pink'
    },
    cyan: {
        text: 'text-cyber-cyan',
        border: 'border-cyber-cyan',
        shadow: 'shadow-neon-cyan',
        bg: 'bg-cyber-cyan/10',
        label: 'text-cyber-cyan'
    },
    yellow: {
        text: 'text-cyber-yellow',
        border: 'border-cyber-yellow',
        shadow: 'shadow-neon-yellow',
        bg: 'bg-cyber-yellow/10',
        label: 'text-cyber-yellow'
    }
};

/**
 * 深色模式赛博风格输入框组件
 */
export const ConsoleInput: React.FC<ConsoleInputProps> = ({
    label,
    value,
    active,
    onChange,
    onFocus,
    inputRef,
    themeColor,
    placeholder
}) => {
    const currentTheme = colorThemes[themeColor];

    return (
        <div className={`
      relative flex flex-col group transition-all duration-300
      ${active ? 'scale-105 z-10' : 'scale-100 opacity-80'}
    `}>
            {/* HUD Lines - Decoration - Full Width */}
            <div className={`
        absolute -top-1 left-0 h-[1px] 
        ${currentTheme.bg.replace('/10', '')} 
        transition-all duration-300 w-full
        ${active ? 'opacity-100 shadow-[0_0_8px_currentColor]' : 'opacity-40'}
      `}></div>

            <label className={`
        text-[9px] uppercase font-bold tracking-[0.1em] mb-1 pl-1 transition-colors flex justify-between items-center
        ${active ? currentTheme.label : 'text-gray-600'}
      `}>
                <span>{label}</span>
                {active && <span className="animate-pulse text-[8px]">● LINKED</span>}
            </label>

            <div className={`
        relative h-14 backdrop-blur-md transition-all duration-300
        clip-corner-input border-l-2 border-r-2
        flex items-center justify-center
        ${active
                    ? `${currentTheme.border} ${currentTheme.bg} bg-opacity-20`
                    : 'border-gray-800 bg-gray-900/40 hover:border-gray-600'}
      `}>
                {/* Animated Background Grid for Active State */}
                {active && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10 animate-grid-scroll"></div>}

                <input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    className={`
            w-full h-full bg-transparent p-2 text-center z-10
            font-mono text-xl font-bold outline-none
            ${active ? `${currentTheme.text} drop-shadow-md` : 'text-gray-500'}
          `}
                    placeholder={placeholder || ""}
                />

                {/* Corner Accents */}
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${active ? currentTheme.border : 'border-gray-700'}`}></div>
                <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${active ? currentTheme.border : 'border-gray-700'}`}></div>
            </div>
        </div>
    );
};
