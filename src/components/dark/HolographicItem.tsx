import React from 'react';
import { Trash2, Zap, Star } from 'lucide-react';
import { ReceiptItem } from '../../types';

interface HolographicItemProps {
    item: ReceiptItem;
    isBest: boolean;
    onRemove: () => void;
    onFavorite?: () => void;
    isFavorite?: boolean;
}

/**
 * 深色模式全息风格小票卡片组件
 */
export const HolographicItem: React.FC<HolographicItemProps> = ({ item, isBest, onRemove, onFavorite, isFavorite }) => {
    return (
        <div className={`
      relative p-4 mb-3 transition-all duration-500 animate-hologram-flicker
      hologram-card clip-tech-border group
      border-l-4 ${isBest ? 'border-l-cyber-cyan' : 'border-l-cyber-violet'}
    `}>
            {/* Decorative Corner Lines */}
            <div className={`absolute top-0 right-0 w-4 h-[1px] ${isBest ? 'bg-cyber-cyan' : 'bg-cyber-violet'} opacity-50`}></div>
            <div className={`absolute top-0 right-0 w-[1px] h-4 ${isBest ? 'bg-cyber-cyan' : 'bg-cyber-violet'} opacity-50`}></div>

            {/* Laser Scan Effect (On Mount) */}
            <div className="absolute left-0 right-0 h-[2px] bg-white/50 shadow-[0_0_10px_white] animate-scan-beam pointer-events-none z-30"></div>

            {/* Main Content */}
            <div className="flex justify-between items-start mb-2 relative z-10 pr-16 bg-transparent">
                <div>
                    <div className="text-3xl font-mono font-bold text-white drop-shadow-md">
                        <span className={`text-sm mr-1 ${isBest ? 'text-cyber-cyan' : 'text-cyber-violet'}`}>¥</span>{item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] ${isBest ? 'text-cyber-cyan bg-cyber-cyan/10' : 'text-cyber-violet bg-cyber-violet/10'} font-mono px-1 rounded`}>ID_{item.id.toString().slice(-4)}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{item.timestamp}</span>
                    </div>
                </div>

                {isBest && (
                    <div className="
            px-2 py-1 bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan 
            text-[10px] font-bold uppercase tracking-widest flex items-center gap-1
            shadow-neon-cyan animate-pulse-fast whitespace-nowrap
            rounded-sm
          ">
                        <Zap size={10} className="fill-current" />
                        最佳价格
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-mono border-t border-white/5 pt-2 mt-2 relative z-10">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-gray-400 tracking-wider mb-0.5">数量 x 份数</span>
                    <span className="text-gray-200">{item.perUnitAmount} <span className="text-gray-500">x</span> {item.count}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-[9px] uppercase tracking-wider mb-0.5 ${isBest ? 'text-cyber-cyan' : 'text-cyber-violet'}`}>单价</span>
                    <span className={`font-bold text-lg ${isBest ? 'text-cyber-cyan drop-shadow-glow-cyan' : 'text-white'}`}>
                        {item.unitPrice.toFixed(4)}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="absolute top-0 right-0 z-20 flex">
                {onFavorite && (
                    <button
                        onClick={onFavorite}
                        className={`p-3 transition-colors duration-200 ${isFavorite ? 'text-cyber-yellow' : 'text-gray-600 hover:text-cyber-yellow'}`}
                        title="收藏"
                    >
                        <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                )}
                <button
                    onClick={onRemove}
                    className="p-3 text-gray-600 hover:text-cyber-red transition-colors duration-200"
                    title="删除"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};
