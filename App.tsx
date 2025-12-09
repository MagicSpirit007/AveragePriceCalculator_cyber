import React, { useState, useRef, useEffect } from 'react';
import { 
  Trash2, 
  Printer, 
  RefreshCcw, 
  ShoppingBag, 
  Sparkles, 
  Download, 
  Moon, 
  Sun, 
  Zap, 
  Database,
  X,
  Cpu,
  Terminal,
  Activity,
  Power,
  Play
} from 'lucide-react';

// --- Types ---
interface ReceiptItem {
  id: number;
  price: number;
  perUnitAmount: number;
  count: number;
  totalAmount: number;
  unitPrice: number;
  timestamp: string;
  themeIndex: number;
}

// --- Sound Utils ---
const playSound = (type: 'click' | 'print' | 'delete' | 'error') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'print') {
      // New: Clean High-Tech Chime (Success)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.linearRampToValueAtTime(1760, now + 0.1); // A6
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'delete') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    console.error('Audio play failed', e);
  }
};

// --- Utils ---
const safeCalculate = (input: string): number => {
  try {
    const sanitized = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/[^0-9+\-*/.]/g, '');
    if (!sanitized) return NaN;
    // eslint-disable-next-line no-new-func
    return Function(`'use strict'; return (${sanitized})`)();
  } catch (e) {
    return NaN;
  }
};

const THEME_COUNT = 4;

// --- Components for Dark Mode ---
interface HolographicItemProps {
  item: ReceiptItem;
  isBest: boolean;
  onRemove: () => void;
}

