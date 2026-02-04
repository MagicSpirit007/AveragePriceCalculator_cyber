import React from 'react';
import { Trash2, Sparkles, Star } from 'lucide-react';
import { ReceiptItem } from '../../types';

interface LightReceiptProps {
    item: ReceiptItem;
    index: number;
    isBest: boolean;
    onRemove: (id: number) => void;
    onFavorite?: () => void;
    isFavorite?: boolean;
}

export const LightReceipt: React.FC<LightReceiptProps> = ({ item, index, isBest, onRemove, onFavorite, isFavorite }) => {
    return (
        <div className={`receipt theme-${item.themeIndex}`}>
            {/* Color Band */}
            <div className="receipt-band"></div>

            <div className="receipt-content">
                <div className="receipt-row">
                    <span className="r-label">#{String(index + 1).padStart(2, '0')} 商品</span>
                    <div className="flex items-center gap-1">
                        {onFavorite && (
                            <button onClick={onFavorite} style={{ background: 'none', border: 'none', color: isFavorite ? '#F59E0B' : 'var(--text-tertiary)', cursor: 'pointer' }} title="收藏">
                                <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                        )}
                        <button onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="receipt-row" style={{ marginTop: '12px' }}>
                    <div>
                        <div className="r-val">¥{item.price}</div>
                        <div className="r-label">总价</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="r-val">
                            {item.totalAmount}
                            {item.count > 1 && <span className="r-sub">({item.perUnitAmount}×{item.count})</span>}
                        </div>
                        <div className="r-label">总量</div>
                    </div>
                </div>

                <div className="unit-price-display">
                    {isBest && (
                        <div className="best-badge">
                            <Sparkles size={10} fill="currentColor" /> BEST
                        </div>
                    )}
                    <span className="up-val">
                        {item.unitPrice < 0.1 ? item.unitPrice.toFixed(4) : item.unitPrice.toFixed(2)}
                    </span>
                    <span className="up-unit">元/单位</span>
                </div>
            </div>

            {/* Jagged Bottom */}
            <div className="receipt-jagged"></div>
        </div>
    );
};
