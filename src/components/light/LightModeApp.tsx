import React, { useState, useRef, useEffect } from 'react';
import {
    Trash2,
    Printer,
    RefreshCcw,
    ShoppingBag,
    Sparkles,
    Download,
    Moon
} from 'lucide-react';
import { ReceiptItem, THEME_COUNT, ActiveField } from '../../types';
import { playSound } from '../../utils/sound';
import { safeCalculate } from '../../utils/calculate';
import { lightStyles } from './lightStyles';

interface LightModeAppProps {
    onToggleTheme: () => void;
}

/**
 * 浅色模式主界面组件
 */
export const LightModeApp: React.FC<LightModeAppProps> = ({ onToggleTheme }) => {
    const [items, setItems] = useState<ReceiptItem[]>([]);
    const [priceInput, setPriceInput] = useState('');
    const [amountInput, setAmountInput] = useState('');
    const [countInput, setCountInput] = useState('');
    const [isPrinting, setIsPrinting] = useState(false);
    const [activeField, setActiveField] = useState<ActiveField>('price');

    // PWA
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const countRef = useRef<HTMLInputElement>(null);

    // 滚动到底部
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [items]);

    // PWA 安装提示
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

    const bestUnitPrice = items.length > 0 ? Math.min(...items.map((i) => i.unitPrice)) : -1;

    const handlePrint = () => {
        const p = safeCalculate(priceInput);
        const perUnit = safeCalculate(amountInput);
        const countVal = safeCalculate(countInput);
        const count = (isNaN(countVal) || countVal <= 0) ? 1 : countVal;

        if (isNaN(p) || isNaN(perUnit) || perUnit <= 0) {
            playSound('error');
            return;
        }

        playSound('print');
        setIsPrinting(true);
        setTimeout(() => setIsPrinting(false), 300);

        const totalAmount = perUnit * count;
        const currentThemeIndex = items.length % THEME_COUNT;

        const newItem: ReceiptItem = {
            id: Date.now(),
            price: p,
            perUnitAmount: perUnit,
            count: count,
            totalAmount: totalAmount,
            unitPrice: p / totalAmount,
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            themeIndex: currentThemeIndex,
        };

        setItems([...items, newItem]);
        setPriceInput('');
        setAmountInput('');
        setCountInput('');
        setActiveField('price');
        priceRef.current?.focus();
    };

    const removeItem = (id: number) => {
        playSound('delete');
        setItems(items.filter((item) => item.id !== id));
    };

    const handleReset = () => {
        playSound('delete');
        setItems([]);
    };

    const handleMathInput = (symbol: string) => {
        playSound('click');
        if (activeField === 'price') {
            setPriceInput((prev) => prev + symbol);
            priceRef.current?.focus();
        } else if (activeField === 'amount') {
            setAmountInput((prev) => prev + symbol);
            amountRef.current?.focus();
        } else if (activeField === 'count') {
            setCountInput((prev) => prev + symbol);
            countRef.current?.focus();
        }
    };

    return (
        <div className="app-container">
            <style>{lightStyles}</style>

            {/* --- Header --- */}
            <div className="header">
                <div className="app-title">AVG PRICE CALC</div>
                <div className="header-actions">
                    <button className="action-btn" onClick={() => { playSound('click'); onToggleTheme(); }}>
                        <Moon size={16} fill="currentColor" />
                    </button>

                    {showInstallBtn && (
                        <button className="action-btn install-btn" onClick={handleInstallClick}>
                            <Download size={14} /> 安装应用
                        </button>
                    )}
                    {items.length > 0 && (
                        <button className="action-btn" onClick={handleReset}>
                            <RefreshCcw size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* --- Output Area --- */}
            <div className="paper-stream" ref={scrollRef}>
                {items.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <ShoppingBag size={40} color="var(--text-secondary)" />
                        </div>
                        <p>打印一张小票吧~</p>
                    </div>
                )}

                {items.map((item, index) => {
                    const isBest = items.length > 1 && item.unitPrice === bestUnitPrice;

                    return (
                        <div key={item.id} className={`receipt theme-${item.themeIndex}`}>
                            {/* Color Band */}
                            <div className="receipt-band"></div>

                            <div className="receipt-content">
                                <div className="receipt-row">
                                    <span className="r-label">#{String(index + 1).padStart(2, '0')} 商品</span>
                                    <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)' }}>
                                        <Trash2 size={16} />
                                    </button>
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
                })}
            </div>

            {/* --- 3D Printer Dock --- */}
            <div className="dock-wrapper">
                <div className="printer-body">
                    {/* Paper Slot on top */}
                    <div className="paper-slot"></div>

                    <div className="input-area">

                        {/* Left: Math Keys (2x2 Grid) */}
                        <div className="math-pad">
                            <button className="math-key" onClick={() => handleMathInput('+')}>+</button>
                            <button className="math-key" onClick={() => handleMathInput('-')}>-</button>
                            <button className="math-key" onClick={() => handleMathInput('×')}>×</button>
                            <button className="math-key" onClick={() => handleMathInput('÷')}>÷</button>
                        </div>

                        {/* Center: Inputs */}
                        <div className="inputs-col">
                            {/* Row 1: Price */}
                            <div className="input-group">
                                <span className="input-label">价格</span>
                                <input
                                    ref={priceRef}
                                    type="text"
                                    inputMode="decimal"
                                    className="pastel-input bg-price"
                                    placeholder="1"
                                    value={priceInput}
                                    onFocus={() => setActiveField('price')}
                                    onChange={(e) => setPriceInput(e.target.value)}
                                />
                            </div>

                            {/* Row 2: Amount & Count */}
                            <div className="input-row">
                                <div className="input-group" style={{ flex: 1.4 }}>
                                    <span className="input-label">数量</span>
                                    <input
                                        ref={amountRef}
                                        type="text"
                                        inputMode="decimal"
                                        className="pastel-input bg-amount"
                                        placeholder="1"
                                        value={amountInput}
                                        onFocus={() => setActiveField('amount')}
                                        onChange={(e) => setAmountInput(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <span className="input-label">件数</span>
                                    <input
                                        ref={countRef}
                                        type="number"
                                        inputMode="numeric"
                                        className="pastel-input bg-count"
                                        placeholder="1"
                                        value={countInput}
                                        onFocus={() => setActiveField('count')}
                                        onChange={(e) => setCountInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Big 3D Action Button */}
                        <button
                            className={`print-btn ${isPrinting ? 'animate' : ''}`}
                            onClick={handlePrint}
                            disabled={!priceInput || !amountInput}
                        >
                            <Printer size={32} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Deco Line */}
                    <div className="printer-detail-line"></div>
                </div>
            </div>
        </div>
    );
};