const HolographicItem: React.FC<HolographicItemProps> = ({ item, isBest, onRemove }) => {
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
      <div className="flex justify-between items-start mb-2 relative z-10 pr-10">
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

      <button 
        onClick={onRemove}
        className="
          absolute top-0 right-0 p-3
          text-gray-600 hover:text-cyber-red
          transition-colors duration-200 z-20
        "
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const ConsoleInput = ({ 
  label, 
  value, 
  active, 
  onChange, 
  onFocus, 
  inputRef,
  themeColor
}: { 
  label: string, 
  value: string, 
  active: boolean, 
  onChange: (val: string) => void, 
  onFocus: () => void,
  inputRef: React.RefObject<HTMLInputElement>,
  themeColor: 'pink' | 'cyan' | 'yellow'
}) => {
  
  const colors = {
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

  const currentTheme = colors[themeColor];

  return (
    <div className={`
      relative flex flex-col group transition-all duration-300
      ${active ? 'scale-105 z-10' : 'scale-100 opacity-80'}
    `}>
      {/* HUD Lines - Decoration */}
      <div className={`absolute -top-1 left-0 w-2 h-[1px] ${currentTheme.bg.replace('/10','')} transition-all duration-300 ${active ? 'opacity-100 w-full' : 'opacity-0'}`}></div>
      
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
          placeholder="0"
        />
        
        {/* Corner Accents */}
        <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${active ? currentTheme.border : 'border-gray-700'}`}></div>
        <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${active ? currentTheme.border : 'border-gray-700'}`}></div>
      </div>
    </div>
  );
};

// --- Main Application ---
function App() {
  const [items, setItems] = useState<ReceiptItem[]>([]);
  
  const [priceInput, setPriceInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [countInput, setCountInput] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  
  const [activeField, setActiveField] = useState<'price' | 'amount' | 'count'>('price');
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  
  // Theme State: 'light' or 'dark'
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  const scrollRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const countRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Detect system preference initially
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeMode('dark');
    }
  }, []);

  // Sync theme with body class for correct variable scoping
  useEffect(() => {
    if (themeMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [themeMode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [items]);

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

  const toggleTheme = () => {
    playSound('click');
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
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

  // Button Color Maps for dark mode console
  const operatorStyles: { [key: string]: string } = {
    '+': 'text-cyber-acid border-cyber-acid/20 hover:bg-cyber-acid/10 hover:border-cyber-acid/50 hover:shadow-neon-acid shadow-[0_4px_0_rgba(176,255,26,0.2)]',
    '-': 'text-cyber-pink border-cyber-pink/20 hover:bg-cyber-pink/10 hover:border-cyber-pink/50 hover:shadow-neon-pink shadow-[0_4px_0_rgba(255,0,150,0.2)]',
    '×': 'text-cyber-cyan border-cyber-cyan/20 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/50 hover:shadow-neon-cyan shadow-[0_4px_0_rgba(0,240,255,0.2)]',
    '÷': 'text-cyber-violet border-cyber-violet/20 hover:bg-cyber-violet/10 hover:border-cyber-violet/50 hover:shadow-neon-violet shadow-[0_4px_0_rgba(176,38,255,0.2)]',
  };

  // --- Dark Mode Layout ---
  if (themeMode === 'dark') {
    // Map active field to theme colors for dynamic lighting
    const activeColorMap = {
      price: { color: 'bg-cyber-pink', shadow: 'shadow-neon-pink', border: 'border-cyber-pink', text: 'text-cyber-pink' },
      amount: { color: 'bg-cyber-cyan', shadow: 'shadow-neon-cyan', border: 'border-cyber-cyan', text: 'text-cyber-cyan' },
      count: { color: 'bg-cyber-yellow', shadow: 'shadow-neon-yellow', border: 'border-cyber-yellow', text: 'text-cyber-yellow' },
    };
    const activeTheme = activeColorMap[activeField];

    return (
      <div className="dark-cyber-app h-screen w-full overflow-hidden flex flex-col relative text-white">
        <style>{`
          .dark-cyber-app {
            background: radial-gradient(circle at 50% 30%, #1a1a2e, #050505);
            color: #e8ecff;
            font-family: 'JetBrains Mono', Consolas, monospace;
          }
          .cyber-bg-gradient {
            position: absolute; inset: 0;
            background: linear-gradient(145deg, rgba(0,240,255,0.05), rgba(255,0,92,0.05), rgba(252,238,10,0.02));
            filter: blur(70px);
            opacity: 0.6;
            pointer-events: none;
          }
          .cyber-grid {
            position: absolute; inset: 0;
            background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 90%);
            pointer-events: none;
            perspective: 500px;
            animation: grid-scroll 20s linear infinite;
          }
          .clip-tech-border {
             clip-path: polygon(
               10px 0, 100% 0, 
               100% calc(100% - 10px), calc(100% - 10px) 100%, 
               0 100%, 
               0 10px
             );
          }
          .clip-corner-input {
             clip-path: polygon(
               0 0, 
               100% 0, 
               100% calc(100% - 8px), 
               calc(100% - 8px) 100%, 
               0 100%,
               0 8px
             );
          }
          .console-3d-block {
             border-bottom: 8px solid #0a0a10;
             border-left: 4px solid #101015;
             border-right: 4px solid #101015;
             border-top: 1px solid rgba(255,255,255,0.1);
             box-shadow: 
               0 20px 50px rgba(0,0,0,0.8),
               inset 0 1px 0 rgba(255,255,255,0.1),
               inset 0 -2px 5px rgba(0,0,0,0.5);
             transform-origin: bottom center;
          }
          .hologram-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
            backdrop-filter: blur(8px);
          }
          .typing-effect { letter-spacing: 0.32em; text-align: center; line-height: 1.6; }
          .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          
          /* CRT and Particles */
          .particle {
             position: absolute;
             width: 2px; height: 2px;
             background: rgba(255,255,255,0.3);
             border-radius: 50%;
             animation: float 10s infinite;
          }
        `}</style>

        {/* --- Global Effects --- */}
        <div className="scanlines"></div>
        <div className="vignette"></div>
        
        {/* Dynamic Backgrounds */}
        <div className="cyber-bg-gradient" />
        <div className="cyber-grid" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           {[...Array(6)].map((_,i) => (
             <div key={i} className="particle" style={{
               left: `${Math.random()*100}%`, 
               top: `${Math.random()*100}%`, 
               animationDelay: `${Math.random()*5}s`,
               opacity: Math.random() * 0.5
             }}></div>
           ))}
        </div>

        {/* Header - Glitch Style */}
        <header className="flex items-center justify-between px-5 py-4 z-40 relative">
          <div className="flex flex-col">
             <h1 className="text-xl font-bold font-mono tracking-tighter text-white/90 animate-glitch" data-text="PRICE_PRINTER">
                PRICE_PRINTER <span className="text-[10px] text-cyber-cyan">// V2.077</span>
             </h1>
             <div className="flex items-center gap-1 text-[9px] text-cyber-acid/80 tracking-widest font-mono">
                <span className="w-1.5 h-1.5 bg-cyber-acid rounded-full animate-pulse"></span>
                SYSTEM ONLINE
             </div>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 text-white/50 hover:text-cyber-yellow hover:bg-white/5 rounded-full transition-all"
          >
            <Sun size={18} />
          </button>
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
              <div className={`flex flex-col justify-end min-h-0`}>
                {items.map((item) => (
                  <HolographicItem 
                      key={item.id} 
                      item={item} 
                      isBest={item.unitPrice === bestUnitPrice} 
                      onRemove={() => removeItem(item.id)}
                    />
                ))}
              </div>
            )}
          </div>

          {/* --- THE ULTIMATE CYBERDECK CONSOLE --- */}
          {/* A heavy, bottom-anchored mechanical deck with 3D block styling */}
          <div className={`
             absolute bottom-0 left-0 right-0 z-50 
             transition-transform duration-100
             ${isPrinting ? 'animate-recoil' : ''}
          `}>
             <div className="console-3d-block bg-[#151520]/80 backdrop-blur-xl">
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
                         <div className={`absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-${activeTheme.text.replace('text-','')} to-transparent animate-power-flow opacity-70`}></div>
                      </div>

                      {/* Inputs Section */}
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <ConsoleInput 
                          label="价格" 
                          value={priceInput} 
                          active={activeField === 'price'} 
                          onChange={setPriceInput}
                          onFocus={() => { setActiveField('price'); /* No Sound */ }}
                          inputRef={priceRef}
                          themeColor="pink"
                        />
                        <ConsoleInput 
                          label="数量" 
                          value={amountInput} 
                          active={activeField === 'amount'} 
                          onChange={setAmountInput}
                          onFocus={() => { setActiveField('amount'); /* No Sound */ }}
                          inputRef={amountRef}
                          themeColor="cyan"
                        />
                        <ConsoleInput 
                          label="件数" 
                          value={countInput} 
                          active={activeField === 'count'} 
                          onChange={setCountInput}
                          onFocus={() => { setActiveField('count'); /* No Sound */ }}
                          inputRef={countRef}
                          themeColor="yellow"
                        />
                      </div>

                      {/* Command Module */}
                      <div className="flex gap-3">
                        {/* Math Keypad - Compact 2x2 */}
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

                      {/* Lower Deck: Reset & Launch */}
                      <div className="flex gap-3 h-14">
                          <button 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleReset}
                            className="
                              w-14 h-full
                              bg-gray-900/80 backdrop-blur-sm
                              border border-cyber-red/30 text-cyber-red/60
                              flex items-center justify-center
                              hover:text-cyber-red hover:border-cyber-red hover:bg-cyber-red/10 hover:shadow-neon-red
                              active:scale-95 transition-all
                              clip-corner-input
                            "
                          >
                            <Trash2 size={20} />
                          </button>

                          <button 
                            onClick={handlePrint}
                            disabled={!priceInput || !amountInput}
                            className={`
                              flex-1 relative overflow-hidden group
                              bg-gray-900/80 backdrop-blur-sm
                              border-2 ${!priceInput || !amountInput ? 'border-gray-800 opacity-50' : 'border-cyber-yellow hover:border-white'}
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
                              ${!priceInput || !amountInput ? 'text-gray-600' : 'text-cyber-yellow group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]'}
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
  }

  return (
    <div className="app-container">
      <style>{`
        :root {
          /* --- LIGHT MODE: MORANDI (High-End Clean) --- */
          --app-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          --bg-color: #EBF4F8; /* Foggy White */
          --bg-image: none;
          
          /* Shape */
          --r-lg: 24px;
          --r-md: 16px;
          --r-sm: 8px;
          --clip-shape: none;
          
          /* Depth */
          --dock-shadow: 0px 20px 40px rgba(17, 97, 107, 0.25);
          --dock-side-shadow: 6px 6px 0px #0D4A52, -6px 6px 0px #0D4A52;
          --card-shadow: 0 4px 16px rgba(17, 97, 107, 0.08);
          --btn-press-y: 6px;
          --border-width: 0px;
          --neon-tube-border: none;
          --neon-tube-glow: none;

          /* Colors */
          --text-primary: #11616B; /* Deep Teal */
          --text-secondary: #5A8F96;
          --text-tertiary: #DC8B70; /* Terracotta */

          /* Printer */
          --printer-main: #11616B;      
          --printer-dark: #0D4A52;      
          --printer-slot: #072F36; /* Deep dark teal for slot */     
          --printer-detail: rgba(255,255,255,0.2);
          --printer-backdrop: none;

          /* Keys & Inputs */
          --key-bg: #FFFFFF;
          --key-text: #11616B;
          --key-shadow: #98CCC6;
          
          --input-bg-price: #FEF7DC; /* Soft Cream Yellow */   
          --input-bg-amount: #E3F1F3; /* Soft Ice Blue */  
          --input-bg-count: #F3E5F5; /* Soft Lilac Purple */   
          --input-text: #11616B;
          --input-shadow: rgba(17, 97, 107, 0.08);
          --input-label: #7BBDB6;

          /* Buttons */
          --btn-main: #DC8B70; /* Terracotta */        
          --btn-shadow: #B56A50;
          --btn-text: #FFFFFF;
          --btn-gradient: none;
          --btn-border: none;

          /* Receipt */
          --receipt-bg: #FFFFFF;
          --receipt-border: none;
          --receipt-backdrop: none;
          --receipt-jagged-display: block;
          
          /* Unit Price */
          --up-bg: #F7FBFC;
          --up-border: dashed #7BBDB6;

          /* Themes */
          --theme-0: #DC8B70; 
          --theme-1: #11616B; 
          --theme-2: #7BBDB6; 
          --theme-3: #E6B9A8; 
          
          /* Badge */
          --badge-bg: #DC8B70;
          --badge-text: #FFFFFF;
        }

        /* Apply clip-path only in dark mode */
        body.dark-mode .printer-body, 
        body.dark-mode .print-btn, 
        body.dark-mode .receipt, 
        body.dark-mode .best-badge, 
        body.dark-mode .install-btn, 
        body.dark-mode .math-key {
          clip-path: var(--clip-shape);
        }

        /* Obsidian Glass Printer Effect (Dark Mode Only) */
        body.dark-mode .printer-body {
          border: var(--neon-tube-border);
          box-shadow: var(--neon-tube-glow), var(--dock-side-shadow);
          backdrop-filter: var(--printer-backdrop);
        }

        /* Neon Tube Effect on Paper Slot */
        body.dark-mode .paper-slot {
          border-bottom: 2px solid #B026FF;
          box-shadow: 0 0 8px #B026FF;
        }
        
        body.dark-mode .print-btn {
          background-image: var(--btn-gradient);
          border: var(--btn-border);
        }
        
        body.dark-mode .print-btn:active {
          transform: translate(2px, 2px);
          box-shadow: -2px -2px 0 var(--btn-shadow);
        }
        
        /* SHARP TEXT - NO GLOW */
        body.dark-mode .input-label,
        body.dark-mode .r-val,
        body.dark-mode .app-title, 
        body.dark-mode .action-btn {
          text-shadow: none !important;
        }
        
        /* Dark Mode Receipt - Glassy */
        body.dark-mode .receipt {
          backdrop-filter: var(--receipt-backdrop);
          box-shadow: 0 0 10px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5);
        }
        
        /* Ensure border color shows up in dark mode */
        body.dark-mode .receipt-band {
           display: none; /* Hide top band, use border instead */
        }
        
        /* Best badge sharp */
        body.dark-mode .best-badge {
          box-shadow: none;
        }

        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          background-color: var(--bg-color);
          background-image: var(--bg-image);
          background-attachment: fixed; /* Keep gradient fixed */
          height: 100dvh;
          overflow: hidden;
          color: var(--text-primary);
          font-family: var(--app-font);
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .app-container {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }

        /* --- Header --- */
        .header {
          padding: 16px 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }
        .app-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }
        .header-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn {
          font-size: 13px;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          border-radius: var(--r-md);
          border: var(--border-width) solid var(--text-secondary); 
          cursor: pointer;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s;
          font-family: var(--app-font);
        }
        .action-btn:active { transform: scale(0.95); }
        .install-btn {
          background: var(--btn-main);
          color: var(--btn-text);
          border-color: var(--btn-main);
        }

        /* --- Output Area --- */
        .paper-stream {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          padding-bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: none; 
          -ms-overflow-style: none;
        }
        .paper-stream::-webkit-scrollbar { display: none; }
        
        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          gap: 16px;
          margin-bottom: 40px;
        }
        .empty-icon {
          background: var(--receipt-bg);
          padding: 20px;
          border-radius: var(--r-lg);
          box-shadow: var(--card-shadow);
          border: var(--border-width) solid var(--text-secondary);
        }

        /* --- Receipt Card --- */
        .receipt {
          position: relative;
          background: var(--receipt-bg);
          border-radius: var(--r-md);
          border: var(--receipt-border);
          padding: 0; 
          box-shadow: var(--card-shadow);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: bottom center;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Theme Classes */
        .theme-0 { --current-theme: var(--theme-0); }
        .theme-1 { --current-theme: var(--theme-1); }
        .theme-2 { --current-theme: var(--theme-2); }
        .theme-3 { --current-theme: var(--theme-3); }

        /* Top Color Band */
        .receipt-band {
          height: 8px;
          width: 100%;
          background-color: var(--current-theme);
        }

        .receipt-content {
          padding: 16px 20px 20px;
        }

        /* Jagged Bottom */
        .receipt-jagged {
          display: var(--receipt-jagged-display);
          height: 12px;
          width: 100%;
          background: var(--receipt-bg);
          -webkit-mask-image: linear-gradient(45deg, transparent 50%, black 50%), linear-gradient(-45deg, transparent 50%, black 50%);
          -webkit-mask-size: 16px 16px;
          -webkit-mask-repeat: repeat-x;
          mask-image: linear-gradient(45deg, transparent 50%, black 50%), linear-gradient(-45deg, transparent 50%, black 50%);
          mask-size: 16px 16px;
          mask-repeat: repeat-x;
          margin-top: -1px;
        }
        
        /* Best Badge */
        .best-badge {
          background: var(--badge-bg);
          color: var(--badge-text);
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: var(--r-sm);
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin-right: auto;
          font-family: var(--app-font);
        }

        @keyframes popIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        .receipt-row:last-child { margin-bottom: 0; }

        .r-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
        }
        .r-val {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .r-sub {
          font-size: 11px;
          color: var(--text-tertiary);
          font-weight: 600;
          margin-left: 6px;
        }

        .unit-price-display {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          background: var(--up-bg);
          padding: 10px 16px;
          margin: 12px -20px -8px;
          border-top: 1px var(--up-border);
          border-bottom: 1px var(--up-border); 
        }
        .up-val {
          font-size: 24px;
          font-weight: 800;
          margin-right: 4px;
          color: var(--current-theme);
        }
        .up-unit {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* --- Printer Dock --- */
        .dock-wrapper {
          padding: 0 16px 24px;
          perspective: 1000px;
          z-index: 20;
        }

        .printer-body {
          background: var(--printer-main);
          border-radius: var(--r-lg);
          padding: 24px 16px 20px;
          position: relative;
          border: var(--border-width) solid var(--text-secondary); 
          
          /* 3D Box Shadow */
          box-shadow: 
            var(--dock-side-shadow),
            var(--dock-shadow);
            
          background-image: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.05) 100%);
        }

        /* --- Optimized Paper Slot --- */
        .paper-slot {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
          height: 18px;
          background: var(--printer-dark);
          border-radius: var(--r-md) var(--r-md) 0 0;
          /* Inner shadow to make it look recessed and solid */
          box-shadow: inset 0 -2px 6px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.05); 
          display: flex;
          align-items: flex-end; 
          justify-content: center;
          padding-bottom: 5px;
          z-index: 0;
        }
        
        /* The actual gap where paper comes out */
        .paper-slot::after {
          content: '';
          width: 90%;
          height: 6px;
          background: var(--printer-slot);
          border-radius: 3px;
          box-shadow: 0 1px 0 rgba(255,255,255,0.15); /* Highlight below hole */
          transition: all 0.3s ease;
        }

        /* Dark mode specific: Neon Glow in the slot */
        body.dark-mode .paper-slot::after {
          background: #B026FF; /* Purple hole */
          height: 3px;
          margin-bottom: 2px;
          box-shadow: 
            0 0 5px #B026FF,
            0 0 10px #B026FF;
          border-radius: 0;
        }

        .printer-detail-line {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 4px;
          background: var(--printer-detail);
          border-radius: 2px;
        }

        .input-area {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }

        /* Left: Math Keypad */
        .math-pad {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 6px;
          width: 72px;
        }
        
        .math-key {
          background: var(--key-bg);
          border: var(--border-width) solid var(--key-text);
          border-radius: var(--r-sm);
          font-size: 18px;
          font-weight: 700;
          color: var(--key-text);
          box-shadow: 0 4px 0 var(--key-shadow); 
          cursor: pointer;
          transition: all 0.1s;
          font-family: var(--app-font);
        }
        .math-key:active {
          transform: translateY(4px);
          box-shadow: 0 0 0 var(--key-shadow);
        }

        /* Center: Inputs */
        .inputs-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }

        .input-row {
          display: flex;
          gap: 8px;
        }

        .input-group {
          flex: 1;
          position: relative;
        }

        .input-label {
          position: absolute;
          top: 4px;
          left: 8px;
          font-size: 9px;
          font-weight: 700;
          color: var(--input-label);
          text-transform: uppercase;
          pointer-events: none;
          font-family: var(--app-font);
        }

        .pastel-input {
          width: 100%;
          height: 44px;
          border: var(--border-width) solid var(--input-text);
          border-radius: var(--r-md);
          padding: 14px 8px 2px; 
          font-size: 15px;
          font-weight: 700;
          color: var(--input-text);
          outline: none;
          transition: transform 0.1s, box-shadow 0.2s;
          box-shadow: inset 0 2px 4px var(--input-shadow);
          text-align: left;
          font-family: var(--app-font);
        }
        .pastel-input:focus {
          box-shadow: inset 0 2px 4px var(--input-shadow), 0 0 0 2px var(--input-label);
          transform: translateY(-1px);
        }
        
        .bg-price { background: var(--input-bg-price); }
        .bg-amount { background: var(--input-bg-amount); }
        .bg-count { background: var(--input-bg-count); color: #11616B; text-align: center; }
        @media (prefers-color-scheme: dark) {
            .bg-count { color: var(--input-text); } 
        }

        /* Right: 3D Action Button */
        .print-btn {
          width: 68px;
          height: auto; 
          background: var(--btn-main);
          border: var(--border-width) solid var(--btn-text);
          border-radius: var(--r-lg);
          color: var(--btn-text);
          cursor: pointer;
          position: relative;
          
          box-shadow: 
            0px var(--btn-press-y) 0px var(--btn-shadow),
            0px 8px 10px rgba(0,0,0,0.2);
          
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s;
          margin-bottom: 6px;
        }
        
        .print-btn:active, .print-btn.animate {
          transform: translateY(var(--btn-press-y));
          box-shadow: 
            0px 0px 0px var(--btn-shadow),
            inset 0px 2px 4px rgba(0,0,0,0.2);
        }

        .print-btn:disabled {
          filter: grayscale(0.8) opacity(0.7);
        }

      `}</style>

      {/* --- Header --- */}
      <div className="header">
        <div className="app-title">Price Printer</div>
        <div className="header-actions">
          <button className="action-btn" onClick={toggleTheme}>
            {themeMode === 'light' ? <Moon size={16} fill="currentColor" /> : <Sun size={16} fill="currentColor" />}
          </button>
          
          {showInstallBtn && (
            <button className="action-btn install-btn" onClick={handleInstallClick}>
              <Download size={14} /> 安装应用
            </button>
          )}
          {items.length > 0 && (
            <button className="action-btn" onClick={handleReset}>
              <RefreshCcw size={14} /> 重置
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
                  <button onClick={() => removeItem(item.id)} style={{background:'none', border:'none', color:'var(--text-tertiary)'}}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="receipt-row" style={{marginTop: '12px'}}>
                  <div>
                    <div className="r-val">¥{item.price}</div>
                    <div className="r-label">总价</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
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
              
              {/* Jagged Bottom (Hidden in dark mode) */}
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
                  placeholder="0.0"
                  value={priceInput}
                  onFocus={() => setActiveField('price')}
                  onChange={(e) => setPriceInput(e.target.value)}
                />
              </div>
              
              {/* Row 2: Amount & Count */}
              <div className="input-row">
                <div className="input-group" style={{flex: 1.4}}>
                  <span className="input-label">数量</span>
                  <input
                    ref={amountRef}
                    type="text"
                    inputMode="decimal"
                    className="pastel-input bg-amount"
                    placeholder="0.0"
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
}

export default App;