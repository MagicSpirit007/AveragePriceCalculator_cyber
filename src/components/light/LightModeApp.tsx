import React, { useState, useRef, useEffect } from 'react';
import {
    Trash2,
    Printer,
    RefreshCcw,
    ShoppingBag,
    Sparkles,
    Download,
    Moon,

    Book
} from 'lucide-react';
import { ReceiptItem, THEME_COUNT, ActiveField } from '../../types';
import { playSound } from '../../utils/sound';
import { safeCalculate } from '../../utils/calculate';
import { lightStyles } from './lightStyles';
import { useHistory } from '../../hooks/useHistory';
import { HistoryPage } from '../history/HistoryPage';
import { FavoriteModal } from '../common/FavoriteModal';
import { HistoryIcon } from '../common/HistoryIcon';
import { useFavorites } from '../../hooks/useFavorites';
import { LightReceipt } from './LightReceipt';
import { PriceBookPage } from '../pricebook/PriceBookPage';

interface LightModeAppProps {
    onToggleTheme: () => void;
}

/**
 * 浅色模式主界面组件
 */
export const LightModeApp: React.FC<LightModeAppProps> = ({ onToggleTheme }) => {
    const [items, itemsSet] = useState<ReceiptItem[]>([]);
    const [priceInput, setPriceInput] = useState('');
    const [labelInput, setLabelInput] = useState('');
    const [countInput, setCountInput] = useState('');
    const [isPrinting, setIsPrinting] = useState(false);
    const [activeField, setActiveField] = useState<ActiveField>('price');
    const [showHistory, setShowHistory] = useState(false);
    const [showPriceBook, setShowPriceBook] = useState(false);

    // Favorites State
    const [favModalOpen, setFavModalOpen] = useState(false);
    const [itemToFav, setItemToFav] = useState<ReceiptItem | null>(null);

    const { addHistory } = useHistory();
    const { favorites } = useFavorites();

    // PWA
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const labelRef = useRef<HTMLInputElement>(null);
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

    const handlePrint = async () => {
        const p = safeCalculate(priceInput);
        const countVal = safeCalculate(countInput);
        const count = (isNaN(countVal) || countVal <= 0) ? 1 : countVal;

        // Fixed per unit to 1
        const perUnit = 1;

        if (isNaN(p)) {
            playSound('error');
            return;
        }

        playSound('print');
        setIsPrinting(true);
        setTimeout(() => setIsPrinting(false), 300);

        const totalAmount = count;
        const currentThemeIndex = items.length % THEME_COUNT;

        const newItem: ReceiptItem = {
            id: Date.now(),
            price: p,
            perUnitAmount: perUnit,
            count: count,
            totalAmount: totalAmount,
            unitPrice: p / count,
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            themeIndex: currentThemeIndex,
            label: labelInput
        };

        const newItems = [...items, newItem];
        itemsSet(newItems);

        // Save to History
        const minPrice = Math.min(...newItems.map(i => i.unitPrice));
        const bestItem = newItems.find(i => i.unitPrice === minPrice) || newItem;

        addHistory({
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            items: newItems,
            bestItem: bestItem,
            createdAt: new Date().toISOString(),
            totalItemCount: newItems.length
        });

        setPriceInput('');
        setLabelInput('');
        setCountInput('');
        setActiveField('price');
        priceRef.current?.focus();
    };

    const removeItem = (id: number) => {
        playSound('delete');
        itemsSet(items.filter((item) => item.id !== id));
    };

    const handleFavorite = (item: ReceiptItem) => {
        setItemToFav(item);
        setFavModalOpen(true);
    };

    const handleReset = () => {
        playSound('delete');
        itemsSet([]);
    };

    const handleMathInput = (symbol: string) => {
        playSound('click');
        if (activeField === 'price') {
            setPriceInput((prev) => prev + symbol);
            priceRef.current?.focus();
        } else if (activeField === 'amount') {
            setLabelInput((prev) => prev + symbol);
            labelRef.current?.focus();
        } else if (activeField === 'count') {
            setCountInput((prev) => prev + symbol);
            countRef.current?.focus();
        }
    };

    return (
        <div className="app-container">
            <style>{lightStyles}</style>

            {/* View Switching */}
            {showHistory && <HistoryPage theme="light" onBack={() => setShowHistory(false)} />}
            {showPriceBook && <PriceBookPage theme="light" onBack={() => setShowPriceBook(false)} />}

            {/* Modal */}
            <FavoriteModal
                isOpen={favModalOpen}
                onClose={() => setFavModalOpen(false)}
                item={itemToFav}
                theme="light"
            />

            {/* --- Header --- */}
            <div className="header">
                <div className="app-title">AVG PRICE CALC</div>
                <div className="header-actions">
                    <button className="action-btn" onClick={() => { playSound('click'); setShowPriceBook(true); }}>
                        <Book size={16} fill="currentColor" />
                    </button>
                    <button className="action-btn" onClick={() => { playSound('click'); setShowHistory(true); }}>
                        <HistoryIcon size={16} />
                    </button>
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
                        <LightReceipt
                            key={item.id}
                            item={item}
                            index={index}
                            isBest={isBest}
                            onRemove={() => removeItem(item.id)}
                            onFavorite={() => handleFavorite(item)}
                            isFavorite={favorites.some(f => f.id === item.id)}
                        />
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
                                    <span className="input-label">标签</span>
                                    <input
                                        ref={labelRef}
                                        type="text"
                                        // inputMode="decimal" // Text input now
                                        className="pastel-input bg-amount"
                                        placeholder="可选..."
                                        value={labelInput}
                                        onFocus={() => setActiveField('amount')}
                                        onChange={(e) => setLabelInput(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <span className="input-label">数量</span>
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
                            disabled={!priceInput || !countInput}
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
