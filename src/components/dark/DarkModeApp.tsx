import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Download, Sun, Terminal, Play, Book } from 'lucide-react';
import { ReceiptItem, THEME_COUNT, ActiveField } from '../../types';
import { playSound } from '../../utils/sound';
import { safeCalculate } from '../../utils/calculate';
import { HolographicItem } from './HolographicItem';
import { ConsoleInput } from './ConsoleInput';
import { darkStyles, operatorStyles, activeColorMap } from './darkStyles';
import { useHistory } from '../../hooks/useHistory';
import { HistoryPage } from '../history/HistoryPage';
import { FavoriteModal } from '../common/FavoriteModal';
import { HistoryIcon } from '../common/HistoryIcon';
import { useFavorites } from '../../hooks/useFavorites';
import { PriceBookPage } from '../pricebook/PriceBookPage';

interface DarkModeAppProps {
    onToggleTheme: () => void;
}

/**
 * 深色模式主界面组件
 */
export const DarkModeApp: React.FC<DarkModeAppProps> = ({ onToggleTheme }) => {
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

        // Per unit amount is always 1 in this new mode
        const perUnit = 1;

        if (isNaN(p)) {
            playSound('error');
            return;
        }

        playSound('print');
        setIsPrinting(true);
        setTimeout(() => setIsPrinting(false), 300);

        const totalAmount = count; // total simple quantity
        const currentThemeIndex = items.length % THEME_COUNT;

        const newItem: ReceiptItem = {
            id: Date.now(),
            price: p,
            perUnitAmount: perUnit, // Keep for compatibility or set 1
            count: count,
            totalAmount: totalAmount,
            unitPrice: p / count,
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            themeIndex: currentThemeIndex,
            label: labelInput // Store label
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
        } else if (activeField === 'amount') { // Keeping 'amount' as key for label to avoid type breakage for now or I should allow text input?
            // Wait, label is text. Math pad shouldn't affect it unless user wants numbers.
            // But ConsoleInput usually binds 'onChange'.
            // If activeField is label, maybe allow appending numbers?
            setLabelInput((prev) => prev + symbol);
            labelRef.current?.focus();
        } else if (activeField === 'count') {
            setCountInput((prev) => prev + symbol);
            countRef.current?.focus();
        }
    };

    const activeTheme = activeColorMap[activeField];

    return (
        <div className="dark-cyber-app h-screen w-full overflow-hidden flex flex-col relative text-white">
            <style>{darkStyles}</style>

            {/* View Switching */}
            {showHistory && <HistoryPage theme="dark" onBack={() => setShowHistory(false)} />}
            {showPriceBook && <PriceBookPage theme="dark" onBack={() => setShowPriceBook(false)} />}

            {/* Modal */}
            <FavoriteModal
                isOpen={favModalOpen}
                onClose={() => setFavModalOpen(false)}
                item={itemToFav}
                theme="dark"
            />

            {/* --- Global Effects --- */}
            <div className="scanlines"></div>
            <div className="vignette"></div>

            {/* Dynamic Backgrounds */}
            <div className="cyber-bg-gradient" />
            <div className="cyber-grid" />

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random() * 0.5
                    }}></div>
                ))}
            </div>

            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4 z-40 relative">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold font-mono tracking-tighter text-white/90 animate-glitch" data-text="AVG_PRICE_CALC">
                        AVG_PRICE_CALC <span className="text-[10px] text-cyber-cyan">// V2.077</span>
                    </h1>
                    <div className="flex items-center gap-1 text-[9px] text-cyber-acid/80 tracking-widest font-mono">
                        <span className="w-1.5 h-1.5 bg-cyber-acid rounded-full animate-pulse"></span>
                        SYSTEM ONLINE
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { playSound('click'); setShowPriceBook(true); }}
                        className="p-2 text-white/50 hover:text-cyber-cyan hover:bg-white/5 rounded-full transition-all"
                        title="价格册"
                    >
                        <Book size={18} />
                    </button>
                    <button
                        onClick={() => { playSound('click'); setShowHistory(true); }}
                        className="p-2 text-white/50 hover:text-cyber-violet hover:bg-white/5 rounded-full transition-all"
                        title="历史"
                    >
                        <HistoryIcon size={18} />
                    </button>
                    <button
                        onClick={() => { playSound('click'); onToggleTheme(); }}
                        className="p-2 text-white/50 hover:text-cyber-yellow hover:bg-white/5 rounded-full transition-all"
                    >
                        <Sun size={18} />
                    </button>

                    {showInstallBtn && (
                        <button
                            onClick={handleInstallClick}
                            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-cyber-black bg-cyber-cyan hover:bg-white hover:text-cyber-black transition-all shadow-[0_0_10px_rgba(0,240,255,0.4)] clip-tech-border"
                        >
                            <Download size={10} /> INSTALL
                        </button>
                    )}

                    {items.length > 0 && (
                        <button
                            onClick={handleReset}
                            className="p-2 text-white/50 hover:text-cyber-red hover:bg-white/5 rounded-full transition-all"
                            title="清空"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </header>

            {/* Main Area: Holographic Log */}
            <main className="flex-1 overflow-hidden flex flex-col max-w-lg mx-auto w-full relative z-30">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 pb-80 relative no-scrollbar"
                >
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-cyber-violet/30 space-y-4 mt-10">
                            <div className="relative">
                                <Terminal size={64} className="animate-pulse text-cyber-violet/50" />
                                <div className="absolute inset-0 blur-2xl bg-cyber-violet/10 rounded-full"></div>
                            </div>
                            <div className="font-mono text-center space-y-2">
                                <p className="text-sm tracking-[0.2em] text-cyber-violet/80">暂无数据</p>
                                <p className="text-[10px] text-cyber-violet/40">系统初始化完毕</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-end min-h-0">
                            {items.map((item) => (
                                <HolographicItem
                                    key={item.id}
                                    item={item}
                                    isBest={item.unitPrice === bestUnitPrice}
                                    onRemove={() => removeItem(item.id)}
                                    onFavorite={() => handleFavorite(item)}
                                    isFavorite={favorites.some(f => f.id === item.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* --- THE ULTIMATE CYBERDECK CONSOLE --- */}
                <div
                    className={`
                        absolute bottom-0 left-0 right-0 z-50 
                        transition-transform duration-100
                        ${isPrinting ? 'animate-recoil' : ''}
                    `}
                    style={{
                        borderTopColor: activeTheme.text.replace('text-', '').replace('cyber-', '#').replace('pink', '#ff0096').replace('cyan', '#00f0ff').replace('yellow', '#fcee0a'),
                        boxShadow: `0 -10px 40px ${activeTheme.text.replace('text-', '').replace('cyber-', '').replace('pink', 'rgba(255,0,150,0.15)').replace('cyan', 'rgba(0,240,255,0.15)').replace('yellow', 'rgba(252,238,10,0.15)')}, inset 0 1px 0 ${activeTheme.text.replace('text-', '').replace('cyber-', '#').replace('pink', '#ff0096').replace('cyan', '#00f0ff').replace('yellow', '#fcee0a')}`
                    }}
                >
                    <div className="console-3d-block bg-[#151520]/80 backdrop-blur-xl transition-all duration-500">
                        {/* Top Decorative Ridge (Mech Shape) */}
                        <div className="relative h-4 w-full">
                            <div className="absolute inset-0 border-b border-white/5 bg-[#1a1a24]"></div>
                            {/* Central Status Light */}
                            <div className={`
                                absolute top-1 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full
                                transition-all duration-300
                                ${activeTheme.color} shadow-[0_0_10px_currentColor]
                            `}></div>
                        </div>

                        {/* Main Console Body */}
                        <div className="px-4 pb-6 pt-2 relative overflow-hidden">
                            {/* Background Texture for Console */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                            <div className="relative max-w-md mx-auto space-y-4">
                                {/* Power Cables Animation */}
                                <div className="absolute -top-3 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent">
                                    <div className={`absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-${activeTheme.text.replace('text-', '')} to-transparent animate-power-flow opacity-70`}></div>
                                </div>

                                {/* Inputs Section */}
                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    <ConsoleInput
                                        label="价格"
                                        value={priceInput}
                                        active={activeField === 'price'}
                                        onChange={setPriceInput}
                                        onFocus={() => setActiveField('price')}
                                        inputRef={priceRef}
                                        themeColor="pink"
                                        placeholder="0"
                                    />
                                    <ConsoleInput
                                        label="标签"
                                        value={labelInput}
                                        active={activeField === 'amount'} // Reusing 'amount' state ID for Label field
                                        onChange={setLabelInput}
                                        onFocus={() => setActiveField('amount')}
                                        inputRef={labelRef}
                                        themeColor="cyan"
                                        placeholder="可选..."
                                    />
                                    <ConsoleInput
                                        label="数量"
                                        value={countInput}
                                        active={activeField === 'count'}
                                        onChange={setCountInput}
                                        onFocus={() => setActiveField('count')}
                                        inputRef={countRef}
                                        themeColor="yellow"
                                        placeholder="1"
                                    />
                                </div>

                                {/* Command Module */}
                                <div className="flex gap-3">
                                    {/* Math Keypad */}
                                    <div className="grid grid-cols-4 gap-2 flex-1">
                                        {['+', '-', '×', '÷'].map((op) => (
                                            <button
                                                key={op}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleMathInput(op)}
                                                className={`
                                                    h-12 relative overflow-hidden
                                                    bg-[#151520]/80 border border-gray-700
                                                    text-gray-400 font-mono font-bold text-xl
                                                    hover:text-white hover:border-white/50 hover:bg-[#202030]
                                                    active:translate-y-0.5 active:border-t-0
                                                    transition-all clip-corner-input
                                                    ${operatorStyles[op]}
                                                `}
                                            >
                                                <span className="relative z-10">{op}</span>
                                                {/* Button Glint */}
                                                <div className="absolute top-0 right-0 w-4 h-4 bg-white/5 skew-x-12"></div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Lower Deck: Launch Only */}
                                <div className="flex gap-3 h-14">
                                    <button
                                        onClick={handlePrint}
                                        disabled={!priceInput || !countInput} // Label not required? Assuming logic. User said change amount to label.
                                        className={`
                                            w-full relative overflow-hidden group
                                            bg-gray-900/80 backdrop-blur-sm
                                            border-2 ${!priceInput || !countInput ? 'border-gray-800 opacity-50' : 'border-cyber-yellow hover:border-white'}
                                            flex items-center justify-center
                                            clip-corner-input
                                            transition-all duration-200
                                            active:scale-[0.98]
                                        `}
                                    >
                                        {/* Glowing Core */}
                                        <div className="absolute inset-0 bg-cyber-yellow/0 group-hover:bg-cyber-yellow/20 transition-all duration-300"></div>

                                        {/* Text & Icon */}
                                        <div className={`
                                            relative z-10 flex items-center gap-3 font-black text-lg tracking-[0.2em] uppercase italic
                                            ${!priceInput || !countInput ? 'text-gray-600' : 'text-cyber-yellow group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]'}
                                        `}>
                                            <span>开始分析</span>
                                            <Play size={20} className="fill-current" />
                                        </div>

                                        {/* Animated Border Flow */}
                                        <div className="absolute bottom-0 left-0 h-1 w-full bg-cyber-yellow scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
